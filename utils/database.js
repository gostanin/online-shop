const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const dotenv = require('dotenv');
dotenv.config();

let _db;

const mongoConnect = (callback) => {
    MongoClient.connect(`mongodb+srv://***REMOVED***:${process.env.DB_PSW}@cluster0.dpwzp.mongodb.net/***REMOVED***`)
        .then(client => {
            console.log('Connected')
            _db = client.db();
            callback();
        })
        .catch(error => console.log(error));

}

const getDb = () => {
    if(_db) {
        return _db;
    }
    throw 'No database found';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

