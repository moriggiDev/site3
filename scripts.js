// scripts.js — Calculadora de Materiais — VERSÃO FINAL

function mostrarForm() {
    const form = document.querySelector('.formulario-fale-conosco');
    const mask = document.querySelector('.mascara-formulario');
    
    form.classList.add('open');
    mask.style.display = 'block';
    form.scrollTop = 0;

    const header = document.querySelector('header');
    const offset = (header ? header.offsetHeight : 0) + 20;
    window.scrollTo({ top: offset, behavior: 'smooth' });
}

function esconderForm() {
    const form = document.querySelector('.formulario-fale-conosco');
    const mask = document.querySelector('.mascara-formulario');
    
    form.classList.remove('open');
    mask.style.display = 'none';
}

// Atualiza slider de perda
document.getElementById('wasteFactor')?.addEventListener('input', function() {
    const value = this.value;
    document.getElementById('wasteValue').textContent = value + '%';
});

// Mostra/oculta campos conforme material
document.getElementById('materialType')?.addEventListener('change', function() {
    const material = this.value;
    const sections = [
        'tileTypeSection', 
        'blockTypeSection', 
        'paintTypeSection', 
        'coatsSection', 
        'customDimensions', 
        'customBlockDimensions'
    ];
    
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    if (material === 'ceramica' || material === 'azulejo') {
        document.getElementById('tileTypeSection').style.display = 'block';
        if (document.getElementById('tileType')?.value === 'personalizado') {
            document.getElementById('customDimensions').style.display = 'block';
        }
    } 
    else if (material === 'blocos') {
        document.getElementById('blockTypeSection').style.display = 'block';
        if (document.getElementById('blockType')?.value === 'personalizado') {
            document.getElementById('customBlockDimensions').style.display = 'block';
        }
    } 
    else if (material === 'tinta') {
        document.getElementById('paintTypeSection').style.display = 'block';
        document.getElementById('coatsSection').style.display = 'block';
    }
});

// Controle campos personalizados
document.getElementById('tileType')?.addEventListener('change', function() {
    const custom = document.getElementById('customDimensions');
    if (this.value === 'personalizado' && custom) {
        custom.style.display = 'block';
    } else if (custom) {
        custom.style.display = 'none';
    }
});

document.getElementById('blockType')?.addEventListener('change', function() {
    const custom = document.getElementById('customBlockDimensions');
    if (this.value === 'personalizado' && custom) {
        custom.style.display = 'block';
    } else if (custom) {
        custom.style.display = 'none';
    }
});

