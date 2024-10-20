const router = require("express").Router();
const multer = require("multer"); // Use multer only for handling file uploads
const { ProviderLogin } = require("../../controllers/provider/index");

router.post("/create-provider", ProviderLogin);
module.exports = router;
