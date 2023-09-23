const mongodb = require('mongodb');

const db = require('../data/database');

class Doctor {
  constructor(name, specialization, location, fees, date, id = null) {
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.name = name;
    this.specialization = specialization;
    this.location = location;
    this.fees = fees;
    this.date = date || new Date();
    if (this.date) {
      this.formattedDate = this.date.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
  }

  save() {
    const doctorDocument = {
      name: this.name,
      specialization: this.specialization,
      date: new Date(),
      fees: this.fees,
      location: this.location,
    };

    if (this._id) { // If there's an existing ID, update the document
      return db.getDb().collection('doctors').updateOne({ _id: this._id }, { $set: doctorDocument });
    } else { // Otherwise, insert a new document
      return db.getDb().collection('doctors').insertOne(doctorDocument);
    }
  }

  static async findAll() {
    const doctors = await db.getDb().collection('doctors').find().toArray();

    return doctors.map(function (doctorDocument) {
      return new Doctor(
        doctorDocument.name,
        doctorDocument.specialization,
        doctorDocument.location,
        doctorDocument.fees,
        doctorDocument.date,
        doctorDocument._id
      );
    });
  }

  static async findDoctorById(doctorId) {
    let docId;
    try {
      docId = new mongodb.ObjectId(doctorId);
    } catch (error) {
      error.code = 404;
      throw error;
    }
    //console.log(docId);
    const doctor = await db
      .getDb()
      .collection('doctors')
      .findOne({ _id: docId });
  
    if (!doctor) {
      const error = new Error('Could not find doctor with provided id.');
      error.code = 404;
      throw error;
    }
  
    return new Doctor(
      doctor.name,
      doctor.specialization,
      doctor.location,
      doctor.fees,
      doctor.date,
      doctor._id
    );
  }
  
  async remove() {
    //console.log("Hi");
    const doctorId = new mongodb.ObjectId(this._id);
    await db.getDb().collection('doctors').deleteOne({ _id: doctorId });
    await db.getDb().collection('meetings').deleteMany({ doctorId: doctorId });
  }  

}

module.exports = Doctor;
