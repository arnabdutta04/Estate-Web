import React from 'react';
import { FaHome, FaSpinner, FaCircleNotch } from 'react-icons/fa';

const LoadingSpinner = ({ 
  text = "Loading", 
  subtext = "Please wait while we fetch your data",
  size = "default", // "small", "default", "large"
  type = "house", // "house", "spinner", "circle"
  overlay = false, // Show as overlay over content
  fullScreen = false // Take full screen height
}) => {
  const sizeClasses = {
    small: 'loading-small',
    default: '',
    large: 'loading-large'
  };

  const icons = {
    house: <FaHome className="loading-icon" />,
    spinner: <FaSpinner className="loading-icon loading-spin" />,
    circle: <FaCircleNotch className="loading-icon loading-spin" />
  };

  const containerClass = `
    loading-container 
    ${sizeClasses[size]} 
    ${overlay ? 'loading-overlay' : ''} 
    ${fullScreen ? 'loading-fullscreen' : ''}
  `.trim();

  return (
    <div className={containerClass}>
      <div className="loading-content">
        {icons[type]}
        <div className="loading-text">
          {text}
          <span className="loading-dots"></span>
        </div>
        {subtext && <div className="loading-subtext">{subtext}</div>}
      </div>
    </div>
  );
};

export default LoadingSpinner;