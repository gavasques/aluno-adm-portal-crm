
"use client"

import * as React from "react"

export function GridBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{
        background: "radial-gradient(circle at center, #9b87f5, #6E59A5)",
        zIndex: -1,
      }}
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />
      
      {/* Light effect */}
      <div 
        className="absolute -top-[40%] left-[20%] w-[60%] h-[80%] rounded-full opacity-20 blur-3xl"
        style={{ 
          background: "linear-gradient(180deg, rgba(214,188,250,0.8) 0%, rgba(155,135,245,0.4) 100%)",
        }} 
      />
      
      {/* Light particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-purple-300/20"
            style={{
              width: Math.floor(Math.random() * 6) + 1 + "px",
              height: Math.floor(Math.random() * 6) + 1 + "px",
              top: Math.floor(Math.random() * 100) + "%",
              left: Math.floor(Math.random() * 100) + "%",
              opacity: Math.random() * 0.5 + 0.2,
              animation: `float ${Math.floor(Math.random() * 10) + 15}s infinite linear`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
      
      {/* Add animation keyframes using CSS */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float {
            0% { transform: translateY(0) translateX(0); }
            25% { transform: translateY(-20px) translateX(10px); }
            50% { transform: translateY(-10px) translateX(-10px); }
            75% { transform: translateY(-30px) translateX(5px); }
            100% { transform: translateY(0) translateX(0); }
          }
        `
      }} />
    </div>
  )
}
