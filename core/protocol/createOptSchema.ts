const createOptSchema = function(index, optConfig) {
  let type = -1;
  let delta = false;

  if (typeof optConfig === 'object') {
    type = optConfig.type;

    // interpolation flag
    if (typeof optConfig.delta !== 'undefined') {
      delta = optConfig.delta;
    }
  } else {
    throw new Error(
      'unknown schema optimization syntax; index: ' + index + ' optConfig: ' + optConfig
    );
  }

  return {
    key: index,
    type,
    delta
  };
};

export default createOptSchema;
