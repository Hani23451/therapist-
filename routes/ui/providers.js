const router = require("express").Router();
const providerValidation = require("../../middlewares/providerValidation");
// router.get("/", authAdminValidation, (req, res) => {
//   res.render("pages/home", { name: "Chris Martin" });
// });

router.get("/login", async (req, res) => {
  try {
    res.render("pages/Providers/ProviderLogin");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

router.get("/dashboard",providerValidation , async (req, res) => {
  try {
    res.render("pages/Providers/ProviderDashBoard");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
