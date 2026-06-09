import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Syncs a Three.js scene with MapLibre camera transforms
export default function ThreeOverlay({ map }) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    if (!map?.current || !containerRef.current) return;

    const mapInstance = map.current;
    const container = containerRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Ambient + directional light
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(50, 100, 50);
    scene.add(dirLight);

    // Sample 3D markers — towers at key coordinates (scaled for visibility)
    const markers = [
      { lng: 39.2083, lat: -6.7924, color: 0x3b82f6, height: 3 },
      { lng: 36.8219, lat: -1.2921, color: 0x22c55e, height: 2.5 },
      { lng: -74.0060, lat: 40.7128, color: 0xef4444, height: 4 },
      { lng: 116.4074, lat: 39.9042, color: 0xf97316, height: 3.5 },
    ];

    const towerGroup = new THREE.Group();
    markers.forEach((m) => {
      const geometry = new THREE.CylinderGeometry(0.3, 0.5, m.height, 8);
      const material = new THREE.MeshPhongMaterial({
        color: m.color,
        emissive: m.color,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.85,
      });
      const tower = new THREE.Mesh(geometry, material);
      tower.position.set(m.lng * 0.5, m.height / 2, -m.lat * 0.5);
      towerGroup.add(tower);

      // Glow ring at base
      const ringGeo = new THREE.RingGeometry(0.6, 0.8, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: m.color, transparent: true, opacity: 0.4, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(m.lng * 0.5, 0.05, -m.lat * 0.5);
      towerGroup.add(ring);
    });
    scene.add(towerGroup);

    // Radar sweep effect
    const radarGeo = new THREE.RingGeometry(0, 15, 64, 1, 0, Math.PI / 4);
    const radarMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.15, side: THREE.DoubleSide });
    const radar = new THREE.Mesh(radarGeo, radarMat);
    radar.rotation.x = -Math.PI / 2;
    radar.position.y = 0.1;
    scene.add(radar);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    const syncCamera = () => {
      if (!mapInstance) return;
      const center = mapInstance.getCenter();
      const zoom = mapInstance.getZoom();
      const pitch = mapInstance.getPitch();
      const bearing = mapInstance.getBearing();

      const scale = Math.pow(2, zoom - 2) * 0.01;
      towerGroup.scale.set(scale, scale, scale);
      towerGroup.position.set(-center.lng * 0.5 * scale, 0, center.lat * 0.5 * scale);

      camera.position.set(0, 20 + zoom * 2, 30 + zoom);
      camera.lookAt(0, 0, 0);
      camera.rotation.z = (-bearing * Math.PI) / 180;
      camera.rotation.x = (-pitch * Math.PI) / 180 + 0.3;

      radar.rotation.z += 0.02;
    };

    const animate = () => {
      syncCamera();
      renderer.render(scene, camera);
      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    const onMove = () => syncCamera();
    mapInstance.on('move', onMove);
    mapInstance.on('zoom', onMove);
    mapInstance.on('rotate', onMove);
    mapInstance.on('pitch', onMove);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', onResize);
      if (mapInstance) {
        mapInstance.off('move', onMove);
        mapInstance.off('zoom', onMove);
        mapInstance.off('rotate', onMove);
        mapInstance.off('pitch', onMove);
      }
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [map]);

  return <div ref={containerRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }} />;
}
