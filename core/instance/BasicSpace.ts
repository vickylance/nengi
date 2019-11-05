// the most basic spatial structure that will work with nengi's instance
import EDictionary from '../../external/EDictionary';

function BasicSpace(ID_PROPERTY_NAME) {
  this.ID_PROPERTY_NAME = ID_PROPERTY_NAME || 'id';
  this.entities = new EDictionary(ID_PROPERTY_NAME);
  this.events = new EDictionary(ID_PROPERTY_NAME);
}

BasicSpace.create = function(ID_PROPERTY_NAME) {
  return new BasicSpace(ID_PROPERTY_NAME);
};

BasicSpace.prototype.insertEntity = function(entity) {
  this.entities.add(entity);
};

BasicSpace.prototype.insertEvent = function(event) {
  this.events.add(event);
};

BasicSpace.prototype.flushEvents = function() {
  this.events = new EDictionary(this.ID_PROPERTY_NAME);
};

BasicSpace.prototype.queryAreaEMap = function(aabb) {
  const minX = aabb.x - aabb.halfWidth;
  const minY = aabb.y - aabb.halfHeight;
  const maxX = aabb.x + aabb.halfWidth;
  const maxY = aabb.y + aabb.halfHeight;

  const entitiesInArea = new Map();

  const entities = this.entities.toArray();

  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i];

    if (entity.x <= maxX && entity.x >= minX && entity.y <= maxY && entity.y >= minY) {
      entitiesInArea.set(entity[this.ID_PROPERTY_NAME], entity);
    }
  }
  return entitiesInArea;
};

BasicSpace.prototype.queryArea = function(aabb) {
  const minX = aabb.x - aabb.halfWidth;
  const minY = aabb.y - aabb.halfHeight;
  const maxX = aabb.x + aabb.halfWidth;
  const maxY = aabb.y + aabb.halfHeight;

  const entitiesInArea = [];
  const eventsInArea = [];

  const entities = this.entities.toArray();

  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i];

    if (entity.x <= maxX && entity.x >= minX && entity.y <= maxY && entity.y >= minY) {
      entitiesInArea.push(entity);
    }
  }

  const events = this.events.toArray();

  for (let i = 0; i < events.length; i++) {
    const event = events[i];

    if (event.x <= maxX && event.x >= minX && event.y <= maxY && event.y >= minY) {
      eventsInArea.push(event);
    }
  }
  return { entities: entitiesInArea, events: eventsInArea };
};

BasicSpace.prototype.release = function() {};

export default BasicSpace;
