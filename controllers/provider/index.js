const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const TherapistProvider = require("../../models/TherapistProvider"); // Adjust the import path as necessary

exports.ProviderLogin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);
  try {
    // Fetch the therapist provider from the database 

    const therapistProvider = await TherapistProvider.findOne({ email });

    // Check if the therapist provider exists
    if (!therapistProvider) {
      return res.render("pages/Providers/ProviderLogin", {
        error: "Invalid email or password",
      });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, therapistProvider.password);

    // If password does not match
    if (!isMatch) {
      return res.render("pages/Providers/ProviderLogin", {
        error: "Invalid email or password",
      });
    }

    // Successful login, redirect or render the next page
    // For example, redirecting to a dashboard
    req.session.userId = 1; // Store user ID in session
    console.log("authorized");

    return res.redirect("/provider/dashboard"); // Adjust to your actual dashboard route
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .render("pages/Providers/ProviderLogin", {
        error: "Internal server error",
      });
  }
});
