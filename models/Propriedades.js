const mongoose = require('mongoose');

const propriedade= new mongoose.Schema({
    endereco: {
        type: String,
        required: true,
        trim: true
    },
    tipo: {
        type: String,
        required: true
    },
    quartos: {
        type: Number,
        required: true
    },
    aluguel: {
        type: Number,
        required: true
    },
    disponivel: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const Propriedade = mongoose.model('Propriedade', propriedade);

module.exports = Propriedade;
