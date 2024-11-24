import express from 'express';
import cors from 'cors';
import hotelRoutes from './routes/hotelRoutes.js';
import sequelize from './../db/db.js'; 
import fs from 'fs';
import path from 'path';
import Hotel from './models/Hotel.js';


const app = express();
const PORT = process.env.PORT || 3000; 

app.use(cors()); 
app.use(express.json());

app.use('/api', hotelRoutes); 

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso!');

    await sequelize.sync();  
    console.log('Banco de dados sincronizado com sucesso!');

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao sincronizar o banco de dados:', error);
  }
};

const importarDados = async () => {
  try {
    await Hotel.sync({ force: true }); 
    console.log('Tabela Hotels recriada com sucesso!');

    const sqlFilePath = path.resolve('src/data', 'Hotels_202411222154.sql');
    if (fs.existsSync(sqlFilePath)) {
      const sql = fs.readFileSync(sqlFilePath, 'utf-8');
      await sequelize.query(sql);  
      console.log('Dados inseridos com sucesso!');
    } else {
      console.log('Arquivo SQL não encontrado!');
    }
  } catch (error) {
    console.error('Erro ao importar dados:', error);
  }
};

await startServer();
importarDados();
