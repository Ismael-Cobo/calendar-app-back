/**
 * Rutas de los eventos
 * host + /api/events
 */

const { Router } = require('express')
const { check } = require('express-validator')
const { 
    getEventos,
    crearEvento,
    actualizarEventos,
    eliminarEventos 
} = require('../controllers/events')
const { isDate } = require('../helpers/isDate')
const { validarCampos } = require('../middlewares/validarCampos')
const { validarJWT } = require('../middlewares/validarJWT')

const router = Router()

// Middleware para todas las rutas que vengan despues
router.use(validarJWT)

router.get('/', getEventos)

router.post(
    '/',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('title', 'El formato del título no es válido').isString(),
        check('start', 'La fecha de inicio es obligatoria').not().isEmpty(),
        check('start', 'El formato de la fecha no es válida').custom(isDate),
        check('end', 'La fecha de final es obligatoria').not().isEmpty(),
        check('end', 'El formato de la fecha no es válida').custom(isDate),
        validarCampos
    ],
    crearEvento)

router.put(
        '/:id',
        [
            check('title', 'El titulo es obligatorio').not().isEmpty(),
            check('title', 'El formato del título no es válido').isString(),
            check('start', 'La fecha de inicio es obligatoria').not().isEmpty(),
            check('start', 'El formato de la fecha no es válida').custom(isDate),
            check('end', 'La fecha de final es obligatoria').not().isEmpty(),
            check('end', 'El formato de la fecha no es válida').custom(isDate),
            validarCampos
        ],
        actualizarEventos)

router.delete('/:id', eliminarEventos)




module.exports = router