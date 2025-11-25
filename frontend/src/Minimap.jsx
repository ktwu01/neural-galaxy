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
        borderRadius: '50%', // Make it circular
        overflow: 'hidden',   // Clip content to the circle
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

    const mapSize = 180;
    const center = mapSize / 2;
    const radius = mapSize / 2;

    // Draw minimap background (circular)
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
    ctx.stroke();
    ctx.closePath();

    ctx.save();
    ctx.clip(); // Clip further drawings to the circle

    const galaxySize = 1000; // This should roughly match the spread of your galaxy data
    const scale = mapSize / galaxySize;

    // Draw particles
    galaxyData.forEach(particle => {
      const x = (particle.x * scale) + center;
      const z = (particle.z * scale) + center;
      ctx.fillStyle = particle.color;
      ctx.fillRect(x, z, 1, 1);
    });

    // Draw camera
    const cameraX = (camera.position.x * scale) + center;
    const cameraZ = (camera.position.z * scale) + center;

    const CAMERA_TRIANGLE_BASE_HALF = 15;
    const CAMERA_TRIANGLE_HEIGHT_HALF = 25;
    
    ctx.save();
    ctx.translate(cameraX, cameraZ);
    
    // Get camera direction
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    const angle = Math.atan2(cameraDirection.x, cameraDirection.z);
    ctx.rotate(angle);
    
    ctx.fillStyle = 'rgba(0, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.moveTo(0, -CAMERA_TRIANGLE_HEIGHT_HALF);
    ctx.lineTo(-CAMERA_TRIANGLE_BASE_HALF, CAMERA_TRIANGLE_HEIGHT_HALF);
    ctx.lineTo(CAMERA_TRIANGLE_BASE_HALF, CAMERA_TRIANGLE_HEIGHT_HALF);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    ctx.restore(); // Restore clipping
  });

  return null;
};

export default Minimap;
