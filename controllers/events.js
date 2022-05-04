const { response } = require('express')
const Eventos = require('../models/Eventos')
const { ObjectId }= require('mongodb'); 





const getEventos = async( req, res = response ) => {

    const eventos = await Eventos.find({"user" :ObjectId(req.uid)})
                                 .populate('user', ['name', 'email'])
                                 // PAra sacar información de las FK
    res.status(200).json({
        ok: true,
        eventos
    })

}

const crearEvento = async( req, res = response ) => {

    const evento = new Eventos( req.body )
    console.log(req)
    try {

        evento.user = req.uid

        const eventoGuardado = await evento.save()
        console.log(eventoGuardado)
        res.status(200).json({
            ok: true,
            evento: eventoGuardado
        })
        
    } catch (error) {
        console.log(error)

        res.status(500).json({
            ok: false,
            msg: 'Error al crear el evento, por favor contacte con el administrador'
        })
    }

}

const actualizarEventos = async( req, res = response ) => {

    const eventoId = req.params.id

    try {
        const evento = await Eventos.findById(eventoId)


        const uid = req.uid

        if( !evento ) {
            res.status(404).json({
                ok: false,
                msg: 'El evento no existe'
            })
        }
        
        if( evento.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene el privilegio de editar el evento'
            })
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }
        const eventoIdJSON = {"_id" :ObjectId(eventoId)}
        const eventoActualizado = await Eventos.findOneAndUpdate(eventoIdJSON, nuevoEvento, { new: true })
        
        let nuevoEventoActualizado = {
            ...eventoActualizado._doc,
            id: eventoActualizado._id
        }

        console.log(nuevoEventoActualizado)
        res.status(200).json({
            ok: true,
            msg: 'Evento actualizado correctamente',
            evento: nuevoEventoActualizado
        })

        

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor contacte con el administrador'
        })
    }

}

const eliminarEventos = async ( req, res = response ) => {

    const eventoId = req.params.id

    try {
        
        const evento = await Eventos.findById(eventoId)

        const uid = req.uid

        if( !evento ) {
            res.status(404).json({
                ok: false,
                msg: 'El evento no existe'
            })
        }
        
        if( evento.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene el privilegio para eliminar el evento'
            })
        }

        const eventoEliminado = {
            ...req.body,
            user: uid
        }

        await Eventos.findOneAndDelete(eventoId, eventoEliminado)
        
        res.status(200).json({
            ok: true,
            msg: 'Evento eliminado correctamente'
        })

        

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor contacte con el administrador'
        })
    }

}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEventos,
    eliminarEventos
}