import React, { useState } from 'react'
import './GpxForm.css'

interface GpxFormProps {
  onFileUpload: (files: File[]) => void
}

export function GpxForm({ onFileUpload }: GpxFormProps): JSX.Element {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newFiles = Array.from(event.target.files || [])
    setSelectedFiles([...selectedFiles, ...newFiles])
  }

  const handleDelete = (index: number): void => {
    const newFiles = [...selectedFiles]
    newFiles.splice(index, 1)
    setSelectedFiles(newFiles)
  }

  const handleUpload = (): void => {
    onFileUpload(selectedFiles)
  }

  return (
    <div className="gpx-form">
      <input type="file" accept=".gpx" multiple onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload GPX</button>
      <div>
        {selectedFiles.map((file, index) => (
          <div key={index}>
            <span>{file.name}</span>
            <button onClick={(): void => handleDelete(index)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}
