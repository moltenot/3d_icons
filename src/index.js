import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  AxesHelper,
  SpotLight,
  LineLoop,
  PlaneGeometry,
  MeshPhongMaterial,
} from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// largely based on https://sbcode.net/threejs/loaders-stl/
const scene = new Scene();
scene.add(new AxesHelper(5));

const light = new SpotLight();
light.position.set(20, 20, 20);
scene.add(light);

const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// green material
const material = new MeshBasicMaterial({ color: 0x00ff00 });
const groundMaterial = new MeshPhongMaterial({
  color: 0x999999,
  specular: 0x101010,
});

// add a eurocopter
const loader = new STLLoader();
loader.load(
  "/eurocopter.stl", // loaded from the static folder by parcel-plugin-static-files-copy
  function (geometry) {
    console.log("loaded geometry", geometry);
    // const mesh = Mesh(geometry, groundMaterial);
    // scene.add(mesh);
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  (error) => {
    console.error(error);
  }
);

// ground
const plane = new Mesh(new PlaneGeometry(40, 40), groundMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -0.5;
scene.add(plane);
plane.receiveShadow = true;

camera.position.z = 3;

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
