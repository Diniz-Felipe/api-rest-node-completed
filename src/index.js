require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const PORT = process.env.SERVER_PORT || 3000;

const app = express();

const Service = mongoose.model('Service', {
    name: String,
    email: String,
    description: String,
    price: Number,
    status: Boolean
});

app.use(express.json());

app.route('/Services')
    .get(async (req, res) => {
        try {
            const service = await Film.find();
            res.json(service);
        } catch (err) {
            res.status(500).json({ msg: `Erro interno do servidor. + ${err}` });
        }
    })

    .delete (async (req, res) => {
        try {
            const service = await Film.findByIdAndDelete(req.params.id);

            if (!service) {
                return res.status(404).json({ msg: 'Serviço não encontrado.' });
            }

            res.send({ msg: "deleted success" });
        } catch (err) {
            res.status(500).json({ msg: `Erro interno do servidor. ${err}` });
        }
    })

    .put(async (req, res) => {
        try {
            const service = await Service.findByIdAndUpdate(
                req.params.id,
                {
                    name: req.body.name,
                    email: req.body.email,
                    description: req.body.description,
                    price: req.body.price,
                    status: req.body.status
                },
                { new: true }
            );

            if (!service) {
                return res.status(404).json({ msg: `Serviço não encontrado.` });
            }

            res.send(service);
        } catch (err) {
            res.status(500).json({ msg: `Erro interno do servidor. ooo  ${err}` });
        }
    })

    .post(async (req, res) => {
        try {
            const service = new Service(req.body);
            await service.save();
            res.status(201).json(service);
        } catch (err) {
            res.status(500).json({ msg: `Erro interno do servidor. + ${err}` });
        }
    })

    .patch(async (req, res) => {
        try {
            const service = await Service.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { new: true }
            );

            if (!service) {
                res.status(404).json({ msg: `serviço não encontrado. ` });
            }

            res.send(service);
        } catch (err) {
            res.status(500).json({ msg: `Erro interno do servidor. ${err}` });
        }
    })

    .head(async (req, res) => {
        try {
          const service = await Service.findById(req.params.id);
    
          if (service) {
            res.status(200).end();
          } else {
            res.status(404).end();
          }
        } catch (err) {
          res.status(500).json({ msg: `Erro interno do servidor. ${err}` });
        }
    });

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ msg: 'Erro interno do servidor.' });
});

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost:27017/db');

// Lidar com eventos de conexão e erro
mongoose.connection.once('open', () => {
    console.log('Conectado ao MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error(`Erro de conexão ao MongoDB: ${err}`);
});

app.use((req, res) => {
    res.status(404).json({ msg: 'Rota não encontrada' });
});

app.listen(PORT, () => {
    console.log(`App rodando na porta ${PORT}`);
});