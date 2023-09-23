const Doctor = require('../models/doctor.model');
const User = require('../models/user.model');
const Meeting=require('../models/meeting.model');


async function getLatestMeetings(req,res,next){
  try {
    const meetings = await Meeting.getPastTwoWeeksMeetings();
    console.log(meetings);
    res.render('customer/meetings/all-meeting', { meetings: meetings });
  } catch (error) {
    next(error);
    return;
  }
}

async function getDoctors(req, res, next) {
  try {
    const doctors = await Doctor.findAll();
    //console.log(doctors);
    res.render('admin/products/all-doctors', { doctors: doctors });
  } catch (error) {
    next(error);
    return;
  }
}

async function getDoctorMeeting(req, res, next) {
  try {
    //console.log("Hi");
    const meetings = await Meeting.findAllMeetingsByDoctorId(req.params.id);
    //console.log(meetings);
    res.render('admin/products/all-doctormeeting', { meetings: meetings });
  } catch (error) {
    next(error);
  }
}


async function viewSingleDoctorMeeting(req, res, next) {
  try {
    const meeting = await Meeting.findById(req.params.id);
    //console.log(meeting);
    res.render('customer/meetings/meeting-details', {meeting:meeting});
  } catch (error) {
    next(error);
  }
}

/*function getNewProduct(req, res) {
  res.render('admin/products/new-product');
}

async function createNewProduct(req, res, next) {
  const product = new Product({
    ...req.body,
    image: req.file.filename,
  });

  try {
    await product.save();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect('/admin/products');
}


async function updateProduct(req, res, next) {
  const product = new Product({
    ...req.body,
    _id: req.params.id,
  });

  if (req.file) {
    product.replaceImage(req.file.filename);
  }

  try {
    await product.save();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect('/admin/products');
}


  res.json({ message: 'Deleted product!' });
}*/

async function getReps(req, res, next) {
  try {
    const reps = await User.findAll();
    //console.log(reps);
    res.render('admin/products/all-reps', {
      reps: reps
    });
  } catch (error) {
    next(error);
  }
}

async function getRepMeetings(req, res, next) {
  try {
    //console.log("Hi");
    const meetings = await Meeting.loadAllMeeting(req.params.id);
    //console.log(meetings);
    res.render('admin/products/all-doctormeeting', { meetings: meetings });
  } catch (error) {
    next(error);
  }
}
/*
async function updateOrder(req, res, next) {
  const orderId = req.params.id;
  const newStatus = req.body.newStatus;

  try {
    const order = await Order.findById(orderId);

    order.status = newStatus;

    await order.save();

    res.json({ message: 'Order updated', newStatus: newStatus });
  } catch (error) {
    next(error);
  }
}*/

async function deleteDoctor(req, res, next) {
  //console.log("Hi");
  let doctor;
  try {
    doctor = await Doctor.findDoctorById(req.params.id);
    await doctor.remove();
  } catch (error) {
    return next(error);
  }

  res.json({ message: 'Deleted product!' });

}

async function deleteDoctorMeetings(req, res, next) {
  console.log(req.params.id);
  let meeting;
  try {
    meeting = await Meeting.findById(req.params.id);
    console.log(meeting);
    await meeting.remove();
  } catch (error) {
    return next(error);
  }

  res.json({ message: 'Deleted product!' });

}

async function deleteRep(req,res,next){
  let rep;
  try{
    await User.removeById(req.params.id);
  }catch(error){
    return next(error);
  }

  res.json({ message: 'Deleted product!' });
}

module.exports = {
  getDoctors: getDoctors,
  getReps:getReps,
  getDoctorMeeting:getDoctorMeeting,
  viewSingleDoctorMeeting:viewSingleDoctorMeeting,
  deleteDoctor:deleteDoctor,
  deleteDoctorMeetings:deleteDoctorMeetings,
  getRepMeetings:getRepMeetings,
  deleteRep:deleteRep,
  getLatestMeetings:getLatestMeetings,
};
