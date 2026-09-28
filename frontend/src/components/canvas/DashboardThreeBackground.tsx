'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export interface DashboardThreeBackgroundProps {
  className?: string;
}

export function DashboardThreeBackground({ className }: DashboardThreeBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scene setup with transparent alpha background for light #F5F6F7 page
    const scene = new THREE.Scene();

    // Camera setup
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 30;

    // Renderer setup with alpha
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Subtle ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x6e7781, 0.4);
    dirLight.position.set(10, 20, 15);
    scene.add(dirLight);

    // Group container for rotating elements
    const group = new THREE.Group();

    // 1. Subtle Wireframe Icosahedron Mesh
    const geo = new THREE.IcosahedronGeometry(14, 2);
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x8b949e,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const sphereMesh = new THREE.Mesh(geo, wireframeMat);
    group.add(sphereMesh);

    // 2. Inner Torus Knot geometry for subtle depth
    const innerGeo = new THREE.TorusKnotGeometry(6.5, 1.5, 48, 12);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x3f4954,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    group.add(innerMesh);

    // 3. Low Density Particle Nodes
    const particlesCount = 45;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 55;
      posArray[i + 1] = (Math.random() - 0.5) * 45;
      posArray[i + 2] = (Math.random() - 0.5) * 35;
    }
    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMat = new THREE.PointsMaterial({
      size: 0.25,
      color: 0x5a636d,
      transparent: true,
      opacity: 0.18,
    });
    const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
    group.add(particlesMesh);

    scene.add(group);

    // Animation Loop with Visibility and Intersection Throttling
    let animationFrameId: number | null = null;
    let isIntersecting = true;
    let isTabVisible = !document.hidden;
    const startTime = performance.now();

    const animate = () => {
      if (!isIntersecting || !isTabVisible) {
        animationFrameId = null;
        return;
      }

      const elapsedTime = (performance.now() - startTime) / 1000;

      if (!prefersReducedMotion) {
        group.rotation.x = elapsedTime * 0.03;
        group.rotation.y = elapsedTime * 0.04;
        innerMesh.rotation.z = -elapsedTime * 0.05;
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      if (animationFrameId === null && isIntersecting && isTabVisible) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    const io = new IntersectionObserver(([entry]) => {
      isIntersecting = entry.isIntersecting;
      if (isIntersecting) {
        startAnimation();
      } else if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    }, { threshold: 0.05 });
    io.observe(container);

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) {
        startAnimation();
      } else if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    startAnimation();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || window.innerWidth;
      const newHeight = container.clientHeight || window.innerHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
      io.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener('resize', handleResize);

      geo.dispose();
      innerGeo.dispose();
      wireframeMat.dispose();
      innerMat.dispose();
      particlesGeo.dispose();
      particlesMat.dispose();
      renderer.dispose();

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className || "fixed inset-0 pointer-events-none z-0 opacity-70"}
      aria-hidden="true"
    />
  );
}
