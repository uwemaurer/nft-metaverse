import * as THREE from 'three';
import generate from 'generate-maze';

const wallWidth = 5.5;
const wallHeight = 3.7;
const wallDepth = 0.1;

interface WallLocation {
    x: number;
    y: number;
    rotY: number;
}

const location = [] as WallLocation[];
let locIndex = 0;
let mazeGroup: THREE.Group;

function createLight() {
  const spotLight = new THREE.SpotLight(0xffffff, 0.5);
  spotLight.angle = Math.PI / 3;
  spotLight.penumbra = 0.1;
  spotLight.distance = 20;
  //spotLight.position.set(0.4, 1, 0.2);
  spotLight.castShadow = true;
  spotLight.shadow.camera.near = 1;
  spotLight.shadow.camera.far = 200;
  spotLight.shadow.mapSize.width = 512;
  spotLight.shadow.mapSize.height = 512;
  spotLight.shadow.bias = -0.002;
  spotLight.shadow.radius = 5;
  return spotLight;
}

export function createMaze(scene:THREE.Scene): THREE.Group {
  type Cell = {
    x: number;
    y: number;
    top: boolean;
    left: boolean;
    right: boolean;
    bottom: boolean;
  };

  const mazeW = 5;
  const mazeH = 6;
  const maze = generate(mazeW, mazeH, true, 123456) as Cell[][];

  const boxGeometry = new THREE.BoxGeometry(
    wallWidth + wallDepth,
    wallHeight,
    wallDepth
  ).toNonIndexed();
  const loader = new THREE.TextureLoader();

  const wallTex = loader.load('/metal.jpg');

  // mip mapping is default
  // floorTex.minFilter = THREE.LinearFilter;
  wallTex.wrapS = wallTex.wrapT = THREE.RepeatWrapping;
  wallTex.repeat.set(50, 50);
  const wallMaterial = new THREE.MeshPhongMaterial({ map: wallTex });

  const boxMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
  
  //const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
  const walls = [] as THREE.Mesh[];

  function createWall(cell: Cell) {
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.x = cell.x * wallWidth;
    box.position.z = cell.y * wallWidth;
    box.position.y = wallHeight / 2;
    box.receiveShadow = true;
    box.castShadow = true;
    return box;
  }

  for (const row of maze) {
    for (const cell of row) {
      if (cell.top) {
        const wall = createWall(cell);
        wall.position.z -= wallWidth / 2;
        walls.push(wall);
      }
      if (cell.left) {
        const wall = createWall(cell);
        wall.rotateY(Math.PI / 2);
        wall.position.x -= wallWidth / 2;
        walls.push(wall);
      }

      if (cell.right && cell.x == row.length - 1) {
        const wall = createWall(cell);
        wall.rotateY(Math.PI / 2);
        wall.position.x += wallWidth / 2;
        walls.push(wall);
      }
      if (cell.bottom && cell.y == maze.length - 1) {
        const wall = createWall(cell);
        wall.position.z += wallWidth / 2;
        walls.push(wall);
      }
    }
  }

  const group = new THREE.Group();
  for (const wall of walls) {
    group.add(wall);
  }

  location.length = 0;
  locIndex = 0;
  const w = wallWidth;
  // tiny distance from the wall to avoid Z-fighting
  const wallDist = (wallWidth - wallDepth) / 2 - 0.001;
  for (const row of maze) {
    for (const cell of row) {
      const x = cell.x * w;
      const y = cell.y * w;
      if (cell.top) {
        location.push({ x, y: y - wallDist, rotY: 0 });
      }
      if (cell.bottom) {
        // rotated 180 deg so we see the front side
        location.push({ x, y: y + wallDist, rotY: Math.PI });
      }
      if (cell.left) {
        location.push({ x: x - wallDist, y, rotY: Math.PI / 2 });
      }
      if (cell.right) {
        location.push({ x: x + wallDist, y, rotY: -Math.PI / 2 });
      }
    }
  }

  // floor
  let floorGeometry: THREE.BufferGeometry = new THREE.PlaneGeometry(
    mazeW * wallWidth,
    mazeH * wallWidth,
    mazeW,
    mazeH
  );
  floorGeometry.rotateX(-Math.PI / 2);
  floorGeometry.translate(
    (mazeW * wallWidth) / 2 - wallWidth / 2,
    0,
    (mazeH * wallWidth) / 2 - wallWidth / 2
  );
  const floorTex = loader.load('/metal.jpg');

  // mip mapping is default
  // floorTex.minFilter = THREE.LinearFilter;
  floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping;
  floorTex.repeat.set(50, 50);
  const floorMaterial = new THREE.MeshLambertMaterial({ map: floorTex });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.receiveShadow = true;

  group.add(floor);

  group.translateZ(-wallWidth / 2);
  group.translateX(-wallWidth / 2);

  //   for (const row of maze) {
  //     for (const cell of row) {
  //         if (cell.x  % 2 == 0 && cell.y % 2 == 0) {

  //         }
  //     }
  //   }

  for (let i = 0; i < 5; i++ ) {
    const light = createLight();

    scene.add(light);
    light.target = new THREE.Object3D();
    scene.add(light.target);
    const x =(mazeW * Math.random()) * wallWidth;
    const y =(mazeH * Math.random()) * wallWidth;
    light.position.set(x, 10, y);
    light.target.position.set(x + Math.random(), 0, y + Math.random());
//    scene.add(new THREE.SpotLightHelper(light));
  }
  mazeGroup = group;
  return group;
}

export function addPainting(url: string) {
    if (locIndex >= location.length) {
        console.log("metaverse out of space");
        return;
    }
    const loc = location[locIndex++];
    
    const painting = createPainting(url);
    painting.rotateY(loc.rotY);
    painting.position.x = loc.x;
    painting.position.z = loc.y;
    painting.position.y = 0;
    mazeGroup.add(painting);
}

function createPainting(url: string) {
  const w = 1.5;
  const h = 1.5;
  const depth = 0.05;
  const padding = 0.1;
  const boxGeometry = new THREE.BoxGeometry(w + 2 * padding, h + 2 * padding, depth);
  boxGeometry.translate(0.0, wallHeight / 2 + 0.2, depth / 2);
  const boxMaterial = new THREE.MeshLambertMaterial({ color: 'gray', wireframe: false });

  const paintingGeometry = new THREE.PlaneGeometry(w, h);
  paintingGeometry.translate(0.0, wallHeight / 2 + 0.2, depth + 0.01);

  const texture = new THREE.TextureLoader().load(url);
  const paintingMaterial = new THREE.MeshLambertMaterial({ map: texture, wireframe: false });
  //const boxMaterial = new THREE.MeshLambertMaterial({ color: 'green' });
  const group = new THREE.Group();
  group.add(new THREE.Mesh(paintingGeometry, paintingMaterial));
  const frame = new THREE.Mesh(boxGeometry, boxMaterial);

  group.add(frame);

  return group;
}
