// --- 1. FUNÇÃO MODO NOTURNO (MANTIDA) ---
const inputCheck = document.querySelector('#modo-noturno');
const elemento = document.querySelector('body');

if (inputCheck) {
    inputCheck.addEventListener('click', () => {
        const modo = inputCheck.checked ? 'dark' : 'light';
        elemento.setAttribute("data-bs-theme", modo);
    });
}

// --- 2. CORREÇÃO DA FUNCIONALIDADE MULTINÍVEL (NÍVEL 2) ---
document.addEventListener('DOMContentLoaded', function () {
    const offcanvas = document.getElementById('offcanvasNavbar');

    if (offcanvas) {
        const dropends = offcanvas.querySelectorAll('.nav-item.dropend');

        dropends.forEach(item => {
            const toggle = item.querySelector('.dropdown-toggle');
            const submenu = item.querySelector('.dropdown-menu');

            if (toggle && submenu) {
                // 1. GERA UM ID ÚNICO E ATRIBUI AO SUBMENU (Correção de Ordem)
                const uniqueId = 'submenu-' + Math.random().toString(36).substr(2, 9);
                submenu.id = uniqueId; 

                // 2. CONVERTE O ELEMENTO PARA SER CONTROLADO PELO SISTEMA COLLAPSE
                submenu.classList.add('collapse');
                submenu.classList.remove('dropdown-menu'); // Remove classe que conflita com visual

                // 3. PREVINE COMPORTAMENTO ANTIGO (Dropdown): remove atributos antigos primeiro
                toggle.removeAttribute('data-bs-toggle');
                toggle.removeAttribute('data-bs-target');

                // 4. ATRIBUI ATRIBUTOS DE CONTROLE (aponta para o ID do submenu)
                toggle.setAttribute('data-bs-toggle', 'collapse');
                toggle.setAttribute('data-bs-target', '#' + uniqueId); // Usa o ID corrigido
                toggle.setAttribute('aria-controls', uniqueId);
                toggle.setAttribute('aria-expanded', 'false');
                
                // 5. EVENTO DE CLIQUE: Usa o método nativo do Bootstrap (Collapse)
                toggle.addEventListener('click', function (e) {
                    e.preventDefault(); // Impede a navegação
                    e.stopPropagation(); // Evita que o clique feche o offcanvas
                    
                    // Inicializa e alterna o collapse (agora que tem os atributos corretos)
                    const bsCollapse = new bootstrap.Collapse(submenu, { toggle: false });
                    bsCollapse.toggle();

                    // Adiciona/Remove a classe 'collapsed' visualmente
                    this.classList.toggle('collapsed');
                });
            }
        });
    }
});

// 1. DADOS DOS PRODUTOS (Preencha com suas descrições e caminhos de imagem)
const productData = {
    'barras-trefiladas': {
        mainName: 'Barras Trefiladas',
        variations: {
            'btc': {
                label: 'BTC - Baixo Teor de Carbono',
                desc: 'Conhecido como "aço comercial", este material essencial, com seu teor variado de carbono, é o padrão da indústria devido à sua notável versatilidade. Ele combina excelente usinabilidade, soldabilidade e forjabilidade, o que simplifica o processamento e a fabricação. É a escolha robusta para inúmeras aplicações que requerem uma boa e confiável resistência mecânica, oferecendo o equilíbrio ideal entre desempenho e facilidade de manipulação.',
                img: './assets/barraredonda.jpg'
            },
            'mtc': {
                label: 'MTC - Médio Teor de Carbono',
                desc: 'Conhecido como "aço comercial", este material essencial, com seu teor variado de carbono, é o padrão da indústria devido à sua notável versatilidade. Ele combina excelente usinabilidade, soldabilidade e forjabilidade, o que simplifica o processamento e a fabricação. É a escolha robusta para inúmeras aplicações que requerem uma boa e confiável resistência mecânica, oferecendo o equilíbrio ideal entre desempenho e facilidade de manipulação.',
                img: './assets/barraredonda.jpg'
            },
            'sulfurado': {
                label: 'Aço Ressulfurado',
                desc: 'O Aço Ressulfurado é um material de alta usinabilidade, perfeito para produção em larga escala com baixo desgaste de ferramenta...',
                img: './assets/barraredonda.jpg'
            }
        }
    },
    'arames-trefilados': {
        mainName: 'Arames Trefilados',
        variations: {
            'btc': { label: 'BTC - Baixo Teor de Carbono', desc: 'Descrição do BTC para Arames...', img: './assets/aramerolo.jpg' },
            'mtc': { label: 'MTC - Médio Teor de Carbono', desc: 'Descrição do MTC para Arames...', img: './assets/aramerolo.jpg' },
        }
    },
    'hastes-aterramento': {
        mainName: 'Haste de Aterramento',
        variations: {
            'baixa-camada': { label: 'Baixa Camada', desc: 'Descrição da Haste de Baixa Camada...', img: './assets/hastebaixa.webp' },
            'alta-camada': { label: 'Alta Camada', desc: 'Descrição da Haste de Alta Camada...', img: './assets/hastealta.png' },
        }
    }
};

