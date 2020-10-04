const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const dotenv = require('dotenv');
dotenv.config();

const mongoConnect = (callback) => {
    MongoClient.connect(`mongodb+srv://***REMOVED***:${process.env.DB_PSW}@cluster0.dpwzp.mongodb.net/***REMOVED***`)
        .then(client => {
            console.log('Connected')
            callback(client);
        })
        .catch(error => console.log(error));

}

module.exports = mongoConnect;

