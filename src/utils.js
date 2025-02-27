const fs = require('fs')
const path = require('path')
const os = require('node:os')

function createFile(relativeFilePath, base64Data) {
  const baseDir = path.join(os.homedir(), 'Documents', 'Lambda', 'Swapper')
  const fullPath = path.join(baseDir, relativeFilePath)
  const dir = path.dirname(fullPath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  const fileData = Buffer.from(base64Data, 'base64')
  fs.writeFileSync(fullPath, fileData)
  console.log(`File created at: ${fullPath}`)
}

function copyFile(old, newPath) {
  fs.copyFile(old, newPath, (err) => {
    if (err) {
      console.error(`Error copying file: ${err.message}`)
    } else {
      console.log(`File copied successfully from ${old} to ${newPath}`)
    }
  })
}

module.exports = {
  createFile,
  copyFile,
}
