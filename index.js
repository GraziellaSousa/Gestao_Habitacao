
const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
const port = 8080;
const path = require('path');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const methodOverride = require('method-override');
app.use(methodOverride('_method'));// Usando o method-override para permitir PUT no formulário


app.set('view engine', 'ejs');  // Definindo EJS como motor de template
app.set('views', path.join(__dirname, 'views'));  // Definindo a pasta onde os templates EJS ficarão

//conexão com o banco
mongoose.connect('mongodb+srv://graziellaaraujo07:753159@cluster0.rcnrw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));

//reflete a estrutura do banco (cria a tabela)
const Propriedade = mongoose.model('Propriedade', {
    endereco: String,
    tipo: String,
    quartos: Number,
    banheiro: Number,
    aluguel: Number,
    disponivel: Boolean,
    imagem_url: String,
});

const Contratos = mongoose.model('Contratos', {
    idPropriedade: String,
    inquilino: String,
    dataInicio: Date,
    dataFim: Date,
    valorPropriedade: Number,
    status: Boolean,
});

const Pagamento = mongoose.model('Pagamento', {
    idContrato: String,
    valorPago: Number,
    dataPagamento: Date,
    situacao: String,
});

// Exibir propriedades
app.get("/Propriedades", async (req, res) => {
    const propriedades = await Propriedade.find();
    res.render('propriedades', { propriedades });
});

// Exibir contratos
app.get("/Contratos", async (req, res) => {
    try {
        // 1. Consulta todos os contratos
        const contratos = await Contratos.find();

        // 2. Para cada contrato, buscar as informações da propriedade usando o idPropriedade
        for (let contrato of contratos) {
            // Buscando a Propriedade associada a esse contrato
            const propriedade = await Propriedade.findById(contrato.idPropriedade);
            contrato.propriedade = propriedade;  // Adicionando as informações da propriedade ao contrato
        }

        // 3. Renderiza os contratos e as propriedades associadas
        res.render('contratos', { contratos });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao carregar contratos');
    }
});

// Exibir pagamentos
app.get("/Pagamentos", async (req, res) => {
    const pagamentos = await Pagamento.find();
    res.render('pagamentos', { pagamentos });
});

app.get('/Propriedades/Cadastrar', (req, res) => {
    res.render('cadastroPropriedade'); // Aqui, você precisa ter um arquivo cadastrarPropriedade.ejs ou a lógica necessária
});

// Rota para exibir o formulário de edição da propriedade
app.get('/Propriedades/Editar/:id', async (req, res) => {
    const propriedadeId = req.params.id;

    try {
        // Buscando a propriedade no banco de dados
        const propriedade = await Propriedade.findById(propriedadeId);

        if (!propriedade) {
            return res.status(404).send('Propriedade não encontrada.');
        }

        // Renderiza a página de edição, passando os dados da propriedade
        res.render('editarPropriedade', { propriedade });
    } catch (err) {
        return res.status(500).send('Erro ao buscar a propriedade.');
    }
});

// Rota para exibir a página de confirmação de exclusão
app.get('/Propriedades/Excluir/:id', async (req, res) => {
    const propriedadeId = req.params.id;

    try {
        // Buscando a propriedade no banco de dados
        const propriedade = await Propriedade.findById(propriedadeId);

        if (!propriedade) {
            return res.status(404).send('Propriedade não encontrada.');
        }

        // Renderizando a página de confirmação de exclusão
        res.render('excluirPropriedade', { propriedade });
    } catch (err) {
        return res.status(500).send('Erro ao buscar a propriedade.');
    }
});

// Rota para exibir o formulário de cadastro de contrato com os dados da propriedade
app.get('/Contratos/Cadastrar/:idPropriedade', async (req, res) => {
    try {
        const propriedadeId = req.params.idPropriedade;
        const propriedade = await Propriedade.findById(propriedadeId);

        if (!propriedade) {
            return res.status(404).send('Propriedade não encontrada');
        }

        // Renderiza o formulário de cadastro de contrato, passando os dados da propriedade
        res.render('cadastrarContrato', { propriedade });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao carregar dados para cadastro de contrato');
    }
});



// Rota para exibir o formulário de edição de contrato
app.get('/Contratos/Editar/:id', async (req, res) => {
    const contratoId = req.params.id;

    try {
        // Buscando o contrato pelo ID
        const contrato = await Contratos.findById(contratoId).populate('idPropriedade'); // Populando a propriedade associada, caso necessário

        if (!contrato) {
            return res.status(404).send('Contrato não encontrado');
        }

        // Renderizando a página de edição, passando os dados do contrato e da propriedade
        res.render('editarContrato', { contrato });
    } catch (err) {
        console.error(err);
        return res.status(500).send('Erro ao carregar dados para edição do contrato');
    }
});



// Rota para exibir detalhes da Propriedade e Contrato, incluindo o Pagamento
app.get("/Contratos/Detalhes/:id", async (req, res) => {
    try {
        // 1. Buscar o contrato pelo ID
        const contrato = await Contratos.findById(req.params.id);

        if (!contrato) {
            return res.status(404).send('Contrato não encontrado');
        }

        // 2. Buscar a propriedade associada ao contrato
        const propriedade = await Propriedade.findById(contrato.idPropriedade);

        if (!propriedade) {
            return res.status(404).send('Propriedade não encontrada');
        }

        // 3. Buscar o pagamento associado ao contrato
        const pagamento = await Pagamento.findOne({ idContrato: contrato._id });

        // 4. Passar o contrato, a propriedade e o pagamento para a view
        res.render('detalhesContrato', { contrato, propriedade, pagamento });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao carregar os detalhes do contrato');
    }
});

// Rota para exibir o formulário de edição do pagamento
app.get("/Pagamentos/Editar/:id", async (req, res) => {
    try {
        // 1. Buscar o pagamento pelo ID
        const pagamento = await Pagamento.findById(req.params.id);

        if (!pagamento) {
            return res.status(404).send('Pagamento não encontrado');
        }

        // 2. Buscar o contrato associado ao pagamento
        const contrato = await Contratos.findById(pagamento.idContrato);

        if (!contrato) {
            return res.status(404).send('Contrato não encontrado');
        }

        // 3. Passar os dados do pagamento e contrato para o formulário de edição
        res.render('editarPagamento', { pagamento, contrato });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao carregar os dados para edição');
    }
});




// Rota para processar o cadastro da nova propriedade
app.post('/Propriedades/Cadastrar', async (req, res) => {
    const { endereco, tipo, quartos, banheiro, aluguel, disponivel, imagem_url } = req.body;

    // Criar a nova propriedade a ser salva no banco
    const novaPropriedade = new Propriedade({
        endereco,
        tipo,
        quartos: parseInt(quartos),
        banheiro: parseInt(banheiro),
        aluguel: parseFloat(aluguel),
        disponivel: disponivel === 'true', // Convertendo string para booleano
        imagem_url: imagem_url || null, // URL da imagem (se fornecida)
    });

    try {
        // Salvar a nova propriedade no banco
        await novaPropriedade.save();
        res.redirect('/Propriedades');
    } catch (err) {
        res.status(500).send('Erro ao salvar a propriedade no banco de dados');
    }
});

//cadastro de novo contrato
app.post("/Contratos/Cadastrar", async (req, res) => {
    try {
        const { idPropriedade, inquilino, dataInicio, dataFim, valorPropriedade, status } = req.body;

        // Verificar se a propriedade está disponível
        const propriedade = await Propriedade.findById(idPropriedade);

        if (!propriedade) {
            return res.status(404).send('Propriedade não encontrada');
        }

        if (!propriedade.disponivel) {
            // Se a propriedade não estiver disponível, renderizar a página com um alerta
            return res.render('cadastrarContrato', {
                mensagemErro: 'A propriedade selecionada não está disponível para aluguel.',
                propriedade: propriedade // Enviar a propriedade de volta ao formulário
            });
        }

        // Criar o novo contrato
        const novoContrato = new Contratos({
            idPropriedade: idPropriedade,
            inquilino: inquilino,  // Nome do inquilino
            dataInicio: new Date(dataInicio),
            dataFim: new Date(dataFim),
            valorPropriedade: parseFloat(valorPropriedade),
            status: status === 'true', // Convertendo para booleano
        });

        // Salvar o contrato no banco de dados
        await novoContrato.save();

        // Criar o pagamento associado ao contrato
        const novoPagamento = new Pagamento({
            idContrato: novoContrato._id,  // ID do contrato recém-criado
            valorPago: parseFloat(valorPropriedade),  // Valor do contrato
            dataPagamento: new Date(),  // Data de hoje
            situacao: 'Pendente'  // Situação inicial
        });

        // Salvar o pagamento no banco
        await novoPagamento.save();

        // Atualizar a propriedade para "indisponível" após a criação do contrato
        await Propriedade.findByIdAndUpdate(idPropriedade, { disponivel: false });

        // Redireciona para a página de contratos ou outra página relevante
        res.redirect('/Contratos');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao cadastrar o contrato');
    }
});


app.post("/Pagamentos/Cadastrar", async (req, res) => {
    try {
        const novoPagamento = new Pagamento({
            idContrato: req.body.idContrato,
            valorPago: req.body.valorPago,
            dataPagamento: req.body.dataPagamento,
            situacao: req.body.situacao,

        })
        await novoPagamento.save();
        return res.status(201).send(novoPagamento);
    } catch {
        res.status(500).send({ message: 'Erro ao salvar o item', error });
    }
});

// Rota para processar a exclusão da propriedade
app.post('/Propriedades/Excluir/:id', async (req, res) => {
    const propriedadeId = req.params.id;

    try {
        // Encontre e remova a propriedade do banco de dados
        const propriedadeDeletada = await Propriedade.findByIdAndDelete(propriedadeId);

        if (!propriedadeDeletada) {
            return res.status(404).send('Propriedade  não encontrada.');
        }

        // Redireciona para a lista de propriedades após a exclusão
        res.redirect('/Propriedades');
    } catch (err) {
        return res.status(500).send('Erro ao excluir a propriedade.');
    }
});



//atualizar a propriedade
app.post('/Propriedades/Atualizar/:id', async (req, res) => {//usando POST pois pelo formulário HTML não consegui usar PUT
    const propriedadeId = req.params.id;
    const { endereco, tipo, quartos, banheiro, aluguel, disponivel, imagem_url } = req.body;

    try {
        // Atualizando a propriedade no banco de dados
        const propriedadeAtualizada = await Propriedade.findByIdAndUpdate(
            propriedadeId,
            {
                endereco,
                tipo,
                quartos: parseInt(quartos),
                banheiro: parseInt(banheiro),
                aluguel: parseFloat(aluguel),
                disponivel: disponivel === 'true', // Convertendo string 'true' ou 'false' para booleano
                imagem_url
            },
            { new: true } // Para garantir que o documento retornado seja o atualizado
        );

        if (!propriedadeAtualizada) {
            return res.status(404).send('Propriedade não encontrada.');
        }

        // Redireciona para a página de propriedades após a atualização
        res.redirect('/Propriedades');
    } catch (err) {
        return res.status(500).send('Erro ao atualizar a propriedade.');
    }
});


// Atualizar contrato
app.post("/Contratos/Atualizar/:id", async (req, res) => {
    const contratoId = req.params.id;
    const { inquilino, dataInicio, dataFim, valorPropriedade, status } = req.body;

    try {
        // Atualizando o contrato no banco de dados
        const contratoAtualizado = await Contratos.findByIdAndUpdate(
            contratoId,
            {
                inquilino,
                dataInicio: new Date(dataInicio),
                dataFim: new Date(dataFim),
                valorPropriedade: parseFloat(valorPropriedade),
                status: status === 'true', // Convertendo para booleano
            },
            { new: true } // Retorna o contrato atualizado
        );

        if (!contratoAtualizado) {
            return res.status(404).send('Contrato não encontrado.');
        }

        // Redireciona para a página de contratos após a atualização
        res.redirect('/Contratos');
    } catch (err) {
        console.error(err);
        return res.status(500).send('Erro ao atualizar o contrato.');
    }
});


// Rota para atualizar as informações de pagamento
app.post("/Pagamentos/Editar/:id", async (req, res) => {
    try {
        // 1. Buscar o pagamento pelo ID
        const pagamento = await Pagamento.findById(req.params.id);

        if (!pagamento) {
            return res.status(404).send('Pagamento não encontrado');
        }

        // 2. Atualizar os dados do pagamento
        pagamento.valorPago = req.body.valorPago;
        pagamento.dataPagamento = req.body.dataPagamento;
        pagamento.situacao = req.body.situacao;

        // 3. Salvar as alterações
        await pagamento.save();

        // 4. Redirecionar para a página de detalhes ou de lista de pagamentos
        res.redirect("/Pagamentos");
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao atualizar o pagamento');
    }
});


app.listen(port, () => {
    console.log('App Running on port', port);
});