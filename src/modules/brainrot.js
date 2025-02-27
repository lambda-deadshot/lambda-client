function toggleBrainrot(show) {
  const videoUrls = [
    'https://www.youtube.com/embed/3xWJ0FSgJVE?autoplay=1',
    'https://www.youtube.com/embed/RnpO6tM6A8k?autoplay=1',
    'https://www.youtube.com/embed/bXVcXbhhxcI?autoplay=1',
    'https://www.youtube.com/embed/qmwgpPfDieI?autoplay=1',
  ]

  const randomVideoUrl = videoUrls[Math.floor(Math.random() * videoUrls.length)]

  const existingOverlay = document.getElementById('youtube-overlay')

  if (show) {
    if (!existingOverlay) {
      const overlay = document.createElement('div')
      overlay.id = 'youtube-overlay'
      overlay.style.position = 'fixed'
      overlay.style.top = '0'
      overlay.style.left = '0'
      overlay.style.width = '100%'
      overlay.style.height = '100%'
      overlay.style.zIndex = '9999'
      overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.75)'
      overlay.style.opacity = '0.25'
      overlay.style.pointerEvents = 'none'
      const iframe = document.createElement('iframe')
      iframe.src = randomVideoUrl
      iframe.frameBorder = '0'
      iframe.allow = 'autoplay; encrypted-media'
      iframe.style.position = 'absolute'
      iframe.style.top = '50%'
      iframe.style.left = '50%'
      iframe.style.transform = 'translate(-50%, -50%)'
      iframe.style.width = '100%' // Adjust width as needed
      iframe.style.height = '100%' // Adjust height as needed
      iframe.style.opacity = '1' // Set the opacity to 100% for the iframe

      // Append the iframe to the overlay div
      overlay.appendChild(iframe)

      // Append the overlay div to the body
      document.body.appendChild(overlay)
    }
  } else {
    // Remove the overlay if it exists
    if (existingOverlay) {
      existingOverlay.remove()
    }
  }
}
module.exports = {
  toggleBrainrot: toggleBrainrot,
}
