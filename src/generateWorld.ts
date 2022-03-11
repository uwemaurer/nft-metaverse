import * as THREE from 'three';
import generate from 'generate-maze';

export function createMaze(): THREE.Group {
    type Cell = {
      x: number;
      y: number;
      top: boolean;
      left: boolean;
      right: boolean;
      bottom: boolean;
    };
    const maze = generate(5, 5, true, 123456) as Cell[][];
  
    const boxGeometry = new THREE.BoxGeometry(10, 8, 1).toNonIndexed();
    const boxMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const group = new THREE.Group();
  
    function createWall(cell: Cell) {
      const group = new THREE.Group();
  
      const box = new THREE.Mesh(boxGeometry, boxMaterial);
      box.position.x = cell.x * 10;
      box.position.z = cell.y * 10 - 50;
      box.position.y = 0;
      //box.receiveShadow = true;
      //box.castShadow = true;
      group.add(box);
      return box;
    }
  
    for (const row of maze) {
      for (const cell of row) {
          console.log(cell);
        if (cell.top) {
          const wall = createWall(cell);
          wall.position.z -= 5;
          group.add(wall);
        }
        if (cell.left) {
          const wall = createWall(cell);
          wall.rotateY(Math.PI / 2);
          wall.position.x -= 5;
          group.add(wall);
        }
        if (cell.right) {
          const wall = createWall(cell);
          wall.rotateY(Math.PI / 2);
          wall.position.x += 5;
          group.add(wall);
        }
        if (cell.bottom) {
          const wall = createWall(cell);
          wall.position.z += 5;
          group.add(wall);
        }
  
        // if (cell.y == 0 && cell.right) {
        //   const url = `https://goofballs.finemints.com/nft/${100}.png`;
        //   const painting = createPainting(url);
        //   painting.rotateX(-Math.PI / 2);
        //   painting.position.x = cell.x * 10;
        //   painting.position.z = cell.y * 10;
        //   painting.position.y = 1;
        //   group.add(painting);
        // }
      
      }
    }
    //group.rotateX(Math.PI / 2);
    group.scale.set(1, 1, 1);
    return group;
  }



function createPainting(url:string) {
    const boxGeometry = new THREE.PlaneGeometry(0.6, 0.6);
    boxGeometry.translate(0.2, 0.2, 0);
    const texture = new THREE.TextureLoader().load(url);
    const boxMaterial = new THREE.MeshLambertMaterial({ map: texture });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.scale.set(10,10,10);
    return box;
}
