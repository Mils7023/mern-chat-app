const mongoose = require('mongoose')

const ConnectDB = async() => {
    try {
        const conn = await mongoose.connect('mongodb+srv://milannariya095:OH8pZ1Tofa0p5q7j@cluster0.4aqbmc8.mongodb.net/?retryWrites=true&w=majority', {
           useNewUrlParser: true,
           useUnifiedTopology: true,
        })
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(); 
    }
}

module.exports = ConnectDB;