import { render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createInitialGameState } from '../../engine/constants'
import { useGameLoop } from '../useGameLoop'
import { useGameStore } from '../useGameStore'

function TestComponent() {
  useGameLoop()
  return null
}

beforeEach(() => {
  localStorage.clear()
  useGameStore.setState({ game: createInitialGameState(Date.now()), ranking: [] })
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('useGameLoop', () => {
  it('chama tick ao montar e periodicamente enquanto o componente está montado', () => {
    const tickSpy = vi.spyOn(useGameStore.getState(), 'tick')
    render(<TestComponent />)

    expect(tickSpy).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(1000)

    expect(tickSpy.mock.calls.length).toBeGreaterThan(1)
  })

  it('chama tick imediatamente quando a aba volta a ficar visível', () => {
    const tickSpy = vi.spyOn(useGameStore.getState(), 'tick')
    render(<TestComponent />)
    tickSpy.mockClear()

    Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true })
    document.dispatchEvent(new Event('visibilitychange'))

    expect(tickSpy).toHaveBeenCalled()
  })

  it('para de chamar tick após desmontar o componente', () => {
    const tickSpy = vi.spyOn(useGameStore.getState(), 'tick')
    const { unmount } = render(<TestComponent />)
    unmount()
    tickSpy.mockClear()

    vi.advanceTimersByTime(2000)

    expect(tickSpy).not.toHaveBeenCalled()
  })
})