// Função de cálculo
document.getElementById('calculateBtn')?.addEventListener('click', function(e) {
    e.preventDefault();
    
    const length = parseFloat(document.getElementById('length')?.value || 0);
    const width = parseFloat(document.getElementById('width')?.value || 0);
    const materialType = document.getElementById('materialType')?.value;
    const wasteFactor = parseFloat(document.getElementById('wasteFactor')?.value || 0) / 100;

    if (!length || !width || length <= 0 || width <= 0) {
        alert('⚠️ Informe comprimento e largura válidos.');
        return;
    }

    let results = '';
    let totalCost = 0;
    const area = length * width;

    // === CERÂMICA OU AZULEJO ===
    if (materialType === 'ceramica' || materialType === 'azulejo') {
        const tileType = document.getElementById('tileType')?.value;
        let tileWidth, tileHeight;

        if (tileType === 'personalizado') {
            tileWidth = parseFloat(document.getElementById('customWidth')?.value || 0);
            tileHeight = parseFloat(document.getElementById('customHeight')?.value || 0);
        } else {
            const [w, h] = tileType.split('x').map(n => parseInt(n));
            tileWidth = w;
            tileHeight = h;
        }

        if (!tileWidth || !tileHeight || tileWidth <= 0 || tileHeight <= 0) {
            alert('⚠️ Dimensões da peça inválidas.');
            return;
        }

        const tileArea = (tileWidth * tileHeight) / 10000;
        const tilesNeeded = area / tileArea;
        const tilesWithWaste = tilesNeeded * (1 + wasteFactor);
        const boxes = Math.ceil(tilesWithWaste / 10);
        const pricePerBox = materialType === 'ceramica' ? 250 : 180;
        totalCost = boxes * pricePerBox;

        results = `
            <div class="results-item"><span>Material:</span> <span>${materialType === 'ceramica' ? 'Cerâmica' : 'Azulejo'}</span></div>
            <div class="results-item"><span>Dimensão da Peça:</span> <span>${tileWidth} × ${tileHeight} cm</span></div>
            <div class="results-item"><span>Área Total:</span> <span>${area.toFixed(2)} m²</span></div>
            <div class="results-item"><span>Peças Necessárias:</span> <span>${Math.ceil(tilesNeeded)}</span></div>
            <div class="results-item"><span>Com Perda:</span> <span>${Math.ceil(tilesWithWaste)}</span></div>
            <div class="results-item"><span>Caixas (10 peças):</span> <span>${boxes}</span></div>
        `;
    }

    // === BLOCOS ===
    else if (materialType === 'blocos') {
        const blockType = document.getElementById('blockType')?.value;
        let blockWidth, blockHeight, blockLength = 39;

        if (blockType === 'personalizado') {
            blockWidth = parseFloat(document.getElementById('blockWidth')?.value || 0);
            blockHeight = parseFloat(document.getElementById('blockHeight')?.value || 0);
        } else {
            const [w, h] = blockType.split('x').map(n => parseInt(n));
            blockWidth = w;
            blockHeight = h;
        }

        if (!blockWidth || !blockHeight || blockWidth <= 0 || blockHeight <= 0) {
            alert('⚠️ Dimensões do bloco inválidas.');
            return;
        }

        const blockFaceArea = (blockLength * blockHeight) / 10000;
        const blocksNeeded = area / blockFaceArea;
        const blocksWithWaste = blocksNeeded * (1 + wasteFactor);
        const palets = Math.ceil(blocksWithWaste / 50);
        const pricePerBlock = 1.80;
        totalCost = blocksWithWaste * pricePerBlock;

        results = `
            <div class="results-item"><span>Material:</span> <span>Blocos</span></div>
            <div class="results-item"><span>Dimensão:</span> <span>${blockWidth} × ${blockHeight} × ${blockLength} cm</span></div>
            <div class="results-item"><span>Área:</span> <span>${area.toFixed(2)} m²</span></div>
            <div class="results-item"><span>Blocos Necessários:</span> <span>${Math.ceil(blocksNeeded)}</span></div>
            <div class="results-item"><span>Com Perda:</span> <span>${Math.ceil(blocksWithWaste)}</span></div>
            <div class="results-item"><span>Palete(s):</span> <span>${palets}</span></div>
        `;
    }

    // === TINTA ===
    else if (materialType === 'tinta') {
        const paintType = document.getElementById('paintType')?.value;
        const coats = parseInt(document.getElementById('coats')?.value || 1);
        const totalArea = area * coats;
        let containerSize, containerLabel, containerPrice;

        switch(paintType) {
            case 'lata18': containerSize = 18; containerLabel = 'Lata 18L'; containerPrice = 180; break;
            case 'lata36': containerSize = 3.6; containerLabel = 'Lata 3,6L'; containerPrice = 45; break;
            case 'galao36': containerSize = 3.6; containerLabel = 'Galão 3,6L'; containerPrice = 42; break;
            case 'balde18': containerSize = 18; containerLabel = 'Balde 18L'; containerPrice = 170; break;
            default: containerSize = 18; containerLabel = 'Lata 18L'; containerPrice = 180;
        }

        const litersNeeded = totalArea / 30;
        const litersWithWaste = litersNeeded * (1 + wasteFactor);
        const containers = Math.ceil(litersWithWaste / containerSize);
        totalCost = containers * containerPrice;

        results = `
            <div class="results-item"><span>Material:</span> <span>Tinta</span></div>
            <div class="results-item"><span>Recipiente:</span> <span>${containerLabel}</span></div>
            <div class="results-item"><span>Demãos:</span> <span>${coats}</span></div>
            <div class="results-item"><span>Área Total:</span> <span>${totalArea.toFixed(2)} m²</span></div>
            <div class="results-item"><span>Recipientes:</span> <span>${containers}</span></div>
        `;
    }

    // Exibe resultados
    const resultsContent = document.getElementById('resultsContent');
    const totalCostEl = document.getElementById('totalCost');
    const inputSection = document.getElementById('inputSection');
    const resultsSection = document.getElementById('results');

    if (resultsContent) resultsContent.innerHTML = results;
    if (totalCostEl) totalCostEl.textContent = `R$ ${totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    if (inputSection) inputSection.style.display = "none";
    if (resultsSection) {
        resultsSection.style.display = "block";
        resultsSection.style.opacity = "0";
        setTimeout(() => { resultsSection.style.opacity = "1"; }, 50);
    }
});

// Botão voltar
document.getElementById('backBtn')?.addEventListener('click', function() {
    const inputSection = document.getElementById('inputSection');
    const resultsSection = document.getElementById('results');
    if (inputSection) inputSection.style.display = "block";
    if (resultsSection) resultsSection.style.display = "none";
});

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    const materialSelect = document.getElementById('materialType');
    if (materialSelect) materialSelect.dispatchEvent(new Event('change'));
});