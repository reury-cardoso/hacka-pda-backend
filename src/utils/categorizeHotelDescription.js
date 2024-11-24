import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import stringSimilarity from 'string-similarity';
import categories from './hotelCategories.js';

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
  } catch (error) {
    console.error('Não foi possível conectar ao banco de dados:', error);
  }
};

const getAllHotels = async () => {
  try {
    const [results, metadata] = await sequelize.query('SELECT * FROM Hotels');
    return results;
  } catch (error) {
    console.error('Erro ao buscar os dados dos hotéis:', error);
    return [];
  }
};

function categorizeHotel(name, description) {
  const normalizedName = name.toLowerCase();
  
  const normalizedDescription = description ? description.toLowerCase() : '';

  let bestMatch = { rating: 0, category: "Indefinido" };

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => normalizedName.includes(keyword))) {
      return category; 
    }
  }

  for (const [category, keywords] of Object.entries(categories)) {
    let categoryMatchScore = 0;

    for (const keyword of keywords) {
      categoryMatchScore += stringSimilarity.compareTwoStrings(normalizedDescription, keyword);
    }

    if (categoryMatchScore > bestMatch.rating) {
      bestMatch = { rating: categoryMatchScore, category };
    }
  }

  return bestMatch.category;
}

const categorizeHotelsFromDB = async () => {
  const hotels = await getAllHotels();
  
  if (hotels.length > 0) {
    hotels.forEach((hotel) => {
      const category = categorizeHotel(hotel.name, hotel.description);
      console.log(`Hotel: ${hotel.name} - Categoria: ${category}`);
    });
  } else {
    console.log('Nenhum hotel encontrado no banco de dados.');
  }
};

testConnection().then(() => {
  categorizeHotelsFromDB();
});