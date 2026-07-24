require("dotenv").config();
const express = require("express");
const visitorRoutes = require('./routes/visitor.route');
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

app.use(cors());
app.use(express.json());


app.use('/api', visitorRoutes);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})