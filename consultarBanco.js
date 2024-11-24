import sqlite3 from 'sqlite3';


const db = new sqlite3.Database('./src/database.sqlite', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('Erro ao abrir o banco de dados:', err);
  } else {
    console.log('Banco de dados aberto com sucesso!');
  }
});


db.all('SELECT * FROM hotels', (err, rows) => {
  if (err) {
    console.error('Erro ao consultar os dados:', err);
  } else {
    console.log('Dados encontrados:', rows);
  }
});
