import React from "react"

import { AuthProvider } from "./auth"
import { EnvProvider } from "./env"

export function AppProviders({ children }) {
  return (
    <EnvProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </EnvProvider>
  )
}
