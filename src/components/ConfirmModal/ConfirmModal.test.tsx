import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ConfirmModal } from './ConfirmModal'

const baseProps = {
  title: 'Reiniciar jogo',
  message: 'Tem certeza?',
  confirmLabel: 'Sim, reiniciar',
}

describe('ConfirmModal', () => {
  it('não renderiza nada quando open é false', () => {
    render(<ConfirmModal {...baseProps} open={false} onConfirm={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.queryByText('Reiniciar jogo')).not.toBeInTheDocument()
  })

  it('renderiza título, mensagem e botões quando open é true', () => {
    render(<ConfirmModal {...baseProps} open onConfirm={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByText('Reiniciar jogo')).toBeInTheDocument()
    expect(screen.getByText('Tem certeza?')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sim, reiniciar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument()
  })

  it('chama onConfirm ao clicar no botão de confirmação', () => {
    const onConfirm = vi.fn()
    render(<ConfirmModal {...baseProps} open onConfirm={onConfirm} onCancel={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: 'Sim, reiniciar' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('chama onCancel ao clicar no botão Cancelar', () => {
    const onCancel = vi.fn()
    render(<ConfirmModal {...baseProps} open onConfirm={vi.fn()} onCancel={onCancel} />)
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('chama onCancel ao clicar fora do modal (no overlay)', () => {
    const onCancel = vi.fn()
    render(<ConfirmModal {...baseProps} open onConfirm={vi.fn()} onCancel={onCancel} />)
    fireEvent.click(screen.getByText('Tem certeza?').closest('.kc-modal-overlay') as Element)
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('não chama onCancel ao clicar dentro do conteúdo do modal', () => {
    const onCancel = vi.fn()
    render(<ConfirmModal {...baseProps} open onConfirm={vi.fn()} onCancel={onCancel} />)
    fireEvent.click(screen.getByText('Tem certeza?'))
    expect(onCancel).not.toHaveBeenCalled()
  })
})
