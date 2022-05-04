const mongoose = require('mongoose')


const dbConexion = async() => {
    
    try {
        await mongoose.connect(process.env.DB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        console.log('DB online')

    } catch (error) {
        console.log(error)
        throw new Error('Error a la hora de iniciar BD')
    }
}

module.exports = {
    dbConexion
}