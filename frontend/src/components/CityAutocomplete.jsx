import React, { useState, useEffect, useRef } from 'react';
import './CityAutocomplete.css';

const CityAutocomplete = ({ value, onChange, placeholder = 'Search city...' }) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  // Comprehensive Indian cities list
  const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 
    'Kolkata', 'Surat', 'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur',
    'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 
    'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik',
    'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivali', 'Vasai-Virar',
    'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 
    'Navi Mumbai', 'Allahabad', 'Ranchi', 'Howrah', 'Coimbatore',
    'Jabalpur', 'Gwalior', 'Vijayawada', 'Jodhpur', 'Madurai', 
    'Raipur', 'Kota', 'Chandigarh', 'Guwahati', 'Solapur',
    'Hubli-Dharwad', 'Mysore', 'Tiruchirappalli', 'Bareilly', 'Aligarh',
    'Tiruppur', 'Moradabad', 'Jalandhar', 'Bhubaneswar', 'Salem',
    'Warangal', 'Mira-Bhayandar', 'Thiruvananthapuram', 'Bhiwandi',
    'Saharanpur', 'Guntur', 'Amravati', 'Bikaner', 'Noida', 
    'Jamshedpur', 'Bhilai', 'Cuttack', 'Firozabad', 'Kochi',
    'Nellore', 'Bhavnagar', 'Dehradun', 'Durgapur', 'Asansol',
    'Rourkela', 'Nanded', 'Kolhapur', 'Ajmer', 'Akola',
    'Gulbarga', 'Jamnagar', 'Ujjain', 'Loni', 'Siliguri',
    'Jhansi', 'Ulhasnagar', 'Jammu', 'Sangli', 'Mangalore', 
    'Erode', 'Belgaum', 'Ambattur', 'Tirunelveli', 'Malegaon', 
    'Gaya', 'Jalgaon', 'Udaipur', 'Maheshtala', 'Tirupati',
    'Davanagere', 'Kozhikode', 'Akola', 'Kurnool', 'Bokaro',
    'Rajahmundry', 'Ballari', 'Agartala', 'Bhagalpur', 'Latur',
    'Dhule', 'Korba', 'Bhilwara', 'Brahmapur', 'Muzaffarpur',
    'Ahmednagar', 'Mathura', 'Kollam', 'Avadi', 'Kadapa',
    'Kamarhati', 'Sambalpur', 'Bilaspur', 'Shahjahanpur', 'Satara',
    'Bijapur', 'Rampur', 'Shivamogga', 'Chandrapur', 'Junagadh',
    'Thrissur', 'Alwar', 'Bardhaman', 'Kulti', 'Kakinada',
    'Nizamabad', 'Parbhani', 'Tumkur', 'Khammam', 'Ozhukarai',
    'Bihar Sharif', 'Panipat', 'Darbhanga', 'Bally', 'Aizawl',
    'Dewas', 'Ichalkaranji', 'Karnal', 'Bathinda', 'Jalna',
    'Eluru', 'Kirari Suleman Nagar', 'Barasat', 'Purnia', 'Satna',
    'Mau', 'Sonipat', 'Farrukhabad', 'Sagar', 'Rourkela',
    'Durg', 'Imphal', 'Ratlam', 'Hapur', 'Arrah', 'Karimnagar',
    'Anantapur', 'Etawah', 'Ambernath', 'North Dumdum', 'Bharatpur',
    'Begusarai', 'New Delhi', 'Gandhidham', 'Baranagar', 'Tiruvottiyur',
    'Puducherry', 'Sikar', 'Thoothukudi', 'Rewa', 'Mirzapur',
    'Raichur', 'Pali', 'Ramagundam', 'Haridwar', 'Vijayanagaram',
    'Katihar', 'Naihati', 'Sambhal', 'Nadiad', 'Malda', 'Yamunanagar'
  ];

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.length > 0) {
      const filtered = cities
        .filter(city => city.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 50); // Limit to 50 results for performance
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      onChange('');
    }
  };

  const handleSuggestionClick = (city) => {
    setInputValue(city);
    onChange(city);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleFocus = () => {
    // Show all cities when clicking on empty input
    if (inputValue.length === 0) {
      setSuggestions(cities.slice(0, 50));
      setShowSuggestions(true);
    } else {
      const filtered = cities
        .filter(city => city.toLowerCase().includes(inputValue.toLowerCase()))
        .slice(0, 50);
      setSuggestions(filtered);
      setShowSuggestions(true);
    }
  };

  return (
    <div className="city-autocomplete" ref={wrapperRef}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        placeholder={placeholder}
        className="city-input"
        autoComplete="off"
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((city, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(city)}
              className="suggestion-item"
            >
              {city}
            </li>
          ))}
        </ul>
      )}
      
      {showSuggestions && inputValue.length > 0 && suggestions.length === 0 && (
        <ul className="suggestions-list">
          <li className="suggestion-item no-results">No cities found</li>
        </ul>
      )}
    </div>
  );
};

export default CityAutocomplete;