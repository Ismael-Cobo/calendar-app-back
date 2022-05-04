const express = require('express')
const { dbConexion } = require('./database/config')
require('dotenv').config()

const cors = require('cors')

//Creando el servidor de express

const app = express()

//Database

dbConexion()

// CORS

app.use(cors())

//Directorio público

app.use(express.static('public'))



// Lectura y parseo del body
app.use( express.json() )

//Todo lo que el archivo "/routes/auth" vaya a exportar 
//la ruta /api/auth lo va a habilitar

//Rutas
app.use('/api/auth', require('./routes/auth'))
app.use('/api/events', require('./routes/events'))


//Escuchar las peticiones

app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo el el puerto ${process.env.PORT}`)
})