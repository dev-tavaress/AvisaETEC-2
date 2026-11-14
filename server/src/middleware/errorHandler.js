export function notFoundHandler(_request, response) {
  return response.status(404).json({ error: 'Rota não encontrada.' })
}

// Erros 4xx do Express (JSON malformado, corpo grande demais) devem voltar
// como 4xx; só falhas inesperadas viram 500.
// eslint-disable-next-line no-unused-vars
export function errorHandler(error, _request, response, _next) {
  const status = error.status ?? error.statusCode

  if (status >= 400 && status < 500) {
    const message = status === 413 ? 'Corpo da requisição grande demais.' : 'Requisição inválida.'
    return response.status(status).json({ error: message })
  }

  console.error(error)
  return response.status(500).json({ error: 'Erro interno do servidor.' })
}
