//festivosRepository

const { getDB } = require('./bdRepository');

//fijos
async function buscarFestivoFijo(dia, mes) {
    const db = getDB();
    const coleccion = db.collection('tipos');
    return await coleccion.findOne({
        tipo: 'Fijo',
        festivos: { $elemMatch: { dia, mes } }
    });
}

//Puente
async function obtenerFestivosPuente() {
    const db = getDB();
    const coleccion = db.collection('tipos');
    const resultado= await coleccion.findOne({ id: 2 });
    return resultado.festivos;
}


//Pascua
async function obtenerFestivosPascua() {
    const db = getDB();
    const coleccion = db.collection('tipos');
    const resultado= await coleccion.findOne({ id: 3 });
    return resultado.festivos;
}

//extras
async function obtenerFestivosExtras() {
    const db = getDB();
    const coleccion = db.collection('tipos');
    const resultado= await coleccion.findOne({ id: 4 });
    return resultado.festivos;
}

//todos los festivos
async function obtenerFestivos() {
    const db = getDB();
    const coleccion = db.collection('tipos');
    return await coleccion.find({}).toArray();
}

module.exports = { obtenerFestivos, buscarFestivoFijo, obtenerFestivosPascua,obtenerFestivosPuente,obtenerFestivosExtras };
