import React from "react"

import { AuthProvider } from "./auth"
import { EnvProvider } from "./env"
import { LoggingProvider } from "./logging"

export function AppProviders({ children }) {
  return (
    <LoggingProvider>
      <EnvProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </EnvProvider>
    </LoggingProvider>
  )
}
