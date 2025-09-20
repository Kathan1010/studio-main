
"use client";

import React, { useRef, useEffect, MutableRefObject } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { Level } from '@/lib/levels';

// --- A dedicated class to manage the Three.js game world ---
export class Game {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private ballMesh: THREE.Mesh;
  private holeMesh: THREE.Mesh;
  private obstacles: THREE.Mesh[] = [];
  private sandpits: THREE.Mesh[] = [];
  private aimLineDots: THREE.Mesh[] = [];
  private flagGroup: THREE.Group;
  private raycaster = new THREE.Raycaster();
  private interactionIndicator: THREE.Mesh;


  // Game state
  private isBallMoving = false;
  private isCharging = false;
  private chargePower = 0;
  private aimDirection = new THREE.Vector3(0, 0, -1);
  private ballVelocity = new THREE.Vector3();
  private isHoleCompleted = false;
  private isDragging = false;
  private dragStartPosition = new THREE.Vector2();
  private dragCurrentPosition = new THREE.Vector2();

  
  // Constants
  private gravity = new THREE.Vector3(0, -0.01, 0);

  // Callbacks
  private onStroke: () => void;
  private onHoleComplete: () => void;
  private setPower: (power: number) => void;
  private isGamePaused: () => boolean;
  
  constructor(
    private mount: HTMLDivElement,
    private level: Level,
    callbacks: {
        onStroke: () => void;
        onHoleComplete: () => void;
        setPower: (power: number) => void;
        isGamePaused: () => boolean;
    }
  ) {
    this.onStroke = callbacks.onStroke;
    this.onHoleComplete = callbacks.onHoleComplete;
    this.setPower = callbacks.setPower;
    this.isGamePaused = callbacks.isGamePaused;

    // --- Basic setup ---
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87CEEB);
    this.scene.fog = new THREE.Fog(0x87CEEB, 20, 100);

    this.camera = new THREE.PerspectiveCamera(60, this.mount.clientWidth / this.mount.clientHeight, 0.1, 1000);
    this.camera.position.set(this.level.startPosition[0], 5, this.level.startPosition[2] + 8);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.mount.clientWidth, this.mount.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.mount.appendChild(this.renderer.domElement);

