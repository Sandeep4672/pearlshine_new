console.log("Meeting Routes");

const express = require('express');

const meetingsController = require('../controllers/meeting.controller');

const router = express.Router();

router.get('/',function(req,res){
    res.redirect('/activity');
})

router.get('/meeting/new', meetingsController.getNewMeeting);

router.post('/meeting',meetingsController.savemeeting);

router.get('/activity',meetingsController.loadmeetings);

router.get('/meetings/:id', meetingsController.viewdetails);

router.get('/meetings/update/:id',meetingsController.getUpdateForm);

router.post('/meetings/update/:id',meetingsController.updateMeeting);

module.exports = router;