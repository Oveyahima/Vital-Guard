const mongoose = require('mongoose');

// Example Patient Schema
const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, required: true, unique: true },
  contactNumber: String,
  // ... other fields
}, { timestamps: true });

  const Patient = mongoose.model('Patient', patientSchema);
  
  // Export doctor model
  module.exports = Patient;
  