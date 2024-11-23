import fetch from 'node-fetch';
import fs from 'fs';

// Função para fazer a busca na API
const buscarCategoria = async (nomeHotel) => {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(nomeHotel)}&format=json`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    console.log(data);

    if (data && data.length > 0) {
      const tipos = data[0].type.toLowerCase();
      
      if (tipos.includes('hotel')) {
        return 'Hotel';
      } else if (tipos.includes('hostel')) {
        return 'Hostel';
      } else if (tipos.includes('resort')) {
        return 'Resort';
      } else if (tipos.includes('pousada') || tipos.includes('guesthouse')) {
        return 'Pousada';
      } else if (tipos.includes('apartment') || tipos.includes('flat')) {
        return 'Flat/Apart Hotel';
      } else {
        return 'Não classificado';
      }
    } else {
      return 'Não encontrado';
    }
  } catch (error) {
    console.error('Erro ao buscar categoria:', error);
    return 'Erro';
  }
};
const classificarHoteis = async (arquivoSQL) => {

  const sql = fs.readFileSync(arquivoSQL, 'utf-8');

  const regex = /INSERT INTO Hotels \(name,.*\) VALUES \(\s*'(.*?)',/g;
  let match;
  const hoteis = [];

  while ((match = regex.exec(sql)) !== null) {
    const nomeHotel = match[1];
    hoteis.push(nomeHotel);
  }

  console.log(hoteis);  

  for (let i = 0; i < hoteis.length; i++) {
    const nomeHotel = hoteis[i];
    const categoria = await buscarCategoria(nomeHotel);
    console.log(`${nomeHotel} - Categoria: ${categoria}`);
  }
};

classificarHoteis('data/Hotels_202411222154.sql');
