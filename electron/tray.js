import { Tray, Menu, app, nativeImage } from 'electron'
import { mainWindow } from './win'
import { backgroundWindow } from './backgroundWin'

const resourcesFolder = __dirname + '/resources/'

export default {
  tray: null,
  contextMenu: null,
  osxContextMenu: null,
  init() {
    const p = process.platform

    if (p === 'darwin') {
      initOSXContextMenu.bind(this)()
    } else {
      initNormalContextMenu.bind(this)()
    }

    if (p === 'darwin') {
      this.tray = new Tray(nativeImage.createEmpty())
      // https://electronjs.org/docs/api/tray#traysethighlightmodemode-macos
      this.tray.setHighlightMode('never')
      this.tray.on('right-click', () => {
        this.tray.popUpContextMenu(this.osxContextMenu)
      })
      this.tray.on('click', (event, bounds, position) => {
        backgroundWindow.webContents.send('trayClick', { event, bounds, position })
      })
    } else if (p === 'win32') {
      this.tray = new Tray(`${resourcesFolder}win/icon.ico`)
    } else if (p === 'linux') {
      this.tray = new Tray(`${resourcesFolder}linux/icon.png`)
    }

    if (p !== 'darwin') {
      this.setContextMenu(this.contextMenu)
    }
  },
  setTrayImage(img) {
    const bounds = this.tray.getBounds()
    const Image = nativeImage.createFromDataURL(img).resize({
      height: bounds ? bounds.height : 22
    })
    this.tray.setImage(Image)
  }
}

function initNormalContextMenu() {
  this.contextMenu = Menu.buildFromTemplate([
    {
      label: '打开',
      enabled: false,
      click: () => {
        mainWindow.show()
        this.contextMenu.items[0].enabled = false
        this.contextMenu.items[1].enabled = true
        if (process.platform === 'linux') {
          this.tray.setContextMenu(this.contextMenu)
        }
      }
    },
    {
      label: '隐藏',
      enabled: true,
      click: () => {
        mainWindow.hide()
        this.contextMenu.items[0].enabled = true
        this.contextMenu.items[1].enabled = false
        if (process.platform === 'linux') {
          this.tray.setContextMenu(this.contextMenu)
        }
      }
    },
    { type: 'separator' },
    {
      label: '红心',
      click: () => {
        mainWindow.webContents.send('love')
      }
    },
    {
      label: '跳过',
      click: () => {
        mainWindow.webContents.send('skip')
      }
    },
    {
      label: '垃圾桶',
      click: () => {
        mainWindow.webContents.send('trash')
      }
    },
    { type: 'separator' },
    {
      label: '退出',
      click: () => {
        app.quit()
      }
    }
  ])
}

function initOSXContextMenu() {
  this.osxContextMenu = Menu.buildFromTemplate([
    {
      label: '打开',
      enabled: false,
      click: () => {
        mainWindow.show()
        this.osxContextMenu.items[0].enabled = false
        this.osxContextMenu.items[1].enabled = true
      }
    },
    {
      label: '隐藏',
      enabled: true,
      click: () => {
        mainWindow.hide()
        this.osxContextMenu.items[0].enabled = true
        this.osxContextMenu.items[1].enabled = false
      }
    },
    { type: 'separator' },
    {
      label: '贴附到状态栏',
      type: 'checkbox',
      checked: false,
      enabled: true,
      click: () => {
        // windowTopSwitch
        let appIconRect = this.tray.getBounds()
        let mainWindowRect = mainWindow.getBounds()
        let currentItem = this.osxContextMenu.items[3]

        if (currentItem.checked === true) {
          if (process.platform === 'darwin') {
            mainWindow.setPosition(appIconRect.x - mainWindowRect.width / 2 + appIconRect.width / 2, appIconRect.y)
          }
        } else {
          mainWindow.center()
        }
      }
    },
    { type: 'separator' },
    {
      label: '退出',
      click: () => {
        app.quit()
      }
    }
  ])
}
