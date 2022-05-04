const { response } = require('express')
const bcrypt = require('bcryptjs')
const Usuario = require('../models/Usuario')
const { generarJWT } = require('../helpers/jwt')

const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body

    try {

        let usuario = await Usuario.findOne({ email })


        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario ya existe con ese correo'
            })
        }

        usuario = new Usuario(req.body)

        // Encriptar pass
        const salt = bcrypt.genSaltSync()
        usuario.password = bcrypt.hashSync(password, salt)


        await usuario.save()

        //Generar el jwt
        const token = await generarJWT(usuario.id, usuario.name)

        res.status(201).json({
            ok: true,
            msg: 'register',
            uid: usuario.id,
            name: usuario.name,
            token
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }
}

const loginUsuario = async (req, res = response) => {

    const { email, password } = req.body

    try {

        const usuario = await Usuario.findOne({ email })

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese correo'
            })
        }

        //confirmar passwords

        const validPassword = bcrypt.compareSync(password, usuario.password)

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Las credenciales no son correctas'
            })
        }

        //Generar el jwt
        const token = await generarJWT(usuario.id, usuario.name)


        res.status(200).json({
            ok: true,
            msg: 'Login correcto',
            email,
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador',
        })
    }
}

const revalidarToken = async (req, res = response) => {

    try {
        const { uid, name } = req

        // Generar el token
        const token = await generarJWT(uid, name)

        res.status(201).json({
            ok: true,
            token,
            uid,
            name
        })
    } catch {
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }
}


module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}