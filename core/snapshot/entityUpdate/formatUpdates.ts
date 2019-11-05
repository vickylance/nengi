import calculateValue from './calculateValue';
import batchOrSingleProps from './batchOrSingleProps';

function formatUpdates(idPropertyName, oldProxy, newProxy, schema) {
  const updates = batchOrSingleProps(oldProxy, newProxy, schema);

  const id = oldProxy[idPropertyName];
  const idType = schema.properties[idPropertyName].type;

  const formattedUpdates = {
    batch: {
      id,
      idType,
      updates: []
    },
    singleProps: []
  };

  updates.singlePropUpdates.forEach(prop => {
    const propData = schema.properties[prop];

    formattedUpdates.singleProps.push({
      id,
      idType,
      key: propData.key,
      keyType: schema.keyType,
      value: newProxy[prop],
      valueType: propData.type,
      prop
    });
  });

  updates.batchedUpdates.forEach(prop => {
    const propData = schema.properties[prop];
    const optData = schema.batch.properties[prop];

    const oldValue = oldProxy[prop];
    const newValue = newProxy[prop];

    const value = calculateValue(oldValue, newValue, optData.delta);

    formattedUpdates.batch.updates.push({
      isDelta: optData.delta,
      value,
      valueType: optData.type,
      prop
    });
  });

  return formattedUpdates;
}

export default formatUpdates;
