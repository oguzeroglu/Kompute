import { Steerable } from "../steering/Steerable";
import { Box } from "../core/Box";
import { Vector3D } from "../core/Vector3D";

var box = new Box(new Vector3D(), new Vector3D());
var vect = new Vector3D();

var DebugHelper = function(world, threeInstance, scene){
  this.world = world;
  this.threeInstance = threeInstance;
  this.scene = scene;

  this.isActive = false;

  this.limeMaterial = new threeInstance.MeshBasicMaterial({ color: "lime", wireframe: true });
  this.magentaMaterial = new threeInstance.MeshBasicMaterial({ color: "magenta", wireframe: true });
  this.redMaterial = new threeInstance.MeshBasicMaterial({ color : "red", wireframe: false });
  this.orangeMaterial = new threeInstance.MeshBasicMaterial({ color: "orange", wireframe: false });
  this.lineMaterial = new threeInstance.LineBasicMaterial({ color: "cyan" });

  this.meshesByEntityID = {};
  this.velocityMeshesByEntityID = {};
  this.lookMeshesByEntityID = {};
  this.pathMeshes = [];
  this.edgeMeshes = [];

  this.LOOK_DISTANCE = 100;

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

    if (entity instanceof Steerable){
      var velocityMesh = this.velocityMeshesByEntityID[entity.id];
      this.scene.remove(velocityMesh);
      delete this.velocityMeshesByEntityID[entity.id];

      var lookMesh = this.lookMeshesByEntityID[entity.id];
      this.scene.remove(lookMesh);
      delete this.lookMeshesByEntityID[entity.id];
    }
  }.bind(this);

  this.world.onEntityUpdated = function(entity){
    if (!this.isActive){
      return;
    }
    var mesh = this.meshesByEntityID[entity.id];
    mesh.position.set(entity.position.x, entity.position.y, entity.position.z);

    if (entity instanceof Steerable){
      var velocityMesh = this.velocityMeshesByEntityID[entity.id];
      vect.copy(entity.position).add(entity.velocity);
      box.setFromTwoVectors(entity.position, vect, 5);
      vect.x = (vect.x + entity.position.x) / 2;
      vect.y = (vect.y + entity.position.y) / 2;
      vect.z = (vect.z + entity.position.z) / 2;
      velocityMesh.position.set(vect.x, vect.y, vect.z);
      velocityMesh.scale.set(box.max.x - box.min.x, box.max.y - box.min.y, box.max.z - box.min.z);

      var lookMesh = this.lookMeshesByEntityID[entity.id];
      vect.copy(entity.lookDirection).normalize().multiplyScalar(this.LOOK_DISTANCE).add(entity.position);
      lookMesh.position.set(vect.x, vect.y, vect.z);
    }
  }.bind(this);

  this.world.onEntityLookDirectionUpdated = function(entity){
    if (!this.isActive){
      return;
    }
    if (entity instanceof Steerable){
      var lookMesh = this.lookMeshesByEntityID[entity.id];
      vect.copy(entity.lookDirection).normalize().multiplyScalar(this.LOOK_DISTANCE).add(entity.position);
      lookMesh.position.set(vect.x, vect.y, vect.z);
    }
  }.bind(this);
}

DebugHelper.prototype.visualisePath = function(path){
  for (var i = 0; i < path.waypoints.length; i ++){
    var wp = path.waypoints[i];
    var waypointMesh = new this.threeInstance.Mesh(new this.threeInstance.BoxBufferGeometry(1, 1, 1), this.orangeMaterial);
    waypointMesh.position.set(wp.x, wp.y, wp.z);
    this.scene.add(waypointMesh);
    this.pathMeshes.push(waypointMesh);
  }
}

DebugHelper.prototype.visualiseGraph = function(graph){
  var threeInstance = this.threeInstance;
  var lineMaterial = this.lineMaterial;
  var scene = this.scene;
  var edgeMeshes = this.edgeMeshes;

  graph.forEachEdge(function(edge){
    var geom = new threeInstance.Geometry();
    geom.vertices.push(edge.fromVertex);
    geom.vertices.push(edge.toVertex);
    var line = new threeInstance.Line(geom, lineMaterial);
    scene.add(line);
    edgeMeshes.push(line);
  });
}

DebugHelper.prototype.addEntity = function(entity){
  var mesh = this.createMeshFromEntity(entity);
  this.meshesByEntityID[entity.id] = mesh;
  this.scene.add(mesh);

  if (entity instanceof Steerable){
    var velocityMesh = new this.threeInstance.Mesh(new this.threeInstance.BoxBufferGeometry(1, 1, 1), this.magentaMaterial);
    velocityMesh.position.set(entity.position.x, entity.position.y, entity.position.z);
    this.scene.add(velocityMesh);
    this.velocityMeshesByEntityID[entity.id] = velocityMesh;

    var lookMesh = new this.threeInstance.Mesh(new this.threeInstance.BoxBufferGeometry(5, 5, 5), this.redMaterial);
    var lookPosition = new Vector3D().copy(entity.lookDirection).normalize().add(entity.position).multiplyScalar(this.LOOK_DISTANCE);
    lookMesh.position.set(lookPosition.x, lookPosition.y, lookPosition.z);
    this.scene.add(lookMesh);
    this.lookMeshesByEntityID[entity.id] = lookMesh;
  }
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

  for (var entityID in this.velocityMeshesByEntityID){
    this.scene.remove(this.velocityMeshesByEntityID[entityID]);
  }

  for (var entityID in this.lookMeshesByEntityID){
    this.scene.remove(this.lookMeshesByEntityID[entityID]);
  }

  for (var i = 0; i < this.pathMeshes.length; i ++){
    this.scene.remove(this.pathMeshes[i]);
  }

  for (var i = 0; i < this.edgeMeshes.length; i ++){
    this.scene.remove(this.edgeMeshes[i]);
  }

  this.meshesByEntityID = {};
  this.velocityMeshesByEntityID = {};
  this.lookMeshesByEntityID = {};
  this.pathMeshes = [];
  this.edgeMeshes = [];
}

DebugHelper.prototype.createMeshFromEntity = function(entity){
  var boxGeometry = new this.threeInstance.BoxBufferGeometry(entity.size.x, entity.size.y, entity.size.z);
  var mesh = new this.threeInstance.Mesh(boxGeometry, this.limeMaterial);
  mesh.position.set(entity.position.x, entity.position.y, entity.position.z);

  return mesh;
}

export { DebugHelper };
