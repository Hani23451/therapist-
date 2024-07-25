const expressAsyncHandler = require("express-async-handler");
const GemsBundle = require("../../models/GemsBundle");
const Questions = require("../../models/Questions");
const Complaints = require("../../models/Complaints");
const Settings = require("../../models/Settings");
const Stories = require("../../models/Stories");
const User = require("../../models/User");
const Relationship = require("../../models/RelationShip");
const admin = require("../../config/FireBase");
const Experience = require("../../models/Experience");
// Controller function to get all gems and render the page
exports.getAllGems = expressAsyncHandler(async (req, res) => {
  try {
    const gemsBundles = await GemsBundle.find();
    res.status(200).json({ gemsBundles }); // Render the page with the gemsBundles data
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});
exports.getAllQuestions = expressAsyncHandler(async (req, res) => {
  try {
    const questions = await Questions.find();
    res.status(200).json({ questions }); // Render the page with the gemsBundles data
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

exports.createComplaint = expressAsyncHandler(async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const newComplaint = new Complaints({ name, email, message });
    await newComplaint.save();

    res
      .status(201)
      .json({ success: true, message: "Complaint created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

exports.getContacts = expressAsyncHandler(async (req, res) => {
  try {
    const settings = await Settings.findOne();

    res.status(201).json({ success: true, data: settings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});
exports.getStories = expressAsyncHandler(async (req, res) => {
  try {
    const stories = await Stories.find();

    res.status(201).json({ success: true, data: stories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

exports.linkCouples = expressAsyncHandler(async (req, res, next) => {
  try {
    const userId = req.user.userId;
    console.log(req.user); // Get user ID from the verified token
    const linkedWord = req.body.linkedWord;

    if (!linkedWord) {
      return res
        .status(400)
        .json({ success: false, message: "linkedWord is required" });
    }

    // Update the current user with the linkedWord and set relationshipStatus to "pending"
    const user = await User.findByIdAndUpdate(
      userId,
      { linkedWord, relationshipStatus: "pending" },
      { new: true }
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    console.log(user);
    const matchedUser = await User.findOne({
      linkedWord,
      _id: { $ne: userId },
    });

    if (matchedUser) {
      // Update both users to reference each other and set relationshipStatus to "accepted"
      user.relationshipStatus = "accepted";
      user.partner = matchedUser._id;

      matchedUser.relationshipStatus = "accepted";
      matchedUser.partner = user._id;

      await user.save();
      await matchedUser.save();

      return res.status(200).json({
        success: true,
        message: "linked successfully",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Account updated, waiting for a partner entering the word",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

exports.createRelationship = expressAsyncHandler(async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { engagementDate, marriageDate, proposalDate } = req.body;

    // Find the current user
    const user = await User.findById(userId).populate("partner");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Find the partner
    const partner = user.partner;

    if (!partner) {
      return res
        .status(404)
        .json({ success: false, message: "No partner found for the user" });
    }

    // Check if a relationship already exists between the current user and their partner
    const existingRelationship = await Relationship.findOne({
      $or: [
        { user1: userId, user2: partner._id },
        { user1: partner._id, user2: userId },
      ],
    });

    if (existingRelationship) {
      return res.status(400).json({
        success: false,
        message: "Relationship already exists between the users",
      });
    }

    // Create the new relationship
    const relationship = await Relationship.create({
      user1: userId,
      user2: partner._id,
      engagementDate,
      marriageDate,
      proposalDate,
      linkedWord: user.linkedWord,
    });

    // Update both users' relationship statuses
    user.relationshipStatus = "completed";
    partner.relationshipStatus = "completed";

    await user.save();
    await partner.save();

    res.status(201).json({
      success: true,
      message: "Relationship created successfully",
      relationship,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
});

exports.sendLoveClick = expressAsyncHandler(async (req, res, next) => {
  const { token, title, body } = req.body;

  const message = {
    // Optional: you can send any data
    notification: {
      title: "love click",
      body: "mustafa eisa has sent u a message",
    },
    topic: "66a23e869d970c131d734099",
  };

  try {
    const response = await admin.messaging().send(message); 
    console.log(response);
    res.status(200).json({
      success: true,
      message: "Notification sent successfully",
      response,
    });
  } catch (error) {   
     console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error sending notification", error });
  }
});
exports.addExperience = expressAsyncHandler(async (req, res) => {
  try {
    const { name, content, jewelCount, isPaid, userName, userEmail } = req.body;
    const experience = new Experience({
      name,
      content,

      userName,
      userEmail,
      // Assuming req.user contains the logged-in admin's info
    });
    await experience.save();
    console.log(experience);
    res
      .status(201)
      .json({ success: true, message: "Experience created successfully" });
  } catch (error) {
    res.status(500).send("Server Error");
    console.error(error);
  }
});

exports.getPublishedExperiences = expressAsyncHandler(async (req, res) => {
  try {
    const experiences = await Experience.find({ status: "published" });
    res.status(200).json({ success: true, experiences });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
});
exports.getUserData = expressAsyncHandler(async (req, res) => {
  try {
    // Fetch user data
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Fetch relationships involving the user, populating user details
    const relationships = await Relationship.findOne({
      $or: [{ user1: req.user.userId }, { user2: req.user.userId }],
    })
      .populate("user1", "fullname email   ") // Populate user1 details
      .populate("user2", "fullname email  "); // Populate user2 details

    res
      .status(200)
      .json({ success: true, user, relationship: relationships || null });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
});
