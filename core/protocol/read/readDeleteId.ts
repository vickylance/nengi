import Binary from '../../binary/Binary';

var readDelete = function(bitStream, idType) {
  bitStream[Binary[idType].read]();
};

export default readDelete;
