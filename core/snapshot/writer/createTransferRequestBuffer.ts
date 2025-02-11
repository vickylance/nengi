import BitBuffer from '../../binary/BitBuffer';
import BitStream from '../../binary/BitStream';
import Binary from '../../binary/Binary';
import BinaryType from '../../binary/BinaryType';
import { Chunk } from '../Chunk';

function createTransferRequestBuffer(password, miscData) {
  const json = JSON.stringify(miscData);

  let bits = 8;
  bits += Binary[BinaryType.UTF8String].countBits(password);
  bits += Binary[BinaryType.UTF8String].countBits(json);

  const bitBuffer = new BitBuffer(bits);
  const bitStream = new BitStream(bitBuffer);

  bitStream.writeUInt8(Chunk.TransferRequest);
  Binary[BinaryType.UTF8String].write(bitStream, password);
  Binary[BinaryType.UTF8String].write(bitStream, json);

  return bitBuffer;
}

export default createTransferRequestBuffer;
