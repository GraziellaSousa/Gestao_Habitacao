// models/Pagamento.js
const mongoose = require('mongoose');

const pagamentoSchema = new mongoose.Schema({
    idContrato: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contrato',
        required: true
    },
    valorPago: {
        type: Number,
        required: true
    },
    dataPagamento: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Pagamento = mongoose.model('Pagamento', pagamentoSchema);

module.exports = Pagamento;
