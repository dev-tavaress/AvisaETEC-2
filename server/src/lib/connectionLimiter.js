// Limitador simples (janela deslizante, em memória) para conexões Socket.IO,
// que não passam pelos middlewares do Express.
export function createConnectionLimiter({ windowMs, limit }) {
  const attempts = new Map()

  const cleanup = setInterval(() => {
    const cutoff = Date.now() - windowMs
    for (const [key, timestamps] of attempts) {
      const recent = timestamps.filter((timestamp) => timestamp > cutoff)
      if (recent.length) attempts.set(key, recent)
      else attempts.delete(key)
    }
  }, windowMs)
  cleanup.unref() // não impede o processo de encerrar

  return function allow(key) {
    const now = Date.now()
    const recent = (attempts.get(key) ?? []).filter((timestamp) => timestamp > now - windowMs)
    const allowed = recent.length < limit
    if (allowed) recent.push(now)
    attempts.set(key, recent)
    return allowed
  }
}
