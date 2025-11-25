let loaderPromise = null

export function loadHtml2Canvas() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('html2canvas can only be loaded in a browser environment'))
  }

  if (window.html2canvas) {
    return Promise.resolve(window.html2canvas)
  }

  if (!loaderPromise) {
    loaderPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js'
      script.async = true
      script.crossOrigin = 'anonymous'
      script.onload = () => {
        if (window.html2canvas) {
          resolve(window.html2canvas)
        } else {
          reject(new Error('html2canvas failed to initialize'))
        }
      }
      script.onerror = () => reject(new Error('Failed to load html2canvas script'))
      document.head.appendChild(script)
    })
  }

  return loaderPromise
}

export default loadHtml2Canvas
