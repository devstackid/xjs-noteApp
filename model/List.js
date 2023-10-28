const mongoose = require('mongoose')

// membuat schema
const List = mongoose.model('List', {
    judul: {
        type: String,
        required: true
    },
    keterangan: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    }
});

module.exports = List;