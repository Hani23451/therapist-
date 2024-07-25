const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const DB = require("./config/DB.config");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swager");
const session = require("express-session");
// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "mysecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 3600000, // 1 hour in milliseconds
      secure: false, // Set to true if using HTTPS
      httpOnly: true, // Ensures cookies are only used over HTTP(S), not client JavaScript
    },
  })
);
app.use(cors());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// Swagger setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/user"));
// ui
app.use(require("./routes/ui/index"));
app.use("/admin", require("./routes/admin/index"));

DB.then((con) => {
  app.listen(process.env.PORT || 8080, () => {
    console.log(
      "Listening On " +
        (process.env.PORT || 8080) +
        " DB Connect To " +
        con.connection.host
    );
    console.log(
      "DB Connected at " + "http://localhost:" + (process.env.PORT || 8080)
    );
  });
}).catch((err) => {
  throw new Error(
    "Error Happened While Connecting TO DataBase\n" + err.message,
    err.status
  );
});
