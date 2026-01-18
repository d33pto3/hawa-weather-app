import React from "react";

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  style?: React.CSSProperties;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  width,
  height,
  style,
}) => {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width: width || "100%",
        height: height || "1rem",
        ...style,
      }}
    />
  );
};

export default Skeleton;
