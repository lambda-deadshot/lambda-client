let settings
settings = window.electron.getSettings()
let rpcEnabled = settings.rpc || false
let statsEnabled = settings.rpc || false
let fps = settings.statsFps || true
let ping = settings.statsPing || true
let cpu = settings.statsCpu || true
let ram = settings.statsRam || true
let uptime = settings.statsUptime || true

function fireToast(success, message) {
  const toastContainer = document.getElementById('status-toast')
  if (!toastContainer) return
  const alert = document.createElement('div')
  alert.className = `px-2 py-1 alert  ${success ? 'alert-success' : 'alert-error'}`
  alert.innerHTML = `<span>${message}</span>`

  toastContainer.appendChild(alert)
  setTimeout(() => alert.remove(), 2000)
}

document.getElementById('rpc-toggle').addEventListener('change', () => {
  window.electron.sendSettingChange(
    `rpc:${!settings.rpc}:${document.getElementById('rpc-text').value}`
  )
  settings.rpc = !settings.rpc
})

document.getElementById('brainrot-toggle').addEventListener('change', () => {
  window.electron.sendSettingChange(`brainrot:${!settings.brainrot}`)
  settings.brainrot = !settings.brainrot
})

window.electron.on('skin-upload', (_, { success, message }) => {
  fireToast(success, message)
})

document.getElementById('ar-upload').addEventListener('change', (event) => {
  const fileInput = event.target
  const file = fileInput.files[0]

  if (file && file.type === 'image/webp') {
    const reader = new FileReader()

    reader.onload = () => {
      window.electron.sendSkinUpload('ar', reader.result.split(',')[1])
    }

    reader.onerror = (error) => {
      console.error('Error reading file:', error)
    }

    reader.readAsDataURL(file)
  } else {
    console.error('Please upload a valid WebP image.')
  }
})

document
  .getElementById('ar-player-upload')
  .addEventListener('change', (event) => {
    const fileInput = event.target
    const file = fileInput.files[0]

    if (file && file.type === 'image/webp') {
      const reader = new FileReader()

      reader.onload = () => {
        window.electron.sendSkinUpload('ar-player', reader.result.split(',')[1])
      }

      reader.onerror = (error) => {
        console.error('Error reading file:', error)
      }

      reader.readAsDataURL(file)
    } else {
      console.error('Please upload a valid WebP image.')
    }
  })

document.getElementById('awp-upload').addEventListener('change', (event) => {
  const fileInput = event.target
  const file = fileInput.files[0]

  if (file && file.type === 'image/webp') {
    const reader = new FileReader()

    reader.onload = () => {
      window.electron.sendSkinUpload('awp', reader.result.split(',')[1])
    }

    reader.onerror = (error) => {
      console.error('Error reading file:', error)
    }

    reader.readAsDataURL(file)
  } else {
    console.error('Please upload a valid WebP image.')
  }
})

document
  .getElementById('awp-player-upload')
  .addEventListener('change', (event) => {
    const fileInput = event.target
    const file = fileInput.files[0]

    if (file && file.type === 'image/webp') {
      const reader = new FileReader()

      reader.onload = () => {
        window.electron.sendSkinUpload(
          'awp-player',
          reader.result.split(',')[1]
        )
      }

      reader.onerror = (error) => {
        console.error('Error reading file:', error)
      }

      reader.readAsDataURL(file)
    } else {
      console.error('Please upload a valid WebP image.')
    }
  })

document.getElementById('smg-upload').addEventListener('change', (event) => {
  const fileInput = event.target
  const file = fileInput.files[0]

  if (file && file.type === 'image/webp') {
    const reader = new FileReader()

    reader.onload = () => {
      window.electron.sendSkinUpload('smg', reader.result.split(',')[1])
    }

    reader.onerror = (error) => {
      console.error('Error reading file:', error)
    }

    reader.readAsDataURL(file)
  } else {
    console.error('Please upload a valid WebP image.')
  }
})

document
  .getElementById('smg-player-upload')
  .addEventListener('change', (event) => {
    const fileInput = event.target
    const file = fileInput.files[0]

    if (file && file.type === 'image/webp') {
      const reader = new FileReader()

      reader.onload = () => {
        window.electron.sendSkinUpload(
          'smg-player',
          reader.result.split(',')[1]
        )
      }

      reader.onerror = (error) => {
        console.error('Error reading file:', error)
      }

      reader.readAsDataURL(file)
    } else {
      console.error('Please upload a valid WebP image.')
    }
  })

document
  .getElementById('shotgun-upload')
  .addEventListener('change', (event) => {
    const fileInput = event.target
    const file = fileInput.files[0]

    if (file && file.type === 'image/webp') {
      const reader = new FileReader()

      reader.onload = () => {
        window.electron.sendSkinUpload('shotgun', reader.result.split(',')[1])
      }

      reader.onerror = (error) => {
        console.error('Error reading file:', error)
      }

      reader.readAsDataURL(file)
    } else {
      console.error('Please upload a valid WebP image.')
    }
  })

