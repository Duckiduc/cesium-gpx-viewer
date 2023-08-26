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
      <div className='upload-container'>
        <label htmlFor="upload">Choose files</label>
        <input id='upload' type="file" accept=".gpx" multiple hidden onChange={handleFileChange} />
        <button className='upload-btn' onClick={handleUpload}>
        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path fill='#fff' d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>
        </button>
      </div>
      <div className='gpx-container'>
      {selectedFiles.map((track, index) => (
        <div key={index} className='file'>
          <span>{track.file.name}</span>
          <div className='right'>
            <div className='color-container'>
              <input
                type="color"
                value={track.color}
                onChange={(e): void => handleColorChange(index, e.target.value)}
              />
            </div>
            <button onClick={(): void => handleDelete(index)} className='delete-btn'>
            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path fill='#fff' d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"/></svg>
            </button>
          
          </div>
        </div>
      ))}
      </div>
    </div>
  )
}
