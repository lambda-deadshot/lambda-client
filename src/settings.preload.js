const { contextBridge, ipcRenderer } = require("electron")
console.log('[Preload]: settings.preload.js loaded')
contextBridge.exposeInMainWorld('electron', {
    sendSettingChange: (msg) => ipcRenderer.send('setting-change', msg),
    getSettings: async () => ipcRenderer.invoke('get-settings'),
    openRSFolder: (folder) => ipcRenderer.invoke('open-rs-folder', folder),
    sendSkinUpload: (type, skinData) => ipcRenderer.invoke('skin-upload', type, skinData),
    reloadDS: () => ipcRenderer.invoke('reload-deadshot'),
    deleteSkin: (path) => ipcRenderer.invoke('delete-skin', path),
    on: (channel, listener) => ipcRenderer.on(channel, listener),
    sendCBFilter: (filter) => ipcRenderer.invoke('cb-filter', filter),
    sendCustomCBFilter: (matrix) => ipcRenderer.invoke('custom-cb-filter', matrix)
})