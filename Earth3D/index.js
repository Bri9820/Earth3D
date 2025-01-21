import * as THREE from 'three'
import { OrbitControls } from 'jsm/controls/OrbitControls.js'
import starField from './src/starField.js'
import { fresnelMat } from './src/fresnelMat.js';



console.log(`THREE REVISION: %c${THREE.REVISION}`);
window.THREE = THREE;
const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w/h, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);
//must do for renderer to render vivid textures!!!
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

//add the earth to a group
const earthGroup = new THREE.Group();
//tilt the earth group to make the earth look tilted
earthGroup.rotation.z = -23.4 * Math.PI / 180;
scene.add(earthGroup);
new OrbitControls(camera, renderer.domElement);
const detail = 12;
const textLoader = new THREE.TextureLoader()
const geometry = new THREE.IcosahedronGeometry(1.5, detail);
const material = new THREE.MeshStandardMaterial({
    // color: '#2C2CE2',
    map: textLoader.load("./textures/8081_earthmap4k.jpg"),
});
// material.map.SRGBColorSpace;
const earthMesh = new THREE.Mesh(geometry, material);

earthGroup.add(earthMesh);

const lightsMat = new THREE.MeshBasicMaterial({
  // color: 0x00ff00,
  map: textLoader.load('./textures/03_earthlights1k.jpg'),
  blending: THREE.AdditiveBlending,
});
const lightsMesh = new THREE.Mesh(geometry, lightsMat);
earthGroup.add(lightsMesh);

//adding clouds
const cloudsMat = new THREE.MeshStandardMaterial({
  map: textLoader.load('./textures/04_earthcloudmap.jpg'),
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending,
  alphaMap: textLoader.load('./textures/05_earthcloudmaptrans.jpg'),
});
const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
cloudsMesh.scale.setScalar(1.003)
earthGroup.add(cloudsMesh);

const fresShader = fresnelMat();
const glowMesh = new THREE.Mesh(geometry, fresShader);
glowMesh.scale.setScalar(1.01);
earthGroup.add(glowMesh);


//adding stars to the scene
const stars = starField({numStars: 2000});
scene.add(stars);


// const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444);
// scene.add(hemiLight);
const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
sunLight.position.set( -2, 0.5, 1.5);
scene.add(sunLight);
function animate(){
    requestAnimationFrame(animate);

    earthMesh.rotation.y += 0.002;
    lightsMesh.rotation.y += 0.002;
    cloudsMesh.rotation.y += 0.002;
    glowMesh.rotation.y += 0.002;
    renderer.render(scene, camera);
}

animate();

//Handles window resizing
window.addEventListener('resize', () => {
    //updates the matrix for the orbit camera
    camera.aspect = w/h;
    camera.updateProjectionMatrix();
});