//festivosController

const { buscarFestivoFijo, obtenerFestivosPascua, obtenerFestivosPuente, obtenerFestivosExtras } = require(`../repository/festivosRepository`);

// Función para calcular el Domingo de Pascua
function calcularDomingoRamos(year) {
    const a = year % 19;
    const b = year % 4;
    const c = year % 7;
    const d = (19 * a + 24) % 30;
    const dias = d + (2 * b + 4 * c + 6 * d + 5) % 7;
    let mes = 3
    let dia = 15 + dias
    if (dia > 31) {
        dia = dia - 31
        mes = 4
    }
    return new Date(year, mes - 1, dia)
}

function agregarDias(fecha, dias) {
    const fechat = new Date(fecha)
    fechat.setDate(fechat.getDate() + dias)
    return fechat
}

function siguienteLunes(fecha) {
    let fechat = new Date(fecha)
    const diaSemana = fechat.getDay()
    if (diaSemana != 1) {
        return fechat = agregarDias(fechat, 8 - diaSemana)
    }
    return fechat
}


// Controlador para validar si una fecha es festiva
async function esFestivo(req, res) {
    const { fecha } = req.params;
    const [year, mes, dia] = fecha.split('-').map(Number);
    const fechaActual = new Date(year, mes - 1, dia);
    const inicioSemanaSanta = calcularDomingoRamos(year)
    const domingoPascua=agregarDias(inicioSemanaSanta,7);

    //formato
    if (isNaN(year) || isNaN(mes) || isNaN(dia) || mes > 12 || dia > 31 || !Number.isInteger(year) || !Number.isInteger(mes) || !Number.isInteger(dia)) {
        return res.status(400).send('Fecha no válida');
    }

    //id:1
    const festivoFijo = await buscarFestivoFijo(dia, mes);
    if (festivoFijo) {
        return res.send(`La fecha ${fecha} es festivo: ${festivoFijo.festivos[0].nombre}`);
    }

    //id 2
    const festivosPuente = await obtenerFestivosPuente()
    console.log(festivosPuente)
    for (let i = 0; i < festivosPuente.length; i++) {
        let festivoAnio = new Date(year, festivosPuente[i].mes - 1, festivosPuente[i].dia)
        let lunesFestivo = siguienteLunes(festivoAnio)
        if (fechaActual.getTime() === lunesFestivo.getTime()) {
            return res.send(`La fecha ${fecha} es festivo: ${festivosPuente[i].nombre}`)
        }
    }

    //id:3
    const festivosPascua = await obtenerFestivosPascua()
    console.log(festivosPascua)
    for (let i = 0; i < festivosPascua.length; i++) {
        const diaSanto = agregarDias(domingoPascua, festivosPascua[i].diasPascua);
        if (fechaActual.getTime() === diaSanto.getTime()) {
            return res.send(`La fecha ${fecha} es festivo: ${festivosPascua[i].nombre}`);
        }
    }

    //id:4 
    const festivosExtras = await obtenerFestivosExtras()
    console.log(festivosExtras)
    for (let i = 0; i < festivosExtras.length; i++) {
        const fechaFestivo = agregarDias(domingoPascua, festivosExtras[i].diasPascua);

        if (fechaActual.getTime() === fechaFestivo.getTime()) {
            return res.send(`La fecha ${fecha} es festivo: ${festivosExtras[i].nombre}`);
        }
    }

    res.send(`La fecha ${fecha} no es festivo.`);
}

module.exports = { esFestivo };
