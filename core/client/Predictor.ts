import proxify from '../protocol/proxify';
import Binary from '../binary/Binary';
import BinaryType from '../binary/BinaryType';

const EPSILON = 0.0001;

const closeEnough = value => {
  return value < EPSILON && value > -EPSILON;
};

class PredictionErrorFrame {
  constructor(tick, config) {
    this.config = config;
    this.tick = tick;
    this.entities = new Map();
  }

  add(nid, entity, predictionError) {
    let entityPredictionError = this.entities.get(nid);
    if (!entityPredictionError) {
      entityPredictionError = new PredictionErrorEntity(nid, entity, this.config);
      this.entities.set(nid, entityPredictionError);
    }
    entityPredictionError.add(predictionError);
  }
}

class PredictionErrorEntity {
  constructor(nid, entity, config) {
    this[config.ID_PROPERTY_NAME] = nid;
    this.proxy = entity;
    this.errors = [];
  }

  add(predictionError) {
    this.errors.push(predictionError);
  }
}

class PredictionErrorProperty {
  constructor(nid, prop, predictedValue, actualValue, deltaValue, config) {
    this[config.ID_PROPERTY_NAME] = nid;
    this.prop = prop;
    this.predictedValue = predictedValue;
    this.actualValue = actualValue;
    this.deltaValue = deltaValue;
  }
}

class PredictionFrame {
  constructor(tick, config) {
    this.config = config;
    this.tick = tick;
    this.entityPredictions = new Map();
  }

  add(nid, entity, props, protocol) {
    let entityPrediction = this.entityPredictions.get(nid);
    if (!entityPrediction) {
      entityPrediction = new EntityPrediction(nid, entity, props, protocol, this.config);
      this.entityPredictions.set(nid, entityPrediction);
    } else {
      entityPrediction.entity = entity;
      entityPrediction.props = props;
    }
  }
}

class EntityPrediction {
  constructor(nid, entity, props, protocol, config) {
    this[config.ID_PROPERTY_NAME] = nid;
    this.proxy = entity;
    this.props = props;
    this.protocol = protocol;
  }
}

class Predictor {
  constructor(config) {
    this.config = config;
    this.predictionFrames = new Map();
    this.latestTick = -1;
  }

  cleanUp(tick) {
    // let str = ''
    this.predictionFrames.forEach(predictionFrame => {
      // str += predictionFrame.tick + ' '
      // console.log(typeof tick, typeof predictionFrame.tick)
      if (predictionFrame.tick < tick - 50) {
        // console.log('delete a prediction frame b/c its old')
        this.predictionFrames.delete(predictionFrame.tick);
      }
    });

    // console.log(str)
  }

  addCustom(tick, entity, props) {
    let predictionFrame = this.predictionFrames.get(tick);
    if (!predictionFrame) {
      predictionFrame = new PredictionFrame(tick, this.config);
      this.predictionFrames.set(tick, predictionFrame);
    }
    const proxy = Object.assign({}, entity);
    // console.log('custom prediction registered', proxy)
    predictionFrame.add(entity[this.config.ID_PROPERTY_NAME], proxy, props, entity.protocol);
  }

  add(tick, entity, props) {
    let predictionFrame = this.predictionFrames.get(tick);
    if (!predictionFrame) {
      predictionFrame = new PredictionFrame(tick, this.config);
      this.predictionFrames.set(tick, predictionFrame);
    }
    const proxy = proxify(entity, entity.protocol);
    // console.log('auto prediction registered', proxy)
    predictionFrame.add(entity[this.config.ID_PROPERTY_NAME], proxy, props, entity.protocol);
  }

  has(tick, nid, prop) {
    const predictionFrame = this.predictionFrames.get(tick);
    if (predictionFrame) {
      const entityPrediction = predictionFrame.entityPredictions.get(nid);
      if (entityPrediction) {
        // console.log('prediction has', prop, entityPrediction.props.indexOf(prop !== -1))
        return entityPrediction.props.indexOf(prop) !== -1;
      }
    }
    return false;
  }

  getErrors(worldState) {
    const predictionErrorFrame = new PredictionErrorFrame(worldState.clientTick, this.config);
    if (worldState) {
      // predictions for this frame
      const predictionFrame = this.predictionFrames.get(worldState.clientTick);

      if (predictionFrame) {
        predictionFrame.entityPredictions.forEach(entityPrediction => {
          // console.log('ep', entityPrediction)
          // predictions for this entity
          const nid = entityPrediction[this.config.ID_PROPERTY_NAME];
          const authoritative = worldState.entities.get(nid);
          if (authoritative) {
            entityPrediction.props.forEach(prop => {
              if (!entityPrediction.protocol) {
                // for backwards compat, nengi 1.0 does not require protocols
                // on predictions
                const authValue = authoritative[prop];
                const predValue = entityPrediction.proxy[prop];
                const diff = authValue - predValue;

                if (!closeEnough(diff)) {
                  predictionErrorFrame.add(
                    nid,
                    entityPrediction.proxy,
                    new PredictionErrorProperty(nid, prop, predValue, authValue, diff, this.config)
                  );
                }
              } else {
                // but if it does have a protocol, strings are available for reconcilation
                const type = entityPrediction.protocol.properties[prop].type;
                if (type === BinaryType.UTF8String || type === BinaryType.ASCIIString) {
                  // provisional, nengi STRING prediction reconiliation
                  const authValue = authoritative[prop];
                  const predValue = entityPrediction.proxy[prop];

                  if (authValue !== predValue) {
                    predictionErrorFrame.add(
                      nid,
                      entityPrediction.proxy,
                      new PredictionErrorProperty(
                        nid,
                        prop,
                        predValue,
                        authValue,
                        null,
                        this.config
                      )
                    );
                  }
                } else {
                  const authValue = authoritative[prop];
                  const predValue = entityPrediction.proxy[prop];
                  const diff = authValue - predValue;

                  if (!closeEnough(diff)) {
                    predictionErrorFrame.add(
                      nid,
                      entityPrediction.proxy,
                      new PredictionErrorProperty(
                        nid,
                        prop,
                        predValue,
                        authValue,
                        diff,
                        this.config
                      )
                    );
                  }
                }
              }
            });
          }
        });
      }
    }
    this.latestTick = worldState.clientTick;
    return predictionErrorFrame;
  }
}

export default Predictor;
