function mostrarForm() {
    const form = document.querySelector('.formulario-fale-conosco');
    const mask = document.querySelector('.mascara-formulario');
    
    form.classList.add('open');
    mask.style.display = 'block';
    
    // Reseta o scroll interno do formulário
    form.scrollTop = 0;
    
    // Calcula a posição exata para rolar a página
    const headerHeight = document.querySelector('header').offsetHeight;
    const offset = headerHeight + 20; // 20px de margem extra abaixo do header
    
    // Rola suavemente até a posição ideal
    window.scrollTo({
        top: offset,
        behavior: 'smooth'
    });
}

function esconderForm() {
    const form = document.querySelector('.formulario-fale-conosco');
    const mask = document.querySelector('.mascara-formulario');
    
    form.classList.remove('open');
    mask.style.display = 'none';
}

// ====== CONTROLE DINÂMICO DE CAMPOS ======

// Atualiza valor do slider de perda
document.getElementById('wasteFactor').addEventListener('input', function() {
    document.getElementById('wasteValue').textContent = this.value + '%';
});

// Mostra/oculta seções conforme tipo de material
document.getElementById('materialType').addEventListener('change', function() {
    const material = this.value;
    const sections = [
        'heightSection', 
        'tileTypeSection', 
        'blockTypeSection', 
        'paintTypeSection', 
        'coatsSection', 
        'customDimensions', 
        'customBlockDimensions'
    ];
    
    // Esconde todas
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    // Mostra específicas
    if (material === 'ceramica' || material === 'azulejo') {
        document.getElementById('heightSection').style.display = 'block';
        document.getElementById('tileTypeSection').style.display = 'block';
        
        // Verifica se está em modo personalizado
        if (document.getElementById('tileType').value === 'personalizado') {
            document.getElementById('customDimensions').style.display = 'block';
        }
    } 
    else if (material === 'blocos') {
        document.getElementById('heightSection').style.display = 'block';
        document.getElementById('blockTypeSection').style.display = 'block';
        
        if (document.getElementById('blockType').value === 'personalizado') {
            document.getElementById('customBlockDimensions').style.display = 'block';
        }
    } 
    else if (material === 'tinta') {
        document.getElementById('paintTypeSection').style.display = 'block';
        document.getElementById('coatsSection').style.display = 'block';
    }
});

// Controle de peças personalizadas (azulejo/cerâmica)
document.getElementById('tileType').addEventListener('change', function() {
    const custom = document.getElementById('customDimensions');
    if (this.value === 'personalizado') {
        custom.style.display = 'block';
    } else {
        custom.style.display = 'none';
    }
});

// Controle de blocos personalizados
document.getElementById('blockType').addEventListener('change', function() {
    const custom = document.getElementById('customBlockDimensions');
    if (this.value === 'personalizado') {
        custom.style.display = 'block';
    } else {
        custom.style.display = 'none';
    }
});

// ====== FUNÇÃO DE CÁLCULO ======

function calcularArea() {
    const length = parseFloat(document.getElementById('length').value);
    const width = parseFloat(document.getElementById('width').value);
    
    if (length > 0 && width > 0 && !isNaN(length) && !isNaN(width)) {
        return length * width;
    }
    return 0;
}

