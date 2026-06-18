import { describe, expect, it } from 'vitest'
import { RANKING_MAX_STORED_ENTRIES } from '../constants'
import { getTopRanking, sanitizePlayerName, upsertRankingEntry } from '../ranking'
import type { RankingEntry } from '../types'

describe('sanitizePlayerName', () => {
  it('remove espaços nas extremidades', () => {
    expect(sanitizePlayerName('  Ana  ')).toBe('Ana')
  })

  it('limita o nome ao tamanho máximo permitido', () => {
    const longName = 'a'.repeat(50)
    expect(sanitizePlayerName(longName)).toHaveLength(20)
  })
})

describe('upsertRankingEntry', () => {
  it('insere um nome novo que ainda não existe no ranking', () => {
    const result = upsertRankingEntry([], { name: 'Ana', score: 100, savedAt: 1 })
    expect(result).toEqual([{ name: 'Ana', score: 100, savedAt: 1 }])
  })

  it('atualiza um nome existente quando o novo score é maior (Regra 3)', () => {
    const ranking: RankingEntry[] = [{ name: 'Ana', score: 100, savedAt: 1 }]
    const result = upsertRankingEntry(ranking, { name: 'Ana', score: 500, savedAt: 2 })
    expect(result).toEqual([{ name: 'Ana', score: 500, savedAt: 2 }])
  })

  it('mantém o registro existente quando o novo score é menor (Regra 3)', () => {
    const ranking: RankingEntry[] = [{ name: 'Ana', score: 100, savedAt: 1 }]
    const result = upsertRankingEntry(ranking, { name: 'Ana', score: 50, savedAt: 2 })
    expect(result).toEqual([{ name: 'Ana', score: 100, savedAt: 1 }])
  })

  it('mantém o registro existente quando o novo score é igual', () => {
    const ranking: RankingEntry[] = [{ name: 'Ana', score: 100, savedAt: 1 }]
    const result = upsertRankingEntry(ranking, { name: 'Ana', score: 100, savedAt: 2 })
    expect(result).toEqual([{ name: 'Ana', score: 100, savedAt: 1 }])
  })

  it('limita o armazenamento a RANKING_MAX_STORED_ENTRIES, mantendo os maiores scores', () => {
    const ranking: RankingEntry[] = Array.from({ length: RANKING_MAX_STORED_ENTRIES }, (_, i) => ({
      name: `Jogador${i}`,
      score: i,
      savedAt: i,
    }))
    const result = upsertRankingEntry(ranking, { name: 'NovoJogador', score: 1000, savedAt: 999 })
    expect(result).toHaveLength(RANKING_MAX_STORED_ENTRIES)
    expect(result[0].name).toBe('NovoJogador')
    expect(result.some((entry) => entry.score === 0)).toBe(false)
  })
})

describe('getTopRanking', () => {
  it('retorna apenas os 10 maiores scores, em ordem decrescente', () => {
    const ranking: RankingEntry[] = Array.from({ length: 15 }, (_, i) => ({
      name: `Jogador${i}`,
      score: i,
      savedAt: i,
    }))
    const top = getTopRanking(ranking)
    expect(top).toHaveLength(10)
    expect(top[0].score).toBe(14)
    expect(top[9].score).toBe(5)
  })
})
