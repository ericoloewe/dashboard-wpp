import React from "react"

import { AuthProvider } from "./auth"

export function AppProviders({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}