document
  .getElementById('shotgun-player-upload')
  .addEventListener('change', (event) => {
    const fileInput = event.target
    const file = fileInput.files[0]

    if (file && file.type === 'image/webp') {
      const reader = new FileReader()

      reader.onload = () => {
        window.electron.sendSkinUpload(
          'shotgun-player',
          reader.result.split(',')[1]
        )
      }

      reader.onerror = (error) => {
        console.error('Error reading file:', error)
      }

      reader.readAsDataURL(file)
    } else {
      console.error('Please upload a valid WebP image.')
    }
  })

document
  .getElementById('mainmenu-upload')
  .addEventListener('change', (event) => {
    const fileInput = event.target
    const file = fileInput.files[0]

    if (file && file.type === 'image/webp') {
      const reader = new FileReader()

      reader.onload = () => {
        window.electron.sendSkinUpload('mainmenu', reader.result.split(',')[1])
      }

      reader.onerror = (error) => {
        console.error('Error reading file:', error)
      }

      reader.readAsDataURL(file)
    } else {
      console.error('Please upload a valid WebP image.')
    }
  })

//custom filters
const previewUrls = [
  './filterpreviews/factory.png',
  './filterpreviews/forest.png',
  './filterpreviews/neotokyo.png',
  './filterpreviews/refinery.png',
  './filterpreviews/snowfall.png',
  './filterpreviews/vineyard.png',
]

let currentIndex = 0
const previewImage = document.getElementById('filterPreviewImage')
const prevBtn = document.getElementById('prevBtn')
const nextBtn = document.getElementById('nextBtn')

function updatePreviewImage() {
  previewImage.src = previewUrls[currentIndex]
}

prevBtn.addEventListener('click', (e) => {
  e.preventDefault()
  currentIndex = (currentIndex - 1 + previewUrls.length) % previewUrls.length
  updatePreviewImage()
})

nextBtn.addEventListener('click', (e) => {
  e.preventDefault()
  currentIndex = (currentIndex + 1) % previewUrls.length
  updatePreviewImage()
})

const redSlider = document.getElementById('redSlider')
const greenSlider = document.getElementById('greenSlider')
const blueSlider = document.getElementById('blueSlider')
const alphaSlider = document.getElementById('alphaSlider')
const feColorMatrix = document.querySelector('#customFilter feColorMatrix')
const influenceSlider = document.getElementById('influenceSlider')
let influence = parseFloat(influenceSlider.value) || 0.1 // Default influence

influenceSlider.addEventListener('input', () => {
  influence = parseFloat(influenceSlider.value) || 0
  updateFilter()
})

function updateFilter() {
  const red = parseFloat(redSlider.value) || 0
  const green = parseFloat(greenSlider.value) || 0
  const blue = parseFloat(blueSlider.value) || 0
  const alpha = parseFloat(alphaSlider.value) || 0

  const matrixValues = [
    red,
    green * influence,
    blue * influence,
    0,
    0, // Red row
    red * influence,
    green,
    blue * influence,
    0,
    0, // Green row
    red * influence,
    green * influence,
    blue,
    0,
    0, // Blue row
    red * influence,
    green * influence,
    blue * influence,
    alpha,
    0, // Alpha row
  ]

  feColorMatrix.setAttribute('values', matrixValues.join(' '))
}

;[redSlider, greenSlider, blueSlider, alphaSlider].forEach((slider) => {
  slider.addEventListener('input', updateFilter)
})

const form = document.getElementById('customFilterForm')
form.addEventListener('submit', (e) => {
  e.preventDefault()
  const red = parseFloat(redSlider.value) || 0
  const green = parseFloat(greenSlider.value) || 0
  const blue = parseFloat(blueSlider.value) || 0
  const alpha = parseFloat(alphaSlider.value) || 0
  const matrixObj = {
    row1: [red, 0, 0, 0, 0],
    row2: [0, green, 0, 0, 0],
    row3: [0, 0, blue, 0, 0],
    row4: [0, 0, 0, alpha, 0],
  }
  window.electron.sendCustomCBFilter(matrixObj)
})

updateFilter()

// stats

document.getElementById('stats-toggle').addEventListener('click', () => {
  window.electron.sendSettingChange(`stats:${!settings.stats}`)
  settings.stats = !settings.stats
})

document.addEventListener('DOMContentLoaded', () => {
  ;['fps', 'ping', 'ram', 'cpu', 'uptime'].forEach((option) => {
    console.log(`stats-${option}-toggle`)
    const checkbox = document.getElementById(`stats-${option}-toggle`)

    if (checkbox) {
      checkbox.addEventListener('input', () => {
        window.electron.sendSettingChange(`stats:${option}:${checkbox.checked}`)
      })
    } else {
      console.error(`Element with ID stats-${option}-toggle not found.`)
    }
  })
})

// flat lightmaps
document.getElementById('flatlightmapstoggle').addEventListener('input', () => {
  window.electron.sendSettingChange(
    `flatlightmaps:${document.getElementById('flatlightmapstoggle').checked}`
  )
})
