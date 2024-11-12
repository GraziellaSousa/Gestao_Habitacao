// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Definindo o schema do usuário
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.']
    },
    password: {
        type: String,
        required: true
    }
});

// Criptografando a senha antes de salvar o usuário
userSchema.pre('save', async function(next) {
    if (this.isModified('password') || this.isNew) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Método para verificar se a senha está correta
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Método para gerar token JWT
userSchema.methods.generateAuthToken = function() {
    const payload = { id: this._id, email: this.email };
    // Usando uma chave secreta fixa para o JWT
    return jwt.sign(payload, 'minha_chave_secreta', { expiresIn: '1h' });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
