const { app, BrowserWindow, ipcMain, protocol, globalShortcut, dialog, screen, session} = require('electron');
const path = require('node:path')
const os = require('node:os')
const fs = require('node:fs')
const started = require('electron-squirrel-startup');
const swapper = require('./swapper.js');
const { spawn } = require("child_process")
const utils = require("./utils.js")
const https = require('https');


let store;
(async () => {
    const { default: Store } = await import("electron-store");
    const path = (await import("path")).default;
    const { app } = await import("electron");

    // Set custom storage location
    const customPath = path.join(app.getPath("documents"), "Lambda");
    
    store = new Store({
        cwd: customPath,
        name: "config",
    });

    console.log("Store initialized at:", store.path);
})();
function getOption(name) {
  if (!store) {
    throw new Error("Store is not initialized yet!");
}
    return store.get(name);
}
function setOption(name, value) {
  if (!store) {
    throw new Error("Store is not initialized yet!");
}
    store.set(name, value);
}
function getAllSettings() {
  if (!store) {
    throw new Error("Store is not initialized yet!");
  }
  return store.store;
}

if (started) {
  app.quit();
}
ipcMain.handle('open-rs-folder', (event, folder) => {
  spawn('explorer.exe', [path.join(app.getPath("documents"), `Lambda/Swapper/${folder}`)]);
})


app.whenReady().then(() => {

if (!fs.existsSync(path.join(os.homedir(), 'Documents', 'Lambda', 'Swapper', 'promo', 'logo.webp'))) {
  utils.copyFile("./src/storage/logo.webp", `${path.join(os.homedir(), 'Documents', 'Lambda', 'Swapper', 'promo', 'logo.webp')}`)
}

const mainWindow = new BrowserWindow({
  height: screen.getPrimaryDisplay().workArea.height,
  width: screen.getPrimaryDisplay().workArea.width,
  show: false,
  title: "λ Lambda Client λ",
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
    enableRemoteModule: true,
    sandbox: false,
    webSecurity: false, // needed to load local images
    preload: path.join(__dirname, 'preload.js'),
  }
});

const splash = new BrowserWindow({
  width: 500, 
  height: 300, 
  frame: false,
  transparent: true,
  alwaysOnTop: true,
  skipTaskbar: true,
});
splash.loadFile("pages/splash.html")
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
  }
});
settings.loadFile("pages/settings.html")

globalShortcut.register('F1', () => {
  if (settings.isVisible()) {
    settings.hide();
  } else {
    settings.show();
  }
});
mainWindow.on("closed", () => settings.close());

mainWindow.loadURL("https://deadshot.io")
  let isFirstLoad = true
  mainWindow.webContents.on('did-finish-load', () => {
    if (isFirstLoad) {
    setTimeout(() => {
      splash.close(); 
      mainWindow.show()
    }, 2500);
    isFirstLoad = false
  }
  });
  mainWindow.hide();

  globalShortcut.register('F12', () => mainWindow.webContents.openDevTools())

  ipcMain.handle('cb-filter', (event, filter) => {
    setOption("cbFilter", filter)
    mainWindow.webContents.executeJavaScript(`applyFilter('${filter}')`)
  })

  ipcMain.handle('custom-cb-filter', (event, matrix) => {
    setOption("cbFilter", "custom")
    setOption("customFilterMatrix", matrix)
    mainWindow.webContents.executeJavaScript(`updateCustomFilter(${JSON.stringify(matrix)})`)
  })



  //settings stuff
  ipcMain.handle('get-settings', async () => {
    return getAllSettings();
  });
  let client;
  client = require('discord-rich-presence')('1324609716252311602');
  ipcMain.on('setting-change', (event, arg) => {
    switch (arg.split(':')[0]) {
      case 'rpc':
        if (arg.split(':')[1] === 'true') {
          client.updatePresence({
            state: 'Lambda Client',
            details: arg.split(':')[2] || settingsJson.rpcText || "Wake up, Mr. Treeman...",
            largeImageText: "Lambda on top!",
            largeImageKey: "lambda",
            startTimestamp: Date.now()
          });
          setOption("rpc", true)
          setOption("rpcText", arg.split(':')[2] || "Wake up, Mr. Treeman...")
          console.log("[RPC]: Enabled!")
        } else { 
          client.disconnect();
          setOption("rpc", false)
          console.log('[RPC]: Disabled!')
        }
        break;
      case 'brainrot':
        if (arg.split(':')[1] == 'true') {
          setOption("brainrot", true)
          mainWindow.webContents.executeJavaScript('toggleBrainrot(true)')
          console.log("[Brainrot]: Enabled!")
        } else {
          setOption("brainrot", false)
          mainWindow.webContents.executeJavaScript('toggleBrainrot(false)')
          console.log("[Brainrot]: Disabled!")
        }
        break;
      default:
        break;
    }
  })


  // Resource swapper
  swapper.replaceResources(mainWindow, app);
  protocol.registerFileProtocol('swap', (request, callback) => {
    callback({
        path: path.normalize(request.url.replace(/^swap:/, ''))
    });
  });
  ipcMain.handle('skin-upload', async (event, type, skinData) => {
    try { 
       switch (type) {
        case "ar":
          utils.createFile("weapons/ar2/arcomp.webp", skinData)
          event.sender.send('skin-upload', { success: true, message: `[SkinUpload]: Uploaded AR skin` } )
          break;
        case "ar-player":
          utils.createFile("character/rookie.webp", skinData)
          event.sender.send('skin-upload', { success: true, message: `[SkinUpload]: Uploaded AR Player skin` } )
          break;
        case "awp":
          utils.createFile("weapons/awp/newawpcomp.webp", skinData)
          event.sender.send('skin-upload', { success: true, message: `[SkinUpload]: Uploaded Sniper skin` } )
          break;
        case "awp-player":
          utils.createFile("character/tuxedo.webp", skinData)
          event.sender.send('skin-upload', { success: true, message: `[SkinUpload]: Uploaded Sniper Player skin` } )
          break;
        case "smg":
          utils.createFile("weapons/vector/vectorcomp.webp", skinData)
          event.sender.send('skin-upload', { success: true, message: `[SkinUpload]: Uploaded SMG skin` } )
          break;
        case "smg-player":
          utils.createFile("character/female.webp", skinData)
          event.sender.send('skin-upload', { success: true, message: `[SkinUpload]: Uploaded SMG Player skin` } )
          break;
        case "shotgun":
          utils.createFile("weapons/shotgun/shotguncomp.webp", skinData)
          event.sender.send('skin-upload', { success: true, message: `[SkinUpload]: Uploaded Shotgun skin` } )
          break;
        case "shotgun-player":
          utils.createFile("character/shotgunplayer.webp", skinData)
          event.sender.send('skin-upload', { success: true, message: `[SkinUpload]: Uploaded Shotgun Player skin` } )
          break;
        case "mainmenu":
          [0, 1, 2, 3, 4, 5].forEach(num => {
            utils.createFile(`promo/background${num}.webp`, skinData)
          })
          event.sender.send('skin-upload', { success: true, message: `[SkinUpload]: Uploaded menu background` } )
          break;
        default:
          event.sender.send('skin-upload', { success: false, message: `[SkinUpload]: Invalid type` } )
          break;
       }
    } catch (error) {
        console.error('[SkinUpload]: Error:', error);
        return { success: false, message: error.message };
    }
  });
});
