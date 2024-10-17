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







//calendario anio
async function esFestivoanio(req, res) {
    const { fecha } = req.params;
    const [year, mes, dia] = fecha.split('-').map(Number);
    const fechaActual = new Date(year, mes - 1, dia);
    const inicioSemanaSanta = calcularDomingoRamos(year);
    const domingoPascua = agregarDias(inicioSemanaSanta, 7);

    // Validar formato de fecha
    if (isNaN(year) || isNaN(mes) || isNaN(dia) || mes > 12 || dia > 31 || !Number.isInteger(year) || !Number.isInteger(mes) || !Number.isInteger(dia)) {
        return false;
    }

    // Comprobar festivo fijo
    const festivoFijo = await buscarFestivoFijo(dia, mes);
    if (festivoFijo) {
        return true;
    }
  
    // Comprobar festivos de puente
    const festivosPuente = await obtenerFestivosPuente();
    for (let i = 0; i < festivosPuente.length; i++) {
        let festivoAnio = new Date(year, festivosPuente[i].mes - 1, festivosPuente[i].dia);
        let lunesFestivo = siguienteLunes(festivoAnio);
        if (fechaActual.getTime() === lunesFestivo.getTime()) {
            return true;
        }
    }

    // Comprobar festivos de Pascua
    const festivosPascua = await obtenerFestivosPascua();
    for (let i = 0; i < festivosPascua.length; i++) {
        const diaSanto = agregarDias(domingoPascua, festivosPascua[i].diasPascua);
        if (fechaActual.getTime() === diaSanto.getTime()) {
            return true;
        }
    }

    // Comprobar festivos extras
    const festivosExtras = await obtenerFestivosExtras();
    for (let i = 0; i < festivosExtras.length; i++) {
        const fechaFestivo = agregarDias(domingoPascua, festivosExtras[i].diasPascua);
        if (fechaActual.getTime() === fechaFestivo.getTime()) {
            return true;
        }
    }

    return false;
}


async function obtenerFestivosPorAnio(req, res) {
    const { year } = req.params;
    const festivos = [];
    const dias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];

    for (let i = 0; i < 12; i++) {
        
        const diasEnMes = new Date(year, i + 1, 0).getDate();

        for (let j = 1; j <= diasEnMes; j++) { 
            let fecha = new Date(year, i, j);

            const reqFecha = {
                params: {
                    fecha: `${year}-${i + 1}-${j}`
                }
            };

            if (await esFestivoanio(reqFecha)) { // Asegurarme de usar await
                let festivo = {
                    fecha: `${year}-${i + 1}-${j}`,
                    tipo: 'dia festivo',
                    descripcion: `${dias[fecha.getDay()]}`
                };
                festivos.push(festivo);
            }
        }
    }

    res.json(festivos);
}

async function obtenerFechasPorAnio(req, res) {
    const { year } = req.params;
    const fechas = [];
    const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

    const pad = (n) => n < 10 ? '0' + n : n;

    for (let i = 1; i <= 12; i++) {
        const diasEnMes = new Date(year, i, 0).getDate();

        for (let j = 1; j <= diasEnMes; j++) {
            let fecha = new Date(year, i - 1, j);

            const reqFecha = {
                params: {
                    fecha: `${year}-${i}-${j}`
                }
            };

            if (await esFestivoanio(reqFecha)) {
                let festivo = {
                    fecha: `${year}-${pad(i)}-${pad(j)}`,
                    tipo: 'Dia festivo',
                    descripcion: `${dias[fecha.getDay()]}`
                };
                fechas.push(festivo);
            } else if (fecha.getDay() === 0) {
                let festivo = {
                    fecha: `${year}-${pad(i)}-${pad(j)}`,
                    tipo: 'Fin de Semana',
                    descripcion: `${dias[fecha.getDay()]}`
                };
                fechas.push(festivo);
            } else {
                let festivo = {
                    fecha: `${year}-${pad(i)}-${pad(j)}`,
                    tipo: 'Dia laboral',
                    descripcion: `${dias[fecha.getDay()]}`
                };
                fechas.push(festivo);
            }
        }
    }

    res.json(fechas);
}



module.exports = { esFestivo, obtenerFestivosPorAnio, obtenerFechasPorAnio};
