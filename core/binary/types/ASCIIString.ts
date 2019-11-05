const boundsCheck = (value: string) => {
  return value.length < 256;
};

const convertASCIIStringToByteArray = (asciiStr: string) => {
  // console.log('convertASCIIStringToByteArray', string)
  const arr: number[] = [];
  if (asciiStr.length < 256) {
    arr.push(asciiStr.length);
  } else {
    throw new Error('ASCIIString exceeded 255 character limit: ' + asciiStr);
  }
  for (let i = 0; i < asciiStr.length; i++) {
    arr.push(asciiStr.charCodeAt(i));
  }
  return arr;
};

/**
 * Serializes value and writes it to the buffer as an ascii string.
 * The first byte will be the length of the string, and the subsequent
 * bytes will be the character codes.
 */
const write = (bitStream, value) => {
  const byteArray = convertASCIIStringToByteArray(value);
  for (let i = 0; i < byteArray.length; i++) {
    const byte = byteArray[i];
    bitStream.writeUInt8(byte);
  }
};

const read = bitStream => {
  const length = bitStream.readUInt8();
  let tempStr = '';
  for (let i = 0; i < length; i++) {
    tempStr += String.fromCharCode(bitStream.readUInt8());
  }
  return tempStr;
};

const countBits = (bitStr: string) => {
  let bits = 8; // will represent the string length
  bits += bitStr.length * 8;
  return bits;
};

const compare = (a: string, b: string) => {
  return {
    a,
    b,
    isChanged: a !== b
  };
};

/**
 * Definition of an ASCIIString, a string that using 1 byte per character
 * the string may be up to 255 characters long
 * uses BitBuffer UInt8 functions for write/read
 */
const ASCIIString = {
  boundsCheck,
  customBits: true,
  countBits,
  customWrite: true,
  write,
  customRead: true,
  read,
  compare
};

export default ASCIIString;
