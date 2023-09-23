const Doctor = require('../models/doctor.model');
const User = require('../models/user.model');

async function doctor(req, res, next) {
  //console.log(req.body)
  const doctor = new Doctor(
    req.body.name,
    req.body.specialization,
    req.body.location,
    req.body.fees,
  );
  await doctor.save();
  res.redirect('/');
}

function addDoctor(req,res){
  res.render('../views/customer/orders/new-doctor');
}

module.exports = {
  doctor:doctor,
  addDoctor: addDoctor,
};
