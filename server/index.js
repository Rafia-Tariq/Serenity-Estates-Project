const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");
const axios = require("axios"); 

const authRoutes = require("./routes/auth.js");
const listingRoutes = require("./routes/listing.js");
const bookingRoutes = require("./routes/booking.js");
const userRoutes = require("./routes/user.js");

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/properties", listingRoutes);
app.use("/bookings", bookingRoutes);
app.use("/users", userRoutes);

// Prediction route
app.post("/predict", (req, res) => {
  // Dummy prediction logic
  const { beds, baths, size, zip_code } = req.body;
  const prediction = 450000; // Replace with actual prediction logic
  res.json({ prediction });
});

/* MONGOOSE SETUP */
const PORT = 5001;
mongoose.connect(`mongodb+srv://serenity123:serenity123@cluster0.irlsaee.mongodb.net/your_database_name?retryWrites=true&w=majority&appName=Cluster0`, {
  dbName: "Serenity_Estates",
  useNewUrlParser: true,
  useUnifiedTopology: true,  
})
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((err) => console.log(`${err} did not connect`));
