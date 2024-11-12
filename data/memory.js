// data/memory.js
let memoryData = {
    logs: [],
    cart: [],
    reservations: []
};

// Funções para manipular os dados temporários
const addLog = (message) => {
    memoryData.logs.push({ message, timestamp: new Date() });
};

const addToCart = (item) => {
    memoryData.cart.push(item);
};

const removeFromCart = (itemId) => {
    memoryData.cart = memoryData.cart.filter(item => item.id !== itemId);
};

const getCart = () => {
    return memoryData.cart;
};

const addReservation = (reservation) => {
    memoryData.reservations.push(reservation);
};

const getReservations = () => {
    return memoryData.reservations;
};

module.exports = { addLog, addToCart, removeFromCart, getCart, addReservation, getReservations };
