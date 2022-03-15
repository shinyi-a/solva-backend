const express = require("express");
const app = express();
const Block = require("../models/blockModel");

app.use(express.urlencoded({ extended: true }));

//get all blocks
app.get("/all", async (req, res) => {
  const hdb = await Block.find();
  res.send(hdb);
});

//get all pending blocks
app.get("/pending", async (req, res) => {
  const hdb = await Block.find({ status: "Pending" });
  res.send(hdb);
});

//get all under construction blocks
app.get("/construction", async (req, res) => {
  const hdb = await Block.find({ status: "Construction" });
  res.send(hdb);
});

//get all waiting for testing commissioning blocks
app.get("/tnc", async (req, res) => {
  const hdb = await Block.find({ status: "Testing and Commissioning" });
  res.send(hdb);
});

//get all turned on blocks
app.get("/turnon", async (req, res) => {
  const hdb = await Block.find({ status: "Turned On" });
  res.send(hdb);
});

//get turned on blocks within the last 12 months
app.get("/graph", async (req, res) => {
  const months = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  const dateNow = new Date();
  const monthNow = months[dateNow.getMonth()];
  const yearNow = dateNow.getFullYear();
  let startdate = `${yearNow - 1}-${monthNow}-01T00:00:00.000Z`;
  let enddate = `${yearNow}-${monthNow}-31T00:00:00.000Z`;
  const hdb = await Block.find({
    status: "Turned On",
    turnondate: { $gte: startdate, $lte: enddate },
  });
  res.send(hdb);
});

//to find the list of blocks under the specific project manager, id is project manager _id
app.get("/user/:id", async (req, res) => {
  const { id } = req.params;
  const hdb = await Block.find({ projectmanager: id });
  // const hdb = await Block.find({ email: id });
  res.send(hdb);
});

//get all under construction blocks under current user
app.get("/construction/:id", async (req, res) => {
  const { id } = req.params;
  const hdb = await Block.find({ status: "Construction", email: id }).sort({
    constructiondate: 1,
  });
  res.send(hdb);
});

//get all waiting for testing commissioning blocks under current user
app.get("/tnc/:id", async (req, res) => {
  const { id } = req.params;
  const hdb = await Block.find({
    status: "Testing and Commissioning",
    email: id,
  }).sort({
    tncdate: 1,
  });
  res.send(hdb);
});

//use this for view sorting/graph in user detail page or block status page - stretch goal
//to find the pending blocks under the specific project manager
// app.get("/user/:id/pending", async (req, res) => {
//   const { id } = req.params;
//   const hdb = await Block.find({ projectmanager: id, status: "Pending" });
//   res.send(hdb);
// });

//to find the construction blocks under the specific project manager - stretch goal
// app.get("/user/:id/construction", async (req, res) => {
//   const { id } = req.params;
//   const hdb = await Block.find({ projectmanager: id, status: "Construction" });
//   res.send(hdb);
// });

//to find the tnc blocks under the specific project manager - stretch goal
// app.get("/user/:id/tnc", async (req, res) => {
//   const { id } = req.params;
//   const hdb = await Block.find({ projectmanager: id, status: "Testing and Commissioning" });
//   res.send(hdb);
// });

//to find the turned on blocks under the specific project manager - stretch goal
// app.get("/user/:id/turned on", async (req, res) => {
//   const { id } = req.params;
//   const hdb = await Block.find({ projectmanager: id, status: "Turned On" });
//   res.send(hdb);
// });

//get the specific block details, id is postal code
app.get("/:id", async (req, res) => {
  const { id } = req.params;
  const hdb = await Block.find({ postalcode: id });
  res.send(hdb);
});

//update block status
app.put("/:id", async (req, res) => {
  const { id } = req.params;
  const hdb = await Block.updateOne({ postalcode: id }, req.body, {
    new: true,
  });
  res.send(hdb);
});

//to add new pending blocks
app.post("/", async (req, res) => {
  try {
    console.log("new hdb: ", req.body);
    const hdb = await Block.create(req.body);
    res.send(hdb);
  } catch (error) {
    console.log("this is er");
    console.log(error);
    res.status("E11000");
  }
});

//to delete block - functionality can only be done by Admin - stretch goal
// app.delete("/:id", async (req, res) => {
//   const hdb = await Block.findOneAndDelete({ _id: req.params.id });
//   res.send(hdb);
// });

module.exports = app;
