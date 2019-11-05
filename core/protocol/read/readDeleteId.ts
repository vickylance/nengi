import Binary from '../../binary/Binary';

const readDelete = function(bitStream, idType) {
  bitStream[Binary[idType].read]();
};

export default readDelete;
