const form = document.querySelector(".formulario-fale-conosco");
const mascara = document.querySelector(".mascara-formulario");
const inputSection = document.getElementById('inputSection');
const resultsSection = document.getElementById('results');
const backBtn = document.getElementById('backBtn');

function mostrarForm(){
    form.style.left = "50%";
    form.style.transform = "translateX(-50%)";
    mascara.style.display = "block";
    // Resetar para a seção de entrada quando abrir
    inputSection.style.display = "block";
    resultsSection.style.display = "none";
    
    // Forçar atualização da posição para dispositivos móveis
    setTimeout(() => {
        form.style.left = "50%";
    }, 100);
}

function esconderForm(){
    form.style.left = "-300px";
    form.style.transform = "translateX(0)";
    mascara.style.display = "none";
}

// Atualiza o valor do fator de perda exibido
document.getElementById('wasteFactor').addEventListener('input', function() {
    document.getElementById('wasteValue').textContent = this.value + '%';
});

// Mostra/oculta seções baseadas no tipo de material selecionado
document.getElementById('materialType').addEventListener('change', function() {
    const material = this.value;
    const sections = ['heightSection', 'tileTypeSection', 'blockTypeSection', 'paintTypeSection', 'coatsSection', 'customDimensions', 'customBlockDimensions'];
    
    // Esconder todas as seções específicas
    sections.forEach(section => {
        document.getElementById(section).style.display = 'none';
    });

    // Mostrar seções apropriadas
    if (material === 'ceramica' || material === 'azulejo') {
        document.getElementById('tileTypeSection').style.display = 'block';
        if (document.getElementById('tileType').value === 'personalizado') {
            document.getElementById('customDimensions').style.display = 'block';
        }
    } else if (material === 'blocos') {
        document.getElementById('heightSection').style.display = 'block';
        document.getElementById('blockTypeSection').style.display = 'block';
        if (document.getElementById('blockType').value === 'personalizado') {
            document.getElementById('customBlockDimensions').style.display = 'block';
        }
    } else if (material === 'tinta') {
        document.getElementById('paintTypeSection').style.display = 'block';
        document.getElementById('coatsSection').style.display = 'block';
    }
});

// Mostra campos personalizados para cerâmica/azulejo
document.getElementById('tileType').addEventListener('change', function() {
    const customDimensions = document.getElementById('customDimensions');
    if (this.value === 'personalizado') {
        customDimensions.style.display = 'block';
    } else {
        customDimensions.style.display = 'none';
    }
});

// Mostra campos personalizados para blocos
document.getElementById('blockType').addEventListener('change', function() {
    const customBlockDimensions = document.getElementById('customBlockDimensions');
    if (this.value === 'personalizado') {
        customBlockDimensions.style.display = 'block';
    } else {
        customBlockDimensions.style.display = 'none';
    }
});

// Função para calcular área
function calcularArea() {
    const lengthInput = document.getElementById('length').value;
    const widthInput = document.getElementById('width').value;
    
    if (lengthInput && widthInput && !isNaN(lengthInput) && !isNaN(widthInput) && lengthInput > 0 && widthInput > 0) {
        return parseFloat(lengthInput) * parseFloat(widthInput);
    }
    return 0;
}

