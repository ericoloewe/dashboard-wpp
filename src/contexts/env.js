import React, { createContext, useState, useEffect } from "react"

const { version: packageVersion } = require('../../package.json');


const EnvContext = createContext({
  isDev: false
})

export function EnvProvider(props) {
  const [isDev, setIsDev] = useState(false);
  const [logLevel, setLogLevel] = useState('info');
  const [version, setVersion] = useState(packageVersion);

  useEffect(() => {
    setIsDev(process.env.NODE_ENV === 'development')
    setLogLevel(process.env.LOG_LEVEL)
    setVersion(packageVersion);
  }, [process.env]);

  return (
    <EnvContext.Provider
      value={{
        isDev,
        logLevel,
        version
      }}
      {...props}
    />
  )
}

export const useEnv = () => React.useContext(EnvContext)
