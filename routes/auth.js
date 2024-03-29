/*
    Rutas del usurio /auth
    host + /api/auth
*/


const { Router } = require('express')
const { check } = require('express-validator')


const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth')
const { validarCampos } = require('../middlewares/validarCampos')
const { validarJWT } = require('../middlewares/validarJWT')
const router = Router()

/*
router.post('/new', crearUsuario)
*/
router.post(
        '/new', 
        [
            check('name', 'El nombre es obligatorio').not().isEmpty(),
            check('email', 'El email es obligatorio').isEmail(),
            check('password', 'La contraseña ha de tener al menos 6 caracteres').isLength({min: 6}),
            validarCampos
        ],
        crearUsuario)

router.post(
    '/',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'La contraseña ha de tener al menos 6 caracteres').isLength({min: 6}),
        validarCampos
    ],
    loginUsuario)

router.get(
        '/renew',
        [
            validarJWT
        ],
        revalidarToken)

module.exports = router