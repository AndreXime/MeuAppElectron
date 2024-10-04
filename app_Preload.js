const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, 'data.json');

// Se não existir, cria um arquivo JSON padrão
if (!fs.existsSync(dataPath)) {
    const defaultData = [];
    fs.writeFileSync(dataPath, JSON.stringify(defaultData, null, 2)); // Formatação legível
}


contextBridge.exposeInMainWorld('electron', {
    minimize: () => ipcRenderer.send('minimize'),
    maximize: () => ipcRenderer.send('maximize'),
    close: () => ipcRenderer.send('close'),
    loadItems: () => {
        return new Promise((resolve, reject) => {
            fs.readFile(dataPath, 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(JSON.parse(data));
                }
            });
        });
    },
    saveItem: (item) => {
        return new Promise((resolve, reject) => {
            fs.readFile(dataPath, 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    const items = JSON.parse(data);
                    items.push(item);
                    fs.writeFile(dataPath, JSON.stringify(items), (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                }
            });
        });
    }
});

