
import React from "react";
import { Toaster as SonnerToaster } from "sonner";
import { useTheme } from "next-themes";

export function ImprovedToaster() {
  const { theme } = useTheme();

  return (
    <SonnerToaster
      theme={theme as any}
      className="toaster group"
      position="top-right"
      expand={false}
      richColors
      closeButton
      visibleToasts={3}
      duration={3000}
      gap={8}
      toastOptions={{
        style: {
          background: 'var(--background)',
          border: '1px solid var(--border)',
          color: 'var(--foreground)',
        },
        className: 'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg rounded-lg',
        descriptionClassName: 'group-[.toast]:text-muted-foreground',
        actionButtonStyle: {
          backgroundColor: 'var(--primary)',
          color: 'var(--primary-foreground)',
        },
        cancelButtonStyle: {
          backgroundColor: 'var(--muted)',
          color: 'var(--muted-foreground)',
        },
      }}
    />
  );
}
