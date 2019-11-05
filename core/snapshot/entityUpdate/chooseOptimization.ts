import isBatchAtomiclyValid from './isBatchAtomiclyValid';
import compare from '../../protocol/compare';
import getValue from '../../protocol/getValue';

function locateDiff(prop, diffs) {
  for (let i = 0; i < diffs.length; i++) {
    if (diffs[i].prop === prop) {
      return diffs[i];
    }
  }
  return null;
}

// 3 cases: batch update, single prop update, or no update needed
export default function chooseOptimization(idPropertyName, oldProxy, newProxy, protocol) {
  const id = oldProxy[idPropertyName];
  const idType = protocol.properties[idPropertyName].type;

  const formattedUpdates = {
    batch: {
      id,
      idType,
      updates: []
    },
    singleProps: []
  };

  const diffs = compare(oldProxy, newProxy, protocol);

  if (diffs.length === 0) {
    return formattedUpdates;
  }

  // batching is disabled until a future version
  const isBatchValid = false; // isBatchAtomiclyValid(diffs, protocol)

  if (isBatchValid) {
    protocol.batch.keys.forEach(key => {
      const diff = locateDiff(key, diffs);
      const opt = protocol.batch.properties[key];
      const propData = protocol.properties[key];

      let value = 0;

      if (diff) {
        if (opt.delta) {
          value = diff.is - diff.was;
        } else {
          value = diff.is;
        }
      } else {
        if (!opt.delta) {
          value = newProxy[key];
        }
      }

      formattedUpdates.batch.updates.push({
        isDelta: opt.delta,
        value,
        valueType: opt.type,
        prop: key,
        path: propData.path
      });
    });
  }

  for (let i = 0; i < diffs.length; i++) {
    const diff = diffs[i];
    let opt = null;

    if (protocol.hasOptimizations) {
      opt = protocol.batch.properties[diff.prop];
    }

    if (isBatchValid && opt) {
    } else {
      const propData = protocol.properties[diff.prop];

      formattedUpdates.singleProps.push({
        id,
        idType,
        key: propData.key,
        keyType: protocol.keyType,
        value: diff.is,
        valueType: propData.type,
        prop: diff.prop,
        path: diff.path
      });
    }
  }

  return formattedUpdates;
}
