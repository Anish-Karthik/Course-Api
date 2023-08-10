const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { User, Course } = require('../db');
const { checkUser } = require('../middleware/auth');

const router = express.Router();

// User routes
router.post('/signup', async (req, res) => {
  const {username, password} = req.body;
  if(!username || !password) {
    res.status(400).json({message: "Username and password are required"});
    return;
  }
  if(await User.findOne({username})) {
    res.status(400).json({message: "Username already exists"});
    return;
  }
  const user = new User({username, password});
  await user.save();
  res.status(200).json({message: "Signed up Successfully"})
});

router.post('/login', async (req, res) => {
  const {username, password} = req.body;
  if(!username || !password) {
    res.status(400).json({message: "Username and password are required"});
    return;
  }
  if(await User.findOne({username, password})) {
    res.status(200).json({message: "Logged in Successfully"})
  } else {
    res.status(401).json({message: "Username or password is incorrect"});
  }
});

router.get('/courses', checkUser, async (req, res) => {
  const courses = await Course.find();
  res.json({ courses });
});

router.get('/courses/:courseId', checkUser, async (req, res) => {
  const { courseId } = req.params;
  const course = await Course.findById(courseId);
  if(!course) {
    res.status(404).json({message: "Course not found"});
    return;
  }
  res.status(200).json({ course });
});

module.exports = router;