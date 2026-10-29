import * as THREE from "three";

export function createScene(container) {
  if (!container || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
  } catch {
    container.classList.add("scene-fallback");
    return () => {};
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.setAttribute("aria-hidden", "true");
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.z = 7.4;

  const coreGeometry = new THREE.IcosahedronGeometry(1.45, 2);
  const coreMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x1b7778, metalness: 0.68, roughness: 0.24,
    transmission: 0.08, clearcoat: 0.8, clearcoatRoughness: 0.2,
    emissive: 0x092c37, emissiveIntensity: 0.6, flatShading: true
  });
  const core = new THREE.Mesh(coreGeometry, coreMaterial);
  scene.add(core);

  const wire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.53, 1),
    new THREE.MeshBasicMaterial({ color: 0x83e8d7, wireframe: true, transparent: true, opacity: 0.21 })
  );
  scene.add(wire);

  const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x8b9cff, transparent: true, opacity: 0.48 });
  const ringA = new THREE.Mesh(new THREE.TorusGeometry(2.03, 0.009, 8, 160), ringMaterial);
  ringA.rotation.x = 1.05; ringA.rotation.y = 0.28; scene.add(ringA);
  const ringB = new THREE.Mesh(new THREE.TorusGeometry(2.27, 0.006, 8, 160), new THREE.MeshBasicMaterial({ color: 0x74e3d0, transparent: true, opacity: 0.35 }));
  ringB.rotation.x = 1.52; ringB.rotation.y = -0.5; scene.add(ringB);

  const particleCount = 240;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const radius = 2.1 + Math.random() * 1.35;
    const angle = Math.random() * Math.PI * 2;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 4.8;
    positions[i * 3 + 2] = Math.sin(angle) * radius * 0.55;
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({ color: 0x9cefe2, size: 0.018, transparent: true, opacity: 0.7 }));
  scene.add(particles);

  scene.add(new THREE.AmbientLight(0x9ba9ff, 1.2));
  const keyLight = new THREE.PointLight(0x79f2d7, 32, 15); keyLight.position.set(3, 2, 4); scene.add(keyLight);
  const fillLight = new THREE.PointLight(0x7885ff, 24, 14); fillLight.position.set(-3, -1, 2); scene.add(fillLight);

  // Viewport-wide pointer tracking makes the 3D object respond even when the
  // pointer is over the text/navigation, not only when it is over the canvas.
  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
  const scroll = { progress: 0, target: 0 };
  const onPointerMove = (event) => {
    pointer.targetX = (event.clientX / Math.max(window.innerWidth, 1) - 0.5) * 0.8;
    pointer.targetY = (event.clientY / Math.max(window.innerHeight, 1) - 0.5) * 0.65;
  };
  const updateScrollTarget = () => {
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    scroll.target = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
  };
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("scroll", updateScrollTarget, { passive: true });
  updateScrollTarget();

  let frame = 0;
  let last = 0;
  let visible = true;
  const observer = new IntersectionObserver((entries) => { visible = entries[0]?.isIntersecting ?? true; });
  observer.observe(container);
  const resize = () => {
    const w = Math.max(container.clientWidth, 1), h = Math.max(container.clientHeight, 1);
    camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h);
  };
  const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(container);

  const animate = (time) => {
    frame = requestAnimationFrame(animate);
    if (!visible || time - last < 30) return;
    last = time;
    pointer.x += (pointer.targetX - pointer.x) * 0.035;
    pointer.y += (pointer.targetY - pointer.y) * 0.035;
    scroll.progress += (scroll.target - scroll.progress) * 0.045;
    core.rotation.y += 0.0022; core.rotation.x += 0.0008;
    core.rotation.y += pointer.x * 0.001;
    wire.rotation.copy(core.rotation);
    ringA.rotation.z += 0.0018; ringB.rotation.z -= 0.0012;
    particles.rotation.y += 0.0006;
    // Smooth mouse parallax + a subtle scroll-driven camera drift.
    scene.rotation.y += (pointer.x * 0.22 + scroll.progress * 0.18 - scene.rotation.y) * 0.035;
    scene.rotation.x += (-pointer.y * 0.16 + scroll.progress * 0.08 - scene.rotation.x) * 0.035;
    camera.position.y += (-scroll.progress * 0.48 - camera.position.y) * 0.025;
    camera.position.z += (7.4 - scroll.progress * 0.35 - camera.position.z) * 0.025;
    renderer.render(scene, camera);
  };
  animate(0);

  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("scroll", updateScrollTarget);
    observer.disconnect(); resizeObserver.disconnect();
    coreGeometry.dispose(); coreMaterial.dispose(); wire.geometry.dispose(); wire.material.dispose();
    ringA.geometry.dispose(); ringMaterial.dispose(); ringB.geometry.dispose(); ringB.material.dispose();
    particleGeometry.dispose(); particles.material.dispose(); renderer.dispose();
    container.removeChild(renderer.domElement);
  };
}