
import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: React.ReactNode;
}

const Image = ({ 
  src, 
  alt, 
  className, 
  fallback, 
  ...props 
}: ImageProps) => {
  const [error, setError] = useState(false);
  
  const handleError = () => {
    setError(true);
  };
  
  if (error && fallback) {
    return <>{fallback}</>;
  }
  
  return (
    <img 
      src={src} 
      alt={alt} 
      className={cn("w-full h-full", className)}
      onError={handleError}
      {...props}
    />
  );
};

export default Image;