document.addEventListener('DOMContentLoaded', function () {
    const produtoModal = document.getElementById('produtoModal');
    if (!produtoModal) return;

    const variationList = document.getElementById('variationList');
    const variationDropdownButton = document.getElementById('variationDropdown');
    const productDescriptionDiv = document.getElementById('productDescription');
    const productImage = document.getElementById('productImage');
    const modalTitle = document.getElementById('produtoModalLabel');

    let currentProductData = null;
    let currentProductKey = null; // guarda a chave do produto atual (ex: 'barras-trefiladas')

    // --- 1. FUNÇÃO DE INICIALIZAÇÃO DO MODAL ---
    produtoModal.addEventListener('show.bs.modal', function (event) {
        const button = event.relatedTarget;
        const productKey = button.getAttribute('data-product-key');
        currentProductKey = productKey;
        currentProductData = productData[productKey];

        if (!currentProductData) return;

        // 1. Atualiza o Título do Modal para o nome do produto principal
        modalTitle.textContent = currentProductData.mainName;
        
        // 2. Preenche a Lista Suspensa (Dropdown)
        variationList.innerHTML = '';
        Object.entries(currentProductData.variations).forEach(([key, value]) => {
            const li = document.createElement('li');
            li.innerHTML = `<a class="dropdown-item" href="#" data-variation-key="${key}">${value.label}</a>`;
            variationList.appendChild(li);
        });
        
        // 3. Reseta para o estado padrão
        variationDropdownButton.textContent = 'Selecione a Variação';
        productDescriptionDiv.innerHTML = '<p>Selecione uma variação acima para ver a descrição detalhada e a imagem específica.</p>';
        productImage.src = './assets/barraredonda.jpg'; // Imagem de placeholder
    });

    // --- 2. FUNÇÃO PARA TROCAR CONTEÚDO E IMAGEM (Clique no Dropdown) ---
    variationList.addEventListener('click', function (event) {
        const item = event.target.closest('.dropdown-item');
        if (!item || !currentProductData) return;

        const variationKey = item.getAttribute('data-variation-key');
        const data = currentProductData.variations[variationKey];

        if (data) {
            // Atualiza o Botão do Dropdown
            variationDropdownButton.textContent = data.label;
            
            // Atualiza a Descrição
            productDescriptionDiv.innerHTML = `<p>${data.desc}</p>`;
            
            // Atualiza a Imagem
            productImage.src = data.img;

            // Fecha o menu Dropdown após a seleção
            const dropdown = bootstrap.Dropdown.getInstance(variationDropdownButton);
            if(dropdown) dropdown.hide();

            // Atualiza o link do botão "Ver detalhes" para levar à página correta
            const btnVerDetalhes = document.getElementById('btnVerDetalhes');
            if (btnVerDetalhes && currentProductKey && productMap[currentProductKey] && productMap[currentProductKey][variationKey]) {
                btnVerDetalhes.href = productMap[currentProductKey][variationKey];
                btnVerDetalhes.style.display = 'inline-block';
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // O ID real do offcanvas no HTML é 'offcanvasNavbar' — procura por ambos e protege
    var offcanvasElement = document.getElementById('offcanvasNavbar') || document.getElementById('seuOffcanvasID');

    // Observa os eventos dentro do Offcanvas se existir
    if (offcanvasElement) {
        offcanvasElement.addEventListener('shown.bs.collapse', function (e) {
            var currentCollapse = e.target;

            // Encontra todos os outros elementos de collapse (submenus)
            var allCollapses = offcanvasElement.querySelectorAll('.collapse.show');

            allCollapses.forEach(function (collapse) {
                // Fecha todos os outros, exceto o que acabou de ser aberto
                if (collapse !== currentCollapse) {
                    var collapseInstance = bootstrap.Collapse.getInstance(collapse);
                    if (collapseInstance) {
                        collapseInstance.hide();
                    }
                }
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const mvvButtons = document.querySelectorAll('.btn-mvv');
    if (mvvButtons && mvvButtons.length) {
        mvvButtons.forEach(button => {
            button.addEventListener('click', function() {
                document.querySelectorAll('.btn-mvv').forEach(btn => btn.classList.remove('active-mvv'));
                this.classList.add('active-mvv');
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const inputControls = document.querySelectorAll('.form-control');

    function applyDarkModeFix() {
        // Verifica se o Dark Mode está ativo (usando o atributo no elemento raiz)
        const isDarkMode = document.documentElement.getAttribute('data-bs-theme') === 'dark' || 
                           document.body.getAttribute('data-bs-theme') === 'dark';

        // Cores (devem corresponder às suas variáveis CSS)
        const lightGray = 'var(--cor-primaria-cinzaclaro)';
        const darkGray = 'var(--cor-terciaria-cinzaescuro)';

        if (isDarkMode) {
            inputControls.forEach(input => {
                // Aplica estilos inline (maior prioridade) para forçar o fundo claro
                input.style.setProperty('-webkit-box-shadow', '0 0 0 30px ' + lightGray, 'important');
                input.style.setProperty('-webkit-text-fill-color', darkGray, 'important');
                input.style.setProperty('background-color', lightGray, 'important');
            });
        } else {
            // Limpa os estilos inline no Light Mode
            inputControls.forEach(input => {
                input.style.removeProperty('-webkit-box-shadow');
                input.style.removeProperty('-webkit-text-fill-color');
                input.style.removeProperty('background-color');
            });
        }
    }

    // 1. Aplica a correção ao carregar a página
    applyDarkModeFix();

    // 2. Opcional: Monitora mudanças no tema caso você tenha um seletor de tema
    const htmlElement = document.documentElement;
    if (htmlElement) {
        new MutationObserver(applyDarkModeFix).observe(htmlElement, { 
            attributes: true, 
            attributeFilter: ['data-bs-theme'] 
        });
    }
});

// Mapeamento de chaves (data-product-key) para nomes de arquivo (href)
const productMap = {
    'barras-trefiladas': {
        'btc': 'barrabtc.html',
        'mtc': 'barramtc.html',
        'sulfurado': 'barraacoressulfurado.html'
    },
    'arames-trefilados': {
        'btc': 'aramebtc.html',
        'mtc': 'aramemtc.html'
    },
    'hastes-aterramento': {
        'baixa-camada': 'hastebc.html',
        'alta-camada': 'hasteac.html'
    }
    // Adicione outras variações se necessário
};

document.addEventListener('DOMContentLoaded', function () {
    const produtoModal = document.getElementById('produtoModal');
    const btnVerDetalhes = document.getElementById('btnVerDetalhes');

    if (produtoModal) {
        produtoModal.addEventListener('show.bs.modal', function (event) {
            // Pega o botão que acionou o modal (o 'Saiba Mais')
            const button = event.relatedTarget; 
            
            // Pega a chave do produto (ex: 'barras-trefiladas')
            const productKey = button.getAttribute('data-product-key');
            
            // Pega o nome do arquivo correspondente (usa a primeira variação disponível como padrão)
            let filename = null;
            if (productMap[productKey]) {
                const keys = Object.keys(productMap[productKey]);
                if (keys.length) filename = productMap[productKey][keys[0]];
            }

            if (btnVerDetalhes) {
                if (filename) {
                    btnVerDetalhes.href = filename;
                    btnVerDetalhes.style.display = 'inline-block';
                } else {
                    btnVerDetalhes.style.display = 'none';
                }
            }
        });

        // Limpa e esconde o botão ao fechar o modal
        produtoModal.addEventListener('hidden.bs.modal', function () {
            btnVerDetalhes.style.display = 'none';
            btnVerDetalhes.href = '#'; 
        });
    }
});

//Troca de Icon de coroa

document.addEventListener('DOMContentLoaded', function() {
    // 1. Encontra o Botão, que é a área real de hover do usuário
    const coroaButton = document.getElementById('btn-coroa-1968'); 

    if (coroaButton) {
        // 2. Encontra a Imagem da Coroa DENTRO do botão
        const coroaIcon = coroaButton.querySelector('.timeline-coroa-icon'); 

        // Garante que a imagem foi encontrada antes de continuar
        if (coroaIcon) {
            const originalSrc = coroaIcon.getAttribute('data-original-src');
            const hoverSrc = coroaIcon.getAttribute('data-hover-src');

            // Evento quando o mouse entra no BOTÃO
            coroaButton.addEventListener('mouseenter', function() {
                coroaIcon.src = hoverSrc; // Troca para o SVG cinza claro
            });

            // Evento quando o mouse sai do BOTÃO
            coroaButton.addEventListener('mouseleave', function() {
                coroaIcon.src = originalSrc; // Volta para o SVG laranja
            });
        }
    }
});

//Animação da Política de Qualidade

document.addEventListener('DOMContentLoaded', function() {
    const itens = document.querySelectorAll('.politica-item');
    const areaTextoExpandido = document.getElementById('texto-expandido');
    
    // Armazena o primeiro item ('T') como o estado persistente/default
    let defaultItem = null;
    let defaultLetra = '';
    let defaultTexto = '';
    
    // Lista de todos os textos para a revelação final (Último 'O')
    const todosTextos = []; 

    // Função para renderizar UMA frase na área de expansão (MANTIDA)
    function renderizarTexto(item, letra, texto, isFirstItem) {
        areaTextoExpandido.innerHTML = '';
        
        const p = document.createElement('p');
        p.classList.add('texto-active');

        // Lógica de Cores Otimizada para o TEXTO
        if (isFirstItem) {
            p.style.color = 'var(--cor-secundaria-cinzamedio)';
            p.classList.add('primeiro-item');
        } else {
            p.style.color = 'var(--cor-terciaria-cinzaescuro)';
        }

        p.appendChild(document.createTextNode(texto)); 
        areaTextoExpandido.appendChild(p);
        
        // Aplica o movimento vertical (translateY)
        const offsetTop = item.offsetTop;
        areaTextoExpandido.style.transform = `translateY(${offsetTop}px)`;

        // Aplica a opacidade
        setTimeout(() => {
            p.style.opacity = 1;
        }, 10);
    }
    
    // Função: Renderiza TODAS as frases para a revelação final (Último 'O')
    function renderizarTodasFrases() {
        areaTextoExpandido.innerHTML = ''; // Limpa a área
        areaTextoExpandido.style.transform = `translateY(0px)`; // Volta o container para o topo

        const container = document.createElement('div');
        container.classList.add('revelacao-completa');
        
        todosTextos.forEach((data, index) => {
            const p = document.createElement('p');
            p.classList.add('texto-revelado');
            
            // Define cor: o primeiro item é diferente, o restante usa a cor padrão
            if (index === 0) {
                 p.style.color = 'var(--cor-secundaria-cinzamedio)';
                 p.classList.add('primeiro-item');
            } else {
                 p.style.color = 'var(--cor-terciaria-cinzaescuro)';
            }
            
            p.appendChild(document.createTextNode(data.texto)); 
            container.appendChild(p);
            
            // Aplica opacidade com um pequeno atraso para o efeito de fade-in
            setTimeout(() => { p.style.opacity = 1; }, 50 * index);
        });

        areaTextoExpandido.appendChild(container);
    }

    // ---------------------------------------------------------------------
    // Lógica de Iteração e Event Listeners
    // ---------------------------------------------------------------------

    itens.forEach((item, index) => {
        const letra = item.getAttribute('data-letra');
        const texto = item.getAttribute('data-texto');
        const isFirst = index === 0;
        const isLast = index === itens.length - 1; 

        // Armazena todos os dados e define o Default Item ('T')
        todosTextos.push({ letra, texto, index });
        if (isFirst) {
            defaultItem = item;
            defaultLetra = letra;
            defaultTexto = texto;
        }

        // 1. Evento Mouse Enter (HOVER)
        item.addEventListener('mouseenter', function() {
            // Remove a classe 'active' de todos (inclusive do 'T' se estava ativa)
            itens.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // LÓGICA: Se for a última letra ('O'), revela tudo
            if (isLast) {
                renderizarTodasFrases();
                
            } else {
                // Se for qualquer outra letra, mostra a frase dela com movimento
                renderizarTexto(item, letra, texto, isFirst);
            }
        });

        // 2. Evento Mouse Leave (HOVER OUT)
        item.addEventListener('mouseleave', function() {
            // 🟢 CRÍTICO: Se não for a última letra ('O'), volta para o estado persistente ('T')
            if (!isLast && defaultItem) {
                 
                 // Remove 'active' de onde saiu o mouse
                 item.classList.remove('active');
                 
                 // Ativa o estado default ('T')
                 defaultItem.classList.add('active');
                 
                 // Renderiza a frase do 'T'
                 renderizarTexto(defaultItem, defaultLetra, defaultTexto, true);
            }
            // Se for a última letra ('O'), o texto revelado permanece até o próximo hover.
        });

        // 3. Inicialização (Exibe o 'T' ao carregar)
        if (isFirst) {
            item.classList.add('active');
            // Renderiza a frase do 'T' na posição correta ao carregar
            renderizarTexto(item, letra, texto, isFirst);
        }
    });
});

//Mascara de número de telefone

document.addEventListener('DOMContentLoaded', function() {
    // Seleciona o campo de telefone pelo ID (usa jQuery se disponível)
    const telefoneInputElem = document.getElementById('form-telefone');
    const telefoneInput = (typeof $ === 'function' && $('#form-telefone').length) ? $('#form-telefone') : null;

    // Define a função de máscara dinâmica
    var SPMaskBehavior = function (val) {
        // Se o valor tiver 15 caracteres (9 dígitos + formatação), aplica a máscara de celular
        return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
    },
    spOptions = {
        onKeyPress: function(val, e, field, options) {
            field.mask(SPMaskBehavior.apply({}, arguments), options);
        }
    };

    // Aplica a máscara dinâmica somente se encontrou o elemento e o plugin jQuery Mask
    if (telefoneInput && typeof telefoneInput.mask === 'function') {
        telefoneInput.mask(SPMaskBehavior, spOptions);
    } else if (telefoneInputElem) {
        // Fallback leve: impede caracteres não numéricos (não aplica máscara visual)
        telefoneInputElem.addEventListener('input', function (e) {
            this.value = this.value.replace(/[^0-9()\-\s]/g, '');
        });
    }
});