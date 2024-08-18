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
const PersonAnalytics = require("../../models/PersonAnalytics");
const GameModelTwo = require("../../models/GameModelTwo");
const GameModelThree = require("../../models/GameModelThree");
const GameModelOne = require("../../models/GameModelOne");
const nodemailer = require("nodemailer");
const shuffleArray = require("../../utils/shuffleArray");
const RtcGenerateToken = require("../../utils/createRtcToken");
const fireBaseMessage = require("../../utils/firebaseMessage");
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
}); // Adjust the path as needed

exports.linkCouples = expressAsyncHandler(async (req, res) => {
  try {
    const userId = req.user.userId;
    const email = req.body.email; // Email of the user to link with

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Find the user with the given email
    const matchedUser = await User.findOne({ email, _id: { $ne: userId } });

    if (matchedUser) {
      // Set current user status to "pending"
      user.linkedWord = email;
      user.relationshipStatus = "pending";
      await user.save();

      async function sendOTP() {
        let transporter = nodemailer.createTransport({
          service: "gmail",
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: "mostafaisa208@gmail.com",
            pass: "bqzl uyxy lvdu bfbk",
          },
        });

        let info = await transporter.sendMail({
          from: "therapist@gmail.com",
          to: matchedUser.email,
          subject: "الارتباط بشريك علي تطبيق Therapist",

          html: `
        <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          color: #333;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: auto;
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
          background-color: #FFC107; /* Yellow color */
          color: #fff;
          padding: 10px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          padding: 20px;
        }
        .content p {
          font-size: 16px;
          line-height: 1.5;
        }
        .button {
          display: inline-block;
          font-size: 16px;
          color: #fff;
          background-color: #FFC107; /* Yellow color */
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 5px;
          margin-top: 20px;
        }
        .footer {
          text-align: center;
          padding: 10px;
          font-size: 14px;
          color: #777;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Connection Request</h1>
        </div>
        <div class="content">
          <p>مرحباً،</p>
          <p>قام المستخدم ${user.fullname} بطلب الارتباط بك. يرجى <a class="button" href="https://hani-server-3qfo.onrender.com/api/user/confirm-connection?userId=${userId}&matchedUserId=${matchedUser._id}">الضغط هنا</a> لقبول   الارتباط.</p>
        </div>
        <div class="footer">
          <p>شكراً لك!</p>
        </div>
      </div>
    </body>
  </html>
          `,
        });

        console.log("Message sent: %s", info.messageId);
      }

      sendOTP()
        .then(async (result) => {
          console.log("Confirmation email sent: %s", result);
          return res.status(200).json({
            success: true,
            message: "طلب الارتباط تم ارساله الي الطرف الاخر بانتظار التاكيد",
          });
        })
        .catch((err) => console.error(err));
    } else {
      // No matched user found
      return res.status(404).json({
        success: false,
        message: "User with the provided email not found",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

exports.confirmConnection = expressAsyncHandler(async (req, res) => {
  try {
    const { userId, matchedUserId } = req.query;

    if (!userId || !matchedUserId) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid request" });
    }

    const user = await User.findById(userId);
    const matchedUser = await User.findById(matchedUserId);

    if (!user || !matchedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User(s) not found" });
    }

    // Update both users to accept the connection
    user.relationshipStatus = "accepted";
    user.partner = matchedUser._id;

    matchedUser.relationshipStatus = "accepted";
    matchedUser.partner = user._id;

    await user.save();
    await matchedUser.save();

    // Render the EJS template
    return res.render("pages/SuccessConnection.ejs", {
      user1: user,
      user2: matchedUser,
    });
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
    const relationship = await Relationship.create({
      user1: userId,
      user2: partner._id,
      userName1: user.fullname,
      userName2: partnerUser.fullname,
      engagementDate: formattedEngagementDate,
      marriageDate: formattedMarriageDate,
      proposalDate: formattedProposalDate,
    });
    user.relationshipStatus = "completed";
    partner.relationshipStatus = "completed";
    user.gemsCount = user.gemsCount + 1;
    partner.gemsCount = partner.gemsCount + 1;
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
        body: "اشتقت اليك",
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDKg1cDiIlTJXwUBjgqvzlOMSwHBYsFesGuA&s",
      },
      topic: `${partnerId}`,
    };
    partnerUser.gemsCount = partnerUser.gemsCount + 1;
    user.gemsCount = user.gemsCount + 1;
    await user.save();
    await partnerUser.save();

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
    });

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

exports.getPersonsAnalytics = expressAsyncHandler(async (req, res) => {
  try {
    const data = await PersonAnalytics.find({});

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "حدث خطأ في الخادم" });
  }
});

exports.updateUserKind = expressAsyncHandler(async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    user.personType = req.body.kindId;
    user.save();

    res
      .status(200)
      .json({ success: true, message: "User kind updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "حدث خطأ في الخادم" });
  }
});

exports.getPartnerTasks = expressAsyncHandler(async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const partner = await User.findById(user.partner);
    if (!partner) {
      return res
        .status(200)
        .json({ success: false, message: "User Have No Partner" });
    }

    const typeId = partner.personType;
    if (!typeId) {
      return res
        .status(200)
        .json({ success: false, message: "Partner Have No Pass test" });
    }

    const type = await PersonAnalytics.findById(typeId);
    if (!type) {
      return res
        .status(200)
        .json({ success: false, message: "Partner Have No Pass test" });
    }
    res.status(200).json({ success: true, data: type });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "حدث خطأ في الخادم" });
  }
});

