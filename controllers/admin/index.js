const asyncHandler = require("express-async-handler");
const GemsBundle = require("../../models/GemsBundle");
const Questions = require("../../models/Questions");
const Settings = require("../../models/Settings");
const Stories = require("../../models/Stories");
const Experience = require("../../models/Experience");
exports.AdminLogin = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  const { email, password } = req.body;
  try {
    if (
      email.trim() === "therapist@gmail.com" &&
      password.trim() === "admin1234"
    ) {
      req.session.userId = 1; // Store user ID in session
      console.log("authorized");
      res.redirect("/");
    } else {
      console.log("unauthorized");
      return res.status(401).render("pages/login");
    }
  } catch (error) {
    console.log(error);
    res.status(500).render("pages/login", { error: "Internal server error" });
  }
});

exports.createGemsBundle = asyncHandler(async (req, res) => {
  const { name, price, count } = req.body;

  if (!name || !price || !count) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const newGemsBundle = await GemsBundle.create({ name, price, count });
    res
      .status(201)
      .json({ success: true, message: "Gems bundle created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error, please try again later",
    });
  }
});
exports.createQuestion = asyncHandler(async (req, res) => {
  const { answer, question } = req.body;

  if (!answer || !question) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const newQuestion = await Questions.create({ question, answer });
    console.log(newQuestion);
    res
      .status(201)
      .json({ success: true, message: "Question  created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error, please try again later",
    });
  }
});
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    await Questions.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Question  deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.deleteGemsBundle = async (req, res) => {
  try {
    const { id } = req.params;
    await GemsBundle.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Gems Bundle deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.createContact = asyncHandler(async (req, res) => {
  try {
    const { tiktok, facebook, instagram, youtube, snapchat } = req.body;
    let settings = await Settings.findOne();

    if (settings) {
      // Update existing settings
      settings.tiktok = tiktok;
      settings.facebook = facebook;
      settings.instagram = instagram;
      settings.youtube = youtube;
      settings.snapchat = snapchat;
    } else {
      // Create new settings
      settings = new Settings({
        tiktok,
        facebook,
        instagram,
        youtube,
        snapchat,
      });
    }

    await settings.save();
    console.log(settings);
    res.redirect("/contact");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

exports.createStory = async (req, res) => {
  try {
    const { name, content, jewelCount, isPaid } = req.body;

    // Create a new story instance
    const newStory = new Stories({
      name,
      content,
      jewelCount,
      isPaid: isPaid === "true", // Convert string to boolean
    });

    // Save the story to the database
    await newStory.save();
    console.log(newStory);
    // Redirect to the stories page or wherever you want
    res.redirect("/stories");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};
exports.deleteStory = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the story by ID
    await Stories.findByIdAndDelete(id);

    // Redirect to the stories page
    res.redirect("/stories");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.addExperience = asyncHandler(async (req, res) => {
  const { name, content, jewelCount, isPaid } = req.body;
  const experience = new Experience({
    name,
    content,
    jewelCount,
    isPaid,
    // Assuming req.user contains the logged-in admin's info
  });
  await experience.save();
  res.redirect("/experiences");
});
exports.deleteExperience = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await Experience.findByIdAndDelete(id);
  res.redirect("/experiences");
});
exports.updateExperienceStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const experience = await Experience.findById(id);

  if (!experience) {
    return res
      .status(404)
      .json({ success: false, message: "Experience not found" });
  }

  const newStatus = experience.status === "publish" ? "published" : "publish";
  experience.status = newStatus;

  await experience.save();
  res.redirect("/experiences");
});
