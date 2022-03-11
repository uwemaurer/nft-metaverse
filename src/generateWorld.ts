import * as THREE from 'three';
import generate from 'generate-maze';

const wallWidth = 4.5;
const wallHeight = 3.5;
const wallDepth = 0.25;

export function createMaze(): THREE.Group {
  type Cell = {
    x: number;
    y: number;
    top: boolean;
    left: boolean;
    right: boolean;
    bottom: boolean;
  };
  const maze = generate(5, 4, true, 123456) as Cell[][];

  const boxGeometry = new THREE.BoxGeometry(
    wallWidth + wallDepth,
    wallHeight,
    wallDepth
  ).toNonIndexed();
  const boxMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
  //const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
  const walls = [] as THREE.Mesh[];

  function createWall(cell: Cell) {
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.x = cell.x * wallWidth;
    box.position.z = cell.y * wallWidth;
    box.position.y = wallHeight / 2;
    //box.receiveShadow = true;
    //box.castShadow = true;
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
  group.scale.set(1, 1, 1);
  group.translateZ(-wallWidth/2);
  group.translateX(-wallWidth/2);
  
  for (const wall of walls) {
    group.add(wall);
  }

  interface WallLocation {
    x: number;
    y: number;
    rotY: number;
  }

  const location = [] as WallLocation[];
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
  for (const loc of location) {
    const i = Math.floor(Math.random() * 1000) + 1;
    const url = `https://goofballs.finemints.com/nft/${i}.png`;
    const painting = createPainting(url);
    painting.rotateY(loc.rotY);
    painting.position.x = loc.x;
    painting.position.z = loc.y;
    painting.position.y = 0;
    group.add(painting);
  }
  return group;
}

function createPainting(url: string) {
  const boxGeometry = new THREE.PlaneGeometry(1.5, 1.5);
  boxGeometry.translate(0.0, wallHeight / 2 + 0.2, 0);
  const texture = new THREE.TextureLoader().load(url);
  const boxMaterial = new THREE.MeshLambertMaterial({ map: texture });
  //const boxMaterial = new THREE.MeshLambertMaterial({ color: 'green' });
  const box = new THREE.Mesh(boxGeometry, boxMaterial);
  return box;
}
