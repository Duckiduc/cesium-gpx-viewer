import { FormEvent, JSX, useState } from 'react'
import './Welcome.css'

interface WelcomeProps {
  onSubmit: (token: string) => void
}

export function Welcome({ onSubmit }: WelcomeProps): JSX.Element {
  const [token, setToken] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    if (token.trim()) onSubmit(token.trim())
  }

  return (
    <div className="welcome">
      <form className="welcome__card panel" onSubmit={handleSubmit}>
        <h1 className="welcome__title">Cesium GPX Viewer</h1>
        <p className="welcome__text">
          Enter a Cesium ion access token to load the globe and terrain. You can create one for free
          at{' '}
          <a href="https://ion.cesium.com/tokens" target="_blank" rel="noreferrer">
            ion.cesium.com/tokens
          </a>
          .
        </p>
        <label className="field">
          <span className="field__label">Cesium ion access token</span>
          <input
            className="input"
            type="password"
            value={token}
            onChange={(event): void => setToken(event.target.value)}
            placeholder="eyJhbGciOi…"
            autoFocus
          />
        </label>
        <p className="welcome__hint">
          The token is stored on this computer and can be changed later in Preferences.
        </p>
        <button className="button button--primary" type="submit" disabled={!token.trim()}>
          Open the globe
        </button>
      </form>
    </div>
  )
}
