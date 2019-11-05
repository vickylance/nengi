import getValue from './getValue';
import setValue from './setValue';

const deproxify = function(proxy, protocol) {
  const obj = {};

  for (let i = 0; i < protocol.keys.length; i++) {
    const prop = protocol.properties[protocol.keys[i]];
    let value = getValue(proxy, prop.path);
    // var value = proxy[protocol.keys[i]]

    if (typeof value === 'undefined') {
      continue;
    }

    // value is an array of nengi objects
    if (prop.isArray && prop.protocol) {
      const temp = [];
      for (let j = 0; j < value.length; j++) {
        temp.push(deproxify(value[j], prop.protocol));
      }
      value = temp;
    }

    // value is a nengi object
    if (!prop.isArray && prop.protocol) {
      value = deproxify(value, prop.protocol);
    }

    setValue(obj, prop.path, value);
  }

  return obj;
};

export default deproxify;
