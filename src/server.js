/*require('dotenv').config();


const app = require('./app');
const { connect } = require('./database/db');
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connect();

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });

  } catch (error) {
    console.error('Erro ao iniciar servidor:', error);
  }
}

startServer();*/

require('dotenv').config();

const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});



