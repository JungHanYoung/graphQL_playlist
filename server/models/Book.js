const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    name: String,
    genre: String,
    authorId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'author'
    }
});

module.exports = mongoose.model('book', BookSchema);