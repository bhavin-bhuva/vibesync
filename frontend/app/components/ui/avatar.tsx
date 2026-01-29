import React from "react";

interface AvatarProps {
  src?: string;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl";
  online?: boolean;
  className?: string;
}

export function Avatar({
  src,
  alt,
  size = "md",
  online,
  className = "",
}: AvatarProps) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        className={`
          ${sizes[size]} rounded-full overflow-hidden
          bg-gradient-to-br from-purple-500 to-blue-500
          flex items-center justify-center text-white font-semibold
          ring-2 ring-white/20
        `}
      >
        {src ? (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : (
          <span className={size === "sm" ? "text-xs" : "text-sm"}>
            {getInitials(alt)}
          </span>
        )}
      </div>
      {online !== undefined && (
        <span
          className={`
            absolute bottom-0 right-0 block rounded-full ring-2 ring-white dark:ring-gray-900
            ${size === "sm" ? "w-2 h-2" : "w-3 h-3"}
            ${online ? "bg-green-500" : "bg-gray-400"}
          `}
        />
      )}
    </div>
  );
}
