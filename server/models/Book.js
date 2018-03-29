const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    name: String,
    genre: String,
    authorId: mongoose.SchemaTypes.ObjectId
});

module.exports = mongoose.model('book', BookSchema);