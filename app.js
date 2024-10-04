const { app, BrowserWindow, ipcMain } = require('electron');
require('electron-reload')(__dirname); // Adicione isso

function createWindow () {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false, // Remove a barra de menu
        webPreferences: {
            preload: __dirname + '/preload.js', // Usar um script de preload
            contextIsolation: true, // Habilita o isolamento de contexto
            enableRemoteModule: false, // Desabilitar o módulo remote
        }
    });

    win.loadFile('public/index.html');
}

// Adicionar listeners para os eventos de controle de janela
ipcMain.on('minimize', (event) => {
    BrowserWindow.getFocusedWindow().minimize();
});

ipcMain.on('maximize', (event) => {
    const win = BrowserWindow.getFocusedWindow();
    if (win.isMaximized()) {
        win.unmaximize();
    } else {
        win.maximize();
    }
});

ipcMain.on('close', (event) => {
    BrowserWindow.getFocusedWindow().close();
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
