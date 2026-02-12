import React from "react";

const PageTransition = ({ children }) => {
  return (
    <div className="page-transition">
      <div className="page-content">{children}</div>
    </div>
  );
};

export default PageTransition;