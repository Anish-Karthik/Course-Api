const jwt = require('jsonwebtoken');
const { User } = require('../db')

const SECRET = process.env.SECRET;  // This should be in an environment variable in a real application

const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    // jwt.verify gives the decoded token if it is valid(i.e it exists in the jwt database), otherwise it will throw an error
    jwt.verify(token, SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      console.log('inside middleware',req.user);
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

async function checkUser(req, res, next) {
  const { username, password } = req.headers;
  const user = await User.findOne({username, password});
  if (user) {
    next();
  } else {
    res.status(401).json({message: "not authorized"});
  }
}

module.exports = {
  authenticateJwt,
  SECRET,
  checkUser
};