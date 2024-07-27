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
const Notification = require("../../models/Notification");
const moment = require("moment");
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
      console.log(user);
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

    const formattedEngagementDate = moment(engagementDate, "DD-MM-YYYY").format(
      "YYYY-MM-DD"
    );
    const formattedMarriageDate = moment(marriageDate, "DD-MM-YYYY").format(
      "YYYY-MM-DD"
    );
    const formattedProposalDate = moment(proposalDate, "DD-MM-YYYY").format(
      "YYYY-MM-DD"
    );

    // Find the current user
    const user = await User.findById(userId).populate("partner");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Find the partner
    const partner = user.partner;
    partnerUser = await User.findById(partner._id);
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
      return res.status(200).json({
        success: false,
        message: "Relationship already exists between the users",
      });
    }

    // Create the new relationship
    const relationship = await Relationship.create({
      user1: userId,
      user2: partner._id,
      userName1: user.fullname,
      userName2: partnerUser.fullname,
      engagementDate: formattedEngagementDate,
      marriageDate: formattedMarriageDate,
      proposalDate: formattedProposalDate,
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
  try {
    const { body } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const partnerId = user.partner;
    if (!partnerId) {
      return res
        .status(404)
        .json({ success: false, message: "No partner found for the user" });
    }
    const partnerUser = await User.findById(partnerId);
    if (!partnerUser) {
      return res
        .status(404)
        .json({ success: false, message: "Partner user not found" });
    }

    const relationship = await Relationship.findOne({
      $or: [
        { user1: req.user.userId, user2: partnerId },
        { user1: partnerId, user2: req.user.userId },
      ],
    });

    if (!relationship) {
      return res.json({ status: 404, message: "Relationship not found" });
    }

    // Create notification for the sender
    await Notification.create({
      user: req.user.userId,
      type: "sendLove",
      message: `${partnerUser.fullname} أنت أرسلت ضغطة شوق إلى `,
    });

    // Create notification for the receiver
    await Notification.create({
      user: partnerId,
      type: "sentLove",
      message: ` أرسل لك ضغطة شوق ${user.fullname}`,
    });

    const message = {
      notification: {
        title: `${user.fullname} ❤️ أرسل لك ضغطة شوق`,
        body: "بحبك ودايب في حبك",
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDKg1cDiIlTJXwUBjgqvzlOMSwHBYsFesGuA&s",
      },
      topic: `${partnerId}`,
    };

    const response = await admin.messaging().send(message);

    console.log(response);
    res.status(200).json({
      success: true,
      message: ` ${partnerUser.fullname} تم ارسال ضغطه الشوق بنجاح الي `,
      response,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
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

exports.editProfile = expressAsyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const { fullname, email, phone, sex, age, password } = req.body;

    // Update user details
    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (sex) user.sex = sex;
    if (age) user.age = age;

    // Hash the new password if it's provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // Save the updated user
    await user.save();

    // Return the updated user data
    res.status(200).json({ success: true, user });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
});

exports.getUserNotifications = expressAsyncHandler(async (req, res) => {
  try {
    const userId = req.user.userId;

    // Fetch all notifications for the user
    const notifications = await Notification.find({ user: userId }).sort({
      createdAt: -1,
    });

    // Count unread notifications
    const unreadCount = await Notification.countDocuments({
      user: userId,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "حدث خطأ في الخادم" });
  }
});
exports.markNotificationAsRead = expressAsyncHandler(async (req, res) => {
  try {
    const { notificationId } = req.params;

    // Find and update the specific notification
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: req.user.userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res
        .status(404)
        .json({ success: false, message: "Notification not found" });
    }

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "حدث خطأ في الخادم" });
  }
});
exports.markAllNotificationsAsRead = expressAsyncHandler(async (req, res) => {
  try {
    // Update all notifications for the user to read
    const result = await Notification.updateMany(
      { user: req.user.userId, isRead: false },
      { isRead: true }
    );

    res.status(200).json({
      success: true,
      message: `Marked ${result.modifiedCount} notifications as read`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "حدث خطأ في الخادم" });
  }
});
