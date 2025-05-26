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





Categories.jsx:
import { categories } from "../data";
import "../styles/Categories.scss"
import { Link } from "react-router-dom";

const Categories = () => {
  return (
    <div className="categories">
      <h1>Explore Top Categories</h1>
      <p>
        Find the perfect vacation rental tailored to your travel style. Dive into local experiences, enjoy cozy comforts, and make unforgettable moments at your dream destination.
      </p>

      <div className="categories_list">
        {categories?.slice(1, 7).map((category) => (
  <Link key={category.label} to={`/properties/category/${category.label}`}>
    <div className="category">
              <img src={category.img} alt={category.label} />
              <div className="overlay"></div>
              <div className="category_text">
                <div className="category_text_icon">{category.icon}</div>
                <p>{category.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories

