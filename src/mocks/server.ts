import MockAdapter from 'axios-mock-adapter'
import { api } from '../services/api'
import type { Cliente } from '../types/cliente'
import type { Comanda } from '../types/comanda'
import type { Pagamento } from '../types/pagamento'
import type { Produto } from '../types/produto'
import { clientesMock, comandasMock, pagamentosMock, produtosMock, proximoId } from './data'

// PNG transparente de 1x1, so para o <img> do QR code ter algo valido para exibir.
// Igual ao backend real, o QR code e um data URI - nunca vira arquivo em disco.
const QR_CODE_FAKE_DATA_URI =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='

function arredondar(valor: number): number {
  return Math.round(valor * 100) / 100
}

function recalcularTotal(comanda: Comanda): void {
  const total = comanda.produtos.reduce((soma, item) => soma + item.subtotal, 0)
  comanda.total = total
  comanda.valor_original = total
}

function idDaUrl(url: string | undefined, posicaoDoFim = 1): number {
  const partes = url?.split('/').filter(Boolean) ?? []
  return Number(partes[partes.length - posicaoDoFim])
}

function totalPago(comandaId: number): number {
  return pagamentosMock
    .filter((p) => p.comanda === comandaId && p.paid)
    .reduce((soma, p) => soma + p.value, 0)
}

function calcularSaldoRestante(comanda: Comanda): number {
  return arredondar(comanda.total - totalPago(comanda.id))
}

/** Espelha o comanda_service.py real: enquanto aberta, a comanda que ja
 * recebeu algum pagamento confirmado (colapsada) exibe uma linha unica de
 * "saldo restante". Uma vez fechada, mostra os produtos reais (somente
 * leitura, edicao ja e bloqueada por comanda.fechada) - nao ha mais saldo a
 * esconder. Os produtos originais nunca sao apagados. */
function serializarComanda(comanda: Comanda): Comanda {
  if (!comanda.colapsada || comanda.fechada) {
    return comanda
  }
  const saldoRestante = calcularSaldoRestante(comanda)
  return {
    ...comanda,
    produtos: [
      { produto_id: null, nome: 'Saldo restante', preco: saldoRestante, quantidade: 1, subtotal: saldoRestante },
    ],
    total: saldoRestante,
  }
}

/** Simula a API real em memória, para desenvolver o frontend sem
 * depender do backend estar de pé. Os formatos de request/response
 * espelham exatamente os das rotas reais - nenhuma tela precisa saber
 * que está em modo mock. */
