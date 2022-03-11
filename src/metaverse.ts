import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import Stats from 'three/examples/jsm/libs/stats.module';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass';
import { createMaze } from './generateWorld';

let camera, scene, renderer, controls;

const objects = [];

let raycaster;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const vertex = new THREE.Vector3();
const color = new THREE.Color();

let stats: Stats;
let composer: EffectComposer;

const clock = new THREE.Clock();

export function init() {
  stats = Stats()
  camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.y = 10;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xeeeeee);
  scene.fog = new THREE.FogExp2(0x000000, 0.01);

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
  //hemiLight.color.setHSL( 0.6, 1, 0.6 );
  //hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
  hemiLight.position.set(0, 50, 0);
  scene.add(hemiLight);

  //const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10);
  //scene.add(hemiLightHelper);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
  //dirLight.color.setHSL(0.1, 1, 0.95);
  dirLight.position.set(-1, 1.75, 1);
  dirLight.position.multiplyScalar(100);
  scene.add(dirLight);

  dirLight.castShadow = true;

  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;

  const d = 50;

  dirLight.shadow.camera.left = -d;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = -d;

  dirLight.shadow.camera.far = 3500;
  dirLight.shadow.bias = -0.0001;

  // const dirLightHelper = new THREE.DirectionalLightHelper(dirLight, 10);
  // scene.add(dirLightHelper);

  controls = new PointerLockControls(camera, document.body);

  const blocker = document.getElementById('blocker');
  const instructions = document.getElementById('instructions');

  instructions.addEventListener('click', function () {
    controls.lock();
  });

  controls.addEventListener('lock', function () {
    instructions.style.display = 'none';
    blocker.style.display = 'none';
  });

  controls.addEventListener('unlock', function () {
    blocker.style.display = 'block';
    instructions.style.display = '';
  });

  scene.add(controls.getObject());

  const onKeyDown = function (event) {
    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        moveForward = true;
        break;

      case 'ArrowLeft':
      case 'KeyA':
        moveLeft = true;
        break;

      case 'ArrowDown':
      case 'KeyS':
        moveBackward = true;
        break;

      case 'ArrowRight':
      case 'KeyD':
        moveRight = true;
        break;

      case 'Space':
        if (canJump === true) velocity.y += 350;
        canJump = false;
        break;
    }
  };

  const onKeyUp = function (event) {
    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        moveForward = false;
        break;

      case 'ArrowLeft':
      case 'KeyA':
        moveLeft = false;
        break;

      case 'ArrowDown':
      case 'KeyS':
        moveBackward = false;
        break;

      case 'ArrowRight':
      case 'KeyD':
        moveRight = false;
        break;
    }
  };

  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

  raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10);

  const loader = new THREE.TextureLoader();

  const sky = loader.load(
    'sunflowers.jpg',
    () => {
      const rt = new THREE.WebGLCubeRenderTarget(sky.image.height);
      rt.fromEquirectangularTexture(renderer, sky);
      scene.background = rt.texture;
    });

  // floor
  let floorGeometry: THREE.BufferGeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);
  floorGeometry.rotateX(-Math.PI / 2);
  const floorTex = loader.load('/metal.jpg');

  // mip mapping is default
  // floorTex.minFilter = THREE.LinearFilter;
  floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping;
  floorTex.repeat.set(800, 800);
  const floorMaterial = new THREE.MeshLambertMaterial({ map: floorTex });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.receiveShadow = true;
  scene.add(floor);

  const maze = createMaze();
  scene.add(maze);
  createBoxes();

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  //renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;

  document.body.appendChild(renderer.domElement);
  window.addEventListener('resize', onWindowResize);
  document.body.appendChild(stats.dom)

  const renderModel = new RenderPass( scene, camera );
  const effectFilm = new FilmPass( 0.35, 0.75, 2048, 0.2 );

  composer = new EffectComposer( renderer );

  composer.addPass( renderModel );
  composer.addPass( effectFilm );
}


function createBoxes() {
  // objects
  const boxGeometry = new THREE.BoxGeometry(10, 10, 10).toNonIndexed();

  for (let i = 0; i < 30; i++) {
    const url = `https://goofballs.finemints.com/nft/${i + 174}.png`;
    const texture = new THREE.TextureLoader().load(url);

    //texture.minFilter = THREE.LinearFilter;
    const boxMaterial = new THREE.MeshLambertMaterial({ map: texture });

    //const boxMaterial = new THREE.MeshPhongMaterial( { specular: 0xffffff, flatShading: true, vertexColors: true } );
    //boxMaterial.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);

    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.x = Math.floor(Math.random() * 20 - 10) * 10;
    box.position.y = Math.floor(Math.random() * 20) * 5 + 10;
    box.position.z = Math.floor(Math.random() * 20 - 10) * 10;
    box.castShadow = true;
    scene.add(box);
    objects.push(box);
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

// units in meter
const eyeHeight = 1.8;

export function animate() {
  requestAnimationFrame(animate);

  const time = performance.now();

  if (controls.isLocked === true) {
    raycaster.ray.origin.copy(controls.getObject().position);
    raycaster.ray.origin.y -= 10;

    const intersections = raycaster.intersectObjects(objects, false);

    const onObject = intersections.length > 0;

    const delta = (time - prevTime) / 1000;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize(); // this ensures consistent movements in all directions

    if (moveForward || moveBackward) velocity.z -= direction.z * 100.0 * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * 100.0 * delta;

    if (onObject === true) {
      velocity.y = Math.max(0, velocity.y);
      canJump = true;
    }

    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);

    controls.getObject().position.y += velocity.y * delta; // new behavior

    if (controls.getObject().position.y < eyeHeight) {
      velocity.y = 0;
      controls.getObject().position.y = eyeHeight;

      canJump = true;
    }
  }

  prevTime = time;

  stats.update();
  
  const delta = clock.getDelta();

  renderer.render(scene, camera);
  //composer.render( delta );
}
