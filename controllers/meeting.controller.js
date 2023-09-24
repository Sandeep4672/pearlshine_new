const Meeting = require('../models/meeting.model');
const Doctor=require('../models/doctor.model');

async function getNewMeeting(req, res, next) {
  const doctors=await Doctor.findAll();
  //console.log(doctors);
  res.render('../views/customer/meetings/new-meeting',{doctors: doctors});
}

async function savemeeting(req,res){
  //console.log(req.session.uid)
  const meeting = new Meeting(
    req.body.date,
    req.body.comments,
    req.session.uid,
    req.body.doctorId,
  );
  await meeting.save();
  res.redirect('/');
}

async function loadmeetings(req,res){
    //console.log(req.session.uid);
    let meetings=await Meeting.loadAllMeeting(req.session.uid);
    //console.log(meetings)
    if (!Array.isArray(meetings)) {
      //console.log("Hi");
      meetings = [meetings];
  }
  //console.log(meetings);
    res.render('customer/meetings/all-meeting',{meetings: meetings});
}

async function viewdetails(req,res){
  //console.log(req.params.id, 'Hi');
  const meeting = await Meeting.findById(req.params.id);
 // console.log(meeting);
  res.render('customer/meetings/meeting-details', {meeting:meeting});
}

async function getUpdateForm(req,res){
  const doctors=await Doctor.findAll();
  const meeting = await Meeting.findById(req.params.id);
  //console.log(meeting);
  res.render('customer/meetings/new-update',{doctors:doctors,meeting: meeting});
}

async function updateMeeting(req, res, next) {
  try {
    const meetingId = req.params.id;
    const updatedMeeting = new Meeting(
      req.body.date,
      req.body.comments,
      req.session.uid,
      req.body.doctorId,
      meetingId
    );

    await updatedMeeting.save(); 

    res.redirect(`/meetings/${meetingId}`);
    
  } catch (error) {
    console.error("Error updating the meeting:", error);
    next(error);
  }
}


module.exports = {
  getNewMeeting:getNewMeeting,
  savemeeting: savemeeting,
  loadmeetings:loadmeetings,
  viewdetails:viewdetails,
  getUpdateForm:getUpdateForm,
  updateMeeting:updateMeeting,
};
