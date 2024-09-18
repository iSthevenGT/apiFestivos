const express = require('express');
const { esFestivo } = require('../controllers/festivosController');
const router = express.Router();

router.get('/:fecha', esFestivo);

module.exports = router;
