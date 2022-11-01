const DB_SERVER = (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging") ? "mongodb://mongo:27017/dntroster" : "mongodb://localhost:27017/dntroster"

var mongoose = require('mongoose');
mongoose.connect(DB_SERVER, (err) => {
    if (err) {
        console.error(err)
    }
});

exports.mongoose = mongoose;