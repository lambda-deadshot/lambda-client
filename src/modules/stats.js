function toggleStats(state) {
  if (document.getElementById('stats')) {
    if (state.toString() == 'true') {
      document.getElementById('stats').style.display = 'block'
    } else {
      document.getElementById('stats').style.display = 'none'
    }
  }
}
function statsHTML(options) {
  const statsContainer = document.getElementById('stats')
  if (!statsContainer) return

  console.log(options)

  let html = `
        <table class="stats-table">
            <tr class="stats-row" id="stats-fps-row" style="display: ${options.fps ? 'table-row' : 'none'};">
                <td class="stats-label">FPS:</td>
                <td id="fps" class="stats-value">--</td>
            </tr>
            <tr class="stats-row" id="stats-ping-row" style="display: ${options.ping ? 'table-row' : 'none'};">
                <td class="stats-label">Ping:</td>
                <td id="ping" class="stats-value">--</td>
            </tr>
            <tr class="stats-row" id="stats-cpu-row" style="display: ${options.cpu ? 'table-row' : 'none'};">
                <td class="stats-label">CPU Usage:</td>
                <td id="cpu-usage" class="stats-value">--</td>
            </tr>
            <tr class="stats-row" id="stats-ram-row" style="display: ${options.ram ? 'table-row' : 'none'};">
                <td class="stats-label">RAM Usage:</td>
                <td id="ram-usage" class="stats-value">--</td>
            </tr>
            <tr class="stats-row" id="stats-uptime-row" style="display: ${options.uptime ? 'table-row' : 'none'};">
                <td class="stats-label">Uptime:</td>
                <td id="uptime" class="stats-value">--</td>
            </tr>
        </table>
    `

  statsContainer.innerHTML = html
}

function fps() {
  let fps = 0
  let frameCount = 0
  let startTime = 0

  function updateFps() {
    if (document.getElementById('fps')) {
      frameCount++
      const elapsedTime = (performance.now() - startTime) / 1000

      if (elapsedTime > 1) {
        fps = frameCount / elapsedTime
        startTime = performance.now()
        frameCount = 0
      }

      document.getElementById('fps').innerHTML = Math.round(fps)
    }
    requestAnimationFrame(updateFps)
  }
  updateFps()
}

function ping() {
  function updatePing() {
    if (document.getElementById('ping')) {
      let start = performance.now()
      requestAnimationFrame(() => {
        let pingValue = performance.now() - start
        document.getElementById('ping').innerHTML = Math.round(pingValue)
      })
    }
    setTimeout(updatePing, 1000)
  }

  updatePing()
}

module.exports = {
  toggleStats: toggleStats,
  statsHTML: statsHTML,
  fps: fps,
  ping: ping,
}
