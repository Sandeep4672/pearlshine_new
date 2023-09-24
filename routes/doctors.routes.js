console.log("Doctor Routes");

const express = require('express');

const doctorsController = require('../controllers/doctors.controller');

const router = express.Router();

router.post('/adddoctor', doctorsController.doctor); // /orders

router.get('/adddoctor', doctorsController.addDoctor);

// /orders

module.exports = router;