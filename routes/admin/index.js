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
  uploadQuestion,
  createGameModelTow,
  DeleteItemModelTow,
  createGameModelThree,
  DeleteItemModelThree,
  createGameModelOne,
  DeleteItemModelOne,
  createTherapistProviderServices,
} = require("../../controllers/admin/index");
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/auth", AdminLogin);
router.post("/create-gems", createGemsBundle);
router.delete("/delete-gems/:id", deleteGemsBundle);
router.delete("/delete-question/:id", deleteQuestion);
router.post("/add-contact", createContact);
router.post("/add-stroy", upload.single("audio"), createStory);
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
router.post(
  "/upload-question",
  upload.fields([{ name: "question" }, { name: "answer" }]),
  uploadQuestion
);

router.post(
  "/create-game-modeltwo",
  upload.single("image"),
  createGameModelTow
);
router.post(
  "/create-game-modelthree",
  upload.single("image"),
  createGameModelThree
);
router.post(
  "/delete-game-modeltwo/:id",

  DeleteItemModelTow
);

router.post(
  "/delete-game-modelthree/:id",

  DeleteItemModelThree
);

router.post(
  "/create-game-modelone",
  upload.single("image"),
  createGameModelOne
);
router.post(
  "/delete-game-modelone/:id",

  DeleteItemModelOne
);

router.post(
  "/create-therapistProvider",

  createTherapistProviderServices
);
createTherapistProviderServices;
module.exports = router;
