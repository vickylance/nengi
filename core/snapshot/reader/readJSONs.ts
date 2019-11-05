import BinaryType from '../../binary/BinaryType';
import Binary from '../../binary/Binary';
import readJSON from '../../protocol/read/readJSON';

function readJSONs(bitStream) {
  const length = bitStream[Binary[BinaryType.UInt16].read]();
  const jsons = [];
  for (let i = 0; i < length; i++) {
    const json = readJSON(bitStream);
    jsons.push(json);
  }
  return jsons;
}

export default readJSONs;
