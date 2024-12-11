document.addEventListener('DOMContentLoaded', () => {
    const produtoForm = document.querySelector('[data-form]');
    const listaProdutos = document.querySelector('[data-product]');
    const mensagemSemProdutos = document.querySelector('[data-mensagem-sem-produtos]');
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.querySelector('.search-input');
    const apiUrl = 'http://localhost:3000/produtos';

    
    if (searchForm && searchInput) {
        
        async function carregarProdutos() {
            const response = await fetch(apiUrl);
            const produtos = await response.json();
            if (produtos.length === 0) {
                mensagemSemProdutos.style.display = 'block';
            } else {
                mensagemSemProdutos.style.display = 'none';
                produtos.forEach(produto => adicionarProdutoDOM(produto));
            }
        }

        
        function adicionarProdutoDOM(produto) {
            const produtoCard = document.createElement('div');
            produtoCard.classList.add('card');
            produtoCard.dataset.id = produto.id;

            produtoCard.innerHTML = `
                <div class="img-container">
                    <img src="${produto.imagem}" alt="${produto.nome}">
                </div>
                <div class="card-container--info">
                    <p>${produto.nome}</p>
                    <div class="card-container--value">
                        <p>R$ ${produto.valor}</p>
                        <button class="delete-button" data-id="${produto.id}">
                            <img src="./assets/trashIcon.svg" alt="Eliminar">
                        </button>
                    </div>
                </div>
            `;

            produtoCard.querySelector('.delete-button').addEventListener('click', () => {
                excluirProduto(produto.id);
            });

            listaProdutos.appendChild(produtoCard);
        }

        
        async function adicionarProdutoAPI(produto) {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(produto)
            });
            const novoProduto = await response.json();
            adicionarProdutoDOM(novoProduto);
            mensagemSemProdutos.style.display = 'none';
        }

        
        async function excluirProduto(id) {
            await fetch(`${apiUrl}/${id}`, {
                method: 'DELETE'
            });
            document.querySelector(`[data-id='${id}']`).remove();
            if (listaProdutos.children.length === 0) {
                mensagemSemProdutos.style.display = 'block';
            }
        }

        
        produtoForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nome = document.querySelector('[data-name]').value;
            const valor = document.querySelector('[data-price]').value;
            const imagem = document.querySelector('[data-image]').value;

            const produto = { nome, valor, imagem };
            adicionarProdutoAPI(produto);

            produtoForm.reset();
        });

        
        searchForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const searchTerm = searchInput.value.toLowerCase();
            const response = await fetch(apiUrl);
            const produtos = await response.json();
            listaProdutos.innerHTML = ''; // Limpa a lista de produtos
            const produtosFiltrados = produtos.filter(produto => produto.nome.toLowerCase().includes(searchTerm));
            if (produtosFiltrados.length === 0) {
                mensagemSemProdutos.style.display = 'block';
            } else {
                mensagemSemProdutos.style.display = 'none';
                produtosFiltrados.forEach(produto => adicionarProdutoDOM(produto));
            }
        });

        
        carregarProdutos();
    } else {
        console.error('Formulário de busca ou campo de entrada não encontrado.');
    }
});
