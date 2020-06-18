# Kompute
`Kompute` is a lightweight and efficient [steering](https://www.red3d.com/cwr/steer/gdc99/) library for AI movement. It's not a visual library and generates numbers (velocity & position data), that's why it may easily be plugged into any codebase.

`Kompute` is originally designed to be used by the [ROYGBIV engine](https://github.com/oguzeroglu/ROYGBIV), however may be easily used in any other project as well.

See the [documentation](https://github.com/oguzeroglu/Kompute/wiki).

# Getting Started

Create a [World](https://github.com/oguzeroglu/Kompute/wiki/World):
```javascript
var worldWidth = 1000;
var worldHeight = 1000;
var worldDepth = 1000;
var binSize = 50;

var world = new Kompute.World(worldWidth, worldHeight, worldDepth, binSize);
```

Create a [Steerable](https://github.com/oguzeroglu/Kompute/wiki/Steerable):
```javascript
var steerableID = "steerable1";
var steerableCenterPosition = new Kompute.Vector3D(0, 50, 0);
var steerableSize = new Kompute.Vector3D(25, 25, 25);

var steerable = new Kompute.Steerable(steerableID, steerableCenterPosition, steerableSize);
```

Insert the steerable into the world:
```javascript
world.insertEntity(steerable);
```

Create a new [Steering Behavior](https://github.com/oguzeroglu/Kompute/wiki/Steering-Behaviors):
```javascript
// this could be any type of Steering behavior
var behavior = new Kompute.SteeringBehavior();
```

Set the behavior:
```javascript
steerable.setBehavior(behavior);
```

Update the steerable (ideally 60 times per second):
```javascript
function update() {
  steerable.update();

  // steerable.position -> the updated position of the steerable
  // steerable.velocity -> the updated velocity of the steerable
  // You may visualise the steerable with any rendering library
  // You may use the velocity with a physics engine

  requestAnimationFrame(update);
}

update();
```

# License
Kompute uses MIT license.
