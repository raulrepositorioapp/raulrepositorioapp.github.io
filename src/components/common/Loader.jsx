import React from "react";

export default function Loader() {
  return (
    <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center z-99 backdrop-blur-[10px]">
      <div class="loading-wave">
        <div class="loading-bar"></div>
        <div class="loading-bar"></div>
        <div class="loading-bar"></div>
        <div class="loading-bar"></div>
      </div>
    </div>
  );
}
