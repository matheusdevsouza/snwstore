'use client'

import { useRef, useEffect, Suspense, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, Environment, OrbitControls } from '@react-three/drei'
import type { Group } from 'three'
import * as THREE from 'three'
import { gsap } from 'gsap'

interface ModelProps {
  url: string
  isInteracting: boolean
  onInteractionChange: (interacting: boolean) => void
  modelRef: React.RefObject<Group>
}

function Model({ url, isInteracting, onInteractionChange, modelRef }: ModelProps) {
  const { scene } = useGLTF(url)
  const isInitialized = useRef(false)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isInitialized.current && scene) {
      scene.traverse((child: any) => {
        if (child instanceof THREE.Mesh) {
          if (child.material instanceof THREE.MeshStandardMaterial) {
            child.material.emissive = new THREE.Color(0x30a9d9)
            child.material.emissiveIntensity = 0.2
            child.material.metalness = 0.3
            child.material.roughness = 0.7
            child.material.needsUpdate = true
          }
          if (child.material instanceof THREE.MeshBasicMaterial) {
            child.material.color = new THREE.Color(0x99e2f2)
            child.material.transparent = true
            child.material.opacity = 0.9
          }
          if (Array.isArray(child.material)) {
            child.material.forEach((mat: any) => {
              if (mat instanceof THREE.MeshStandardMaterial) {
                mat.emissive = new THREE.Color(0x30a9d9)
                mat.emissiveIntensity = 0.2
                mat.metalness = 0.3
                mat.roughness = 0.7
                mat.needsUpdate = true
              }
            })
          }
        }
      })
      
      isInitialized.current = true
    }
  }, [scene])

  useEffect(() => {
    if (modelRef.current && !hasAnimated.current) {
      modelRef.current.rotation.x = -Math.PI / 2
      modelRef.current.rotation.z = 0
        
      const initialScale = 0
      const initialOpacity = 0
      const initialY = 2
      const initialRotationY = -Math.PI * 0.5
      
      modelRef.current.scale.set(initialScale, initialScale, initialScale)
      modelRef.current.position.y = initialY
      modelRef.current.rotation.y = initialRotationY
      
      scene.traverse((child: any) => {
        if (child instanceof THREE.Mesh) {
          if (child.material instanceof THREE.MeshStandardMaterial || 
              child.material instanceof THREE.MeshBasicMaterial) {
            if (Array.isArray(child.material)) {
              child.material.forEach((mat: any) => {
                if (mat.transparent !== undefined) {
                  mat.transparent = true
                  mat.opacity = initialOpacity
                }
              })
            } else {
              child.material.transparent = true
              child.material.opacity = initialOpacity
            }
          }
        }
      })
      
      const tl = gsap.timeline({
        delay: 0.5,
        onComplete: () => {
          hasAnimated.current = true
        }
      })
      
      tl.to(modelRef.current.scale, {
        x: 0.4,
        y: 0.4,
        z: 0.4,
        duration: 1.2,
        ease: 'back.out(1.7)',
      })
      
      tl.to(modelRef.current.position, {
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
      }, 0)
      
      tl.to(modelRef.current.rotation, {
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
      }, 0)

      scene.traverse((child: any) => {
        if (child instanceof THREE.Mesh) {
          if (child.material instanceof THREE.MeshStandardMaterial || 
              child.material instanceof THREE.MeshBasicMaterial) {
            if (Array.isArray(child.material)) {
              child.material.forEach((mat: any) => {
                if (mat.transparent !== undefined) {
                  gsap.to(mat, {
                    opacity: mat instanceof THREE.MeshBasicMaterial ? 0.9 : 1,
                    duration: 1.0,
                    ease: 'power2.out',
                  })
                }
              })
            } else {
              gsap.to(child.material, {
                opacity: child.material instanceof THREE.MeshBasicMaterial ? 0.9 : 1,
                duration: 1.0,
                ease: 'power2.out',
              })
            }
          }
        }
      })
    }
  }, [scene, modelRef])

  useFrame((_state: any, delta: number) => {
    if (modelRef.current && !isInteracting && hasAnimated.current) {
      modelRef.current.rotation.y += delta * 0.1
    }
  })

  return (
    <group ref={modelRef} scale={[0, 0, 0]} position={[0, 2, 0]}>
      <primitive object={scene} />
    </group>
  )
}

