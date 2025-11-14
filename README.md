
# Trabalho Prático 07 - Semanas 13 e 14

A partir dos dados cadastrados na etapa anterior, vamos trabalhar formas de apresentação que representem de forma clara e interativa as informações do seu projeto. Você poderá usar gráficos (barra, linha, pizza), mapas, calendários ou outras formas de visualização. Seu desafio é entregar uma página Web que organize, processe e exiba os dados de forma compreensível e esteticamente agradável.

Com base nos tipos de projetos escolhidos, você deve propor **visualizações que estimulem a interpretação, agrupamento e exibição criativa dos dados**, trabalhando tanto a lógica quanto o design da aplicação.

Sugerimos o uso das seguintes ferramentas acessíveis: [FullCalendar](https://fullcalendar.io/), [Chart.js](https://www.chartjs.org/), [Mapbox](https://docs.mapbox.com/api/), para citar algumas.

## Informações do trabalho

- Nome: Pedro Henrique Bernardo Nunes
- Matricula: 899758
- Proposta de projeto escolhida: Desliga AI - Equilíbrio Digital
- Breve descrição sobre seu projeto: Plataforma de conscientização sobre vício em vídeos curtos e uso excessivo de redes sociais, oferecendo artigos, dicas práticas e análises visuais dos dados.

## Implementação - Análise com Chart.js

### Descrição da Funcionalidade

Esta implementação adiciona uma página de análise que utiliza **Chart.js** para gerar uma visão comparativa entre a extensão textual do conteúdo dos itens e a quantidade de dicas fornecidas. A análise é inteiramente derivada do array `itemsData` existente em `app.js`, evitando duplicação de dados.

**Métricas analisadas:**
- **Nº de Palavras**: Soma total de palavras das seções do conteúdo (introduction, mainContent, impact, solution)
- **Nº de Dicas**: Quantidade de itens no array `tips` de cada artigo

**Objetivo**: Oferecer ao usuário e ao avaliador uma visualização rápida e objetiva sobre quais itens têm conteúdo mais aprofundado e quais oferecem mais suporte prático (dicas).

### Arquivos Criados/Modificados

- ✅ `public/analise.html` - Página HTML com estrutura para exibição do gráfico
- ✅ `public/analise.js` - Script JavaScript que processa `itemsData` e inicializa Chart.js
- ✅ `public/index.html` - Adicionado link "Análise" no menu de navegação

### Tecnologias Utilizadas

- **Chart.js 4.4.0** (via CDN) - Biblioteca para criação de gráficos interativos
- **Bootstrap 5.3.0** - Framework CSS (já existente no projeto)
- **JavaScript Vanilla** - Processamento de dados e lógica de negócio

### Funcionalidades Implementadas

1. **Processamento Automático de Dados**: Lê `itemsData` de `app.js` e extrai métricas
2. **Contagem de Palavras**: Algoritmo que soma palavras de todas as seções do conteúdo
3. **Gráfico de Barras Interativo**: Visualização comparativa com tooltips e legendas
4. **Tratamento de Erros**: Mensagens claras caso dados não estejam disponíveis
5. **Botão de Recarregar**: Permite atualizar o gráfico sem recarregar a página
6. **Design Responsivo**: Adaptação para diferentes tamanhos de tela

### Como Testar

1. Abra `public/index.html` no navegador
2. Clique no link "Análise" no menu de navegação
3. O gráfico será renderizado automaticamente mostrando a comparação entre palavras e dicas
4. Use o botão "Recarregar Dados" para reprocessar e atualizar o gráfico

### Prints da Implementação

**Cenário 1 - Dados Padrão:**
![Análise - Cenário 1](img/print_analise_cenario1.png)
*Visualização inicial com os 3 artigos padrão do projeto*

**Cenário 2 - Após Edição (Conteúdo Longo):**
![Análise - Cenário 2](img/print_analise_cenario2.png)
*Visualização após edição de um artigo com conteúdo mais extenso*

> **Nota**: Os prints devem ser capturados manualmente após testar a funcionalidade. Salve as imagens na pasta `img/` com os nomes especificados acima.

### Estrutura de Dados Processada

O script `analise.js` processa cada item do array `itemsData` seguindo esta lógica:

```javascript
Para cada item em itemsData:
  - labels.push(item.title)
  - numDicas = item.tips.length
  - numPalavras = soma de palavras de:
      * item.content.introduction
      * item.content.mainContent
      * item.content.impact
      * item.content.solution
```

### Melhorias Futuras Sugeridas

- Adicionar um terceiro dataset (ex.: número médio de palavras por dica)
- Inserir legenda interativa que ao clicar filtre itens no gráfico
- Converter o gráfico de barras para barras empilhadas ou radar para análises alternativas
- Conectar ao JSON Server via `fetch('/items')` para leitura dinâmica e atualização sem recarregar a página
- Integrar FullCalendar ou Mapbox em outra entrega caso sejam adicionados campos de data ou localização nos dados

### Comentários Técnicos

- O arquivo `analise.js` deve ser carregado **após** `app.js` para garantir que `itemsData` esteja disponível
- A contagem de palavras utiliza `split(/\s+/)` que é adequado para português, mas pode ter limitações com idiomas mais complexos
- O gráfico é totalmente responsivo e se adapta ao tamanho do container
- Tratamento de erros robusto para casos onde `itemsData` não está definido ou está vazio
