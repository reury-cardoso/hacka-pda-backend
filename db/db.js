import { Sequelize } from 'sequelize';


const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite', 
});

const testarConexao = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados foi bem-sucedida.');
  } catch (error) {
    console.error('Não foi possível conectar ao banco de dados:', error);
  }
};

testarConexao();

export default sequelize;
