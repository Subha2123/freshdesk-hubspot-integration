import React from "react";
import { useNavigate } from "react-router-dom";

const TitleBackNaviagtion = ({
  to = "/dashboard",
  label = "Dashboard",
  current = "Current",
  showBackArrow = true,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center text-sm mb-4">
      <button
        onClick={() => navigate(to)}
        className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 cursor-pointer"
      >
        {showBackArrow && <span>←</span>}
        {label}
      </button>

      <span className="mx-2 text-gray-400">/</span>

      <span className="text-gray-600 font-medium">{current}</span>
    </div>
  );
};

export default TitleBackNaviagtion;
