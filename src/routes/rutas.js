const path = require('path')


function getLogin(req, res) {
  if (req.isAuthenticated()) {
    let user = req.user
    res.sendFile(path.join(__dirname, "../views/home.html"));
   

  }else{
  res.sendFile(path.join(__dirname, '../views/login.html'))
  }
}

function getSignup(req, res) {
  res.sendFile(path.join(__dirname, "../views/signup.html"));
}

function postLogin(req, res) {
  let user = req.user;

  res.sendFile(path.join(__dirname, "../views/index.html"));
}

function postSignup(req, res) {
  let user = req.user;

  res.sendFile(path.join(__dirname, "../views/index.html"));
}

function getFailsignup(req, res) {
  res.sendFile(path.join(__dirname, "../views/failsignup.html"));
}

function getFaillogin(req, res) {
  res.sendFile(path.join(__dirname, "../views/faillogin.html"));
}


function getlogout(req, res) {
  req.logout()
  res.sendFile(path.join(__dirname, "../views/login.html"));
}



module.exports = {
  getLogin,
  postLogin,
  getSignup,
  postSignup,
  getFailsignup,
  getFaillogin,
  getlogout

};