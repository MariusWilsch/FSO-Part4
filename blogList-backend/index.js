const app = require("./app.js");
const express = require('express')
const cors = require("cors");


app.use(cors());
app.use(express.json());



const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