// Função principal de cálculo
document.getElementById('calculateBtn').addEventListener('click', function(e) {
    e.preventDefault();
    
    const materialType = document.getElementById('materialType').value;
    const wasteFactor = parseFloat(document.getElementById('wasteFactor').value) / 100;
    const area = calcularArea();
    
    if (area <= 0) {
        alert('Por favor, informe as dimensões válidas (comprimento e largura).');
        return;
    }

    let results = '';
    let totalCost = 0;

    if (materialType === 'ceramica' || materialType === 'azulejo') {
        const tileType = document.getElementById('tileType').value;
        let tileWidth, tileHeight;
        
        if (tileType === 'personalizado') {
            tileWidth = parseFloat(document.getElementById('customWidth').value);
            tileHeight = parseFloat(document.getElementById('customHeight').value);
        } else {
            const [width, height] = tileType.split('x').map(n => parseInt(n));
            tileWidth = width;
            tileHeight = height;
        }

        if (!tileWidth || !tileHeight || isNaN(tileWidth) || isNaN(tileHeight)) {
            alert('Por favor, informe as dimensões da cerâmica/azulejo.');
            return;
        }

        const tileArea = (tileWidth * tileHeight) / 10000;
        const tilesNeeded = area / tileArea;
        const tilesWithWaste = tilesNeeded * (1 + wasteFactor);
        const boxesNeeded = Math.ceil(tilesWithWaste / 10);

        const unitPrice = materialType === 'ceramica' ? 25 : 18;
        const totalPrice = boxesNeeded * unitPrice * 10;

        results += `
            <div class="results-item">
                <span>Material:</span>
                <span class="results-value">${materialType === 'ceramica' ? 'Cerâmica' : 'Azulejo'}</span>
            </div>
            <div class="results-item">
                <span>Dimensões:</span>
                <span class="results-value">${tileWidth}×${tileHeight} cm</span>
            </div>
            <div class="results-item">
                <span>Área por peça:</span>
                <span class="results-value">${tileArea.toFixed(4)} m²</span>
            </div>
            <div class="results-item">
                <span>Peças necessárias:</span>
                <span class="results-value">${Math.ceil(tilesNeeded)}</span>
            </div>
            <div class="results-item">
                <span>Com perda (${(wasteFactor*100)}%):</span>
                <span class="results-value">${Math.ceil(tilesWithWaste)}</span>
            </div>
            <div class="results-item">
                <span>Caixas necessárias:</span>
                <span class="results-value">${boxesNeeded}</span>
            </div>
        `;

        totalCost = totalPrice;
    }
    else if (materialType === 'blocos') {
        const blockType = document.getElementById('blockType').value;
        let blockWidth, blockHeight, blockLength;
        
        if (blockType === 'personalizado') {
            blockWidth = parseFloat(document.getElementById('blockWidth').value);
            blockHeight = parseFloat(document.getElementById('blockHeight').value);
            blockLength = 39;
        } else {
            const [width, height] = blockType.split('x').map(n => parseInt(n));
            blockWidth = width;
            blockHeight = height;
            blockLength = 39;
        }

        if (!blockWidth || !blockHeight || isNaN(blockWidth) || isNaN(blockHeight)) {
            alert('Por favor, informe as dimensões do bloco.');
            return;
        }

        const height = parseFloat(document.getElementById('height').value) || 2.8;
        const wallArea = area * height;
        const blockArea = (blockLength * blockHeight) / 10000;
        const blocksNeeded = wallArea / blockArea;
        const blocksWithWaste = blocksNeeded * (1 + wasteFactor);
        const paletsNeeded = Math.ceil(blocksWithWaste / 50);

        const unitPrice = 1.80;
        const totalPrice = paletsNeeded * unitPrice * 50;

        results += `
            <div class="results-item">
                <span>Material:</span>
                <span class="results-value">Blocos</span>
            </div>
            <div class="results-item">
                <span>Dimensões:</span>
                <span class="results-value">${blockWidth}×${blockHeight}×${blockLength} cm</span>
            </div>
            <div class="results-item">
                <span>Altura parede:</span>
                <span class="results-value">${height} m</span>
            </div>
            <div class="results-item">
                <span>Área parede:</span>
                <span class="results-value">${wallArea.toFixed(2)} m²</span>
            </div>
            <div class="results-item">
                <span>Área por bloco:</span>
                <span class="results-value">${blockArea.toFixed(4)} m²</span>
            </div>
            <div class="results-item">
                <span>Blocos necessários:</span>
                <span class="results-value">${Math.ceil(blocksNeeded)}</span>
            </div>
            <div class="results-item">
                <span>Com perda (${(wasteFactor*100)}%):</span>
                <span class="results-value">${Math.ceil(blocksWithWaste)}</span>
            </div>
            <div class="results-item">
                <span>Palets necessários:</span>
                <span class="results-value">${paletsNeeded}</span>
            </div>
        `;

        totalCost = totalPrice;
    }
    else if (materialType === 'tinta') {
        const paintType = document.getElementById('paintType').value;
        const coats = parseInt(document.getElementById('coats').value);
        const totalArea = area * coats;
        
        let coverage = 30;
        let containerSize, containerPrice;
        
        switch(paintType) {
            case 'lata18':
                containerSize = 18;
                containerPrice = 180;
                break;
            case 'lata36':
                containerSize = 3.6;
                containerPrice = 45;
                break;
            case 'galao36':
                containerSize = 3.6;
                containerPrice = 42;
                break;
            case 'balde18':
                containerSize = 18;
                containerPrice = 170;
                break;
        }
        
        const totalLitersNeeded = totalArea / coverage;
        const litersWithWaste = totalLitersNeeded * (1 + wasteFactor);
        const containersNeeded = Math.ceil(litersWithWaste / containerSize);
        const totalPrice = containersNeeded * containerPrice;

        results += `
            <div class="results-item">
                <span>Material:</span>
                <span class="results-value">Tinta</span>
            </div>
            <div class="results-item">
                <span>Recipiente:</span>
                <span class="results-value">${paintType === 'lata18' ? 'Lata 18L' : 
                   paintType === 'lata36' ? 'Lata 3,6L' :
                   paintType === 'galao36' ? 'Galão 3,6L' : 'Balde 18L'}</span>
            </div>
            <div class="results-item">
                <span>Demãos:</span>
                <span class="results-value">${coats}</span>
            </div>
            <div class="results-item">
                <span>Área total:</span>
                <span class="results-value">${totalArea.toFixed(2)} m²</span>
            </div>
            <div class="results-item">
                <span>Rendimento:</span>
                <span class="results-value">${coverage} m²/L</span>
            </div>
            <div class="results-item">
                <span>Litros necessários:</span>
                <span class="results-value">${totalLitersNeeded.toFixed(2)} L</span>
            </div>
            <div class="results-item">
                <span>Com perda (${(wasteFactor*100)}%):</span>
                <span class="results-value">${litersWithWaste.toFixed(2)} L</span>
            </div>
            <div class="results-item">
                <span>Recipientes:</span>
                <span class="results-value">${containersNeeded}</span>
            </div>
        `;

        totalCost = totalPrice;
    }

    // Atualizar resultados
    document.getElementById('resultsContent').innerHTML = results;
    document.getElementById('totalCost').textContent = `R$ ${totalCost.toFixed(2)}`;
    
    // Alternar as seções
    inputSection.style.display = "none";
    resultsSection.style.display = "block";
    
    // Forçar atualização do layout para dispositivos móveis
    setTimeout(() => {
        resultsSection.style.opacity = "1";
    }, 10);
});

// Botão de voltar
document.getElementById('backBtn').addEventListener('click', function() {
    resultsSection.style.display = "none";
    inputSection.style.display = "block";
});

// Inicializar com cerâmica selecionado
document.getElementById('materialType').dispatchEvent(new Event('change'));

// Ajustes para dispositivos móveis
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se é dispositivo móvel
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Ajustar a posição inicial do formulário para dispositivos móveis
        form.style.top = "20px";
    }
});

// Prevenir o scroll do body quando o formulário estiver aberto em dispositivos móveis
form.addEventListener('touchstart', function(e) {
    if (form.style.left !== "-300px") {
        e.stopPropagation();
    }
});

mascara.addEventListener('touchstart', function(e) {
    esconderForm();
    e.stopPropagation();
});