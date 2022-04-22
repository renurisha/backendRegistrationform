const bcrypt = require("bcryptjs");
const express = require("express");

const hbs = require("hbs");
const path = require("path");
const Register = require("./models/register");

require("./db/connect");
const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "hbs");

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/register",async(req,res)=>{
  try{
    const user=await Register.find();
    res.send(user)
  }
  catch(e){
    res.send(e.message)
  }
})
app.post("/register", async (req, res) => {
  const user = new Register({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
  });
  const token = await user.generateToken();
  res.cookie("jwt", token);

  const createduser = await user.save();
  res.status(201).render("index");

  res.send(createduser);
});
app.get("/login", (req, res) => {
  //console.log(req.body.name);

  res.render("login");
});
app.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await Register.findOne({ email: email, password: password });
  console.log("user", user);
  //const isMatch = await bcrypt.compare(password, user.email);
  //console.log(password, user.email);

  if (user) {
    const token = await user.generateToken();
    console.log("logintoken", token);
    res.status(201).render("index");
  } else {
    res.status(400).send("invalid user");
  }
});

app.listen(port, () => {
  console.log("listening on port");
});