document.getElementById('calculateBtn').addEventListener('click', function(e) {
    e.preventDefault();
    
    const materialType = document.getElementById('materialType').value;
    const wasteFactor = parseFloat(document.getElementById('wasteFactor').value) / 100;
    const area = calcularArea();
    
    if (area <= 0) {
        alert('⚠️ Por favor, informe comprimento e largura válidos (maiores que zero).');
        return;
    }

    let results = '';
    let totalCost = 0;

    // === CERÂMICA OU AZULEJO ===
    if (materialType === 'ceramica' || materialType === 'azulejo') {
        const tileType = document.getElementById('tileType').value;
        let tileWidth, tileHeight;

        if (tileType === 'personalizado') {
            tileWidth = parseFloat(document.getElementById('customWidth').value);
            tileHeight = parseFloat(document.getElementById('customHeight').value);
        } else {
            const [w, h] = tileType.split('x').map(n => parseInt(n));
            tileWidth = w;
            tileHeight = h;
        }

        if (!tileWidth || !tileHeight || tileWidth <= 0 || tileHeight <= 0) {
            alert('⚠️ Por favor, informe dimensões válidas para a peça.');
            return;
        }

        const height = parseFloat(document.getElementById('height').value) || 2.8;
        const wallArea = (area * height) * 2; // Considera 2 paredes (ajuste conforme necessidade)
        const tileArea = (tileWidth * tileHeight) / 10000; // converte cm² para m²
        const tilesNeeded = wallArea / tileArea;
        const tilesWithWaste = tilesNeeded * (1 + wasteFactor);
        const boxes = Math.ceil(tilesWithWaste / 10); // 10 peças por caixa

        const pricePerBox = materialType === 'ceramica' ? 250 : 180; // preço por caixa
        totalCost = boxes * pricePerBox;

        results = `
            <div class="results-item">
                <span>Material:</span>
                <span class="results-value">${materialType === 'ceramica' ? 'Cerâmica' : 'Azulejo'}</span>
            </div>
            <div class="results-item">
                <span>Dimensão da Peça:</span>
                <span class="results-value">${tileWidth} × ${tileHeight} cm</span>
            </div>
            <div class="results-item">
                <span>Altura da Parede:</span>
                <span class="results-value">${height} m</span>
            </div>
            <div class="results-item">
                <span>Área Total:</span>
                <span class="results-value">${wallArea.toFixed(2)} m²</span>
            </div>
            <div class="results-item">
                <span>Peças Necessárias:</span>
                <span class="results-value">${Math.ceil(tilesNeeded)}</span>
            </div>
            <div class="results-item">
                <span>Com Perda (${(wasteFactor * 100).toFixed(0)}%):</span>
                <span class="results-value">${Math.ceil(tilesWithWaste)}</span>
            </div>
            <div class="results-item">
                <span>Caixas (10 peças):</span>
                <span class="results-value">${boxes}</span>
            </div>
        `;
    }

    // === BLOCOS ===
    else if (materialType === 'blocos') {
        const blockType = document.getElementById('blockType').value;
        let blockWidth, blockHeight, blockLength = 39; // comprimento padrão

        if (blockType === 'personalizado') {
            blockWidth = parseFloat(document.getElementById('blockWidth').value);
            blockHeight = parseFloat(document.getElementById('blockHeight').value);
        } else {
            const [w, h] = blockType.split('x').map(n => parseInt(n));
            blockWidth = w;
            blockHeight = h;
        }

        if (!blockWidth || !blockHeight || blockWidth <= 0 || blockHeight <= 0) {
            alert('⚠️ Por favor, informe dimensões válidas para o bloco.');
            return;
        }

        const height = parseFloat(document.getElementById('height').value) || 2.8;
        const wallArea = (area * height) * 2;
        const blockFaceArea = (blockLength * blockHeight) / 10000; // face que será assentada
        const blocksNeeded = wallArea / blockFaceArea;
        const blocksWithWaste = blocksNeeded * (1 + wasteFactor);
        const palets = Math.ceil(blocksWithWaste / 50); // 50 blocos por palete

        const pricePerBlock = 1.80;
        totalCost = blocksWithWaste * pricePerBlock;

        results = `
            <div class="results-item">
                <span>Material:</span>
                <span class="results-value">Blocos</span>
            </div>
            <div class="results-item">
                <span>Dimensão do Bloco:</span>
                <span class="results-value">${blockWidth} × ${blockHeight} × ${blockLength} cm</span>
            </div>
            <div class="results-item">
                <span>Altura da Parede:</span>
                <span class="results-value">${height} m</span>
            </div>
            <div class="results-item">
                <span>Área Total:</span>
                <span class="results-value">${wallArea.toFixed(2)} m²</span>
            </div>
            <div class="results-item">
                <span>Blocos Necessários:</span>
                <span class="results-value">${Math.ceil(blocksNeeded)}</span>
            </div>
            <div class="results-item">
                <span>Com Perda (${(wasteFactor * 100).toFixed(0)}%):</span>
                <span class="results-value">${Math.ceil(blocksWithWaste)}</span>
            </div>
            <div class="results-item">
                <span>Palete(s) (50 und):</span>
                <span class="results-value">${palets}</span>
            </div>
        `;
    }

    // === TINTA ===
    else if (materialType === 'tinta') {
        const paintType = document.getElementById('paintType').value;
        const coats = parseInt(document.getElementById('coats').value);
        const totalArea = area * coats; // área x demãos

        let coverage = 30; // m² por litro (média)
        let containerSize, containerLabel, containerPrice;

        switch(paintType) {
            case 'lata18':
                containerSize = 18;
                containerLabel = 'Lata de 18L';
                containerPrice = 180;
                break;
            case 'lata36':
                containerSize = 3.6;
                containerLabel = 'Lata de 3,6L';
                containerPrice = 45;
                break;
            case 'galao36':
                containerSize = 3.6;
                containerLabel = 'Galão de 3,6L';
                containerPrice = 42;
                break;
            case 'balde18':
                containerSize = 18;
                containerLabel = 'Balde de 18L';
                containerPrice = 170;
                break;
            default:
                containerSize = 18;
                containerLabel = 'Lata de 18L';
                containerPrice = 180;
        }

        const litersNeeded = totalArea / coverage;
        const litersWithWaste = litersNeeded * (1 + wasteFactor);
        const containers = Math.ceil(litersWithWaste / containerSize);
        totalCost = containers * containerPrice;

        results = `
            <div class="results-item">
                <span>Material:</span>
                <span class="results-value">Tinta</span>
            </div>
            <div class="results-item">
                <span>Recipiente:</span>
                <span class="results-value">${containerLabel}</span>
            </div>
            <div class="results-item">
                <span>Demãos:</span>
                <span class="results-value">${coats}</span>
            </div>
            <div class="results-item">
                <span>Área Total:</span>
                <span class="results-value">${totalArea.toFixed(2)} m²</span>
            </div>
            <div class="results-item">
                <span>Rendimento:</span>
                <span class="results-value">${coverage} m²/L</span>
            </div>
            <div class="results-item">
                <span>Litros Necessários:</span>
                <span class="results-value">${litersNeeded.toFixed(2)} L</span>
            </div>
            <div class="results-item">
                <span>Com Perda (${(wasteFactor * 100).toFixed(0)}%):</span>
                <span class="results-value">${litersWithWaste.toFixed(2)} L</span>
            </div>
            <div class="results-item">
                <span>Recipientes Necessários:</span>
                <span class="results-value">${containers}</span>
            </div>
        `;
    }

    // Exibe resultados
    document.getElementById('resultsContent').innerHTML = results;
    document.getElementById('totalCost').textContent = `R$ ${totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    
    // Alterna as seções
    inputSection.style.display = "none";
    resultsSection.style.display = "block";
    
    // Animação suave
    resultsSection.style.opacity = "0";
    setTimeout(() => {
        resultsSection.style.opacity = "1";
    }, 50);
});

// Botão Voltar
if (backBtn) {
    backBtn.addEventListener('click', function() {
        resultsSection.style.display = "none";
        inputSection.style.display = "block";
    });
}

// ====== INICIALIZAÇÃO ======

// Dispara evento change ao carregar para mostrar campos iniciais
document.addEventListener('DOMContentLoaded', function() {
    const materialSelect = document.getElementById('materialType');
    if (materialSelect) {
        materialSelect.dispatchEvent(new Event('change'));
    }
    
    // Ajuste mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile && form) {
        form.style.top = "20px";
    }
});

// Fecha formulário ao clicar na máscara
if (mascara) {
    mascara.addEventListener('click', esconderForm);
}

// ====== UTILIDADES (OPCIONAIS) ======

// Função de reset (opcional - descomente se quiser usar)
/*
function resetForm() {
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        if (input.type === 'range') {
            input.value = 10;
            document.getElementById('wasteValue').textContent = '10%';
        } else if (input.type === 'number') {
            input.value = '';
        } else if (input.tagName === 'SELECT') {
            input.selectedIndex = 0;
        }
    });
    
    // Esconde campos dinâmicos
    document.getElementById('customDimensions').style.display = 'none';
    document.getElementById('customBlockDimensions').style.display = 'none';
    
    // Volta para tela de entrada
    inputSection.style.display = 'block';
    resultsSection.style.display = 'none';
}
*/
