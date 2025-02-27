const {
  app,
  BrowserWindow,
  ipcMain,
  protocol,
  globalShortcut,
  dialog,
  screen,
  session,
} = require('electron')
const path = require('node:path')
const os = require('node:os')
const osutils = require('os-utils')
const fs = require('node:fs')
const started = require('electron-squirrel-startup')
const swapper = require('./swapper.js')
const { spawn } = require('child_process')
const utils = require('./utils.js')
const https = require('https')

let store
;(async () => {
  const { default: Store } = await import('electron-store')
  const path = (await import('path')).default
  const { app } = await import('electron')

  // Set custom storage location
  const customPath = path.join(app.getPath('documents'), 'Lambda')

  store = new Store({
    cwd: customPath,
    name: 'config',
  })

  console.log('Store initialized at:', store.path)
  initDefaultSettings()
})()
function getOption(name) {
  if (!store) {
    throw new Error('Store is not initialized yet!')
  }
  return store.get(name)
}
function setOption(name, value) {
  if (!store) {
    throw new Error('Store is not initialized yet!')
  }
  store.set(name, value)
}
function getAllSettings() {
  if (!store) {
    throw new Error('Store is not initialized yet!')
  }
  return store.store
}

function initDefaultSettings() {
  const defaultSettings = [
    { name: 'rpc', defaultValue: false },
    { name: 'rpcText', defaultValue: 'Wake up, Mr. Treeman...' },
    { name: 'brainrot', defaultValue: false },
    { name: 'cbFilter', defaultValue: 'normal' },
    {
      name: 'customFilterMatrix',
      defaultValue: {
        row1: '[1,0,0,0,0]',
        row2: '[0,1,0,0,0]',
        row3: '[0,0,1,0,0]',
        row4: '[0,0,0,1,0]',
      },
    },
    { name: 'stats', defaultValue: false },
    {
      name: 'statOptions',
      defaultValue: {
        fps: true,
        ping: true,
        cpu: true,
        ram: true,
        uptime: true,
      },
    },
  ]

  defaultSettings.forEach((setting) => {
    if (!getOption(setting.name)) {
      setOption(setting.name, setting.defaultValue)
    }
  })
}

if (started) {
  app.quit()
}
ipcMain.handle('open-rs-folder', (event, folder) => {
  spawn('explorer.exe', [
    path.join(app.getPath('documents'), `Lambda/Swapper/${folder}`),
  ])
})

const mapNames = ['industry', 'manor', 'mlab', 'neon', 'tf', 'winter']
const lightmapFiles = [
  'lightmap0.webp',
  'lightmap1.webp',
  'smalllightmap0.webp',
  'smalllightmap1.webp',
]

async function copyLightmaps() {
  const homeDir = os.homedir()
  const targetBasePath = path.join(
    homeDir,
    'Documents',
    'Lambda',
    'Swapper',
    'maps'
  )

  if (!fs.existsSync(targetBasePath)) {
    fs.mkdirSync(targetBasePath, { recursive: true })
  }

  for (let mapName of mapNames) {
    const targetDir = path.join(targetBasePath, mapName, 'out')

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true })
    }

    await Promise.all(
      lightmapFiles.map((file) => {
        const oldPath = path.join('./src/storage/lightmaps', file)
        const newPath = path.join(targetDir, `${file}`)

        return utils.copyFile(oldPath, newPath)
      })
    )

    console.log(`Files for ${mapName} have been copied.`)
  }
}
async function deleteLightmaps() {
  const homeDir = require('os').homedir()
  const targetBasePath = path.join(
    homeDir,
    'Documents',
    'Lambda',
    'Swapper',
    'maps'
  )

  for (let mapName of mapNames) {
    const targetDir = path.join(targetBasePath, mapName, 'out')

    if (fs.existsSync(targetDir)) {
      await Promise.all(
        lightmapFiles.map((file) => {
          const filePath = path.join(targetDir, `${file}`)

          return new Promise((resolve, reject) => {
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error(`Error deleting ${filePath}:`, err)
                reject(err)
              } else {
                console.log(`Deleted ${filePath}`)
                resolve()
              }
            })
          })
        })
      )

      console.log(`All lightmap files for ${mapName} have been deleted.`)
    } else {
      console.log(`Target directory for ${mapName} does not exist.`)
    }
  }
}

