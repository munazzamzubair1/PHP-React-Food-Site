// Import necessary modules
import React, { createContext, useState } from "react";

// Create the context
const UploadFileSrc = createContext();

// Define the contextProvider component
const ContextProvider = ({ children }) => {
  const [url, setUrl] = useState(process.env.REACT_APP_IMG_URL); // Set the initial URL state

  return <UploadFileSrc.Provider value={{ url, setUrl }}>{children}</UploadFileSrc.Provider>;
};

export { ContextProvider, UploadFileSrc };
