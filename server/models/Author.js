const mongoose = require('mongoose');

const AuthorSchema = new mongoose.Schema({
    name: String,
    age: Number,
    books: [mongoose.SchemaTypes.ObjectId]
});

module.exports = mongoose.model('author', AuthorSchema);