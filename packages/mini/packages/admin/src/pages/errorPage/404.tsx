import React from "react";
import { useRouteError } from "react-router-dom";
const Error404: React.FC = () => {
  const error = useRouteError();
  console.log("🚀 ~ error:", error);
  return (
    <div>
      <h1>404 - Unauthorized</h1>
      <p>Sorry, not found this page.</p>
    </div>
  );
};

export default Error404;
