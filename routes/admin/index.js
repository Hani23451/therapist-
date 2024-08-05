const router = require("express").Router();
const multer = require("multer"); // Use multer only for handling file uploads
const {
  AdminLogin,
  createGemsBundle,
  deleteGemsBundle,
  createQuestion,
  deleteQuestion,
  createContact,
  createStory,
  deleteStory,
  addExperience,
  deleteExperience,
  updateExperienceStatus,
  creatingPersonAnalytics,
} = require("../../controllers/admin/index");
const storage = multer.memoryStorage();
const upload = multer({ storage });


router.post("/auth", AdminLogin);
router.post("/create-gems", createGemsBundle);
router.delete("/delete-gems/:id", deleteGemsBundle);
router.delete("/delete-question/:id", deleteQuestion);
router.post("/add-contact", createContact);
router.post("/add-stroy", createStory);
router.post("/add-experience", addExperience);
router.post(
  "/add-person-analytics",
  upload.single("video"),
  creatingPersonAnalytics
);
router.post("/create-question", createQuestion);
router.post("/stories/delete/:id", deleteStory);
router.post("/delete-experience/:id", deleteExperience);
router.post("/update-experience-status/:id", updateExperienceStatus);

module.exports = router;
