import copyProxy from '../protocol/copyProxy';
import setValue from '../protocol/setValue';
import getValue from '../protocol/getValue';

function EntityCache(config) {
  this.config = config;
  this.state = {};
}

EntityCache.prototype.saveEntity = function(entity, protocol) {
  // console.log('ENTITY SAVED', entity.id, entity)
  const copy = copyProxy(entity, protocol);
  // console.log('copy', copy)
  copy.protocol = entity.protocol;
  this.state[entity[this.config.ID_PROPERTY_NAME]] = copy;
  // console.log('STATe',this.state[entity.id])
};

EntityCache.prototype.deleteEntity = function(id) {
  // console.log('ENTITY DELETED', id)
  delete this.state[id];
};

EntityCache.prototype.updateEntityPartial = function(id, path, value) {
  setValue(this.state[id], path, value);
};

EntityCache.prototype.updateEntityOptimized = function(id, path, deltaValue) {
  const value = getValue(this.state[id], path);
  setValue(this.state[id], path, value + deltaValue);
};

EntityCache.prototype.getEntity = function(id) {
  return this.state[id];
};

EntityCache.prototype.saveSnapshot = function(snapshot, protocols) {
  // console.log('SAVING', tick)
  for (let i = 0; i < snapshot.createEntities.length; i++) {
    const entity = snapshot.createEntities[i];
    this.saveEntity(entity, entity.protocol);
  }

  for (let i = 0; i < snapshot.updateEntities.partial.length; i++) {
    const partial = snapshot.updateEntities.partial[i];
    this.updateEntityPartial(partial.id, partial.path, partial.value);
  }

  for (let i = 0; i < snapshot.updateEntities.optimized.length; i++) {
    const optimized = snapshot.updateEntities.optimized[i];
    optimized.updates.forEach(microOpt => {
      if (microOpt.isDelta) {
        // deltaValue
        this.updateEntityOptimized(optimized.id, microOpt.path, microOpt.value);
      } else {
        // exact value
        this.updateEntityPartial(optimized.id, microOpt.path, microOpt.value);
      }
    });
  }

  for (let i = 0; i < snapshot.deleteEntities.length; i++) {
    const id = snapshot.deleteEntities[i];
    this.deleteEntity(id);
  }
};

export default EntityCache;