function InteractiveControls({ 
  onInteractionChange, 
  modelRef 
}: { 
  onInteractionChange: (interacting: boolean) => void
  modelRef: React.RefObject<Group>
}) {
  const controlsRef = useRef<any>(null)
  const { camera } = useThree()
  const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const animationTimelineRef = useRef<gsap.core.Timeline | null>(null)
  const isResetting = useRef(false)
  const initialRotationY = useRef(0)

  const initialCameraPosition = useRef({ x: 0, y: 0, z: 8 })

  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return

    initialCameraPosition.current = {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z
    }

    const handleStart = () => {
      if (animationTimelineRef.current) {
        animationTimelineRef.current.kill()
        animationTimelineRef.current = null
      }
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current)
        resetTimeoutRef.current = null
      }
      isResetting.current = false
      
      if (modelRef.current) {
        initialRotationY.current = modelRef.current.rotation.y
      }
      
      onInteractionChange(true)
    }

    const handleEnd = () => {
      resetTimeoutRef.current = setTimeout(() => {
        if (isResetting.current) return
        
        isResetting.current = true
        onInteractionChange(false)

        controls.enabled = false

        if (!modelRef.current) return

        animationTimelineRef.current = gsap.timeline({
          onComplete: () => {
            controls.enabled = true
            controls.reset()
            isResetting.current = false
            animationTimelineRef.current = null
          }
        })

        animationTimelineRef.current.to(camera.position, {
          x: initialCameraPosition.current.x,
          y: initialCameraPosition.current.y,
          z: initialCameraPosition.current.z,
          duration: 2,
          ease: 'power3.out',
          onUpdate: () => {
            camera.lookAt(0, 0, 0)
            controls.target.set(0, 0, 0)
            controls.update()
          }
        }, 0)

        if (modelRef.current) {
          animationTimelineRef.current.to(modelRef.current.rotation, {
            x: -Math.PI / 2,
            z: 0,
            duration: 2,
            ease: 'power3.out',
          }, 0)
        }
      }, 200)
    }

    controls.addEventListener('start', handleStart)
    controls.addEventListener('end', handleEnd)

    return () => {
      controls.removeEventListener('start', handleStart)
      controls.removeEventListener('end', handleEnd)
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current)
      }
      if (animationTimelineRef.current) {
        animationTimelineRef.current.kill()
      }
    }
  }, [onInteractionChange, camera, modelRef])

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping={true}
      dampingFactor={0.05}
      rotateSpeed={1}
      minDistance={5}
      maxDistance={15}
      minPolarAngle={0}
      maxPolarAngle={Math.PI}
      enablePan={false}
      enableZoom={false}
      autoRotate={false}
      makeDefault
    />
  )
}

function Scene({ 
  isInteracting, 
  onInteractionChange,
  modelRef 
}: { 
  isInteracting: boolean
  onInteractionChange: (interacting: boolean) => void
  modelRef: React.RefObject<Group>
}) {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={0.9} color="#99E2F2" />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} color="#30A9D9" />
      <pointLight position={[5, 5, 5]} intensity={0.7} color="#30A9D9" />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#99E2F2" />
      <spotLight position={[0, 10, 0]} angle={0.4} penumbra={1} intensity={0.6} color="#99E2F2" />

      <Model url="/snow.glb" isInteracting={isInteracting} onInteractionChange={onInteractionChange} modelRef={modelRef} />

      <InteractiveControls onInteractionChange={onInteractionChange} modelRef={modelRef} />

      <Environment preset="night" />
    </>
  )
}

export default function Model3D() {
  const [isInteracting, setIsInteracting] = useState(false)
  const modelRef = useRef<Group>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      useGLTF.preload('/snow.glb')
    }
  }, [])

  return (
    <div 
      className="w-full h-full"
      style={{ 
        background: 'transparent',
        position: 'relative'
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 35 }}
        gl={{ 
          alpha: true, 
          antialias: true, 
          powerPreference: 'high-performance',
          stencil: false,
          depth: true
        }}
        dpr={[1, 2]}
        style={{ 
          background: 'transparent', 
          width: '100%', 
          height: '100%',
          cursor: 'grab'
        }}
        onCreated={({ gl }) => {        
          gl.domElement.style.pointerEvents = 'auto'
          gl.domElement.style.touchAction = 'none'
        }}
      >
        <Suspense fallback={null}>
          <Scene 
            isInteracting={isInteracting} 
            onInteractionChange={setIsInteracting}
            modelRef={modelRef}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
