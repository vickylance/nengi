import Protocol from './Protocol';
import EntityProtocol from './EntityProtocol';
import MessageProtocol from './MessageProtocol';
import LocalEventProtocol from './LocalEventProtocol';
import CommandProtocol from './CommandProtocol';
import ComponentProtocol from './ComponentProtocol';

const debug = (configSection, name) => {
  return (configSection === 'messages' && name === 'Test') || configSection === 'basics';
};

function ProtocolMap(config, metaConfig) {
  this.lookupByIndex = new Map();
  this.lookupByProtocol = new Map();
  this.protocolIndex = 0;

  // this.processProtocols(meta, config, )

  this.lookupMetaByIndex = new Map();
  this.lookupMetaByProtocol = new Map();

  this.processMeta(config, metaConfig, 'messages');

  this.processProtocols(config, 'basics', Protocol);
  this.processProtocols(config, 'entities', EntityProtocol);
  this.processProtocols(config, 'components', EntityProtocol);
  this.processProtocols(config, 'messages', MessageProtocol);
  this.processProtocols(config, 'localMessages', LocalEventProtocol);
  this.processProtocols(config, 'commands', CommandProtocol);
}

ProtocolMap.prototype.processMeta = function(config, metaConfig, configSection) {
  for (let i = 0; i < metaConfig[configSection].length; i++) {
    const name = metaConfig[configSection][i][0];
    const protocolConfig = metaConfig[configSection][i][1];
    const type = metaConfig[configSection][i][2];

    const protocol = new MessageProtocol(protocolConfig, config);
    this.lookupMetaByIndex.set(type, protocol);
    this.lookupMetaByProtocol.set(protocol, type);
    protocol.name = name;

    // console.log('protocol', protocol)
  }
};

ProtocolMap.prototype.processProtocols = function(config, configSection, protocolConstructor) {
  const section = config.protocols[configSection];
  if (!section) {
    return;
  }
  for (let i = 0; i < section.length; i++) {
    const entry = section[i];
    if (Array.isArray(entry)) {
      const name = entry[0];
      const ctor = entry[1];
      if (entry.length === 2) {
        // if (debug(configSection, name)) {
        // 	console.log('ctor mode', name)
        // }

        // nengi beta Constructor mode
        const protocolConfig = ctor.protocol;
        const protocol = new protocolConstructor(protocolConfig, config);
        this.lookupByIndex.set(this.protocolIndex, protocol);
        this.lookupByProtocol.set(protocol, this.protocolIndex);
        // mutates prototype
        ctor.prototype.protocol = protocol;
        // mutates protocol, adding a name
        protocol.name = name;
        this.protocolIndex++;
        // if (debug(configSection, name)) {
        // 	console.log(protocol)
        // }

        // console.log(name, this.protocolIndex)
      } else {
        // console.log('factory mode')
        // nengi beta factory mode
        const protocolConfig = entry[2];
        const type = entry[3];
        const protocol = new protocolConstructor(protocolConfig, config);
        this.lookupByIndex.set(type, protocol);
        this.lookupByProtocol.set(protocol, type);
        protocol.name = name;
      }
    } else {
      // new syntax mode
      // console.log('new syntax')
      if (configSection === 'components') {
        const protocol = new ComponentProtocol(entry.protocol, config, entry.components);
        this.lookupByIndex.set(entry[config.TYPE_PROPERTY_NAME], protocol);
        this.lookupByProtocol.set(protocol, entry[config.TYPE_PROPERTY_NAME]);
        protocol.name = entry.name;
      }
      if (configSection === 'entities') {
        const protocol = new EntityProtocol(entry.protocol, config, entry.components);
        this.lookupByIndex.set(entry[config.TYPE_PROPERTY_NAME], protocol);
        this.lookupByProtocol.set(protocol, entry[config.TYPE_PROPERTY_NAME]);
        protocol.name = entry.name;
      }
    }
  }

  // console.log(this)
};

ProtocolMap.prototype.getMetaProtocol = function(index) {
  return this.lookupMetaByIndex.get(index);
};

ProtocolMap.prototype.getMetaIndex = function(protocol) {
  return this.lookupMetaByProtocol.get(protocol);
};

ProtocolMap.prototype.getProtocol = function(index) {
  return this.lookupByIndex.get(index);
};

ProtocolMap.prototype.getIndex = function(protocol) {
  return this.lookupByProtocol.get(protocol);
};

export default ProtocolMap;
