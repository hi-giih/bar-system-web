// Pares (fundo, texto) com contraste garantido - o texto usa o tom mais
// escuro da mesma familia de cor, nunca preto/cinza genérico.
const PARES_AVATAR: Array<{ bg: string; texto: string }> = [
  { bg: 'var(--color-avatar-1)', texto: '#412402' },
  { bg: 'var(--color-avatar-2)', texto: '#4a1b0c' },
  { bg: 'var(--color-avatar-3)', texto: '#26215c' },
  { bg: 'var(--color-avatar-4)', texto: '#042c53' },
  { bg: 'var(--color-avatar-5)', texto: '#04342c' },
  { bg: 'var(--color-avatar-6)', texto: '#4b1528' },
]

/** Deriva sempre o mesmo par de cores a partir do nome, para o avatar
 * de um mesmo cliente ficar visualmente consistente entre telas. */
export function corDoAvatar(nome: string): { bg: string; texto: string } {
  let hash = 0
  for (let i = 0; i < nome.length; i++) {
    hash = (hash * 31 + nome.charCodeAt(i)) % PARES_AVATAR.length
  }
  return PARES_AVATAR[Math.abs(hash)]
}

/** Ex.: "Bruno Almeida" -> "BA", "Juliana" -> "J" */
export function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/)
  if (partes.length === 1) {
    return partes[0].slice(0, 2).toUpperCase()
  }
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
}