exports.sayTaskNotification = expressAsyncHandler(async (req, res) => {
  try {
    const userId = req.user.userId;
    const { task } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const partner = await User.findById(user.partner);
    if (!partner) {
      return res
        .status(200)
        .json({ success: false, message: "User Have No Partner" });
    }
    const partnerId = partner._id;
    const relationship = await Relationship.findOne({
      $or: [
        { user1: req.user.userId, user2: partnerId },
        { user1: partnerId, user2: req.user.userId },
      ],
    });
    if (relationship.loveLevel >= 100) {
      relationship.loveLevel = relationship.loveLevel;
    }
    relationship.loveLevel = relationship.loveLevel + 1;
    relationship.save();
    const message = {
      notification: {
        title: `${user.fullname}`,
        body: `قام بتنفيذ مهمة ${task} : `,
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDKg1cDiIlTJXwUBjgqvzlOMSwHBYsFesGuA&s",
      },
      topic: `${partnerId}`,
    };

    const response = await admin.messaging().send(message);
    res.status(200).json({ success: true, data: "تم ارسال الاشعار" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "حدث خطأ في الخادم" });
  }
});

exports.getRelationship = expressAsyncHandler(async (req, res) => {
  try {
    const userId = req.user.userId;
    const { task } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const partner = await User.findById(user.partner);
    if (!partner) {
      return res
        .status(200)
        .json({ success: false, message: "User Have No Partner" });
    }
    const partnerId = partner._id;

    let relationship = await Relationship.findOne({
      $or: [
        { user1: req.user.userId, user2: partnerId },
        { user1: partnerId, user2: req.user.userId },
      ],
    });
    if (!relationship) {
      return res
        .status(200)
        .json({ success: false, message: "User Have No Relationship" });
    }

    relationship = relationship;
    res.status(200).json({ success: true, data: relationship });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "حدث خطأ في الخادم" });
  }
});

exports.getGames = expressAsyncHandler(async (req, res) => {
  try {
    // Fetch data from all models
    const game1 = await GameModelOne.find().select("-content").exec();
    const game2 = await GameModelTwo.find().select("-content").exec();
    const game3 = await GameModelThree.find().select("-content").exec();

    // Combine results into a single array
    const allGames = [...game1, ...game2, ...game3];

    // Shuffle the combined array
    const shuffledGames = shuffleArray(allGames);

    // Send the response
    res.status(200).json({ success: true, data: shuffledGames });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "حدث خطأ في الخادم" });
  }
});

