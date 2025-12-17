import React, { useState } from 'react';

const FilterSidebar = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    propertyType: '',
    listingType: '',
    city: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    condition: ''
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    setFilters({
      propertyType: '',
      listingType: '',
      city: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      condition: ''
    });
    onFilter({});
  };

  return (
    <div className="filter-sidebar">
      <h3>Filter Properties</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Property Type</label>
          <select name="propertyType" value={filters.propertyType} onChange={handleChange}>
            <option value="">All Types</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="house">House</option>
            <option value="flat">Flat</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>

        <div className="form-group">
          <label>Listing Type</label>
          <select name="listingType" value={filters.listingType} onChange={handleChange}>
            <option value="">All</option>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>
        </div>

        <div className="form-group">
          <label>City</label>
          <input 
            type="text" 
            name="city" 
            value={filters.city} 
            onChange={handleChange}
            placeholder="Enter city"
          />
        </div>

        <div className="form-group">
          <label>Price Range</label>
          <div className="price-inputs">
            <input 
              type="number" 
              name="minPrice" 
              value={filters.minPrice} 
              onChange={handleChange}
              placeholder="Min"
            />
            <input 
              type="number" 
              name="maxPrice" 
              value={filters.maxPrice} 
              onChange={handleChange}
              placeholder="Max"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Bedrooms</label>
          <select name="bedrooms" value={filters.bedrooms} onChange={handleChange}>
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </div>

        <div className="form-group">
          <label>Bathrooms</label>
          <select name="bathrooms" value={filters.bathrooms} onChange={handleChange}>
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
          </select>
        </div>

        <div className="form-group">
          <label>Condition</label>
          <select name="condition" value={filters.condition} onChange={handleChange}>
            <option value="">All Conditions</option>
            <option value="new">New</option>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
          </select>
        </div>

        <button type="submit" className="btn-filter">Apply Filters</button>
        <button type="button" onClick={handleReset} className="btn-reset">Reset</button>
      </form>
    </div>
  );
};

export default FilterSidebar;