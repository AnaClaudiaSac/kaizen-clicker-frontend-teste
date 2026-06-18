import { useEffect } from 'react'
import { useGameStore } from './useGameStore'

const LOOP_INTERVAL_MS = 250

/**
 * Roda o loop do jogo: chama `tick` periodicamente usando o tempo real
 * (Date.now()), e força um recálculo imediato quando a aba volta a ficar
 * visível (Page Visibility API). A própria função `tick` da store já lida
 * com o tempo decorrido enquanto a aba estava em background ou o app
 * estava fechado (Regra 2) — este hook só garante que ela seja chamada
 * com frequência suficiente para a UI parecer fluida.
 */
export function useGameLoop(): void {
  const tick = useGameStore((state) => state.tick)

  useEffect(() => {
    tick(Date.now())

    const intervalId = setInterval(() => {
      tick(Date.now())
    }, LOOP_INTERVAL_MS)

    function handleVisibilityChange(): void {
      if (document.visibilityState === 'visible') {
        tick(Date.now())
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearInterval(intervalId)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [tick])
}
