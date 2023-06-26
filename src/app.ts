import express from "express";
import route from "./routes/index";
import path from "path";
const app = express();
app.use(express.static("public"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(route);

// Start the server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
