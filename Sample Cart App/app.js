const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const User = require("./models/user");

// app.get('/hello', (req, res) => {
//   res.send("Hi, there!")
// })

// app.listen(3000)

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("613c912ae0146f7f0d4d7d38")
    .then((user) => {
      console.log("user " + user);
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

const shopRouter = require("./routes/shop");
const adminRouter = require("./routes/admin");

app.use(shopRouter);

app.use("/admin", adminRouter);
app.use(adminRouter);

mongoose
  .connect("mongodb+srv://perfect:perfect123@sample.tfh3q.mongodb.net/sample")
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Pavan",
          email: "pavan@test.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
    console.log("Connected!");
    app.listen(3000, (err) => {
      console.log(err);
      console.log("Listinening on port 3000")
    });

  })
  .catch((err) => {
    console.log(err);
    res.status(500).send("Internal Error!")
  });
