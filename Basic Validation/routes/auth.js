const express = require("express");
const {body, check } = require("express-validator");

const authController = require("../controllers/auth");
const User = require('../models/user');
const bcrypt = require('bcryptjs');

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post("/login", [
  check('email')
  .isEmail()
  .withMessage('Enter a valid email')
  .custom((value , {req}) =>{
    return User.findOne({ email: value }).then(user => {
      if (!user) {
        return Promise.reject('Email is Invalid! Please enter valid email ');
      }
      return bcrypt.compare(req.body.password, user.password).then(doMatch =>{
        if(!doMatch){
          return Promise.reject('Password is Incorrect! ');
        }
      })
  })
}),
  body('password','Enter password of length min 5 chars ')
  .isAlphanumeric()
  .isLength({min: 5})
  
    
] , authController.postLogin);


router.post(
    '/signup',
    [
      check('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom((value, { req }) => {
          return User.findOne({ email: value }).then(userDoc => {
            if (userDoc) {
              return Promise.reject(
                'E-Mail exists already, please pick a different one.'
              );
            }
          });
        }),
      body(
        'password',
        'Please enter a password with only numbers and text and at least 5 characters.'
      )
        .isLength({ min: 5 })
        .isAlphanumeric(),
      body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords have to match!');
        }
        return true;
      })
    ],
    authController.postSignup
  );

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
