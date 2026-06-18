import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '../../store/useGameStore'

/**
 * Dispara uma animação visível a cada vez que `totalProduced` aumenta.
 * Reaplica a animação CSS remontando o elemento via `key`, em vez de usar
 * uma animação contínua — assim ela representa cada evento de produção,
 * não um efeito decorativo estático.
 */
export function PieceAnimation() {
  const totalProduced = useGameStore((state) => state.game.totalProduced)
  const previousRef = useRef(totalProduced)
  const [pulseKey, setPulseKey] = useState(0)

  useEffect(() => {
    if (totalProduced > previousRef.current) {
      setPulseKey((key) => key + 1)
    }
    previousRef.current = totalProduced
  }, [totalProduced])

  return (
    <div
      data-testid="piece-animation"
      data-pulse={pulseKey}
      className="flex h-12 items-center justify-center"
      aria-hidden="true"
    >
      <span key={pulseKey} className="animate-piece-pop text-3xl">
        ⚙️
      </span>
    </div>
  )
}
