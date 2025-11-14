// analise.js
// Objetivo: processar o array global `itemsData` (definido em app.js) e gerar um gráfico com Chart.js
// Requisitos: este arquivo deve ser carregado APÓS app.js e após a importação do Chart.js
// Autor: ProezaDEV - Data: 2024
// Observações: trabalhar apenas dentro de public/

// Variável global para armazenar a instância do gráfico
let chartInstance = null;

/**
 * Função contarPalavras(text):
 * - Recebe string (pode ser undefined/null); se null -> retorna 0
 * - Aplica .trim(), substitui múltiplos espaços, e faz split por \s+
 * - Retorna o tamanho do array resultante
 * - Comentário: contar palavras via split não é infalível para idiomas complexos, mas é suficiente para a atividade
 */
function contarPalavras(text) {
    if (!text || typeof text !== 'string') {
        return 0;
    }
    
    const textoLimpo = text.trim();
    if (textoLimpo === '') {
        return 0;
    }
    
    // Remove múltiplos espaços e quebra por espaços/tabs/newlines
    const palavrasArray = textoLimpo.split(/\s+/).filter(palavra => palavra.length > 0);
    return palavrasArray.length;
}

/**
 * STEP: Extrair labels e métricas do itemsData
 * - labels: array de títulos (item.title)
 * - seriePalavras: número total de palavras (somando todas as seções de content)
 * - serieDicas: item.tips.length
 * Tratar campos ausentes e arrays vazios.
 */
function processarDados() {
    // Verificar se itemsData existe
    if (typeof itemsData === 'undefined' || itemsData === null) {
        return {
            error: 'Dados não encontrados. Verifique se app.js foi carregado corretamente.',
            labels: [],
            seriePalavras: [],
            serieDicas: []
        };
    }
    
    // Verificar se itemsData está vazio
    if (!Array.isArray(itemsData) || itemsData.length === 0) {
        return {
            error: 'Nenhum item encontrado para análise.',
            labels: [],
            seriePalavras: [],
            serieDicas: []
        };
    }
    
    const labels = [];
    const seriePalavras = [];
    const serieDicas = [];
    
    // Processar cada item
    itemsData.forEach(item => {
        // Adicionar título ao array de labels
        labels.push(item.title || 'Sem título');
        
        // Contar número de dicas
        const numTips = Array.isArray(item.tips) ? item.tips.length : 0;
        serieDicas.push(numTips);
        
        // Contar palavras do conteúdo
        let numPalavras = 0;
        
        if (item.content && typeof item.content === 'object') {
            // Somar palavras de cada campo do content
            const campos = ['introduction', 'mainContent', 'impact', 'solution'];
            
            campos.forEach(campo => {
                if (item.content[campo] && typeof item.content[campo] === 'string') {
                    numPalavras += contarPalavras(item.content[campo]);
                }
            });
        }
        
        seriePalavras.push(numPalavras);
    });
    
    return {
        error: null,
        labels: labels,
        seriePalavras: seriePalavras,
        serieDicas: serieDicas
    };
}

/**
 * Função rebuildChart():
 * - Se chart já existe, chamar chart.destroy() antes de recriar
 * - Essa função permite recarregar os dados sem recarregar a página (botão 'Recarregar dados')
 * - Observação: para atualização automática via JSON Server seria necessário implementar fetch e comparar/atualizar itemsData
 */
function rebuildChart() {
    // Destruir gráfico existente se houver
    if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
    }
    
    // Reprocessar dados e criar novo gráfico
    inicializarGrafico();
}

/**
 * STEP: Inicializar Chart.js
 * - Selecionar canvas pelo id 'chartAnalise'
 * - Configurar datasets (Nº Palavras e Nº Dicas)
 * - Configurar opções: responsive, beginAtZero, tooltips, legend
 * - Após criar o chart, logar no console as arrays para fácil debug (labels, seriePalavras, serieDicas)
 */
function inicializarGrafico() {
    const canvas = document.getElementById('chartAnalise');
    const container = document.getElementById('chartAnaliseContainer');
    
    if (!canvas) {
        console.error('Canvas #chartAnalise não encontrado');
        return;
    }
    
    // Processar dados
    const dados = processarDados();
    
    // Se houver erro, exibir mensagem no DOM
    if (dados.error) {
        container.innerHTML = `
            <div class="error-message">
                <h3><i class="fas fa-exclamation-triangle"></i> Erro</h3>
                <p>${dados.error}</p>
            </div>
        `;
        return;
    }
    
    // Garantir que o canvas esteja presente no container
    if (!container.querySelector('canvas')) {
        container.innerHTML = '<canvas id="chartAnalise"></canvas>';
    }
    
    // Log para debug
    console.log('Labels:', dados.labels);
    console.log('Série Palavras:', dados.seriePalavras);
    console.log('Série Dicas:', dados.serieDicas);
    
    // Criar contexto do canvas
    const ctx = document.getElementById('chartAnalise').getContext('2d');
    
    // Configurar Chart.js
    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dados.labels,
            datasets: [
                {
                    label: 'Nº de Palavras',
                    data: dados.seriePalavras,
                    backgroundColor: 'rgba(67, 97, 238, 0.7)',
                    borderColor: 'rgba(67, 97, 238, 1)',
                    borderWidth: 2,
                    hoverBackgroundColor: 'rgba(67, 97, 238, 0.9)',
                    hoverBorderColor: 'rgba(67, 97, 238, 1)'
                },
                {
                    label: 'Nº de Dicas',
                    data: dados.serieDicas,
                    backgroundColor: 'rgba(247, 37, 133, 0.7)',
                    borderColor: 'rgba(247, 37, 133, 1)',
                    borderWidth: 2,
                    hoverBackgroundColor: 'rgba(247, 37, 133, 0.9)',
                    hoverBorderColor: 'rgba(247, 37, 133, 1)'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 14,
                            family: "'Montserrat', sans-serif"
                        },
                        padding: 15,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: {
                        size: 16,
                        family: "'Montserrat', sans-serif"
                    },
                    bodyFont: {
                        size: 14,
                        family: "'Roboto', sans-serif"
                    },
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += context.parsed.y;
                            if (context.dataset.label === 'Nº de Palavras') {
                                label += ' palavras';
                            } else {
                                label += ' dicas';
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        font: {
                            size: 12,
                            family: "'Roboto', sans-serif"
                        }
                    },
                    title: {
                        display: true,
                        text: 'Quantidade',
                        font: {
                            size: 14,
                            weight: 'bold',
                            family: "'Montserrat', sans-serif"
                        }
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 12,
                            family: "'Roboto', sans-serif"
                        }
                    },
                    title: {
                        display: true,
                        text: 'Artigos',
                        font: {
                            size: 14,
                            weight: 'bold',
                            family: "'Montserrat', sans-serif"
                        }
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// Inicializar gráfico quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar um pequeno delay para garantir que itemsData esteja disponível
    setTimeout(() => {
        inicializarGrafico();
    }, 100);
});

// Expor rebuildChart globalmente para o botão
window.rebuildChart = rebuildChart;

