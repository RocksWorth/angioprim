'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  width?: number;
  height?: number;
}

export function ProductImage({ 
  src, 
  alt, 
  className, 
  fill = false,
  sizes,
  priority = false,
  width,
  height,
  ...props 
}: ProductImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Create placeholder image URL (using btoa for browser compatibility)
  const createPlaceholderSrc = () => {
    const svgString = `<svg width="${width || 800}" height="${height || 600}" viewBox="0 0 ${width || 800} ${height || 600}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f1f5f9"/>
      <g opacity="0.5">
        <rect x="20%" y="30%" width="60%" height="40%" rx="8" fill="#cbd5e1"/>
        <circle cx="35%" cy="45%" r="8%" fill="#94a3b8"/>
        <polygon points="45%,55% 60%,40% 75%,55% 75%,70% 45%,70%" fill="#94a3b8"/>
      </g>
      <text x="50%" y="85%" text-anchor="middle" font-family="system-ui" font-size="14" fill="#64748b">
        ${alt || 'Product Image'}
      </text>
    </svg>`;
    
    return `data:image/svg+xml;base64,${typeof window !== 'undefined' ? btoa(svgString) : ''}`;
  };

  if (imageError) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 border-2 border-dashed border-slate-300 rounded-lg",
          className
        )}
        style={{ 
          width: fill ? '100%' : width, 
          height: fill ? '100%' : height,
          minHeight: fill ? '200px' : height || '200px'
        }}
      >
        <div className="text-center p-4">
          <div className="w-12 h-12 mx-auto mb-3 opacity-50">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full text-slate-400">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21,15 16,10 5,21"/>
            </svg>
          </div>
          <p className="text-sm text-slate-500 font-medium">{alt}</p>
          <p className="text-xs text-slate-400 mt-1">Image not available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Loading placeholder */}
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse rounded-inherit"
          style={{ 
            width: fill ? '100%' : width, 
            height: fill ? '100%' : height || '200px'
          }}
        />
      )}
      
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        sizes={sizes}
        priority={priority}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          fill && "object-cover"
        )}
        onError={() => {
          setImageError(true);
          setIsLoading(false);
        }}
        onLoad={() => setIsLoading(false)}
        {...props}
      />
    </div>
  );
}
