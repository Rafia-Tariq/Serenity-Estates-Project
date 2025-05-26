import React, { useState } from 'react';
import axios from 'axios';
import "../styles/prediction.scss"
import Navbar from "../components/Navbar"; // Importing Navbar component

const Prediction = () => {
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [size, setSize] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null); // Clear previous errors

    const inputData = {
      beds: bedrooms,
      baths: bathrooms,
      size: size,
      zip_code: zipCode,
    };

    try {
      const response = await axios.post('http://localhost:5001/prediction', inputData);
      setPrediction(response.data.prediction); // Assuming the response has a `prediction` field
    } catch (error) {
      console.error("There was an error making the prediction!", error);
      setError('Error fetching prediction. Please try again.');
    }
  };

  return (
    <div>
      <Navbar /> {/* Including Navbar component */}
      <div className="prediction"> {/* Apply the prediction class to the root div */}
        <h1>House Price Prediction</h1>
        <form className="prediction-form" onSubmit={handleSubmit}> {/* Apply the prediction-form class to the form */}
          <div>
            <label>
              Bedrooms:
              <input
                type="number"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Bathrooms:
              <input
                type="number"
                step="0.1"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Size (sq ft):
              <input
                type="number"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Zip Code:
              <input
                type="number"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                required
              />
            </label>
          </div>
          <button type="submit">Predict</button>
        </form>
        {prediction && (
          <div>
            <h2>Predicted Price: ${prediction}</h2>
          </div>
        )}
        {error && (
          <div>
            <p style={{ color: 'red' }}>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prediction;
