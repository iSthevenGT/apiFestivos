const express = require('express');
const app = express();

const { conectarDB } = require('./repository/bdRepository');
// Conectar a la base de datos
conectarDB();

const festivoRutas = require('./routes/festivosRoutes');
// Cargar las rutas
app.use('/api', festivoRutas);


const port = 3030;

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
