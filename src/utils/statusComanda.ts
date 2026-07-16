import type { Comanda } from '../types/comanda'

export type TomStatus = 'neutro' | 'aviso' | 'sucesso'

export function statusDaComanda(comanda: Comanda): { texto: string; tom: TomStatus } {
  if (comanda.fechada) {
    return { texto: 'Fechada', tom: 'neutro' }
  }
  if (comanda.total === 0) {
    return { texto: 'Paga', tom: 'sucesso' }
  }
  return { texto: 'Aberta', tom: 'aviso' }
}