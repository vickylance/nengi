// var Grid = require('./Grid')
import EDictionary from '../../external/EDictionary';

import SpatialStructure from './BasicSpace';
import proxify from '../protocol/proxify';

const lerp = function(a, b, portion) {
  return a + (b - a) * portion;
};

function Historian(tickRate, ticksToSave, ID_PROPERTY_NAME) {
  this.history = {};
  this.ticksToSave = ticksToSave;
  this.tick = -1;
  this.tickRate = tickRate;
  this.ID_PROPERTY_NAME = ID_PROPERTY_NAME || 'id';
}

Historian.prototype.getSnapshot = function(tick) {
  if (this.history[tick]) {
    return this.history[tick];
  } else {
    return null;
    // console.log('historian had no snapshot for tick', tick, 'current tick is', this.tick)
    // throw new Error('historian had no snapshot for tick', tick, 'current tick is', this.tick)
  }
};

Historian.prototype.record = function(tick, entities, events, boundary) {
  // console.log('recording...', entities)
  const spatialStructure = SpatialStructure.create(this.ID_PROPERTY_NAME);

  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i];
    const proxy = proxify(entity, entity.protocol);
    proxy.ref = entity;
    spatialStructure.insertEntity(proxy);
  }

  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    spatialStructure.insertEvent(event);
  }

  this.history[tick] = spatialStructure;

  if (tick > this.tick) {
    this.tick = tick;
  }

  if (this.history[tick - this.ticksToSave]) {
    this.history[tick - this.ticksToSave].release();
    delete this.history[tick - this.ticksToSave];
  }
};

Historian.prototype.getLagCompensatedArea = function(timeAgo, aabb) {
  // console.log(timeAgo)
  const tickLengthMs = 1000 / this.tickRate;
  const ticksAgo = timeAgo / tickLengthMs;

  // console.log('ticks ago', ticksAgo)

  const olderTick = this.tick - Math.floor(ticksAgo);
  const newerTick = this.tick - Math.floor(ticksAgo) + 1;
  const portion = (timeAgo % tickLengthMs) / tickLengthMs;

  const timesliceA = this.getSnapshot(olderTick);
  const timesliceB = this.getSnapshot(newerTick);

  const compensatedEntities = [];

  if (timesliceA && timesliceB) {
    const entitiesA = timesliceA.queryAreaEMap(aabb);
    const entitiesB = timesliceB.queryAreaEMap(aabb);

    entitiesA.forEach(entityA => {
      const entityB = entitiesB.get(entityA[this.ID_PROPERTY_NAME]);
      // SKIPPING LERP
      compensatedEntities.push(entityA);

      /*
            if (entityA && entityB) {
                var compensatedEntity = {
                    id: entityA.id,
                    x: lerp(entityA.x, entityB.x, portion),
                    y: lerp(entityA.y, entityB.y, portion)
                }

                compensatedEntities.push(compensatedEntity)
            }
            */
    });
  }

  return compensatedEntities;
};

Historian.prototype.getCurrentState = function() {
  return this.getSnapshot(this.tick);
};

Historian.prototype.getRecentEvents = function() {
  const spatialStructure = this.getSnapshot(this.tick);
};

Historian.prototype.getRecentSnapshot = function() {
  return this.getSnapshot(this.tick);
};

export default Historian;
