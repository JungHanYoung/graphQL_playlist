const mongoose = require('mongoose');

const AuthorSchema = new mongoose.Schema({
    name: String,
    age: Number,
    books: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'book'
    }]
});

module.exports = mongoose.model('author', AuthorSchema);