import fetch from 'node-fetch';
import fs from 'fs';

const buscarCategoria = async (nomeHotel) => {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(nomeHotel)}&format=json`;

  try {
    console.log(`Consultando: ${url}`);
    const response = await fetch(url);
    const data = await response.json();

    console.log('Resposta:', data);
    
    if (data && data.length > 0) {
      const tipo = data[0].type; 
      return tipo;
    }

    if (data && data.length > 0) {
      return 'Encontrado no OSM';
    }

    return 'Não encontrado no OSM';
  } catch (error) {
    console.error('Erro ao buscar categoria:', error);
    return 'Erro';
  }
};


const classificarPrimeiroHotel = async (arquivoSQL) => {

  const sql = fs.readFileSync(arquivoSQL, 'utf-8');
  console.log(sql); 


  const regex = /VALUES\s*\(\s*'(.*?)'\s*,/g;
  const match = regex.exec(sql);

  if (match) {
    const nomeHotel = match[1]; 
    console.log(`Nome do hotel: ${nomeHotel}`);


    const categoria = await buscarCategoria(nomeHotel);

    console.log(`${nomeHotel} - Categoria: ${categoria}`);
  } else {
    console.log('Nenhum hotel encontrado no SQL.');
  }
};


classificarPrimeiroHotel('data/Hotels_202411222154.sql');
