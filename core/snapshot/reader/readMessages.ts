import BinaryType from '../../binary/BinaryType';
import Binary from '../../binary/Binary';
import readMessage from '../../protocol/read/readMessage';
// var config = require('../../../config')

function readMessages(bitStream, protocols, config) {
  // number of messages
  const length = bitStream[Binary[BinaryType.UInt16].read]();

  const messages = [];
  for (let i = 0; i < length; i++) {
    const type = bitStream[Binary[config.TYPE_BINARY_TYPE].read]();
    const protocol = protocols.getProtocol(type);
    const message = readMessage(bitStream, protocol, 1, type, config.TYPE_PROPERTY_NAME);
    message.protocol = protocol;
    messages.push(message);
    // console.log('read message', message)
  }
  return messages;
}

export default readMessages;
