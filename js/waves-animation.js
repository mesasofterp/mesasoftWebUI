
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
const container = document.getElementById('waves-container');

if (container) {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const SEPARATION = 100, AMOUNTX = 50, AMOUNTY = 50;
    const numParticles = AMOUNTX * AMOUNTY;
    const positions = new Float32Array(numParticles * 3);
    const scales = new Float32Array(numParticles);

    let i = 0, j = 0;
    for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
            positions[i] = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
            positions[i + 1] = 0;
            positions[i + 2] = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2);
            scales[j] = 1;
            i += 3;
            j++;
        }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    const material = new THREE.PointsMaterial({
        color: 0x888888,
        size: 2,
        sizeAttenuation: true
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    camera.position.y = 250;
    camera.position.z = 500;
    camera.rotation.x = -0.4;

    let count = 0;

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onWindowResize, false);

    function animate() {
        requestAnimationFrame(animate);

        const positions = particles.geometry.attributes.position.array;
        const scales = particles.geometry.attributes.scale.array;

        let i = 0, j = 0;
        for (let ix = 0; ix < AMOUNTX; ix++) {
            for (let iy = 0; iy < AMOUNTY; iy++) {
                positions[i + 1] = (Math.sin((ix + count) * 0.3) * 50) +
                                   (Math.sin((iy + count) * 0.5) * 50);
                scales[j] = (Math.sin((ix + count) * 0.3) + 1) * 1.5 +
                            (Math.sin((iy + count) * 0.5) + 1) * 1.5;
                i += 3;
                j++;
            }
        }
        particles.geometry.attributes.position.needsUpdate = true;
        particles.geometry.attributes.scale.needsUpdate = true;

        count += 0.05;
        renderer.render(scene, camera);
    }
    animate();
}
