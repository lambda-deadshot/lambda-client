const electron = require('electron')
const ipcRenderer = electron.ipcRenderer

const statsBgColor = '#010203'
const statsTextColor = '#ffffff'
window.addEventListener('DOMContentLoaded', () => {
  document.head.insertAdjacentHTML(
    'beforeend',
    `
        <style>
            .stats-container {
                position: absolute;
                padding: 1rem; /* 16px */
                gap: 0.5rem; /* 8px */
                z-index: 9999;
                background-color: ${statsBgColor};
                color: ${statsTextColor};
                font-family: 'Encode Sans SemiCondensed', sans-serif;
            }
            .empty {
              display:none
            }
            .stats-table {
                border-collapse: collapse;
                width: fit-content;
            }

            .stats-row {
                display: table-row;
            }

            .stats-label,
            .stats-value {
                padding: 4px 8px; /* Adjust padding for spacing */
            }

            .stats-label {
                text-align: left;
                font-weight: 600; /* Semi-bold */
            }

            .stats-value {
                text-align: right;
            }
        </style>
    `
  )
  const statsDisplay = document.createElement('div')
  statsDisplay.setAttribute('id', 'stats')
  statsDisplay.setAttribute('class', 'stats-container')
  document.body.insertAdjacentElement('beforeend', statsDisplay)
  // Make stats container draggable
  const statsContainer = document.getElementById('stats')
  let isDragging = false
  let offsetX = 0
  let offsetY = 0

  statsContainer.addEventListener('mousedown', (event) => {
    isDragging = true
    offsetX = event.clientX - statsContainer.offsetLeft
    offsetY = event.clientY - statsContainer.offsetTop
    statsContainer.classList.add('dragging')
  })

  document.addEventListener('mousemove', (event) => {
    if (isDragging) {
      statsContainer.style.left = `${event.clientX - offsetX}px`
      statsContainer.style.top = `${event.clientY - offsetY}px`
    }
  })

  document.addEventListener('mouseup', () => {
    isDragging = false
    statsContainer.classList.remove('dragging')
  })

  // colorblind filters SVG
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('style', 'height:0px; width:0px')
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  svg.setAttribute('version', '1.1')
  svg.setAttribute('id', 'colorblindFilters')

  svg.innerHTML = `
<defs>
  <filter id="protanopia">
    <feColorMatrix in="SourceGraphic" type="matrix"
      values="1.8, 0.7, 0,   0, 0
              0.2, 1.2, 0,   0, 0
              0,   0.3, 1.5, 0, 0
              0,   0,   0,   1, 0"/>
  </filter>
  <filter id="deuteranopia">
    <feColorMatrix in="SourceGraphic" type="matrix"
      values="1.6, 0.4, 0,   0, 0
              0.4, 1.6, 0,   0, 0
              0,   0.2, 1.8, 0, 0
              0,   0,   0,   1, 0"/>
  </filter>
  <filter id="tritanopia">
    <feColorMatrix in="SourceGraphic" type="matrix"
      values="1.05, 0,  0,   0, 0
              0,    1.6, 0.4, 0, 0
              0,    0.4, 1.6, 0, 0
              0,    0,   0,   1, 0"/>
  </filter>
  <filter id="achromatopsia">
    <feColorMatrix in="SourceGraphic" type="matrix"
      values="1.0, 0.5, 0.5, 0, 0
              0.5, 1.0, 0.5, 0, 0
              0.5, 0.5, 1.0, 0, 0
              0,   0,   0,   1, 0"/>
  </filter>
  <filter id="protanomaly">
  <feColorMatrix in="SourceGraphic" type="matrix"
    values="1.4, 0.6, 0,   0, 0
            0.1, 1.6, 0,   0, 0
            0,   0.2, 1.8, 0, 0
            0,   0,   0,   1, 0"/>
</filter>
<filter id="deuteranomaly">
  <feColorMatrix in="SourceGraphic" type="matrix"
    values="1.3, 0.7, 0,   0, 0
            0.2, 1.4, 0.4, 0, 0
            0,   0.3, 1.7, 0, 0
            0,   0,   0,   1, 0"/>
</filter>
<filter id="tritanomaly">
  <feColorMatrix in="SourceGraphic" type="matrix"
    values="1.1, 0.1, 0,   0, 0
            0,   1.5, 0.5, 0, 0
            0,   0.5, 1.5, 0, 0
            0,   0,   0,   1, 0"/>
</filter>
</defs>

`
  document.body.insertAdjacentElement('afterbegin', svg)

  // colorblind filters
  const cbFilterScript = require('./modules/cbfilters.js')
  const cbFilterScriptElement = document.createElement('script')
  cbFilterScriptElement.classList.add('lambda-module-colorblind-filters')
  cbFilterScriptElement.innerHTML = cbFilterScript.applyFilter
  document.body.insertAdjacentElement('beforeend', cbFilterScriptElement)

  // custom filter
  const customFilterScript = require('./modules/customColorFilter.js')
  const customFilterScriptElement = document.createElement('script')
  customFilterScriptElement.classList.add('lambda-module-custom-filters')
  customFilterScriptElement.innerHTML = customFilterScript.updateCustomFilter
  document.body.insertAdjacentElement('beforeend', customFilterScriptElement)

  // brainrot mode overlay
  const brainrotScript = require('./modules/brainrot.js')
  const brainrotScriptElement = document.createElement('script')
  brainrotScriptElement.classList.add('lambda-module-brainrot-mode')
  brainrotScriptElement.innerHTML = brainrotScript.toggleBrainrot
  document.body.insertAdjacentElement('beforeend', brainrotScriptElement)

  // stats
  const statsScript = require('./modules/stats.js')
  const statsScriptElement = document.createElement('script')
  statsScriptElement.classList.add('lambda-module-stats')
  statsScriptElement.innerHTML = statsScript.toggleStats
  statsScriptElement.innerHTML += statsScript.statsHTML
  document.body.insertAdjacentElement('beforeend', statsScriptElement)

  // call stat updaters
  statsScript.fps()
  statsScript.ping()
  ipcRenderer.on('cpu', (event, data) => {
    if (document.getElementById('cpu-usage'))
      document.getElementById('cpu-usage').innerHTML = data.toFixed(2) + '%'
  })

  ipcRenderer.on('mem', (event, data) => {
    if (document.getElementById('ram-usage'))
      document.getElementById('ram-usage').innerHTML = data.toFixed(2)
  })

  ipcRenderer.on('uptime', (event, data) => {
    let seconds = Math.round(data)
    let hours = Math.floor(seconds / 3600)
    seconds %= 3600
    let minutes = Math.floor(seconds / 60)
    seconds %= 60

    let formattedTime = [
      hours ? `${hours}h` : '',
      minutes ? `${minutes}m` : '',
      seconds ? `${seconds}s` : '',
    ]
      .filter(Boolean)
      .join(' ')

    if (document.getElementById('uptime'))
      document.getElementById('uptime').innerHTML = formattedTime || '0s'
  })

  // lambda chat
  const lambdaChatScript = require('./modules/lambda-chat.js')
  const lambdaChatScriptElement = document.createElement('script')
  lambdaChatScriptElement.classList.add('lambda-module-global-chat')
  lambdaChatScriptElement.innerHTML = 'let state = null\n'
  lambdaChatScriptElement.innerHTML += lambdaChatScript.initP2PChat
  document.body.insertAdjacentElement('beforeend', lambdaChatScriptElement)

  // create chat elements
  const wrapper = document.createElement('div')
  wrapper.setAttribute(
    'style',
    'position: fixed; display:flex; flex-direction:column; top: 0; left: 0; width: 350px; height: 200px; z-index: 200; background-color: rgba(0, 0, 0, 0.28); color:white'
  )
  const messages = document.createElement('div')
  messages.id = 'messages'
  messages.setAttribute(
    'style',
    'display: flex; flex-direction: column; width: 100%; flex-grow: 1;margin-left:4px; font-size: 14px'
  )
  wrapper.appendChild(messages)
  const chatInput = document.createElement('input')
  chatInput.id = 'chat-input'
  chatInput.disabled = true
  chatInput.setAttribute(
    'style',
    'width: 100%;height:25px;background-color: transparent;border: 1px solid white;color:white; padding-left:4px; margin:1px'
  )
  wrapper.appendChild(chatInput)
  chatInput.addEventListener('keydown', (event) => {
    event.stopPropagation()
  })
  document.body.insertAdjacentElement('afterbegin', wrapper)

  //get deadshot chat and give it an id for future reference
  const observer = new MutationObserver((mutationsList, obs) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node
            if (
              el.tagName === 'INPUT' &&
              el.getAttribute('maxlength') === '100'
            ) {
              el.id = 'ds-chat'
              obs.disconnect()
            }
          }
        })
      }
    }
  })
  observer.observe(document.body, { childList: true, subtree: true })

  const toggleButton = document.createElement('button')
  toggleButton.textContent = 'Using DS Chat'
  toggleButton.setAttribute('tabindex', '-1') // makes it so enter key doesnt click button
  toggleButton.setAttribute(
    'style',
    'left: 0;z-index: 201;width:fit-content;background-color:transparent;color:white;border:1px solid white;margin:2px;padding: 2px;'
  )

  toggleButton.addEventListener('click', () => {
    const dsChat = document.getElementById('ds-chat')
    if (dsChat) {
      if (chatInput.disabled) {
        chatInput.disabled = false
        dsChat.disabled = true
        toggleButton.textContent = 'Using Lambda Chat'
      } else {
        chatInput.disabled = true
        dsChat.disabled = false
        toggleButton.textContent = 'Using DS Chat'
      }
    } else {
      chatInput.disabled = !chatInput.disabled
      toggleButton.textContent = chatInput.disabled
        ? 'Using DS Chat'
        : 'Using Lambda Chat'
    }
  })
  wrapper.insertAdjacentElement('beforeend', toggleButton)
  //force focus lambda chat if deadshot chat disabled
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const dsChat = document.getElementById('ds-chat')
      if (dsChat && dsChat.disabled) {
        const chatInput = document.getElementById('chat-input')
        if (chatInput) {
          chatInput.focus()
        }
      }
    }
  })

  //chat init
  function startChat(username) {
    const chatConfig = {
      msgBoxId: '#messages',
      inputId: '#chat-input',
      username: username,
      loggingCallback: (level, message) => {
        console.log(`[${level}] ${message}`)
      },
      sigSrv: 'ws://143.198.65.132:8080',
    }

    initP2PChat(chatConfig)
  }

  // check for user id thing and load chat accordingly
  function initializeChat() {
    try {
      const dses = localStorage.getItem('dses')

      if (!dses) {
        startChat('Guest')
      } else {
        fetch('https://login.deadshot.io/login', {
          headers: {
            accept: '*/*',
            'accept-language': 'en-US,en;q=0.9',
            'content-type': 'application/json',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-site',
            'sec-gpc': '1',
          },
          referrer: 'https://deadshot.io/',
          referrerPolicy: 'strict-origin-when-cross-origin',
          body: `{\"idtoken\":"${localStorage.getItem('dses')}"}`,
          method: 'POST',
          mode: 'cors',
          credentials: 'omit',
        })
          .then((response) => response.json())
          .then((data) => {
            const username = data.username || 'Guest'
            startChat(username)
          })
          .catch((error) => {
            console.error('Error fetching user data:', error)
            startChat('Guest')
          })
      }
    } catch (error) {
      console.log(
        'something went wrong with lambda chat idk, exiting function (reload page to retry)'
      )
      return
    }
  }

  // Intercept XHR and re check username on completion of login or logout
  initializeChat()
  ;(function () {
    let open = XMLHttpRequest.prototype.open
    XMLHttpRequest.prototype.open = function (method, url, ...args) {
      if (url.includes('signout') || url.includes('signin')) {
        let xhr = this
        xhr.onreadystatechange = function () {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            initializeChat()
          }
        }
      }
      return open.apply(this, [method, url, ...args])
    }
  })()

  ipcRenderer.send('readyforsettings')
}) //DOMContentLoaded
