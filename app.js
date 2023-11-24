import bodyParser from "body-parser";
import UAParser from "ua-parser-js";
import express from "express";
import logger from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import errorHandler from "errorhandler";
import { request } from "express";
import methodOverride from "method-override";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ua = UAParser(request.headers["user-agent"]);

app.set("port", 3000);
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(methodOverride());

app.use(express.static(path.join(__dirname, "public")));

app.use(errorHandler());

app.get("/", (req, res) => {
  res.render("pages/home");
});

app.get("/about", (req, res) => {
  res.render("pages/about");
});

app.listen(app.get("port"), () => {
  console.log(`listening on port ${app.get("port")}`);
});
