"use client"

import { Toaster as Sonner } from "sonner"
import * as React from "react"

const Toaster = ({ ...props }: React.ComponentProps<typeof Sonner>) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        style: {
          backgroundColor: "#FFFFFF",
          border: "1px solid hsl(var(--border))",
          color: "hsl(var(--popover-foreground))",
          opacity: 1,
        },
      }}
      style={
        {
          "--normal-bg": "hsl(var(--popover))",
          "--normal-text": "hsl(var(--popover-foreground))",
          "--normal-border": "hsl(var(--border))",
          zIndex: 99999,
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }