const mongoose = require('mongoose');

// const aluguel= new mongoose.Schema({
//     idPropriedade: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Propriedade',
//         required: true
//     },
//     inquilino: {
//         type: String,
//         required: true
//     },
//     dataInicio: {
//         type: Date,
//         required: true
//     },
//     dataFim: {
//         type: Date,
//         required: true
//     },
//     valorAluguel: {
//         type: Number,
//         required: truewhats
//     },
//     status: {
//         type: String,
//         enum: ['Ativo', 'Encerrado'],
//         default: 'Ativo'
//     }
// }, { timestamps: true });

// const Aluguel = mongoose.model('Contrato', aluguel);



// module.exports = Contrato;


//conexão com o banco
mongoose.connect('mongodb+srv://graziellaaraujo07:753159@cluster0.rcnrw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(()=> console.log('Connected to MongoDB'))
    .catch((error)=>console.error('MongoDB connection error:' , error));
    
    //reflete a estrutura do banco (cria a tabela)
    const Lanches = mongoose.model('Lanches', {
    nome: String,
    peso: Number,
    ingredientes: String,
    preco: Number,
    imagem_url: String
    });    
