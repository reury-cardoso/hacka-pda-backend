import fs from 'fs';
import path from 'path';
import sequelize from '../db/db.js';
import Hotel from './models/Hotel.js';

const importarDados = async () => {
  try {
   
    await Hotel.sync({ force: true }); 
    console.log('Tabela Hotels recriada com sucesso!');

   
    const sql = fs.readFileSync(path.resolve('src','data', 'Hotels_202411222154.sql'), 'utf-8');

    
    await sequelize.query(sql);

    console.log('Dados inseridos com sucesso!');
  } catch (error) {
    console.error('Erro ao importar dados:', error);
  }
};

importarDados();