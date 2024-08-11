const asyncHandler = require("express-async-handler");
const GemsBundle = require("../../models/GemsBundle");
const Questions = require("../../models/Questions");
const Settings = require("../../models/Settings");
const Stories = require("../../models/Stories");
const Experience = require("../../models/Experience");
const PersonAnalytics = require("../../models/PersonAnalytics");
const cloudinary = require("../../config/Cloudinary");
const sharp = require("sharp");
const bufferToStream = require("../../utils/ImageStream");
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
    const { name, content_free, content_paid , jewelCount, isPaid } = req.body;
    if (!req.file) {
      const newStory = new Stories({
        name,
        content_free,
        content_paid, 
        content:content_free + content_paid,
        jewelCount,
        isPaid: isPaid === "true", // Convert string to boolean
      });

      // Save the story to the database
      await newStory.save();
      console.log(newStory);
      // Redirect to the stories page or wherever you want 
      console.log(newStory)
      return res.redirect("/stories");
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: "stories",
        timeout: 220000,
      },
      async (error, result) => {
        if (error) {
          console.error("Error uploading audio:", error);
          return res
            .status(500)
            .json({ message: "Error uploading audio", error: error.message });
        }

        try {
          // Create a new story instance
          const newStory = new Stories({
            name,
            content_free,
            content_paid,
            jewelCount,
            audio: result.secure_url,
            isPaid: isPaid === "true", // Convert string to boolean
          });

          // Save the story to the database
          await newStory.save();
          console.log(newStory);
          // Redirect to the stories page or wherever you want
          res.redirect("/stories");
        } catch (saveError) {
          console.error("Error saving story", saveError);
          return res.status(500).json({
            message: "Error saving Story",
            error: saveError.message,
          });
        }
      }
    );

    bufferToStream(req.file.buffer).pipe(stream);
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

exports.creatingPersonAnalytics = asyncHandler(async (req, res) => {
  try {
    const { title, description, task1, task2, task3, task4, task5, task6 } =
      req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Convert tasks to an array
    const tasks = [task1, task2, task3, task4, task5, task6].filter(
      (task) => task
    );

    // Convert buffer to stream
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "video",
        folder: "persons_analytics",
        timeout: 320000,
      },
      async (error, result) => {
        if (error) {
          console.error("Error uploading video:", error);
          return res
            .status(500)
            .json({ message: "Error uploading video", error: error.message });
        }

        try {
          // Create new PersonAnalytics instance
          const personAnalytics = new PersonAnalytics({
            title,
            description,
            video: result.url,
            tasks, // Pass the tasks array
          });

          // Save to database
          await personAnalytics.save();
          const data = await PersonAnalytics.find({});
          return res.render("pages/analytics", { data, PersonAnalytic: true });
        } catch (saveError) {
          console.error("Error saving PersonAnalytics:", saveError);
          return res.status(500).json({
            message: "Error saving PersonAnalytics",
            error: saveError.message,
          });
        }
      }
    );

    bufferToStream(req.file.buffer).pipe(stream);
  } catch (error) {
    console.error("Error in creatingPersonAnalytics:", error);
    res
      .status(500)
      .json({ message: "Error processing request", error: error.message });
  }
});
 


exports.uploadQuestion = asyncHandler(async (req, res) => {
  try {
   
    console.log(req); 
    res.status(200).json({ success: true, message: "Uploaded successfully" });
  } catch (error) {
    console.error("Error in creatingPersonAnalytics:", error);
    res
      .status(500)
      .json({ message: "Error processing request", error: error.message });
  }
});