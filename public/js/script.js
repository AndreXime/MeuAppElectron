// Função para carregar itens do JSON
async function loadItems() {
    try {
        const items = await window.electron.loadItems();
        displayItems(items);
    } catch (err) {
        console.error("Erro ao carregar itens:", err);
    }
}

// Função para exibir os itens na lista
function displayItems(items) {
    const itemList = document.getElementById('itemList');
    itemList.innerHTML = ''; // Limpa a lista antes de atualizar
    const now = new Date();

    items.forEach(item => {
        const expiryDate = new Date(item.expiry);
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        listItem.textContent = `${item.name} - Vence em: ${expiryDate.toLocaleDateString()}`;

        // Lógica de cores
        const daysToExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
        if (daysToExpiry < 0) {
            listItem.style.background = 'red'; // Item vencido
        } else if (daysToExpiry <= 14) {
            listItem.style.background = 'yellow'; // Vermelho
        } else if (daysToExpiry <= 30) {
            listItem.style.background = 'orange'; // Amarelo
        } else {
            listItem.style.background = 'green'; // Verde
        }

        itemList.appendChild(listItem);
    });
}

// Adiciona um novo item
document.getElementById('itemForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const itemName = document.getElementById('itemName').value;
    const expiryDate = document.getElementById('expiryDate').value;

    try {
        await window.electron.saveItem({ name: itemName, expiry: expiryDate });
        loadItems(); // Atualizar a lista
    } catch (err) {
        console.error("Erro ao salvar item:", err);
    }

    // Limpar o formulário
    document.getElementById('itemForm').reset();
});

// Carregar os itens ao iniciar
loadItems();
