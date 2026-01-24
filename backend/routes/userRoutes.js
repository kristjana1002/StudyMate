// Connects user URLs to the user controller
const express = require('express');
const { signup, login } = require('../controllers/userController');
const router = express.Router();


module.exports = router;
