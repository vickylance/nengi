import BitBuffer from '../../binary/BitBuffer';
import BitStream from '../../binary/BitStream';
import Binary from '../../binary/Binary';
import BinaryType from '../../binary/BinaryType';
import { Chunk } from '../Chunk';

function createHandshakeBuffer(handshake) {
  const json = JSON.stringify(handshake);

  let bits = 8;
  bits += Binary[BinaryType.UTF8String].countBits(json);

  const bitBuffer = new BitBuffer(bits);
  const bitStream = new BitStream(bitBuffer);

  bitStream.writeUInt8(Chunk.Handshake);
  Binary[BinaryType.UTF8String].write(bitStream, json);

  return bitBuffer;
}

export default createHandshakeBuffer;
