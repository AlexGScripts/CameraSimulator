let scene, camera, renderer, player, visionCone;
let keys = {};
let deathScreen = document.getElementById("deathScreen");

init();
animate();

function init() {
  // Scene setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x222222);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 5, 10);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("game") });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Lights
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10, 10, 10);
  scene.add(light);

  const ambient = new THREE.AmbientLight(0x404040);
  scene.add(ambient);

  // Floor
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ color: 0x444444 })
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  // Player
  player = new THREE.Mesh(
    new THREE.BoxGeometry(1, 2, 1),
    new THREE.MeshStandardMaterial({ color: 0x00ff00 })
  );
  player.position.y = 1;
  scene.add(player);

  // Camera + vision cone
  const camBox = new THREE.Mesh(
    new THREE.BoxGeometry(1, 0.5, 0.5),
    new THREE.MeshStandardMaterial({ color: 0x1111ff })
  );
  camBox.position.set(0, 3, -8);
  scene.add(camBox);

  visionCone = new THREE.Mesh(
    new THREE.ConeGeometry(5, 10, 32, 1, true),
    new THREE.MeshStandardMaterial({ color: 0xff0000, transparent: true, opacity: 0.3, side: THREE.DoubleSide })
  );
  visionCone.rotation.x = -Math.PI / 2;
  visionCone.position.set(0, 2.5, -8);
  scene.add(visionCone);

  document.addEventListener("keydown", (e) => keys[e.key.toLowerCase()] = true);
  document.addEventListener("keyup", (e) => keys[e.key.toLowerCase()] = false);
}

function animate() {
  requestAnimationFrame(animate);

  if (!deathScreen.style.display) {
    movePlayer();
    rotateVision();
    checkDetection();
  }

  renderer.render(scene, camera);
}

function movePlayer() {
  const speed = 0.1;

  if (keys["w"]) player.position.z -= speed;
  if (keys["s"]) player.position.z += speed;
  if (keys["a"]) player.position.x -= speed;
  if (keys["d"]) player.position.x += speed;
}

let angle = 0;
function rotateVision() {
  angle += 0.01;
  visionCone.rotation.y = Math.sin(angle) * 0.7;
}

function checkDetection() {
  const coneDirection = new THREE.Vector3(0, 0, -1)
    .applyEuler(visionCone.rotation)
    .normalize();

  const toPlayer = new THREE.Vector3().subVectors(player.position, visionCone.position);
  const distance = toPlayer.length();
  const angleToPlayer = coneDirection.angleTo(toPlayer.normalize());

  if (distance < 5 && angleToPlayer < Math.PI / 6) {
    deathScreen.style.display = "flex";
  }
}
