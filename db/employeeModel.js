const mongoose = require("mongoose");

// employee schema
const EmployeeSchema = new mongoose.Schema({
  // user field
  user: {
    type: String,
    required: [true, "Invalid user"],
    unique: true,
  },

  // name type
  name: {
    type: String,
    required: [true, "Invalid name"],
    unique: false,
  },
  
  //  created time
  created: {
    type: Date,
    default: Date.now,
    unique: false,
  },

  updated: {
    type: Date,
    default: Date.now,
    unique: false,
  },
  //  location field
  store: {
    type: String,
    required: [true, "Invalid store"],
    unique: false,
  },

  employeeStatus: {
    type: Boolean,
    require: [true, "Employee status is required"],
    default: true,
    unique: false,
  },
});

// export EmployeeSchema
module.exports = mongoose.model.Employee || mongoose.model("Employee", EmployeeSchema);
