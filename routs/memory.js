const express = require('express');
const { addLog, addToCart, removeFromCart, getCart, addReservation, getReservations } = require('../data/memory');
const auth = require('../middleware/auth');

const router = express.Router();

// Rota para adicionar log
router.post('/logs', auth, (req, res) => {
    const { message } = req.body;
    addLog(message);
    res.status(201).json({ message: 'Log adicionado com sucesso' });
});

// Rota para adicionar item ao carrinho
router.post('/cart', auth, (req, res) => {
    const { item } = req.body;
    addToCart(item);
    res.status(201).json({ message: 'Item adicionado ao carrinho' });
});

// Rota para remover item do carrinho
router.delete('/cart/:itemId', auth, (req, res) => {
    const { itemId } = req.params;
    removeFromCart(itemId);
    res.status(200).json({ message: 'Item removido do carrinho' });
});

// Rota para visualizar o carrinho
router.get('/cart', auth, (req, res) => {
    const cart = getCart();
    res.status(200).json(cart);
});

// Rota para adicionar uma reserva
router.post('/reservations', auth, (req, res) => {
    const { reservation } = req.body;
    addReservation(reservation);
    res.status(201).json({ message: 'Reserva adicionada com sucesso' });
});

// Rota para visualizar as reservas
router.get('/reservations', auth, (req, res) => {
    const reservations = getReservations();
    res.status(200).json(reservations);
});

module.exports = router;
