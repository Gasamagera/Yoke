const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });
const app = require("./app");


const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  encodeURIComponent(process.env.DATABASE_PASSWORD)
);
mongoose
  .connect(DB)
  .then((con) => {
    console.log("DATABASE Connection Successful");
  });

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
