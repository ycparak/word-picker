import { useCallback, useSyncExternalStore } from 'react'

function subscribeToResize(onChange: () => void) {
  window.addEventListener('resize', onChange)
  return () => window.removeEventListener('resize', onChange)
}

/** Largest uniform scale at which a `width`×`height` box fits inside the viewport. */
export function useFitScale(width: number, height: number): number {
  const getSnapshot = useCallback(
    () => Math.min(window.innerWidth / width, window.innerHeight / height),
    [width, height],
  )

  return useSyncExternalStore(subscribeToResize, getSnapshot, () => 1)
}
