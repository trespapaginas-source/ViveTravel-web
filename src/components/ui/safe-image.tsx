import React, { useState, useEffect } from "react";
import { Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  fallbackIcon?: React.ReactNode;
  wrapperClassName?: string;
}

export function SafeImage({
  src,
  alt,
  className,
  wrapperClassName,
  fallbackSrc = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80",
  fallbackIcon,
  ...props
}: SafeImageProps) {
  const [error, setError] = useState(false);
  const [fallbackError, setFallbackError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Reset error states if src changes
  useEffect(() => {
    setError(false);
    setFallbackError(false);
    setLoaded(false);
  }, [src]);

  // If no source provided initially, act as error
  const currentSrc = error || !src ? fallbackSrc : src;

  return (
    <div className={cn("relative w-full h-full overflow-hidden bg-muted flex items-center justify-center", wrapperClassName)}>
      {(!loaded || error || fallbackError) && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 backdrop-blur-sm z-0">
          {fallbackIcon || <ImageIcon className="w-8 h-8 text-muted-foreground/30" />}
        </div>
      )}
      
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {!fallbackError && currentSrc && (
        <img
          src={currentSrc}
          alt={alt || "Image"}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300 z-10 relative",
            loaded && !fallbackError ? "opacity-100" : "opacity-0",
            className
          )}
          onLoad={() => setLoaded(true)}
          onError={() => {
            if (!error && src) {
              setError(true);
            } else {
              setFallbackError(true);
              setLoaded(true);
            }
          }}
          {...props} />
      )}
    </div>
  );
}
