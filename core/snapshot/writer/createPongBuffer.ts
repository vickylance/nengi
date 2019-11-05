import BitBuffer from '../../binary/BitBuffer';
import BitStream from '../../binary/BitStream';
import { Chunk } from '../Chunk';
import countPongBits from './countPongBits';
import writePong from './writePong';

function createPongBuffer(pongKey) {
  let bits = 0;
  bits += 8;
  bits += 8;

  const bitBuffer = new BitBuffer(bits);
  const bitStream = new BitStream(bitBuffer);

  bitStream.writeUInt8(Chunk.Pong);
  bitStream.writeUInt8(pongKey);

  return bitBuffer;
}

export default createPongBuffer;
