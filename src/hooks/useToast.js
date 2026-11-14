import { useCallback, useEffect, useRef, useState } from 'react'

export function useToast(duration = 2600) {
  const [message, setMessage] = useState('')
  const timeoutRef = useRef()

  const showToast = useCallback((nextMessage) => {
    setMessage(nextMessage)
    window.clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(() => setMessage(''), duration)
  }, [duration])

  useEffect(() => () => window.clearTimeout(timeoutRef.current), [])

  return { message, showToast }
}
