import { useState, useRef } from 'react'
import { FaDownload, FaTimes, FaCheckCircle, FaExclamationTriangle, FaSpinner } from 'react-icons/fa'

export function FileUpload({ onDataLoaded, onClose }) {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef(null)

  // Supported file formats
  const SUPPORTED_FORMATS = ['.json', '.csv', '.txt']
  const MAX_FILE_SIZE = 1000 * 1024 * 1024 // 1000MB (1GB) for large JSON chat histories

  // Validate file
  const validateFile = (file) => {
    if (!file) {
      return 'No file selected'
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return `File is too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`
    }

    // Check file extension
    const extension = '.' + file.name.split('.').pop().toLowerCase()
    if (!SUPPORTED_FORMATS.includes(extension)) {
      return `Unsupported file format. Supported formats: ${SUPPORTED_FORMATS.join(', ')}`
    }

    return null
  }

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  // Handle file selection
  const handleFileSelect = (selectedFile) => {
    setError(null)
    setSuccess(false)

    const validationError = validateFile(selectedFile)
    if (validationError) {
      setError(validationError)
      return
    }

    setFile(selectedFile)
  }

  // Handle file input change
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  // Process file
  const processFile = async () => {
    if (!file) return

    setUploading(true)
    setProgress(0)
    setError(null)

    try {
      const reader = new FileReader()

      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100
          setProgress(percentComplete)
        }
      }

      reader.onload = async (e) => {
        try {
          const content = e.target.result
          const extension = '.' + file.name.split('.').pop().toLowerCase()

          let data = null

          // Parse based on file type
          if (extension === '.json') {
            data = JSON.parse(content)
          } else if (extension === '.csv') {
            // Simple CSV parsing (you may want to use a library like papaparse)
            const lines = content.split('\n')
            const headers = lines[0].split(',')
            data = lines.slice(1).map(line => {
              const values = line.split(',')
              return headers.reduce((obj, header, index) => {
                obj[header.trim()] = values[index]?.trim()
                return obj
              }, {})
            })
          } else if (extension === '.txt') {
            // For text files, split by lines
            data = content.split('\n').filter(line => line.trim())
          }

          // Validate data structure (basic check)
          if (!data || (Array.isArray(data) && data.length === 0)) {
            throw new Error('File is empty or invalid')
          }

          setProgress(100)
          setSuccess(true)
          setUploading(false)

          // Callback with loaded data
          setTimeout(() => {
            onDataLoaded(data, file.name)
          }, 500)

        } catch (parseError) {
          throw new Error(`Failed to parse file: ${parseError.message}`)
        }
      }

      reader.onerror = () => {
        throw new Error('Failed to read file')
      }

      reader.readAsText(file)

    } catch (err) {
      setError(err.message)
      setUploading(false)
      setProgress(0)
    }
  }

  return (
    <div
      role="dialog"
      aria-labelledby="upload-title"
      aria-modal="true"
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'rgba(0, 0, 0, 0.95)',
        border: '2px solid #00ffff',
        borderRadius: '12px',
        padding: '32px',
        color: 'white',
        fontFamily: 'monospace',
        zIndex: 2000,
        maxWidth: '600px',
        width: '90%',
        boxShadow: '0 0 40px rgba(0, 255, 255, 0.3)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 id="upload-title" style={{ margin: 0, fontSize: '20px', color: '#00ffff' }}>
          <FaDownload style={{ marginRight: '8px' }} />
          Import Chat History
        </h2>
        <button
          onClick={onClose}
          aria-label="Close upload dialog"
          style={{
            background: 'none',
            border: 'none',
            color: '#00ffff',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '4px',
          }}
        >
          <FaTimes />
        </button>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Click to upload file or drag and drop"
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            fileInputRef.current?.click()
          }
        }}
        style={{
          border: `2px dashed ${dragActive ? '#00ffff' : 'rgba(0, 255, 255, 0.3)'}`,
          borderRadius: '8px',
          padding: '40px',
          textAlign: 'center',
          cursor: 'pointer',
          background: dragActive ? 'rgba(0, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.02)',
          transition: 'all 0.3s ease',
          marginBottom: '16px',
        }}
      >
        <FaDownload style={{ fontSize: '48px', color: '#00ffff', marginBottom: '16px', opacity: 0.6 }} />
        <p style={{ fontSize: '16px', marginBottom: '8px', fontWeight: 'bold' }}>
          {file ? file.name : 'Drag & drop your file here'}
        </p>
        <p style={{ fontSize: '12px', opacity: 0.6, marginBottom: '8px' }}>
          or click to browse
        </p>
        <p style={{ fontSize: '11px', opacity: 0.4 }}>
          Supported formats: {SUPPORTED_FORMATS.join(', ')} • Max size: 1GB
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept={SUPPORTED_FORMATS.join(',')}
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
          aria-label="File input"
        />
      </div>

      {/* Progress Bar */}
      {uploading && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
            <span>Processing...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '4px',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #00ffff, #00cccc)',
              transition: 'width 0.3s ease',
            }} />
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div style={{
          background: 'rgba(255, 100, 100, 0.1)',
          border: '1px solid rgba(255, 100, 100, 0.3)',
          borderRadius: '6px',
          padding: '12px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px',
        }}>
          <FaExclamationTriangle style={{ color: '#ff6666' }} />
          <span>{error}</span>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div style={{
          background: 'rgba(100, 255, 100, 0.1)',
          border: '1px solid rgba(100, 255, 100, 0.3)',
          borderRadius: '6px',
          padding: '12px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px',
        }}>
          <FaCheckCircle style={{ color: '#66ff66' }} />
          <span>File uploaded successfully!</span>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <button
          onClick={onClose}
          disabled={uploading}
          style={{
            padding: '10px 20px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '6px',
            color: 'white',
            cursor: uploading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontFamily: 'monospace',
            opacity: uploading ? 0.5 : 1,
          }}
        >
          Cancel
        </button>
        <button
          onClick={processFile}
          disabled={!file || uploading || success}
          style={{
            padding: '10px 20px',
            background: file && !uploading && !success ? '#00ffff' : 'rgba(0, 255, 255, 0.3)',
            border: 'none',
            borderRadius: '6px',
            color: '#000',
            cursor: file && !uploading && !success ? 'pointer' : 'not-allowed',
            fontSize: '14px',
            fontWeight: 'bold',
            fontFamily: 'monospace',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {uploading ? (
            <>
              <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
              Processing...
            </>
          ) : success ? (
            <>
              <FaCheckCircle />
              Done
            </>
          ) : (
            <>
              <FaDownload />
              Import
            </>
          )}
        </button>
      </div>

      {/* Spinner animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}