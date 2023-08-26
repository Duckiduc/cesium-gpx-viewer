import React, { useState } from 'react'
import './GpxForm.css'
import { Color } from 'cesium'

interface GpxFormProps {
  onFileUpload: (files: { file: File; color: string }[]) => void
}

export function GpxForm({ onFileUpload }: GpxFormProps): JSX.Element {
  const [selectedFiles, setSelectedFiles] = useState<{ file: File; color: string }[]>([])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newFiles = Array.from(event.target.files || [])
    const newTracks = newFiles.map((file) => ({ file, color: Color.YELLOW.toCssColorString() }))
    setSelectedFiles([...selectedFiles, ...newTracks])
  }

  const handleColorChange = (index: number, color: string): void => {
    const updatedTracks = [...selectedFiles]
    updatedTracks[index].color = color
    setSelectedFiles(updatedTracks)
  }

  const handleDelete = (index: number): void => {
    const updatedTracks = selectedFiles.filter((_, i) => i !== index)
    setSelectedFiles(updatedTracks)
  }

  const handleUpload = (): void => {
    onFileUpload(selectedFiles)
  }

  return (
    <div className="gpx-form">
      <input type="file" accept=".gpx" multiple onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload GPX</button>
      {selectedFiles.map((track, index) => (
        <div key={index}>
          <span>{track.file.name}</span>
          <input
            type="color"
            value={track.color}
            onChange={(e): void => handleColorChange(index, e.target.value)}
          />
          <button onClick={(): void => handleDelete(index)}>Delete</button>
        </div>
      ))}
    </div>
  )
}
