const router = require("express").Router();
const User = require("../../models/User");
const GemsBundle = require("../../models/GemsBundle");
const Questions = require("../../models/Questions");
const Settings = require("../../models/Settings");
const Complaints = require("../../models/Complaints");
const Stories = require("../../models/Stories");
const Experience = require("../../models/Experience");
const authAdminValidation = require("../../middlewares/adminValidation");
router.get("/", authAdminValidation, (req, res) => {
  res.render("pages/home", { name: "Chris Martin" });
});

// Route to get users and render the page
router.get("/users", authAdminValidation, async (req, res) => {
  try {
    const users = await User.find(); // Fetch users from the database
    res.render("pages/Users", { users }); // Pass users data to the EJS template
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

router.get("/gems", authAdminValidation, async (req, res) => {
  try {
    // Fetch all GemsBundle data from the database
    const gemsBundles = await GemsBundle.find({});

    // Pass the data to the EJS template
    res.render("pages/gemsBundle", { gemsBundles });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});
router.get("/contact", authAdminValidation, async (req, res) => {
  try {
    const settings = await Settings.findOne();
    const complaints = await Complaints.find();
    console.log("from contact page");
    console.log(complaints.length);
    res.render("pages/contact", { settings, complaints }); // Pass settings data to the EJS template
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});
router.get("/stories", authAdminValidation, async (req, res) => {
  try {
    const stories = await Stories.find(); // Fetch all stories from the database
    res.render("pages/stories", { stories }); // Render the EJS template for stories
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});
router.get("/experiences", authAdminValidation, async (req, res) => {
  try {
    const experiences = await Experience.find();
    res.render("pages/experiences", { experiences });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});
router.get("/question", authAdminValidation, async (req, res) => {
  try {
    // Fetch users from the database
    const questions = await Questions.find({});
    res.render("pages/question", { questions }); // Pass users data to the EJS template
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});
router.get("/login", async (req, res) => {
  try {
    // Fetch users from the database
    res.render("pages/login"); // Pass users data to the EJS template
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
