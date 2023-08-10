const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { Admin, Course } = require('../db');
const { authenticateJwt, SECRET } = require('../middleware/auth');

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ message: 'Username and password are required' });
    return;
  }
  if(await Admin.findOne({username})) {
    res.status(400).json({message: "Username already exists"});
    return;
  }
  const admin = new Admin({ username, password });
  await admin.save();
  res.status(200).json({ message: 'Signed up successfully' });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ message: 'Username and password are required' });
    return;
  }
  const user = await Admin.findOne({username, password});
  // create token
  const token = jwt.sign({ username, role: 'admin'}, SECRET, {expiresIn: "6h"}); 
  
  console.log(user);
  if(user) {
    res.status(200).json({message: "Logged in Successfully", token})
  } else {
    res.status(401).json({message: "Username or password is incorrect"});
    return;
  }
});

router.post('/courses', async (req, res) => {
  const course = new Course(req.body);
  await course.save();
  res.json({ message: 'Course created successfully', courseId: course.id });
  console.log(course);
});

router.put('/courses/:courseId', authenticateJwt, async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true });
  if (course) {
    res.json({ message: 'Course updated successfully' });
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});

router.delete('/courses/:courseId', authenticateJwt, async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.courseId);
  if (course) {
    res.json({ message: 'Course deleted successfully' });
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
})

router.get('/courses', authenticateJwt, async (req, res) => {
  console.log('inside route',req.user);
  const courses = await Course.find({});
  res.json({ courses });
});

module.exports = router;