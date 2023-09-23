const express = require('express');

const adminController = require('../controllers/admin.controller');
const router = express.Router();

router.get('/activity',adminController.getLatestMeetings);

router.get('/doctors', adminController.getDoctors); // /admin/products

router.get('/doctors/meetings/:id', adminController.getDoctorMeeting);

router.get('/doctors/doctor-meeting/:id', adminController.viewSingleDoctorMeeting);

/*router.get('/products/new', adminController.getNewProduct);*/

router.delete('/doctors/:id', adminController.deleteDoctor);

router.get('/reps', adminController.getReps);

router.delete('/doctors/meetings/:id', adminController.deleteDoctorMeetings);

router.get('/reps/meetings/:id',adminController.getRepMeetings);

router.delete('/reps/:id',adminController.deleteRep);

//router.patch('/orders/:id', adminController.updateOrder);

module.exports = router;