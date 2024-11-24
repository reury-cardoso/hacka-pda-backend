# 📚 Documentação da API de Categorização de Hotéis 🌍

## 🚀 Visão Geral

Esta API tem como objetivo categorizar hotéis de forma automática, analisando suas descrições e nomes. Utiliza a biblioteca **string-similarity-js** para comparar as descrições com palavras-chave específicas de cada categoria e também integra uma **API de geolocalização** (Nominatim OpenStreetMap) para buscar a localização do hotel e definir a categoria mais adequada.

## 🔍 Funcionalidades

1. **Categorização por Descrição** 📝:
   - A API analisa a descrição do hotel e verifica a presença de palavras-chave relacionadas a uma categoria específica (ex: "luxo", "spa", "piscina" para "Resort").
   - Se palavras-chave coincidirem, a categoria é atribuída diretamente ao hotel.

2. **Categorização com Localização** 🌍:
   - A API consulta o nome do hotel na **API de geolocalização Nominatim OpenStreetMap**.
   - Se encontrar o hotel com base na localização, a categoria será automaticamente definida como **"Hotel"**.

3. **Categorização Automática para Banco de Dados** 💾:
   - A API percorre os dados de todos os hotéis no banco de dados e categoriza cada um de acordo com o nome e descrição, podendo **atualizar automaticamente a categoria no banco de dados**.

## 🛠 Como Usar

### 📤 Entrada:
- **Nome do Hotel** (ex: "Hotel Luxo Spa")
- **Descrição do Hotel** (ex: "Um hotel 5 estrelas com spa e piscina")

### 🏷️ Saída:
- Categoria do Hotel: **Resort**, **Hotel Fazenda**, **Hostel**, **Pousada**, **Hotel**, etc.

### 🎯 Objetivo:
- Organizar e categorizar automaticamente hotéis em seu banco de dados, facilitando a busca e o gerenciamento.

## 🔄 Como Funciona

1. **Busca de Categoria por Descrição**:
   - A API verifica se o nome ou a descrição do hotel contém palavras-chave que correspondem a uma das categorias definidas (como **Resort** ou **Hotel Fazenda**). Exemplo: "luxo", "spa", "fazenda", entre outros. Se a busca por localização não encontrar resultados, a API faz uma comparação de similaridade entre a descrição do hotel e as palavras-chave de cada categoria. O algoritmo da lib **string-similarity** ajuda a calcular a correspondência mais próxima.

2. **Busca por Localização**:
   - A API usa o nome do hotel para consultar a **API de Geolocalização Nominatim OpenStreetMap**. Se a localização for encontrada, o hotel é automaticamente classificado como **"Hotel"**.
