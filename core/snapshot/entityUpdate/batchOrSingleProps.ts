import isBatchAtomiclyValid from './isBatchAtomiclyValid';
import compare from '../../protocol/compare';

function batchOrSingleProps(oldProxy, newProxy, schema) {
  const singlePropUpdates = [];
  let batchedUpdates = [];
  const diffs = compare(oldProxy, newProxy, schema);
  // console.log('diffs', diffs)

  // can batch mode be used on these values?
  const batchable = isBatchAtomiclyValid(diffs, schema);

  // is there any overlap between diffs and the batchable properties?
  let useBatch = false;
  if (schema.hasOptimizations) {
    for (let i = 0; i < diffs.length; i++) {
      const diff = diffs[i];
      const opt = schema.batch.properties[diff.prop];

      if (opt) {
        useBatch = true;
      }
    }
  }

  for (let i = 0; i < diffs.length; i++) {
    const diff = diffs[i];

    let optimization = null;
    if (schema.hasOptimizations) {
      optimization = schema.batch.properties[diff.prop];
    }

    if (useBatch && batchable && optimization) {
      // will be batched
    } else {
      // update this property individually
      singlePropUpdates.push(diff.prop);
    }
  }

  if (useBatch && batchable) {
    batchedUpdates = [];
    // all batched properties
    schema.batch.keys.forEach(prop => {
      batchedUpdates.push(prop);
    });
  }

  const foo = {
    batchedUpdates,
    singlePropUpdates,
    diffs
  };
  // console.log('foo', foo)

  return foo;
}

export default batchOrSingleProps;
