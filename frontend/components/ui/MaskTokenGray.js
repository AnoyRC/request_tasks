import React from "react";

const MaskTokenGray = ({ image }) => {
  return (
    <div
      className="w-8 h-8 -rotate-12 opacity-45"
      style={{
        backgroundColor: "gray",
        maskImage: `url(${image})`,
        maskSize: "contain",
        maskRepeat: "no-repeat",
        maskPosition: "center",
      }}
    />
  );
};

export default MaskTokenGray;
