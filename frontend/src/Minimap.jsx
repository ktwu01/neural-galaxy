import React, { useRef, forwardRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const Minimap = forwardRef((props, ref) => {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        width: '180px',
        height: '180px',
        zIndex: 1001,
      }}
    >
      <canvas ref={ref} width="180" height="180"></canvas>
    </div>
  );
});

export const MinimapUpdater = ({ galaxyRef, minimapCanvasRef }) => {
  const { camera } = useThree();

  useFrame(() => {
    if (!minimapCanvasRef.current || !galaxyRef.current) {
      return;
    }

    const galaxyData = galaxyRef.current.getGalaxyData();
    const points = galaxyRef.current.getPointsRef();

    if (!galaxyData || !points) {
      return;
    }

    const canvas = minimapCanvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw minimap background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    const mapSize = 180;
    const galaxySize = 1000; // This should roughly match the spread of your galaxy data
    const scale = mapSize / galaxySize;

    // Draw particles
    galaxyData.forEach(particle => {
      const x = (particle.x * scale) + (mapSize / 2);
      const z = (particle.z * scale) + (mapSize / 2);
      ctx.fillStyle = particle.color;
      ctx.fillRect(x, z, 1, 1);
    });

    // Draw camera
    const cameraX = (camera.position.x * scale) + (mapSize / 2);
    const cameraZ = (camera.position.z * scale) + (mapSize / 2);

    ctx.save();
    ctx.translate(cameraX, cameraZ);
    
    // Get camera direction
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    const angle = Math.atan2(cameraDirection.x, cameraDirection.z);
    ctx.rotate(angle);
    
    const CAMERA_TRIANGLE_BASE_HALF = 12;
    const CAMERA_TRIANGLE_HEIGHT_HALF = 25;

    ctx.fillStyle = 'rgba(0, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.moveTo(0, -CAMERA_TRIANGLE_HEIGHT_HALF);
    ctx.lineTo(-CAMERA_TRIANGLE_BASE_HALF, CAMERA_TRIANGLE_HEIGHT_HALF);
    ctx.lineTo(CAMERA_TRIANGLE_BASE_HALF, CAMERA_TRIANGLE_HEIGHT_HALF);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  });

  return null;
};

export default Minimap;
