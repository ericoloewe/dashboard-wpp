import React, { createContext, useState, useEffect } from "react"


const EnvContext = createContext({
  isDev: false
})

export function EnvProvider(props) {
  const [isDev, setIsDev] = useState(false);
  const [logLevel, setLogLevel] = useState('info');

  useEffect(() => {
    setIsDev(process.env.NODE_ENV === 'development')
    setLogLevel(process.env.LOG_LEVEL)
  }, [process.env]);

  return (
    <EnvContext.Provider
      value={{
        isDev,
        logLevel,
      }}
      {...props}
    />
  )
}

export const useEnv = () => React.useContext(EnvContext)
