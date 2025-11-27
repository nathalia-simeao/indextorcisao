document.addEventListener('DOMContentLoaded', function() {
    const produtoModal = document.getElementById('produtoModal');
    const variationDropdownButton = document.getElementById('variationDropdown');
    const variationList = document.getElementById('variationList');
    const productImage = document.getElementById('productImage');
    const productDescription = document.getElementById('productDescription');
    const btnVerDetalhes = document.getElementById('btnVerDetalhes');
    let currentProductKey = '';

    // Objeto contendo os dados de todos os produtos e suas variações
    const productData = {
        "barras-trefiladas": {
            name: "Barras Trefiladas",
            variations: [
                { name: "BTC - Baixo Teor de Carbono", image: "assets/barraredonda.jpg", description: "Barras de Baixo Teor de Carbono, ideais para aplicações que exigem boa soldabilidade e conformabilidade.", link: "barrabtc.html" },
                { name: "MTC - Médio Teor de Carbono", image: "assets/barraredonda.jpg", description: "Barras de Médio Teor de Carbono, oferecendo um bom equilíbrio entre resistência e ductilidade para diversas aplicações.", link: "barramtc.html" },
                { name: "ATC - Alto Teor de Carbono", image: "assets/barraredonda.jpg", description: "Conhecido como 'aço comercial', este material essencial, com seu teor variado de carbono, é o padrão da indústria devido à sua notável versatilidade. Ele combina excelente usinabilidade, soldabilidade e forjabilidade, o que simplifica o processamento e a fabricação. É a escolha robusta para inúmeras aplicações que requerem uma boa e confiável resistência mecânica, oferecendo o equilíbrio ideal entre desempenho e facilidade de manipulação.", link: "barraatc.html" },
                { name: "Aço Ressulfurado", image: "assets/barraredonda.jpg", description: "Barras de Aço Ressulfurado, projetadas para alta usinabilidade e acabamento superficial superior.", link: "barraacoressulfurado.html" }
            ]
        },
        "hastes-aterramento": {
            name: "Haste de Aterramento",
            variations: [
                { name: "Baixa Camada", image: "assets/hastebaixa.webp", description: "Haste de aterramento com baixa camada de cobre, adequada para solos com menor agressividade.", link: "hastebc.html" },
                { name: "Alta Camada", image: "assets/hastealta.png", description: "Haste de aterramento com alta camada de cobre, ideal para maior durabilidade e resistência à corrosão em solos agressivos.", link: "hasteac.html" }
            ]
        },
        "arames-trefilados": {
            name: "Arames Trefilados",
            variations: [
                { name: "BTC - Baixo Teor de Carbono", image: "assets/aramespider.jpg", description: "Arames de Baixo Teor de Carbono, flexíveis e fáceis de manusear, ideais para amarração e usos gerais.", link: "aramebtc.html" },
                { name: "MTC - Médio Teor de Carbono", image: "assets/aramespider.jpg", description: "Arames de Médio Teor de Carbono, oferecendo maior resistência para aplicações que exigem mais robustez.", link: "aramemtc.html" },
                { name: "ATC - Alto Teor de Carbono", image: "assets/aramespider.jpg", description: "Arame de aço de alto desempenho é o padrão da indústria, resultado do processo de trefilação que aprimora suas propriedades mecânicas. Ele se destaca pela sua uniformidade dimensional e pela elevada resistência à tração, mantendo um excelente equilíbrio entre tenacidade e dureza. É a escolha essencial para inúmeras aplicações que requerem alta performance estrutural e confiabilidade, oferecendo o equilíbrio ideal entre resistência mecânica superior e precisão na aplicação.", link: "arameatc.html" }
            ]
        }
    };

    // Evento que é disparado quando o modal é exibido
    produtoModal.addEventListener('show.bs.modal', function (event) {
        const button = event.relatedTarget; // Botão que acionou o modal
        currentProductKey = button.getAttribute('data-product-key'); // Pega a chave do produto
        const product = productData[currentProductKey];

        if (product) {
            // Atualiza o título do modal
            document.getElementById('produtoModalLabel').textContent = `Detalhes do Produto - ${product.name}`;
            // Reseta o texto do dropdown e o conteúdo do modal
            variationDropdownButton.textContent = "Selecione a Variação";
            variationList.innerHTML = '';
            productImage.src = 'assets/hastebaixa.webp'; // Imagem padrão ou placeholder
            productImage.alt = 'Imagem da Variação'; // Alt text padrão
            productDescription.innerHTML = '<p>Selecione uma variação acima para ver a descrição e a imagem.</p>';
            btnVerDetalhes.style.display = 'none'; // Esconde o botão "Ver Detalhes"
            btnVerDetalhes.href = '#'; // Reseta o link do botão

            // Popula o dropdown com as variações do produto selecionado
            product.variations.forEach(variation => {
                const listItem = document.createElement('li');
                const anchor = document.createElement('a');
                anchor.classList.add('dropdown-item');
                anchor.href = '#'; // O link real será usado pelo botão "Ver Detalhes"
                anchor.textContent = variation.name;
                // Armazena os dados da variação nos atributos data- para fácil acesso
                anchor.dataset.image = variation.image;
                anchor.dataset.description = variation.description;
                anchor.dataset.link = variation.link;
                listItem.appendChild(anchor);
                variationList.appendChild(listItem);
            });
        }
    });

    // Evento para lidar com a seleção de uma variação no dropdown
    variationList.addEventListener('click', function(event) {
        const target = event.target;
        if (target.classList.contains('dropdown-item')) {
            event.preventDefault(); // Previne o comportamento padrão do link
            variationDropdownButton.textContent = target.textContent; // Atualiza o texto do botão do dropdown
            productImage.src = target.dataset.image; // Atualiza a imagem
            productImage.alt = `Imagem de ${target.textContent}`; // Atualiza o alt text da imagem
            productDescription.innerHTML = `<p>${target.dataset.description}</p>`; // Atualiza a descrição
            btnVerDetalhes.href = target.dataset.link; // Define o link do botão "Ver Detalhes"
            btnVerDetalhes.style.display = 'block'; // Mostra o botão "Ver Detalhes"
        }
    });

    // Lógica para o Modo Noturno
    const modoNoturnoSwitch = document.getElementById('modo-noturno');
    
    // Função para aplicar o tema (claro ou escuro)
    const aplicarTema = () => {
        // Verifica se o tema 'dark' está salvo no localStorage
        if (localStorage.getItem('theme') === 'dark') {
            document.body.setAttribute('data-bs-theme', 'dark'); // Aplica o tema escuro
            if (modoNoturnoSwitch) modoNoturnoSwitch.checked = true; // Marca o switch
        } else {
            document.body.setAttribute('data-bs-theme', 'light'); // Aplica o tema claro
            if (modoNoturnoSwitch) modoNoturnoSwitch.checked = false; // Desmarca o switch
        }
    };

    // Adiciona um listener para o switch de modo noturno
    if (modoNoturnoSwitch) {
        modoNoturnoSwitch.addEventListener('change', () => {
            localStorage.setItem('theme', modoNoturnoSwitch.checked ? 'dark' : 'light');
            aplicarTema();
        });
    }

    aplicarTema(); // Aplica o tema ao carregar a página
});