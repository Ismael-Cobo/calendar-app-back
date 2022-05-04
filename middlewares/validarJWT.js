const { response, request } = require('express')
const jwt = require('jsonwebtoken')


const validarJWT = ( req = request, res = response, next ) => {

    // Recibir el jwt
    // en los headers x-token

    const token = req.header('x-token')

    if( !token ) {
        res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición',
            token: 1
        })
    }

    try {

        const { uid, name } = jwt.verify(token, process.env.SECRET_JWT_SEED)
        
        // Le paso el uid y el name a la request para poder tener el token
        req.uid = uid
        req.name = name


    } catch (error) {
        console.log(error)
        res.status(401).json({
            ok: false,
            msg: 'El token no es válido'
        })
    }

    next()
}

module.exports = {
    validarJWT
}