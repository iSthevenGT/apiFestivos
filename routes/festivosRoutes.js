const express = require('express');
const { esFestivo, obtenerFestivosPorAnio, obtenerFechasPorAnio } = require('../controllers/festivosController');

const router = express.Router();

router.get('/festivos/verificar/:fecha', esFestivo);
router.get('/festivos/obtener/:year', obtenerFestivosPorAnio);
router.get('/festivos/calendario/:year', obtenerFechasPorAnio);

module.exports = router;
