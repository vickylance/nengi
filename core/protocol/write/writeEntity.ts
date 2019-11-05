import writeMessage from './writeMessage';

const writeEntity = (bitStream, proxy, schema) => {
  writeMessage(bitStream, proxy, schema);
};

export default writeEntity;
