const { check } = require("express-validator")
const validator = require("../../middlewares/validator")

exports.LoginValidator = [
    check("email").isEmail().withMessage("Please Enter Valid Email"),
    check("password").notEmpty().isLength({ min: 6 }).withMessage("Please Enter Valid Password With Minmum Characters 6"),
    validator
]

exports.RegisterValidator = [
    check("fullname").notEmpty().withMessage("Please Enter Valid Username"),
    check("phone").notEmpty().withMessage("Please Enter Valid Phone"),
    check("sex").notEmpty().withMessage("Please Enter sex"),
    check("email").isEmail().withMessage("Please Enter Valid Email"),
    check("age").notEmpty().withMessage("Please Enter Valid age"),
    // check("gender").notEmpty().isIn(["male","female"]).withMessage("Please Enter Valid Gender"),
    check("password").notEmpty().isLength({ min: 6 }).withMessage("Please Enter Valid Password With Minmum Characters 6"),
    validator
]