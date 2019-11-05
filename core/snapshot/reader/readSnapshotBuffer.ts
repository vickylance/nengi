import Binary from '../../binary/Binary';
import BitBuffer from '../../binary/BitBuffer';
import BitStream from '../../binary/BitStream';
import readBatches from './readBatches';
import readSingleProps from './readSingleProps';
import readCreateEntities from './readCreateEntities';
import readDeleteEntities from './readDeleteEntities';
import readLocalEvents from './readLocalEvents';
import readMessages from './readMessages';
import readJSONs from './readJSONs';
import readTimesync from './readTimesync';
import readPing from './readPing';
import readTransfer from './readTransfer';
import readConnectionResponse from './readConnectionResponse';
import readEngineMessages from './readEngineMessages';

// var config = require('../../../config')

import { Chunk } from '../Chunk';

import { ChunkReverse } from '../Chunk';

function readSnapshotBuffer(
  arrayBuffer,
  protocols,
  config,
  connectCallback,
  transferCallback,
  protocolResolver
) {
  const bitBuffer = new BitBuffer(arrayBuffer);
  const bitStream = new BitStream(bitBuffer);

  // console.log(bitStream)

  const snapshot = {
    tick: 0,
    clientTick: -1,

    timestamp: -1,
    pingKey: -1,
    avgLatency: -1,

    engineMessages: [],

    // a copy of all visible events
    localMessages: [],

    // a copy of all messages
    messages: [],

    jsons: [],

    // a copy of all visible entities
    createEntities: [],

    // ids of entites no longer relevant to client
    deleteEntities: [],

    // updates to individual entities, using varying optimizations
    updateEntities: {
      // not used
      full: [],
      // per-property updates
      partial: [],
      // microOptimizations
      optimized: []
    },

    createComponents: [],
    deleteComponents: [],

    updateComponents: {
      // not used
      full: [],
      // per-property updates
      partial: [],
      // microOptimizations
      optimized: []
    }
  };

  // var timestamp = bitStream.readFloat64()
  // console.log(Date.now() - timestamp)
  // snapshot.timestamp = timestamp
  // snapshot.clientTick = bitStream.readUInt32()

  // console.log('+==================================+')
  while (bitStream.offset + 16 <= bitBuffer.bitLength) {
    // console.log('while', bitStream.offset, bitBuffer.bitLength)
    const msgType = bitStream.readUInt8();
    // console.log(msgType, ChunkReverse[msgType])

    switch (msgType) {
      case Chunk.Engine:
        const engineMessages = readEngineMessages(bitStream, protocols, config);
        snapshot.engineMessages = engineMessages;
        break;
      case Chunk.ClientTick:
        snapshot.clientTick = bitStream.readUInt32();
        break;
      case Chunk.Ping:
        const pingKey = readPing(bitStream);
        snapshot.pingKey = pingKey;
        break;
      case Chunk.Timesync:
        const times = readTimesync(bitStream);
        // console.log('READ Timesync', times)
        snapshot.timestamp = times.time;
        snapshot.avgLatency = times.avgLatency;
        break;
      case Chunk.CreateEntities:
        const entities = readMessages(bitStream, protocols, config);
        // console.log('READ ENTITIES', entities)
        snapshot.createEntities = entities;
        break;
      case Chunk.UpdateEntitiesPartial:
        const singleProps = readSingleProps(bitStream, protocolResolver, config);
        // console.log('SINGLE PROPS', singleProps)
        snapshot.updateEntities.partial = singleProps;
        break;
      case Chunk.UpdateEntitiesOptimized:
        const batches = readBatches(bitStream, protocolResolver);
        // console.log('BATCHES', batches)
        snapshot.updateEntities.optimized = batches;
        break;
      case Chunk.DeleteEntities:
        const deleteEntities = readDeleteEntities(bitStream, config);
        // console.log('DeleteEntities', deleteEntities)
        snapshot.deleteEntities = deleteEntities;
        break;
      case Chunk.LocalEvents:
        // console.log('prot', protocols)
        const localEvents = readMessages(bitStream, protocols, config);
        snapshot.localMessages = localEvents;
        break;
      case Chunk.Messages:
        const messages = readMessages(bitStream, protocols, config);
        snapshot.messages = messages;
        break;
      case Chunk.JSONs:
        const jsons = readJSONs(bitStream);
        snapshot.jsons = jsons;
        break;
      case Chunk.ConnectionResponse:
        const response = readConnectionResponse(bitStream);
        connectCallback(response);
        return; // exit this code! not a normal snapshot
      default:
        break;
    }
  }
  // console.log('ss',snapshot)
  // entityCache.saveSnapshot(snapshot)

  return snapshot; // simplifySnapshot(snapshot, entityCache)
}

export default readSnapshotBuffer;