exports.getGame = expressAsyncHandler(async (req, res) => {
  try {
    const { model, id } = req.body;
    let data = null; // Use `let` instead of `const` to allow reassignment

    switch (model) {
      case "GameModelOne":
        data = await GameModelOne.findById(id);
        break;
      case "GameModelTwo":
        data = await GameModelTwo.findById(id);
        break;
      case "GameModelThree":
        data = await GameModelThree.findById(id);
        break;
      default:
        return res
          .status(400)
          .json({ success: false, message: "Invalid model type" }); // Handle unknown model types
    }

    if (!data) {
      return res
        .status(404)
        .json({ success: false, message: "Game not found" }); // Handle case where no game is found
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "حدث خطأ في الخادم" });
  }
});

exports.sendPlayInvitation = expressAsyncHandler(async (req, res) => {
  try {
    const { gameId, model } = req.body;
    const userId = req.user.userId;

    // Fetch user and partner
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const partnerId = user.partner;
    const partner = await User.findById(partnerId);
    if (!partner) {
      return res
        .status(404)
        .json({ success: false, message: "Partner not found" });
    }

    // Fetch game based on model
    let game;
    switch (model) {
      case "GameModelOne":
        game = await GameModelOne.findById(gameId);
        break;
      case "GameModelTwo":
        game = await GameModelTwo.findById(gameId);
        break;
      case "GameModelThree":
        game = await GameModelThree.findById(gameId);
        break;
      default: {
        return res
          .status(400)
          .json({ success: false, message: "Invalid game model" });
      }
    }

    if (!game) {
      return res
        .status(404)
        .json({ success: false, message: "Game not found" });
    }

    // Send notification
    const message = {
      notification: {
        title: `شريكك ارسل لك دعوه للعب`,
        body: `ستقومان بلعب ${game.title} `,
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDKg1cDiIlTJXwUBjgqvzlOMSwHBYsFesGuA&s",
      },
      data: {
        gameId: game._id.toString(),
        model,
      },
      topic: `${partnerId}`,
    };

    const response = await admin.messaging().send(message);

    return res
      .status(200)
      .json({ success: true, message: "Invitation sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "حدث خطأ في الخادم" });
  }
});

exports.acceptPlayInvitation = expressAsyncHandler(async (req, res) => {
  try {
    const userId = req.user.userId;

    // Fetch user and partner
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    const partnerId = user.partner;
    const partner = await User.findById(partnerId);
    if (!partner) {
      return res.status(404).json({ success: false, message: "Partner not found" });
    }

    // Generate a unique channel name for the couple
    const channelName = `${userId}_${partnerId}`;

    // Generate RTC tokens for both users
    const userTokenRtc = await RtcGenerateToken(channelName, userId); // Generate RTC Token for the user
    const partnerTokenRtc = await RtcGenerateToken(channelName, partnerId); // Generate RTC Token for the partner

    // Create Firebase messages
    const messageUser = fireBaseMessage(
      "السماح",
      "انقر للسماح باللعب",
      {
        channelName: channelName,
        userToken: userTokenRtc,
        type: "allow_call",
      },
      userId
    );

    const messagePartner = fireBaseMessage(
      "السماح",
      "انقر للسماح باللعب",
      {
        channelName: channelName,
        userToken: partnerTokenRtc,
        type: "allow_call",
      },
      partnerId
    );

    // Send notifications
    await admin.messaging().send(messageUser);
    await admin.messaging().send(messagePartner);

    return res.status(200).json({
      success: true,
      message: "Invitation accepted and RTC tokens generated",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "حدث خطأ في الخادم" });
  }
});
