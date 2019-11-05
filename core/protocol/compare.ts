import Binary from '../binary/Binary';
import getValue from './getValue';

function compare(proxyA, proxyB, protocol) {
  const diffs = [];

  for (let i = 0; i < protocol.keys.length; i++) {
    const propName = protocol.keys[i];
    const propData = protocol.properties[propName];

    const valueA = getValue(proxyA, propData.path);
    const valueB = getValue(proxyB, propData.path);
    // var valueA = proxyA[propName]
    // var valueB = proxyB[propName]

    if (propData.protocol === null && !propData.isArray) {
      const comparison = Binary[propData.type].compare(valueA, valueB);
      // console.log('comparison', valueA, valueB, comparison)
      if (comparison.isChanged) {
        diffs.push({
          prop: propName,
          path: propData.path,
          was: comparison.a,
          is: comparison.b,
          key: i,
          type: propData.type
        });
      }
    }
  }

  return diffs;
}

export default compare;
