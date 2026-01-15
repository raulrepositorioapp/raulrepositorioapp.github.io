import React from "react";
import { useLocation } from "react-router-dom";

export default function CarIconSVG() {
  const currentPath = useLocation().pathname;
  const isActive = currentPath === "/vechile";

  return (
    <svg
      className="w-full h-auto"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.49 2.82996H15.51C18 2.82996 18.55 4.06996 18.87 5.58996L20 11H4L5.13 5.58996C5.45 4.06996 6 2.82996 8.49 2.82996Z"
        stroke={isActive ? "#fff" : "#637381"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.00929 19.82C1.89929 20.99 2.83929 22 4.03929 22H5.91929C6.99929 22 7.14929 21.54 7.33929 20.97L7.53929 20.37C7.81929 19.55 7.99929 19 9.43929 19H14.5593C15.9993 19 16.2093 19.62 16.4593 20.37L16.6593 20.97C16.8493 21.54 16.9993 22 18.0793 22H19.9593C21.1593 22 22.0993 20.99 21.9893 19.82L21.4293 13.73C21.2893 12.23 20.9993 11 18.3793 11H5.61929C2.99929 11 2.70929 12.23 2.56929 13.73L2.00929 19.82Z"
        stroke={isActive ? "#fff" : "#637381"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 8H21"
        stroke={isActive ? "#fff" : "#637381"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 8H4"
        stroke={isActive ? "#fff" : "#637381"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 3V5"
        stroke={isActive ? "#fff" : "#637381"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 5H10.5"
        stroke={isActive ? "#fff" : "#637381"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 15H15"
        stroke={isActive ? "#fff" : "#637381"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 15H6"
        stroke={isActive ? "#fff" : "#637381"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
