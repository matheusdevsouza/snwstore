'use client'

import { useRef, useEffect, Suspense, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, OrbitControls } from '@react-three/drei'
import type { Group } from 'three'
import * as THREE from 'three'
import { gsap } from 'gsap'

interface ModelProps {
  url: string
  isInteracting: boolean
  onInteractionChange: (interacting: boolean) => void
  modelRef: React.RefObject<Group>
  isMobile?: boolean
}

function Model({ url, isInteracting, onInteractionChange, modelRef, isMobile = false }: ModelProps) {
  const { scene } = useGLTF(url)
  const isInitialized = useRef(false)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isInitialized.current && scene) {
      scene.traverse((child: any) => {
        if (child instanceof THREE.Mesh) {
          const processMaterial = (material: THREE.Material) => {
            if (material instanceof THREE.MeshStandardMaterial) {
              const hasTexture = material.map || material.normalMap || material.roughnessMap || material.metalnessMap || material.emissiveMap || material.aoMap
              
              if (hasTexture) {
                material.emissive = new THREE.Color(0x30a9d9)
                material.emissiveIntensity = isMobile ? 0.15 : 0.2
                material.metalness = isMobile ? 0.4 : 0.3
                material.roughness = isMobile ? 0.6 : 0.7
                material.needsUpdate = true
                return
              }
              
              if (!material.emissive || material.emissive.getHex() === 0x000000) {
                material.emissive = new THREE.Color(0x30a9d9)
                material.emissiveIntensity = isMobile ? 0.25 : 0.2
                material.metalness = isMobile ? 0.4 : 0.3
                material.roughness = isMobile ? 0.6 : 0.7
                material.needsUpdate = true
              }
            } else if (material instanceof THREE.MeshBasicMaterial) {
              if (!material.map) {
                material.color = new THREE.Color(0x99e2f2)
                material.transparent = true
                if (material.opacity === 1) {
                  material.opacity = isMobile ? 0.95 : 0.9
                }
              } else if (isMobile) {
                material.opacity = Math.min(material.opacity || 1, 0.95)
                material.needsUpdate = true
              }
            }
          }

          if (Array.isArray(child.material)) {
            child.material.forEach(processMaterial)
          } else {
            processMaterial(child.material)
          }
        }
      })
      
      isInitialized.current = true
    }
  }, [scene, isMobile])

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
      
      const scaleValue = isMobile ? 0.45 : 0.4
      
      tl.to(modelRef.current.scale, {
        x: scaleValue,
        y: scaleValue,
        z: scaleValue,
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
  }, [scene, modelRef, isMobile])

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
  modelRef,
  isMobile = false
}: { 
  onInteractionChange: (interacting: boolean) => void
  modelRef: React.RefObject<Group>
  isMobile?: boolean
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

        try {
          controls.enabled = false
        } catch (e) {
          console.warn('Error disabling controls:', e)
        }

        if (!modelRef.current) return

        animationTimelineRef.current = gsap.timeline({
          onComplete: () => {
            try {
              controls.enabled = true
              controls.reset()
            } catch (e) {
              console.warn('Error resetting controls:', e)
            }
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
            try {
              camera.lookAt(0, 0, 0)
              controls.target.set(0, 0, 0)
              controls.update()
            } catch (e) {
              console.warn('Error updating controls:', e)
            }
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

    const handleError = (e: ErrorEvent) => {
      if (e.message && e.message.includes('releasePointerCapture')) {
        e.preventDefault()
        return false
      }
    }

    controls.addEventListener('start', handleStart)
    controls.addEventListener('end', handleEnd)
    
    if (typeof window !== 'undefined') {
      window.addEventListener('error', handleError)
    }

    return () => {
      controls.removeEventListener('start', handleStart)
      controls.removeEventListener('end', handleEnd)
      if (typeof window !== 'undefined') {
        window.removeEventListener('error', handleError)
      }
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current)
      }
      if (animationTimelineRef.current) {
        animationTimelineRef.current.kill()
      }
    }
  }, [onInteractionChange, camera, modelRef, isMobile])

  if (isMobile) {
    return null
  }

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
  modelRef,
  isMobile = false
}: { 
  isInteracting: boolean
  onInteractionChange: (interacting: boolean) => void
  modelRef: React.RefObject<Group>
  isMobile?: boolean
}) {
  return (
    <>
      <ambientLight intensity={isMobile ? 0.8 : 0.9} />
      <directionalLight position={[5, 5, 5]} intensity={isMobile ? 1.0 : 1.2} color="#99E2F2" />
      <directionalLight position={[-5, -5, -5]} intensity={isMobile ? 0.6 : 0.8} color="#30A9D9" />
      <pointLight position={[5, 5, 5]} intensity={isMobile ? 0.8 : 1.0} color="#30A9D9" />
      <pointLight position={[-5, -5, -5]} intensity={isMobile ? 0.6 : 0.8} color="#99E2F2" />
      <spotLight position={[0, 10, 0]} angle={0.4} penumbra={1} intensity={isMobile ? 0.7 : 0.9} color="#99E2F2" />

      <Model url="/snow.glb" isInteracting={isInteracting} onInteractionChange={onInteractionChange} modelRef={modelRef} isMobile={isMobile} />

      <InteractiveControls onInteractionChange={onInteractionChange} modelRef={modelRef} isMobile={isMobile} />
    </>
  )
}

export default function Model3D() {
  const [isInteracting, setIsInteracting] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const modelRef = useRef<Group>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      useGLTF.preload('/snow.glb')
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768)
      }
      checkMobile()
      window.addEventListener('resize', checkMobile)
      return () => window.removeEventListener('resize', checkMobile)
    }
  }, [])

  return (
    <div 
      className="w-full h-full"
      style={{ 
        background: 'transparent',
        position: 'relative',
        ...(isMobile && {
          pointerEvents: 'none',
          touchAction: 'pan-y'
        })
      }}
    >
      <Canvas
        camera={{ position: [0, 0, isMobile ? 6 : 8], fov: isMobile ? 40 : 35 }}
        gl={{ 
          alpha: true, 
          antialias: true, 
          powerPreference: 'high-performance',
          stencil: false,
          depth: true
        }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        style={{ 
          background: 'transparent', 
          width: '100%', 
          height: '100%',
          cursor: 'grab'
        }}
        onCreated={({ gl }) => {
          if (isMobile) {
            gl.domElement.style.pointerEvents = 'none'
            gl.domElement.style.touchAction = 'pan-y'
          } else {
            gl.domElement.style.pointerEvents = 'auto'
            gl.domElement.style.touchAction = 'none'
          }
          
          if (typeof gl.domElement.releasePointerCapture === 'function') {
            const originalReleasePointerCapture = gl.domElement.releasePointerCapture.bind(gl.domElement)
            gl.domElement.releasePointerCapture = function(pointerId: number) {
              try {
                originalReleasePointerCapture(pointerId)
              } catch (e: any) {
                if (!e?.message?.includes('releasePointerCapture')) {
                  console.warn('Pointer capture error:', e)
                }
              }
            }
          }
        }}
      >
        <Suspense fallback={null}>
          <Scene 
            isInteracting={isInteracting} 
            onInteractionChange={setIsInteracting}
            modelRef={modelRef}
            isMobile={isMobile}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
