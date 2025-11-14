import Lenis from 'lenis'

let lenisInstance: Lenis | null = null

export function getLenis(): Lenis | null {
  return lenisInstance
}

export function setLenis(lenis: Lenis | null) {
  lenisInstance = lenis
}

