import './GpxForm.css'

interface GpxFormProps {
  onFileUpload: (file: File) => void
}

export function GpxForm({ onFileUpload }: GpxFormProps): JSX.Element {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0]
    if (file) {
      onFileUpload(file)
    }
  }

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const file = event.target[0].files?.[0]
    if (file) {
      onFileUpload(file)
    }
  }

  return (
    <form className="gpx-form" onSubmit={handleFormSubmit}>
      <input type="file" accept=".gpx" onChange={handleFileChange} />
      <button type="submit">Upload GPX</button>
    </form>
  )
}
