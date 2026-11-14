export function Toast({ message }) {
  return <div className={`toast ${message ? 'visible' : ''}`} role="status">{message}</div>
}
