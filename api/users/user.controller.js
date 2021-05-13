const {
  create,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserByUserEmail,
} = require("./user.service");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
// const jwt = require("jsonwebtoken");
const { sign } = require("jsonwebtoken");
module.exports = {
  createUser: (req, res) => {
    const body = req.body;
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt, (err, hash) => {
      if (err) {
        throw err;
      }
    });
    create(body, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
        });
      }
      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },
  getUserById: (req, res) => {
    const id = req.params.id;
    console.log(id);
    getUserById(id, (err, results) => {
      console.log(results);
      if (err) {
        return res.json({
          success: 0,
          message: "Error trying to get records",
        });
      }
      if (!results) {
        return res.json({
          success: 0,
          message: "Record not found",
        });
      }
      if (results) {
        return res.json({
          success: 1,
          data: results,
        });
      }
    });
  },
  getUsers: (req, res) => {
    getUsers((err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!result) {
        return res.json({
          success: 0,
          message: "Record not found",
        });
      }
      if (result) {
        return res.json({
          success: 1,
          data: result,
        });
      }
    });
  },
  updateUser: (req, res) => {
    const body = req.body;
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);
    updateUser(body, (err, results) => {
      console.log(err);
      console.log(results);

      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.json({
          success: 0,
          message: "Unable to update user",
        });
      }
      if (results) {
        return res.json({
          success: 1,
          data: "User updated successful",
        });
      }
    });
  },
  deleteUser: (req, res) => {
    const body = req.body;
    deleteUser(body, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.json({
          success: 0,
          message: "Record not found",
        });
      }
      if (results) {
        return res.json({
          success: 1,
          data: "User deleted successful",
        });
      }
    });
  },
  login: (req, res) => {
    const body = req.body;
    getUserByUserEmail(body.email, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.json({
          success: 0,
          message: "Invalid email or password",
        });
      }
      const result = compareSync(body.password, results.password);
      if (result) {
        results.password = undefined;
        console.log(results);
        const jsontoken = sign({ result: results }, process.env.SECRET_KEY, {
          expiresIn: "1hr",
        });
        return res.json({
          success: 1,
          message: "Login success",
          token: jsontoken,
        });
      } else {
        return res.json({
          success: 0,
          message: "Invalid email or password",
        });
      }
    });
  },
};
