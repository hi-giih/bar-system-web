const PRIMEIRO_DIACRITICO = 0x0300
const ULTIMO_DIACRITICO = 0x036f

function ehDiacritico(codigo: number): boolean {
  return codigo >= PRIMEIRO_DIACRITICO && codigo <= ULTIMO_DIACRITICO
}

/** Remove acentos decompondo o texto em NFD (letra + marca de acento
 * separadas) e descartando as marcas, letra a letra. Evita depender de
 * caracteres acentuados ou ranges unicode escritos direto no arquivo fonte. */
function normalizar(texto: string): string {
  const decomposto = texto.normalize('NFD')
  let resultado = ''
  for (let i = 0; i < decomposto.length; i++) {
    if (!ehDiacritico(decomposto.charCodeAt(i))) {
      resultado += decomposto[i]
    }
  }
  return resultado.toLowerCase()
}

/** Compara ignorando acentos e maiusculas/minusculas, para a busca funcionar
 * digitando "jose" e encontrar o nome acentuado correspondente. */
export function correspondeABusca(texto: string, busca: string): boolean {
  if (!busca.trim()) return true
  return normalizar(texto).includes(normalizar(busca))
}
