const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// require database connection
const dbConnect = require("./db/dbConnect");
const User = require("./db/userModel");
const Clock = require("./db/clockModel");
const Employee = require("./db/employeeModel");
const auth = require("./auth");

// execute database connection
dbConnect();

// Curb Cores Error by adding a header here
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response, next) => {
  response.json({ message: "Hey! This is your server response!" });
  next();
});

// register endpoint
app.post("/register", (request, response) => {
  // hash the password
  bcrypt
    .hash(request.body.password, 10)
    .then((hashedPassword) => {
      // create a new user instance and collect the data
      const user = new User({
        email: request.body.email,
        password: hashedPassword,
      });

      // save the new user
      user
        .save()
        // return success if the new user is added to the database successfully
        .then((result) => {
          response.status(201).send({
            message: "User Created Successfully",
            result,
          });
        })
        // catch erroe if the new user wasn't added successfully to the database
        .catch((error) => {
          response.status(500).send({
            message: "Error creating user",
            error,
          });
        });
    })
    // catch error if the password hash isn't successful
    .catch((e) => {
      response.status(500).send({
        message: "Password was not hashed successfully",
        e,
      });
    });
});

// login endpoint
app.post("/login", (request, response) => {
  // check if email exists
  User.findOne({ email: request.body.email })

    // if email exists
    .then((user) => {
      // compare the password entered and the hashed password found
      bcrypt
        .compare(request.body.password, user.password)

        // if the passwords match
        .then((passwordCheck) => {

          // check if password matches
          if(!passwordCheck) {
            return response.status(400).send({
              message: "Passwords does not match",
              error,
            });
          }

          //   create JWT token
          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
            },
            "RANDOM-TOKEN",
            { expiresIn: "24h" }
          );

          //   return success response
          response.status(200).send({
            message: "Login Successful",
            email: user.email,
            token,
          });
        })
        // catch error if password do not match
        .catch((error) => {
          response.status(400).send({
            message: "Passwords does not match",
            error,
          });
        });
    })
    // catch error if email does not exist
    .catch((e) => {
      response.status(404).send({
        message: "Email not found",
        e,
      });
    });
});

// free endpoint
app.get("/free-endpoint", (request, response) => {
  response.json({ message: "You are free to access me anytime" });
});

// authentication endpoint
app.get("/auth-endpoint", auth, (request, response) => {
  response.send({ message: "You are authorized to access me" });
});

// clock endpoint
app.post("/clock-punch", (request, response) => {
  // create a new user instance and collect the data
  const clock = new Clock({
    user: request.body.user,
    type: request.body.punchType,
    location: request.body.location || {},
  });
  // save the punch
  clock
    .save()
    // return success if the new user is added to the database successfully
    .then((result) => {
      response.status(201).send({
        message: "punch saved successfully",
        result,
      });
    })
    // catch erroe if the new user wasn't added successfully to the database
    .catch((error) => {
      response.status(500).send({
        message: "Error saving punch",
        error,
      });
    })
});

// create employee endpoint
app.post("/create/employee", (request, response) => {
  const employee = new Employee({
    user: request.body.user,
    name: request.body.name,
    store: request.body.store
  });

  // create employee
  employee
    .save()
    // return success if the new user is added to the database successfully
    .then((result) => {
      response.status(201).send({
        message: "employee saved successfully",
        result,
      });
    })
    // catch erroe if the new user wasn't added successfully to the database
    .catch((error) => {
      response.status(500).send({
        message: "Error saving employee",
        error,
      });
    })
});

app.get("/employees", (request, response, next) => {
  Employee
    .find()
    .then((employees) => {
      response.json(employees);
      next();
    })
    .catch((error) => {
      response.status(500).send({
        message: "Error fetching employees",
        error,
      })
    })
});

app.get("/employee/:id", (request, response, next) => {
  Employee
    .findOne({ user: request.params.id, employeeStatus: true })
    .then((employee) => {
      response.json(employee);
      next();
    })
    .catch((error) => {
      response.status(400).send({
        message: "Error employee not found",
        error,
      })
    })
});

app.delete("/employee/:id", (request, response, next) => {
  Employee
    .findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
});

app.put("/employee/:id", (request, response, next) => {
  const body = request.body
  console.log(request.params.id);
  const employee = {
    employeeStatus: body.estatus,
    store: body.store,
    user: body.user,
    name: body.name,
  }

  Employee
    .findByIdAndUpdate(request.params.id, employee, { new: true })
    .then((res) => {
      response.json(res)
    })
    .catch(error => next(error))
});

module.exports = app;