app.whenReady().then(() => {
  if (
    !fs.existsSync(
      path.join(
        os.homedir(),
        'Documents',
        'Lambda',
        'Swapper',
        'promo',
        'logo.webp'
      )
    )
  ) {
    utils.copyFile(
      './src/storage/logo.webp',
      `${path.join(os.homedir(), 'Documents', 'Lambda', 'Swapper', 'promo', 'logo.webp')}`
    )
  }

  const mainWindow = new BrowserWindow({
    height: screen.getPrimaryDisplay().workArea.height,
    width: screen.getPrimaryDisplay().workArea.width,
    show: false,
    title: 'λ Lambda Client λ',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      sandbox: false,
      webSecurity: false, // needed to load local images
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  const splash = new BrowserWindow({
    width: 500,
    height: 300,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
  })
  splash.loadFile('pages/splash.html')
  splash.center()

  const settings = new BrowserWindow({
    width: 700,
    height: 400,
    frame: true, // change to false
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'settings.preload.js'),
    },
  })
  settings.loadFile('pages/settings.html')

  globalShortcut.register('F1', () => {
    if (settings.isVisible()) {
      settings.hide()
    } else {
      settings.show()
    }
  })
  mainWindow.on('closed', () => settings.close())

  mainWindow.loadURL('https://deadshot.io')
  let isFirstLoad = true
  mainWindow.webContents.on('did-finish-load', () => {
    if (isFirstLoad) {
      setTimeout(() => {
        splash.close()
        mainWindow.show()
      }, 2500)
      isFirstLoad = false
    }
  })
  mainWindow.hide()

  globalShortcut.register('F12', () => mainWindow.webContents.openDevTools())

  ipcMain.handle('cb-filter', (event, filter) => {
    setOption('cbFilter', filter)
    mainWindow.webContents.executeJavaScript(`applyFilter('${filter}')`)
  })

  ipcMain.handle('custom-cb-filter', (event, matrix) => {
    setOption('cbFilter', 'custom')
    const formattedMatrix = Object.keys(matrix).reduce((acc, key) => {
      acc[key] = JSON.stringify(matrix[key])
      return acc
    }, {})
    setOption('customFilterMatrix', formattedMatrix)
    mainWindow.webContents.executeJavaScript(
      `updateCustomFilter(${JSON.stringify(matrix)})`
    )
  })

  //settings stuff
  ipcMain.handle('get-settings', async () => {
    return getAllSettings()
  })
  ipcMain.handle('get-setting', (event, setting) => {
    return getOption(setting)
  })
  let client
  client = require('discord-rich-presence')('1324609716252311602')
  ipcMain.on('setting-change', (event, arg) => {
    switch (arg.split(':')[0]) {
      case 'rpc':
        if (arg.split(':')[1] === 'true') {
          client.updatePresence({
            state: 'Lambda Client',
            details:
              arg.split(':')[2] ||
              getOption('rpcText') ||
              'Wake up, Mr. Treeman...',
            largeImageText: 'Lambda on top!',
            largeImageKey: 'lambda',
            startTimestamp: Date.now(),
          })
          setOption('rpc', true)
          setOption('rpcText', arg.split(':')[2] || 'Wake up, Mr. Treeman...')
          console.log('[RPC]: Enabled!')
        } else {
          client.disconnect()
          setOption('rpc', false)
          console.log('[RPC]: Disabled!')
        }
        break
      case 'brainrot':
        if (arg.split(':')[1] == 'true') {
          setOption('brainrot', true)
          mainWindow.webContents.executeJavaScript('toggleBrainrot(true)')
          console.log('[Brainrot]: Enabled!')
        } else {
          setOption('brainrot', false)
          mainWindow.webContents.executeJavaScript('toggleBrainrot(false)')
          console.log('[Brainrot]: Disabled!')
        }
        break
      case 'flatlightmaps':
        if (arg.split(':')[1] == 'true') {
          copyLightmaps()
            .then(() => console.log('[Flat Lightmaps]: Enabled!'))
            .catch((err) => console.error('Error copying files:', err))
        } else {
          deleteLightmaps()
            .then(() => console.log('[Flat Lightmaps]: Disabled!'))
            .catch((err) => console.error('Error copying files:', err))
        }
        break
      case 'stats':
        if (arg.split(':')[1] == 'true') {
          setOption('stats', true)
          mainWindow.webContents.executeJavaScript('toggleStats(true)')
          console.log('[Stats]: Enabled!')
        } else if (arg.split(':')[1] == 'false') {
          setOption('stats', false)
          mainWindow.webContents.executeJavaScript('toggleStats(false)')
          console.log('[Stats]: Disabled!')
        } else {
          switch (arg.split(':')[1]) {
            case 'fps':
              setOption('statOptions', {
                ...getOption('statOptions'),
                fps: arg.split(':')[2] === 'true',
              })
              mainWindow.webContents.executeJavaScript(
                `statsHTML(${JSON.stringify(getOption('statOptions'))})`
              )
              console.log(
                `[Stats:fps]: ${arg.split(':')[2] === 'true' ? 'Enabled!' : 'Disabled!'}`
              )
              break

            case 'ping':
              setOption('statOptions', {
                ...getOption('statOptions'),
                ping: arg.split(':')[2] === 'true',
              })
              mainWindow.webContents.executeJavaScript(
                `statsHTML(${JSON.stringify(getOption('statOptions'))})`
              )
              console.log(
                `[Stats:ping]: ${arg.split(':')[2] === 'true' ? 'Enabled!' : 'Disabled!'}`
              )
              break

            case 'cpu':
              setOption('statOptions', {
                ...getOption('statOptions'),
                cpu: arg.split(':')[2] === 'true',
              })
              mainWindow.webContents.executeJavaScript(
                `statsHTML(${JSON.stringify(getOption('statOptions'))})`
              )
              console.log(
                `[Stats:cpu]: ${arg.split(':')[2] === 'true' ? 'Enabled!' : 'Disabled!'}`
              )
              break

            case 'ram':
              setOption('statOptions', {
                ...getOption('statOptions'),
                ram: arg.split(':')[2] === 'true',
              })
              mainWindow.webContents.executeJavaScript(
                `statsHTML(${JSON.stringify(getOption('statOptions'))})`
              )
              console.log(
                `[Stats:ram]: ${arg.split(':')[2] === 'true' ? 'Enabled!' : 'Disabled!'}`
              )
              break

            case 'uptime':
              setOption('statOptions', {
                ...getOption('statOptions'),
                uptime: arg.split(':')[2] === 'true',
              })
              mainWindow.webContents.executeJavaScript(
                `statsHTML(${JSON.stringify(getOption('statOptions'))})`
              )
              console.log(
                `[Stats:uptime]: ${arg.split(':')[2] === 'true' ? 'Enabled!' : 'Disabled!'}`
              )
              break

            default:
              break
          }
        }
        break
      default:
        console.log('[Setting Change]: invalid option provided')
        break
    }
  })

  // Resource swapper
  swapper.replaceResources(mainWindow, app)
  protocol.registerFileProtocol('swap', (request, callback) => {
    callback({
      path: path.normalize(request.url.replace(/^swap:/, '')),
    })
  })
  ipcMain.handle('skin-upload', async (event, type, skinData) => {
    try {
      switch (type) {
        case 'ar':
          utils.createFile('weapons/ar2/arcomp.webp', skinData)
          event.sender.send('skin-upload', {
            success: true,
            message: `[SkinUpload]: Uploaded AR skin`,
          })
          break
        case 'ar-player':
          utils.createFile('character/rookie.webp', skinData)
          event.sender.send('skin-upload', {
            success: true,
            message: `[SkinUpload]: Uploaded AR Player skin`,
          })
          break
        case 'awp':
          utils.createFile('weapons/awp/newawpcomp.webp', skinData)
          event.sender.send('skin-upload', {
            success: true,
            message: `[SkinUpload]: Uploaded Sniper skin`,
          })
          break
        case 'awp-player':
          utils.createFile('character/tuxedo.webp', skinData)
          event.sender.send('skin-upload', {
            success: true,
            message: `[SkinUpload]: Uploaded Sniper Player skin`,
          })
          break
        case 'smg':
          utils.createFile('weapons/vector/vectorcomp.webp', skinData)
          event.sender.send('skin-upload', {
            success: true,
            message: `[SkinUpload]: Uploaded SMG skin`,
          })
          break
        case 'smg-player':
          utils.createFile('character/female.webp', skinData)
          event.sender.send('skin-upload', {
            success: true,
            message: `[SkinUpload]: Uploaded SMG Player skin`,
          })
          break
        case 'shotgun':
          utils.createFile('weapons/shotgun/shotguncomp.webp', skinData)
          event.sender.send('skin-upload', {
            success: true,
            message: `[SkinUpload]: Uploaded Shotgun skin`,
          })
          break
        case 'shotgun-player':
          utils.createFile('character/shotgunplayer.webp', skinData)
          event.sender.send('skin-upload', {
            success: true,
            message: `[SkinUpload]: Uploaded Shotgun Player skin`,
          })
          break
        case 'mainmenu':
          ;[0, 1, 2, 3, 4, 5].forEach((num) => {
            utils.createFile(`promo/background${num}.webp`, skinData)
          })
          event.sender.send('skin-upload', {
            success: true,
            message: `[SkinUpload]: Uploaded menu background`,
          })
          break
        default:
          event.sender.send('skin-upload', {
            success: false,
            message: `[SkinUpload]: Invalid type`,
          })
          break
      }
    } catch (error) {
      console.error('[SkinUpload]: Error:', error)
      return { success: false, message: error.message }
    }
  })

  ipcMain.on('readyforsettings', () => {
    // init options
    mainWindow.webContents.executeJavaScript(
      `statsHTML(${JSON.stringify(getOption('statOptions'))})`
    )
    mainWindow.webContents.executeJavaScript(
      `toggleStats(${getOption('stats')})`
    )
    mainWindow.webContents.executeJavaScript(
      `toggleBrainrot(${getOption('brainrot')})`
    )
    mainWindow.webContents.executeJavaScript(
      `applyFilter('${getOption('cbFilter')}')`
    )
    if (getOption('rpc')) {
      client.updatePresence({
        state: 'Lambda Client',
        details: getOption('rpcText') || 'Wake up, Mr. Treeman...',
        largeImageText: 'Lambda on top!',
        largeImageKey: 'lambda',
        startTimestamp: Date.now(),
      })
    }
  })

  // stats
  let stats
  mainWindow.on('close', () => {
    clearInterval(stats)
  })

  stats = setInterval(() => {
    osutils.cpuUsage(function (v) {
      if (mainWindow) {
        mainWindow.webContents.send('cpu', v * 100)
        mainWindow.webContents.send('mem', osutils.freememPercentage() * 100)
        mainWindow.webContents.send('uptime', osutils.processUptime())
      }
    })
  }, 1000)

  stats.unref()
}) //app.whenReady
