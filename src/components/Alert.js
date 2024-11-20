// Alert.js
import React, { useEffect } from "react";

const Alert = ({ message, type, duration, onClose }) => {
  useEffect(() => {
    // Set a timeout to automatically hide the alert after `duration` milliseconds
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      // Clean up the timer when the component unmounts
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!message) return null; // Don't render anything if there is no message

  return (
    <div className={`alert alert-${type} alert-dismissible fade show`} role="alert">
      {message}
      <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
    </div>
  );
};

export default Alert;
