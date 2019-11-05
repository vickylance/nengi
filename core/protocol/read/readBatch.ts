import Binary from '../../binary/Binary';
// var config = require('../../../config')

function readBatch(bitStream, entityCache, config) {
  const batch = {};

  const id = bitStream[Binary[config.ID_BINARY_TYPE].read]();
  const schema = entityCache.getEntity(id).protocol;

  batch.id = id;
  batch.updates = [];

  schema.batch.keys.forEach(prop => {
    const propData = schema.batch.properties[prop];
    const value = bitStream[Binary[propData.type].read]();
    batch.updates.push({
      isDelta: propData.delta,
      prop,
      path: propData.path,
      value
    });
  });

  return batch;
}

export default readBatch;