export function iniciarMocks(): void {
  const mock = new MockAdapter(api, { delayResponse: 300 })

  mock.onPost('/auth/login').reply(200, { access_token: 'token-mock-desenvolvimento' })

  mock.onGet('/clientes/').reply(200, { clientes: clientesMock })

  mock.onPost('/clientes/').reply((config) => {
    const dado = JSON.parse(config.data)
    const novoCliente: Cliente = {
      id: proximoId('cliente'),
      nome: dado.nome,
      telefone: dado.telefone ?? null,
    }
    clientesMock.push(novoCliente)
    return [200, { message: 'Cliente cadastrado com sucesso', cliente: novoCliente, id: novoCliente.id }]
  })

  mock.onPut(/\/clientes\/\d+$/).reply((config) => {
    const id = Number(config.url?.split('/').pop())
    const dado = JSON.parse(config.data)
    const cliente = clientesMock.find((c) => c.id === id)
    if (!cliente) {
      return [404, { message: 'Cliente não encontrado' }]
    }
    if ('nome' in dado) cliente.nome = dado.nome
    if ('telefone' in dado) cliente.telefone = dado.telefone
    return [200, { message: 'Cliente atualizado com sucesso', cliente }]
  })

  mock.onDelete(/\/clientes\/\d+$/).reply((config) => {
    const id = Number(config.url?.split('/').pop())
    const indice = clientesMock.findIndex((c) => c.id === id)
    if (indice === -1) {
      return [404, { message: 'Cliente não encontrado' }]
    }
    clientesMock.splice(indice, 1)
    return [200, { message: 'Cliente deletado com sucesso' }]
  })

  mock.onGet('/produtos/').reply(200, { produtos: produtosMock })

  mock.onPost('/produtos/').reply((config) => {
    const dado = JSON.parse(config.data)
    const novoProduto: Produto = {
      id: proximoId('produto'),
      nome: dado.nome,
      preco: dado.preco,
      icone: dado.icone ?? 'bebida',
    }
    produtosMock.push(novoProduto)
    return [200, { message: 'Produto cadastrado com sucesso', produto: novoProduto, id: novoProduto.id }]
  })

  mock.onPut(/^\/produtos\/\d+$/).reply((config) => {
    const id = Number(config.url?.split('/').pop())
    const dado = JSON.parse(config.data)
    const produto = produtosMock.find((p) => p.id === id)
    if (!produto) {
      return [404, { message: 'Produto não encontrado' }]
    }
    if ('nome' in dado) produto.nome = dado.nome
    if ('preco' in dado) produto.preco = dado.preco
    if ('icone' in dado) produto.icone = dado.icone
    return [200, { message: 'Produto atualizado com sucesso', produto }]
  })

  mock.onDelete(/^\/produtos\/\d+$/).reply((config) => {
    const id = Number(config.url?.split('/').pop())
    const indice = produtosMock.findIndex((p) => p.id === id)
    if (indice === -1) {
      return [404, { message: 'Produto não encontrado' }]
    }
    produtosMock.splice(indice, 1)
    return [200, { message: 'Produto deletado com sucesso' }]
  })

  mock.onGet('/comanda/').reply(200, { comandas: comandasMock.map(serializarComanda) })

  mock.onPost('/comanda/').reply((config) => {
    const dado = JSON.parse(config.data)
    const cliente = clientesMock.find((c) => c.id === dado.cliente_id)
    if (!cliente) {
      return [404, { message: 'Cliente não encontrado' }]
    }
    const novaComanda: Comanda = {
      id: proximoId('comanda'),
      data: dado.data,
      cliente_id: cliente.id,
      cliente_nome: cliente.nome,
      fechada: false,
      colapsada: false,
      produtos: [],
      total: 0,
      valor_original: 0,
      forma_pagamento: null,
    }
    comandasMock.push(novaComanda)
    return [200, novaComanda]
  })

  mock.onGet(/\/comanda\/\d+$/).reply((config) => {
    const id = idDaUrl(config.url)
    const comanda = comandasMock.find((c) => c.id === id)
    if (!comanda) {
      return [404, { message: 'Comanda não encontrada' }]
    }
    return [200, serializarComanda(comanda)]
  })

  mock.onPost(/\/comanda\/\d+\/produtos$/).reply((config) => {
    const comandaId = idDaUrl(config.url, 2)
    const comanda = comandasMock.find((c) => c.id === comandaId)
    if (!comanda) {
      return [404, { message: 'Comanda não encontrada' }]
    }
    const dado = JSON.parse(config.data)
    const produto = produtosMock.find((p) => p.id === dado.produto_id)
    if (!produto) {
      return [404, { message: 'Produto não encontrado' }]
    }
    const existente = comanda.produtos.find((item) => item.produto_id === produto.id)
    if (existente) {
      existente.quantidade += dado.quantidade
      existente.subtotal = existente.preco * existente.quantidade
    } else {
      comanda.produtos.push({
        produto_id: produto.id,
        nome: produto.nome,
        preco: produto.preco,
        quantidade: dado.quantidade,
        subtotal: produto.preco * dado.quantidade,
      })
    }
    recalcularTotal(comanda)
    return [200, { message: 'Produto adicionado com sucesso', comanda: serializarComanda(comanda) }]
  })

  mock.onPatch(/\/comanda\/\d+\/produtos\/\d+$/).reply((config) => {
    const comandaId = idDaUrl(config.url, 3)
    const produtoId = idDaUrl(config.url, 1)
    const comanda = comandasMock.find((c) => c.id === comandaId)
    if (!comanda) {
      return [404, { message: 'Comanda não encontrada' }]
    }
    const item = comanda.produtos.find((p) => p.produto_id === produtoId)
    if (!item) {
      return [404, { message: 'Produto não encontrado na comanda' }]
    }
    const { quantidade } = JSON.parse(config.data)
    item.quantidade += quantidade
    item.subtotal = item.preco * item.quantidade
    recalcularTotal(comanda)
    return [200, { message: 'Quantidade atualizada com sucesso', comanda: serializarComanda(comanda) }]
  })

  mock.onDelete(/\/comanda\/\d+\/produtos\/\d+$/).reply((config) => {
    const comandaId = idDaUrl(config.url, 3)
    const produtoId = idDaUrl(config.url, 1)
    const comanda = comandasMock.find((c) => c.id === comandaId)
    if (!comanda) {
      return [404, { message: 'Comanda não encontrada' }]
    }
    const indice = comanda.produtos.findIndex((p) => p.produto_id === produtoId)
    if (indice === -1) {
      return [404, { message: 'Produto não encontrado na comanda' }]
    }
    const { quantidade } = JSON.parse(config.data)
    const item = comanda.produtos[indice]
    if (item.quantidade > quantidade) {
      item.quantidade -= quantidade
      item.subtotal = item.preco * item.quantidade
    } else {
      comanda.produtos.splice(indice, 1)
    }
    recalcularTotal(comanda)
    return [200, { message: 'Produto removido da comanda com sucesso', comanda: serializarComanda(comanda) }]
  })

  mock.onPost(/\/comanda\/\d+\/fechar$/).reply((config) => {
    const comandaId = idDaUrl(config.url, 2)
    const comanda = comandasMock.find((c) => c.id === comandaId)
    if (!comanda) {
      return [404, { message: 'Comanda não encontrada' }]
    }
    if (comanda.fechada) {
      return [400, { message: 'Comanda já está fechada.' }]
    }
    const saldoRestante = calcularSaldoRestante(comanda)
    if (saldoRestante > 0) {
      return [
        400,
        { message: `Comanda possui saldo pendente de ${saldoRestante.toFixed(2)} e não pode ser fechada.` },
      ]
    }
    comanda.fechada = true
    return [200, { message: 'Comanda fechada com sucesso.', comanda: serializarComanda(comanda) }]
  })

  mock.onDelete(/\/comanda\/\d+$/).reply((config) => {
    const id = idDaUrl(config.url)
    const indice = comandasMock.findIndex((c) => c.id === id)
    if (indice === -1) {
      return [404, { message: 'Comanda não encontrada' }]
    }
    comandasMock.splice(indice, 1)
    return [200, { message: 'Comanda deletada com sucesso' }]
  })

  // Fluxo de pagamento (espelha /pagamento/* do backend real): Pix tem duas
  // etapas (gera QR code e depois confirma); cartao/dinheiro sao pagos fora
  // do app, entao ja nascem confirmados, sem QR code.
  mock.onPost('/pagamento/').reply((config) => {
    const dado = JSON.parse(config.data)
    const comanda = comandasMock.find((c) => c.id === dado.comanda_id)
    if (!comanda) {
      return [404, { message: 'Comanda não encontrada' }]
    }
    if (typeof dado.valor !== 'number' || dado.valor <= 0) {
      return [400, { message: 'Informe um valor válido.' }]
    }
    if (!['pix', 'cartao', 'dinheiro'].includes(dado.forma_pagamento)) {
      return [400, { message: 'Forma de pagamento inválida.' }]
    }

    const pagamentoId = proximoId('pagamento')
    const ehPix = dado.forma_pagamento === 'pix'
    const novoPagamento: Pagamento = {
      id: pagamentoId,
      comanda: comanda.id,
      value: dado.valor,
      paid: !ehPix,
      forma_pagamento: dado.forma_pagamento,
      bank_payment_id: ehPix ? `mock-${pagamentoId}` : null,
      qr_code: ehPix ? QR_CODE_FAKE_DATA_URI : null,
      expiration_date: ehPix ? new Date(Date.now() + 30 * 60 * 1000).toISOString() : null,
    }
    pagamentosMock.push(novoPagamento)

    if (ehPix) {
      return [200, { message: 'Pagamento criado com sucesso', pagamento: novoPagamento }]
    }

    comanda.colapsada = true
    comanda.forma_pagamento = dado.forma_pagamento
    return [
      200,
      {
        message: 'Pagamento registrado com sucesso',
        pagamento: novoPagamento,
        total_comanda: comanda.total,
        total_pago: totalPago(comanda.id),
        saldo_restante: calcularSaldoRestante(comanda),
      },
    ]
  })

  mock.onPost('/pagamento/confirmacao').reply((config) => {
    const dado = JSON.parse(config.data)
    const pagamento = pagamentosMock.find(
      (p) => p.comanda === dado.comanda_id && p.value === dado.valor && !p.paid,
    )
    if (!pagamento) {
      return [404, { message: 'Não existe nenhum pagamento para essa comanda' }]
    }
    const comanda = comandasMock.find((c) => c.id === dado.comanda_id)
    if (!comanda) {
      return [404, { message: 'Comanda não encontrada' }]
    }

    pagamento.paid = true
    comanda.colapsada = true
    comanda.forma_pagamento = pagamento.forma_pagamento

    return [
      200,
      {
        message: 'Pagamento confirmado com sucesso',
        total_comanda: comanda.total,
        total_pago: totalPago(comanda.id),
        saldo_restante: calcularSaldoRestante(comanda),
      },
    ]
  })
}
