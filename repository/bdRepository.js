//bdRepository

const { MongoClient } = require('mongodb');
const bdConfigs = require('../configs/bdConfigs.js');
const url = `mongodb://${bdConfigs.server}:${bdConfigs.port}`;

const client = new MongoClient(url);
let db;

async function conectarDB() {
   
    try {
        await client.connect();
        console.log("se ha establecido conexion a la base de datos");//prueba
        db = client.db(bdConfigs.database);
        console.log(`conectado a: ${bdConfigs.database}`);//prueba
    } catch (error) {
        console.error('Error conectando a MongoDB:', error);
        process.exit(1);
    }
}

function getDB() {
    if (!db) {
        throw new Error('La base de datos no está conectada');
    }
    return db;
}

module.exports = { conectarDB, getDB };
