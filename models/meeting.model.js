const mongodb = require('mongodb');
const db = require('../data/database');

console.log("Meeting model");

class Meeting {
  constructor(date, comment, uid, doctorId, meetingId) {
    this.date = date;
    this.comment = comment;
    this.entrydate = new Date();
    this.uid = new mongodb.ObjectId(uid);
    this.doctorId = new mongodb.ObjectId(doctorId);
    this.meetingId = meetingId ? new mongodb.ObjectId(meetingId) : null;  // Only convert to ObjectId if meetingId is provided
  }
  

  async save() {
    const doctorDetails = await Meeting.getDoctorDetailsById(this.doctorId);
  
    const meetingDocument = {
        name: doctorDetails.name,
        specialization: doctorDetails.specialization,
        date: this.date,
        comment: this.comment,
        uid: this.uid,
        entrydate: this.entrydate,
        doctorId: this.doctorId
    };
  
    if (this.meetingId) { // if meetingId exists, it's an update
        const result = await db.getDb().collection('meetings').updateOne(
            { _id: this.meetingId },
            { $set: meetingDocument }
        );
        return result; 
    } else {  // Otherwise, insert a new document
        const result = await db.getDb().collection('meetings').insertOne(meetingDocument);
        return result;
    }
  }
  


static async findAllMeetingsByDoctorId(doctorId) {
  let id;
  try {
      id = new mongodb.ObjectId(doctorId);
  } catch (error) {
      error.code = 404;
      throw error;
  }

  const meetingsCursor = await db
      .getDb()
      .collection('meetings')
      .find({ doctorId: id })
      .sort({ date: 1 });

  const meetingsArray = await meetingsCursor.toArray();

  // Fetch doctor's details
  const doctor = await db.getDb().collection('doctors').findOne({ _id: id });
  if (!doctor) {
      throw new Error('Doctor with provided ID not found.');
  }

  return meetingsArray.map(meeting => {
      const meetingInstance = new Meeting(
          meeting.date,
          meeting.comment,
          meeting.uid,
          meeting.doctorId,
          meeting._id  // This is the meetingId
      );
      
      // Attach doctor's details to each meeting instance
      meetingInstance.doctorName = doctor.name;
      meetingInstance.doctorSpecialization = doctor.specialization;

      return meetingInstance;
  });
}

static async getPastTwoWeeksMeetings() {
  // Calculate the date for 2 weeks ago
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  // Fetch meetings from the database where the date is greater than twoWeeksAgo
  const meetingsCursor = await db
    .getDb()
    .collection('meetings')
    .find({ entrydate: { $gte: twoWeeksAgo } })
    .sort({ entrydate: 1 });

  const meetingsArray = await meetingsCursor.toArray();
  console.log(meetingsArray);
  // Asynchronously fetch doctor details for all meetings
  const meetingInstancesWithDoctorDetails = await Promise.all(meetingsArray.map(async meeting => {
      const doctorDetails = await Meeting.getDoctorDetailsById(meeting.doctorId);
      
      const meetingInstance = new Meeting(
          meeting.date,
          meeting.comment,
          meeting.uid,
          meeting.doctorId,
          meeting._id  // This is the meetingId
      );

      // Attach doctor's details to each meeting instance
      meetingInstance.doctorName = doctorDetails.name;
      meetingInstance.doctorSpecialization = doctorDetails.specialization;
      //console.log(meetingInstance);
      return meetingInstance;
  }));

  return meetingInstancesWithDoctorDetails;
}



static async loadAllMeeting(uid) {
  let id;
  try {
      id = new mongodb.ObjectId(uid);
  } catch (error) {
      error.code = 404;
      throw error;
  }

  const meetingsCursor = await db
      .getDb()
      .collection('meetings')
      .find({ uid: id })
      .sort({ date: 1 });

  const meetingsArray = await meetingsCursor.toArray();

  // Asynchronously fetch doctor details for all meetings
  const meetingInstancesWithDoctorDetails = await Promise.all(meetingsArray.map(async meeting => {
      const doctorDetails = await Meeting.getDoctorDetailsById(meeting.doctorId);
      
      const meetingInstance = new Meeting(
          meeting.date,
          meeting.comment,
          meeting.uid,
          meeting.doctorId,
          meeting._id  // This is the meetingId
      );

      // Attach doctor's details to each meeting instance
      meetingInstance.doctorName = doctorDetails.name;
      meetingInstance.doctorSpecialization = doctorDetails.specialization;

      return meetingInstance;
  }));

  return meetingInstancesWithDoctorDetails;
}


static async getDoctorDetailsById(doctorId) {
  const doctor = await db.getDb().collection('doctors').findOne({ _id: new mongodb.ObjectId(doctorId) });
  
  if (!doctor) {
      console.error(`Doctor with ID ${doctorId} not found. Check data integrity.`);
      return null;
  }
  
  return { name: doctor.name, specialization: doctor.specialization };
}


static async findById(uid){
  let id;
  try {
    id = new mongodb.ObjectId(uid);
  } catch (error) {
    error.code = 404;
    throw error;
  }
  const meeting = await db.getDb().collection('meetings').findOne({ _id: id });

  if (!meeting) {
    const error = new Error('Could not find meeting with provided id.');
    error.code = 404;
    throw error;
  }

  // Fetch doctor's details
  const doctorDetails = await Meeting.getDoctorDetailsById(meeting.doctorId);
  
  // Create a new Meeting instance with the required details, including doctor's name and specialization
  const meetingInstance = new Meeting(
    meeting.date, 
    meeting.comment, 
    meeting.uid,
    meeting.doctorId,
    meeting._id  // This is the meetingId
  );

  // Attach doctor's name and specialization to the meeting instance
  meetingInstance.name = doctorDetails.name;
  meetingInstance.specialization = doctorDetails.specialization;

  return meetingInstance;
}

async remove() {
  // Use this.meetingId if that's where you store the meeting's ObjectId
  const meetingId = this.meetingId instanceof mongodb.ObjectId ? this.meetingId : new mongodb.ObjectId(this.meetingId);
  await db.getDb().collection('meetings').deleteOne({ _id: meetingId });
}

}

module.exports = Meeting;