import { useState, ChangeEvent, FormEvent } from 'react'
import '../App.css'

interface ApiFormProps {
  onSubmit: (value: string) => void
}

export function ApiForm({ onSubmit }: ApiFormProps): JSX.Element {
  const [inputValue, setInputValue] = useState('')

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setInputValue(event.target.value)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    onSubmit(inputValue) // Call the parent component's callback function
  }

  return (
    <form onSubmit={handleSubmit} className="dialog-container">
      <input type="text" value={inputValue} onChange={handleChange} placeholder="Enter a value" />
      <button type="submit">Validate</button>
    </form>
  )
}