    this.addLights();
    this.createLevel();
    this.bindEventHandlers();
    this.updateAimLine();
  }

  private addLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(-5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.left = -25;
    directionalLight.shadow.camera.right = 25;
    directionalLight.shadow.camera.top = 25;
    directionalLight.shadow.camera.bottom = -25;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    this.scene.add(directionalLight);
  }

  private createTree(position: THREE.Vector3) {
    const treeGroup = new THREE.Group();

    const trunkGeo = new THREE.CylinderGeometry(0.2, 0.3, 1.5, 8);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const trunkMesh = new THREE.Mesh(trunkGeo, trunkMat);
    trunkMesh.position.y = 0.75;
    trunkMesh.castShadow = true;
    treeGroup.add(trunkMesh);

    const leavesGeo = new THREE.ConeGeometry(1, 2, 8);
    const leavesMat = new THREE.MeshStandardMaterial({ color: 0x006400 });
    const leavesMesh = new THREE.Mesh(leavesGeo, leavesMat);
    leavesMesh.position.y = 2.5;
    leavesMesh.castShadow = true;
    treeGroup.add(leavesMesh);

    treeGroup.position.copy(position);
    this.scene.add(treeGroup);
    
    const trunkObstacle = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.5, 0.6), new THREE.MeshStandardMaterial({visible: false}));
    trunkObstacle.position.set(position.x, 0.75, position.z);
    this.obstacles.push(trunkObstacle);
    this.scene.add(trunkObstacle);
  }

  private createLevel() {
    // Ground
    const groundGeo = new THREE.PlaneGeometry(50, 50);
    
    // --- Checkerboard Texture ---
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    if (context) {
        const color1 = '#228B22'; // ForestGreen
        const color2 = '#006400'; // DarkGreen
        const checks = 2;
        const size = canvas.width / checks;

        for (let x = 0; x < checks; x++) {
            for (let y = 0; y < checks; y++) {
                context.fillStyle = (x + y) % 2 === 0 ? color1 : color2;
                context.fillRect(x * size, y * size, size, size);
            }
        }
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(8, 8);

    const groundMat = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.8 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Ball
    const ballGeo = new THREE.SphereGeometry(0.15, 32, 16);
    const ballMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, metalness: 0 });
    this.ballMesh = new THREE.Mesh(ballGeo, ballMat);
    this.ballMesh.castShadow = true;
    this.ballMesh.position.fromArray(this.level.startPosition);
    this.scene.add(this.ballMesh);

    // --- Interaction Indicator ---
    const indicatorTextureCanvas = document.createElement('canvas');
    indicatorTextureCanvas.width = 128;
    indicatorTextureCanvas.height = 128;
    const indicatorContext = indicatorTextureCanvas.getContext('2d')!;
    indicatorContext.strokeStyle = 'white';
    indicatorContext.lineWidth = 8;
    indicatorContext.setLineDash([10, 8]); // Dashed line
    indicatorContext.beginPath();
    indicatorContext.arc(64, 64, 56, 0, Math.PI * 2);
    indicatorContext.stroke();
    const indicatorTexture = new THREE.CanvasTexture(indicatorTextureCanvas);

    const indicatorGeo = new THREE.RingGeometry(0.25, 0.35, 32);
    const indicatorMat = new THREE.MeshBasicMaterial({ 
        map: indicatorTexture, 
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
    });
    this.interactionIndicator = new THREE.Mesh(indicatorGeo, indicatorMat);
    this.interactionIndicator.rotation.x = -Math.PI / 2;
    this.scene.add(this.interactionIndicator);

    // Hole
    const holeGeo = new THREE.CircleGeometry(this.level.holeRadius, 32);
    const holeMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
    this.holeMesh = new THREE.Mesh(holeGeo, holeMat);
    this.holeMesh.position.fromArray(this.level.holePosition);
    this.holeMesh.rotation.x = -Math.PI / 2;
    this.scene.add(this.holeMesh);

    // Obstacles
    const obstacleMat = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.8 });
    this.level.obstacles.forEach(obs => {
      const obsGeo = new THREE.BoxGeometry(obs.size[0], obs.size[1], obs.size[2]);
      const obstacle = new THREE.Mesh(obsGeo, obstacleMat);
      obstacle.position.fromArray(obs.position);
      if (obs.rotation) {
          obstacle.rotation.fromArray(obs.rotation as [number, number, number]);
      }
      obstacle.castShadow = true;
      obstacle.receiveShadow = true;
      this.scene.add(obstacle);
      this.obstacles.push(obstacle);
    });

    // Sandpits
    if (this.level.sandpits) {
      this.level.sandpits.forEach(sp => {
        const sandGeo = new THREE.CircleGeometry(sp.radius, 32);
        const sandMat = new THREE.MeshStandardMaterial({ color: 0xF4A460, roughness: 1 });
        const sandpit = new THREE.Mesh(sandGeo, sandMat);
        sandpit.position.fromArray(sp.position);
        sandpit.rotation.x = -Math.PI / 2;
        sandpit.receiveShadow = true;
        this.scene.add(sandpit);
        this.sandpits.push(sandpit);
      });
    }

    // Trees
    if (this.level.trees) {
      this.level.trees.forEach(t => {
        this.createTree(new THREE.Vector3(...t.position));
      });
    }

    // Flag
    this.flagGroup = new THREE.Group();
    const poleGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.5, 8);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, transparent: true });
    const poleMesh = new THREE.Mesh(poleGeo, poleMat);
    poleMesh.position.y = 0.75; // Half of height
    poleMesh.castShadow = true;
    this.flagGroup.add(poleMesh);

    const flagGeo = new THREE.PlaneGeometry(0.6, 0.4);
    const flagMat = new THREE.MeshStandardMaterial({ color: 0xff0000, side: THREE.DoubleSide, transparent: true });
    const flagMesh = new THREE.Mesh(flagGeo, flagMat);
    flagMesh.position.set(0.3, 1.2, 0); // Position relative to the pole top
    this.flagGroup.add(flagMesh);
    
    this.flagGroup.position.fromArray(this.level.holePosition);
    this.flagGroup.position.y = this.level.holePosition[1];
    this.scene.add(this.flagGroup);


    // Aim Line
    const dotCount = 10;
    const dotGeo = new THREE.CircleGeometry(0.08, 16);
    const dotMat = new THREE.MeshBasicMaterial({ 
        color: 0x00ff00, 
        transparent: true,
        opacity: 0.8
    });
    dotMat.depthTest = false;
    dotMat.depthWrite = false;

    for (let i = 0; i < dotCount; i++) {
        const dot = new THREE.Mesh(dotGeo, dotMat);
        dot.rotation.x = -Math.PI / 2;
        dot.visible = false;
        dot.renderOrder = 999;
        this.aimLineDots.push(dot);
        this.scene.add(dot);
    }
  }

  private bindEventHandlers() {
    window.addEventListener('resize', this.handleResize);
    this.renderer.domElement.addEventListener('pointerdown', this.handlePointerDown);
    this.renderer.domElement.addEventListener('pointermove', this.handlePointerMove);
    window.addEventListener('pointerup', this.handlePointerUp); // Use window for pointerup
    
    // Touch events
    this.renderer.domElement.addEventListener('touchstart', this.handleTouchStart, { passive: false });
    this.renderer.domElement.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    window.addEventListener('touchend', this.handleTouchEnd);
  }

  private updateAimLine() {
    const areDotsVisible = !(this.isBallMoving || this.isHoleCompleted);
    
    let lineLength = 0;
    let powerColor = new THREE.Color(0x00ff00); // Default to green

    if (this.isDragging) {
        const dragVector = this.dragCurrentPosition.clone().sub(this.dragStartPosition);
        const dragDistance = dragVector.length();
        
        this.aimDirection.set(-dragVector.x, 0, -dragVector.y).normalize();

        const maxDrag = 80;
        this.chargePower = Math.min((dragDistance / maxDrag) * 100, 100);
        this.setPower(this.chargePower);

        lineLength = (this.chargePower / 100) * 4;

        if (this.chargePower < 50) {
            powerColor.setHSL(0.33, 1, 0.5); // Green
        } else if (this.chargePower < 85) {
            powerColor.setHSL(0.16, 1, 0.5); // Yellow
        } else {
            powerColor.setHSL(0, 1, 0.5); // Red
        }

    } else {
        this.chargePower = 0;
        this.setPower(0);
    }
    
    // Update aim line dots
    const startPoint = this.ballMesh.position.clone();
    startPoint.y = 0.1; // Lift the line slightly off the ground

    this.aimLineDots.forEach((dot, index) => {
        if (!areDotsVisible || !this.isDragging || lineLength <= 0) {
            dot.visible = false;
            return;
        }
        
        dot.visible = true;
        
        // Position dots along the aim direction
        const segmentLength = lineLength / this.aimLineDots.length;
        const dotPosition = startPoint.clone().add(
            this.aimDirection.clone().multiplyScalar((index + 1) * segmentLength)
        );
        dot.position.copy(dotPosition);

        // Update color
        (dot.material as THREE.MeshBasicMaterial).color = powerColor;
        
        // Make dots smaller as they get further away
        const scale = 1.0 - (index / this.aimLineDots.length) * 0.5;
        dot.scale.set(scale, scale, scale);
    });
  }
  
    private handleTouchStart = (event: TouchEvent) => {
        if (event.touches.length === 1) {
            event.preventDefault();
            this.handlePointerDown(event.touches[0] as unknown as PointerEvent);
        }
    };

    private handleTouchMove = (event: TouchEvent) => {
        if (event.touches.length === 1) {
            event.preventDefault();
            this.handlePointerMove(event.touches[0] as unknown as PointerEvent);
        }
    };

    private handleTouchEnd = (event: TouchEvent) => {
         this.handlePointerUp();
    };

  private handlePointerDown = (event: PointerEvent) => {
    if (this.isGamePaused() || this.isBallMoving || this.isHoleCompleted) return;

    this.isDragging = true;
    this.dragStartPosition.set(event.clientX, event.clientY);
    this.dragCurrentPosition.copy(this.dragStartPosition);
  };

  private handlePointerMove = (event: PointerEvent) => {
    if (this.isDragging) {
      const sensitivity = 0.25; // Lower is less sensitive
      const deltaX = (event.clientX - this.dragStartPosition.x) * sensitivity;
      const deltaY = (event.clientY - this.dragStartPosition.y) * sensitivity;
      this.dragCurrentPosition.set(this.dragStartPosition.x + deltaX, this.dragStartPosition.y + deltaY);
    }
  };

  private handlePointerUp = () => {
    if (!this.isDragging) return;

    this.isDragging = false;
    
    if (this.chargePower < 5) { // Cancel shot if not enough power
        this.setPower(0);
        this.chargePower = 0;
        this.aimLineDots.forEach(d => d.visible = false);
        return;
    }

    const powerMultiplier = 0.007;
    this.ballVelocity.copy(this.aimDirection).multiplyScalar(this.chargePower * powerMultiplier);
    this.isBallMoving = true;
    this.onStroke();

    // Reset charge state
    this.setPower(0);
    this.chargePower = 0;
    this.aimLineDots.forEach(d => d.visible = false);
  };

  private handleResize = () => {
    this.camera.aspect = this.mount.clientWidth / this.mount.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.mount.clientWidth, this.mount.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  };
  
 private checkCollisions() {
    const ballRadius = (this.ballMesh.geometry as THREE.SphereGeometry).parameters.radius;
    let onSurface = false;
    let inSand = false;
    let surfaceNormal = new THREE.Vector3(0, 1, 0); // Default to flat ground
    
    // --- Ground collision ---
    const groundLevel = 0;
    if (this.ballMesh.position.y < groundLevel + ballRadius && this.ballVelocity.y < 0) {
        this.ballMesh.position.y = groundLevel + ballRadius;
        this.ballVelocity.y *= -0.3; // Dampen bounce
        onSurface = true;
    }

    // --- Obstacle Collision (with Raycasting for Tunneling) ---
    const movementVector = this.ballVelocity.clone();
    const movementDistance = movementVector.length();
    let collisionDetected = false;

    if (movementDistance > 0) {
        const raycaster = new THREE.Raycaster(this.ballMesh.position, movementVector.normalize(), 0, movementDistance + ballRadius);
        const intersects = raycaster.intersectObjects(this.obstacles);

        if (intersects.length > 0) {
            const intersection = intersects[0];
            // Check if the intersection is closer than the ball's intended movement
            if (intersection.distance <= movementDistance + ballRadius) {
                collisionDetected = true;
                const collisionNormal = intersection.face!.normal.clone();
                // Make sure normal is pointing out of the face from the obstacle's perspective
                collisionNormal.transformDirection(intersection.object.matrixWorld).normalize();

                // Position the ball at the point of collision
                this.ballMesh.position.copy(intersection.point);
                this.ballMesh.position.add(collisionNormal.clone().multiplyScalar(ballRadius * 1.01)); // Epsilon to avoid getting stuck
                
                // Reflect velocity
                this.ballVelocity.reflect(collisionNormal);
                
                // Apply dampening
                const collisionDampening = 0.7; 
                this.ballVelocity.multiplyScalar(collisionDampening);
                
                // If the normal is pointing mostly upwards, we are on top of the obstacle
                if (collisionNormal.y > 0.7) {
                    onSurface = true;
                    surfaceNormal = collisionNormal; // This is a slope!
                }
            }
        }
    }
    
    // --- Sandpit check ---
    if (!collisionDetected) { // Only check for sand if we didn't just bounce off a wall
        for (const sandpit of this.sandpits) {
            const distToSandpitCenter = this.ballMesh.position.clone().setY(sandpit.position.y).distanceTo(sandpit.position);
            const sandpitRadius = (sandpit.geometry as THREE.CircleGeometry).parameters.radius;

            // Check if the ball is horizontally within the sandpit and vertically very close to it.
            if (distToSandpitCenter < sandpitRadius && Math.abs(this.ballMesh.position.y - (sandpit.position.y + ballRadius)) < 0.2) {
                inSand = true;
                onSurface = true; // Being in sand means we are on a surface
                break;
            }
        }
    }


    // --- Apply friction and slope gravity if on any surface ---
    if(onSurface) {
      const isFlat = surfaceNormal.y > 0.99; // Check if the surface is nearly flat
      const friction = inSand ? 0.8 : 0.98;
      
      this.ballVelocity.x *= friction;
      this.ballVelocity.z *= friction;
      
      // Also apply a little friction to vertical bounce on surfaces
      if (Math.abs(this.ballVelocity.y) < 0.01) {
          this.ballVelocity.y = 0;
      }
      
      // Apply slope gravity if not flat
      if (!isFlat) {
          const slopeGravity = this.gravity.clone();
          const slide = slopeGravity.sub(surfaceNormal.clone().multiplyScalar(slopeGravity.dot(surfaceNormal)));
          this.ballVelocity.add(slide);
      }
    }
  }


 private updateCamera() {
    const cameraOffset = new THREE.Vector3(0, 5, 8);
    const targetPosition = new THREE.Vector3(
        this.ballMesh.position.x,
        0, // IMPORTANT: Ignore ball's y position for the target calculation
        this.ballMesh.position.z
    ).add(cameraOffset);

    // Smoothly interpolate the camera's position
    const lerpFactor = 0.05;
    
    // Smoothly interpolate x and z
    this.camera.position.x = THREE.MathUtils.lerp(this.camera.position.x, targetPosition.x, lerpFactor);
    this.camera.position.z = THREE.MathUtils.lerp(this.camera.position.z, targetPosition.z, lerpFactor);
    
    // Smoothly interpolate y, but prevent it from going below a certain height
    const minCameraHeight = 1;
    const targetY = Math.max(targetPosition.y, minCameraHeight);
    this.camera.position.y = THREE.MathUtils.lerp(this.camera.position.y, targetY, lerpFactor);
    
    // The camera should always look at the ball's horizontal plane to prevent vibration
    const lookAtPosition = new THREE.Vector3(this.ballMesh.position.x, 0, this.ballMesh.position.z);
    this.camera.lookAt(lookAtPosition);
  }

  private update() {
    if (this.isGamePaused()) {
        // Update the indicator rotation even when paused
        this.interactionIndicator.rotation.z += 0.01;
        return;
    }
    
    this.updateCamera();

    this.updateAimLine();

    // --- Update Interaction Indicator ---
    this.interactionIndicator.position.copy(this.ballMesh.position);
    this.interactionIndicator.position.y = this.ballMesh.position.y - 0.14; // Slightly below the ball
    this.interactionIndicator.rotation.z += 0.01; // Spin it
    
    // Only show the indicator if the ball can be hit
    this.interactionIndicator.visible = !this.isBallMoving && !this.isHoleCompleted && !this.isDragging;
    
    // --- Hole Completion Animation ---
    if (this.isHoleCompleted) {
        // Sink the ball
        this.ballMesh.position.y -= 0.05;
        this.ballMesh.scale.multiplyScalar(0.95);
        if (this.ballMesh.scale.x < 0.1) {
            this.ballMesh.visible = false;
        }

        // Fade out the flag
        if (this.flagGroup && this.flagGroup.visible) {
            let faded = true;
            this.flagGroup.traverse(child => {
                if (child instanceof THREE.Mesh && (child.material as THREE.Material).transparent && (child.material as THREE.Material).opacity > 0) {
                    (child.material as THREE.Material).opacity -= 0.05;
                    faded = false;
                }
            });
            if (faded) {
                this.flagGroup.visible = false;
            }
        }
        return;
    }

    // --- Gameplay Physics ---
    if (this.isBallMoving) {
        // Apply global gravity before checking collisions
        this.ballVelocity.add(this.gravity);
        
        // Move and check for collisions
        this.checkCollisions();
        this.ballMesh.position.add(this.ballVelocity);


        const ballRadius = (this.ballMesh.geometry as THREE.SphereGeometry).parameters.radius;
        const distToHole = this.ballMesh.position.distanceTo(this.holeMesh.position);
        
        // --- HOLE COMPLETION LOGIC ---
        const onHolePlane = Math.abs(this.ballMesh.position.y - this.holeMesh.position.y) < ballRadius;
        if (onHolePlane && distToHole < this.level.holeRadius && this.ballVelocity.lengthSq() < 0.05) {
            this.isHoleCompleted = true;
            this.isBallMoving = false;
            this.ballVelocity.set(0, 0, 0); // Stop all movement
            this.ballMesh.position.copy(this.holeMesh.position).setY(this.holeMesh.position.y + ballRadius); // Center it
            
            this.onHoleComplete();
            return; // Exit update loop for this frame
        }

        // --- HOLE GRAVITY LOGIC ---
        if (onHolePlane && distToHole < this.level.holeRadius * 2.5 && this.ballVelocity.lengthSq() < 0.5) {
            const pullVector = this.holeMesh.position.clone().sub(this.ballMesh.position).normalize();
            pullVector.y = 0; // Only pull on the XZ plane
            pullVector.multiplyScalar(0.0035); // Adjust pull strength for a subtle effect
            this.ballVelocity.add(pullVector);
            this.ballVelocity.multiplyScalar(0.975); // Slightly dampen velocity near hole
        }

        // --- Out of Bounds Check ---
        const { x, y, z } = this.ballMesh.position;
        if (y < -2) { // Only reset if it falls below the boundaries
            this.onStroke(); // Penalty stroke
            this.ballMesh.position.fromArray(this.level.startPosition);
            this.ballVelocity.set(0, 0, 0);
            this.isBallMoving = false;
        }
        
        // --- Stop Condition ---
        const onAnySurface = this.ballMesh.position.y <= (this.ballMesh.geometry as THREE.SphereGeometry).parameters.radius + 0.01;
        if (onAnySurface && this.ballVelocity.lengthSq() < 0.0001) {
            this.ballVelocity.set(0, 0, 0);
            this.isBallMoving = false;
        }
    }
  }

  public animate = () => {
    requestAnimationFrame(this.animate);

    this.update();
    
    this.renderer.render(this.scene, this.camera);
  };

  public cleanup() {
    window.removeEventListener('resize', this.handleResize);
    this.renderer.domElement.removeEventListener('pointerdown', this.handlePointerDown);
    this.renderer.domElement.removeEventListener('pointermove', this.handlePointerMove);
    window.removeEventListener('pointerup', this.handlePointerUp);
    this.renderer.domElement.removeEventListener('touchstart', this.handleTouchStart);
    this.renderer.domElement.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('touchend', this.handleTouchEnd);


    if (this.mount && this.renderer.domElement) {
        try {
            this.mount.removeChild(this.renderer.domElement);
        } catch (e) {
            console.error("Failed to remove renderer DOM element.", e);
        }
    }
    
    this.scene.traverse(object => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        if (Array.isArray(object.material)) {
          object.material.forEach(material => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    });
    this.renderer.dispose();
  }
}

// --- The React Component ---
type GolfCanvasProps = {
  level: Level;
  onStroke: () => void;
  onHoleComplete: () => void;
  setPower: (power: number) => void;
  isGamePaused?: boolean;
  gameRef?: MutableRefObject<Game | null>;
};

const GolfCanvas: React.FC<GolfCanvasProps> = ({ level, onStroke, onHoleComplete, setPower, isGamePaused = false, gameRef }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const isGamePausedRef = useRef(isGamePaused);

  useEffect(() => {
    isGamePausedRef.current = isGamePaused;
  }, [isGamePaused]);

  useEffect(() => {
    if (!mountRef.current) return;

    const game = new Game(mountRef.current, level, {
        onStroke,
        onHoleComplete,
        setPower,
        isGamePaused: () => isGamePausedRef.current,
    });

    if (gameRef) {
        gameRef.current = game;
    }
    
    game.animate();

    return () => {
      game.cleanup();
      if (gameRef) {
        gameRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]); // Key change: This effect now ONLY re-runs if the level changes.

  return <div ref={mountRef} className="absolute top-0 left-0 w-full h-full touch-action-none" />;
};

export default GolfCanvas;

    
