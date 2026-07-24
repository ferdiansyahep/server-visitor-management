require("dotenv").config();
const express = require("express");
const visitorRoutes = require('./routes/visitor.route');
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


app.use('/api', visitorRoutes);

app.use('/', (req, res) => {
  res.send('Hello World!');
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})