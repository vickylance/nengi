import BitBuffer from '../../binary/BitBuffer';
import BitStream from '../../binary/BitStream';
import Binary from '../../binary/Binary';
import BinaryType from '../../binary/BinaryType';
import { Chunk } from '../Chunk';

function createTransferResponseBuffer(password, approved, transferKey) {
  let bits = 8;
  bits += Binary[BinaryType.UTF8String].countBits(password);
  bits += 2;
  bits += Binary[BinaryType.UTF8String].countBits(transferKey);

  const bitBuffer = new BitBuffer(bits);
  const bitStream = new BitStream(bitBuffer);

  bitStream.writeUInt8(Chunk.TransferResponse);
  Binary[BinaryType.UTF8String].write(bitStream, password);
  bitStream.writeBoolean(approved);
  Binary[BinaryType.UTF8String].write(bitStream, transferKey);

  return bitBuffer;
}

export default createTransferResponseBuffer;
