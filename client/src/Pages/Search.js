import React, { useState } from 'react';
import axios from 'axios';
import "../styles/search.scss";
import Navbar from "../components/Navbar"; // Importing Navbar component

const Search = () => {
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [size, setSize] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.get('http://localhost:5000/search', {
        params: {
          beds: bedrooms,
          baths: bathrooms,
          size: size,
          zip_code: zipCode,
        },
      });
      setResults(response.data.results);
    } catch (error) {
      console.error('There was an error making the search!', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="search">
        <h1>Search Houses</h1>
        <form className="search-form" onSubmit={handleSearch}>
          <div>
            <label>
              Bedrooms:
              <input
                type="number"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
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
              />
            </label>
          </div>
          <button type="submit">Search</button>
        </form>
        {results.length > 0 && (
          <div className="search-results">
            <h2>Search Results:</h2>
            <ul>
              {results.map((result, index) => (
                <li key={index}>
                  <p>{result.beds} beds, {result.baths} baths, {result.size} sq ft, Zip Code: {result.zip_code}, Price: ${result.price}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
