const path = require("node:path");

require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

const inventoryRoutes = require("./routes/inventoryRoute");
app.use("/inventories", inventoryRoutes);

const warehouseRoutes = require("./routes/warehouseRoute");
app.use("/warehouses", warehouseRoutes);

app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 5500;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT} `);
});
