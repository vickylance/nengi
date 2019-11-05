import Binary from '../../binary/Binary';

const writeDeleteId = (bitStream, idType, id) => {
  bitStream[Binary[idType].write](id);
};

export default writeDeleteId;
