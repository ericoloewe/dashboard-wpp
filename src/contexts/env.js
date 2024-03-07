import React, { createContext, useState, useEffect } from "react"


const EnvContext = createContext({
  isDev: false
})

export function EnvProvider(props) {
  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    setIsDev(process.env.NODE_ENV === 'development')
  }, [process.env]);

  return (
    <EnvContext.Provider
      value={{
        isDev,
      }}
      {...props}
    />
  )
}

export const useEnv = () => React.useContext(EnvContext)
