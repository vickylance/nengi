import BinaryType from '../../binary/BinaryType';
import Binary from '../../binary/Binary';
import countMessageBits from '../../protocol/countBits/countMessageBits';

function countCommandsBits(commands) {
  let bits = 0;

  bits += Binary[BinaryType.UInt8].bits;
  bits += Binary[BinaryType.UInt16].bits;
  for (let i = 0; i < commands.length; i++) {
    const command = commands[i];
    bits += countMessageBits(command, command.protocol);
  }

  return bits;
}

export default countCommandsBits;
