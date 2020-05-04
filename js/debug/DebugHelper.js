var DebugHelper = function(world, threeInstance, scene){
  this.world = world;
  this.threeInstance = threeInstance;
  this.scene = scene;

  this.isActive = false;

  this.threeMaterial = new threeInstance.MeshBasicMaterial({ color: "lime", wireframe: true });

  this.meshesByEntityID = {};

  this.world.onEntityInserted = function(entity){
    if (!this.isActive){
      return;
    }
    this.addEntity(entity);
  }.bind(this);

  this.world.onEntityRemoved = function(entity){
    if (!this.isActive){
      return;
    }
    var mesh = this.meshesByEntityID[entity.id];
    this.scene.remove(mesh);
    delete this.meshesByEntityID[entity.id];
  }.bind(this);

  this.world.onEntityUpdated = function(entity){
    if (!this.isActive){
      return;
    }
    var mesh = this.meshesByEntityID[entity.id];
    mesh.position.set(entity.position.x, entity.position.y, entity.position.z);
  }.bind(this);
}

DebugHelper.prototype.addEntity = function(entity){
  var mesh = this.createMeshFromEntity(entity);
  this.meshesByEntityID[entity.id] = mesh;
  this.scene.add(mesh);
}

DebugHelper.prototype.activate = function(){
  this.isActive = true;

  this.world.forEachEntity(function(entity){
    this.addEntity(entity);
  }.bind(this));
}

DebugHelper.prototype.deactivate = function(){
  this.isActive = false;

  for (var entityID in this.meshesByEntityID){
    this.scene.remove(this.meshesByEntityID[entityID]);
  }

  this.meshesByEntityID = {};
}

DebugHelper.prototype.createMeshFromEntity = function(entity){
  var boxGeometry = new this.threeInstance.BoxBufferGeometry(entity.size.x, entity.size.y, entity.size.z);
  var mesh = new this.threeInstance.Mesh(boxGeometry, this.threeMaterial);
  mesh.position.set(entity.position.x, entity.position.y, entity.position.z);

  return mesh;
}

export { DebugHelper };
