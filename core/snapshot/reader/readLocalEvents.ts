import BinaryType from '../../binary/BinaryType';
import Binary from '../../binary/Binary';
import readMessage from '../../protocol/read/readMessage';
// var config = require('../../../config')

function readLocalEvents(bitStream, protocols, config) {
  // number of events
  const length = bitStream[Binary[BinaryType.UInt8].read]();

  const events = [];
  for (let i = 0; i < length; i++) {
    const type = bitStream[Binary[config.TYPE_BINARY_TYPE].read]();
    const protocol = protocols.getProtocol(type);
    const event = readMessage(bitStream, protocol, 1, type, config.TYPE_PROPERTY_NAME);
    event.protocol = protocol;
    events.push(event);
  }
  return events;
}

export default readLocalEvents;
