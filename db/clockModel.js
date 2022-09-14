const mongoose = require("mongoose");

// clock schema
const ClockSchema = new mongoose.Schema({
  // user field
  user: {
    type: String,
    required: [true, "Invalid user"],
    unique: false,
  },

  // name type
  name: {
    type: String,
    required: [true, "Invalid name"],
    unique: false,
  },

  //  location field
  store: {
    type: String,
    required: [true, "Invalid store"],
    unique: false,
  },

  // punch type
  type: {
    type: String,
    required: [true, "Invalid punch type"],
    unique: false
  },
  
  //  punch time
  timestamp: {
    type: Date,
    default: Date.now,
    unique: false
  },

  //  location field
  location: {
    type: Map,
    required: false,
    unique: false,
  },
});

// export UserSchema
module.exports = mongoose.model.Clock || mongoose.model("Clock", ClockSchema);
