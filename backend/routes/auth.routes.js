const express = require('express');
const { register, login, createAdmin } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.post('/create-admin', createAdmin);

module.exports = router;

