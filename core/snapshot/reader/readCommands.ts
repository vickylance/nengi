import BinaryType from '../../binary/BinaryType';
import Binary from '../../binary/Binary';
import readMessage from '../../protocol/read/readMessage';
// var config = require('../../../config')

function readCommands(bitStream, protocols, config) {
  // number of commands
  const length = bitStream[Binary[BinaryType.UInt16].read]();
  const commands = [];
  for (let i = 0; i < length; i++) {
    const type = bitStream[Binary[config.TYPE_BINARY_TYPE].read]();
    const protocol = protocols.getProtocol(type);
    const command = readMessage(bitStream, protocol, 1, type, config.TYPE_PROPERTY_NAME);
    command.protocol = protocol;
    commands.push(command);
  }
  return commands;
}

export default readCommands;
