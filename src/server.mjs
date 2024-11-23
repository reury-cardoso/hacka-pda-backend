import fetch from 'node-fetch';
import fs from 'fs';


const buscarCategoria = async (nomeHotel) => {
  const tiposHotel = [
    { tipo: 'hotel', url: `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(nomeHotel)}+hotel&format=json` },
    { tipo: 'hostel', url: `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(nomeHotel)}+hostel&format=json` },
    { tipo: 'resort', url: `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(nomeHotel)}+resort&format=json` },
    { tipo: 'pousada', url: `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(nomeHotel)}+pousada&format=json` },
    { tipo: 'flat', url: `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(nomeHotel)}+flat&format=json` },
  ];

  try {
    for (let i = 0; i < tiposHotel.length; i++) {
      const response = await fetch(tiposHotel[i].url);
      const data = await response.json();

      console.log(data);


      if (data && data.length > 0) {
        return tiposHotel[i].tipo.charAt(0).toUpperCase() + tiposHotel[i].tipo.slice(1); 
      }
    }
    
    return 'Não classificado';
    
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
