import React, { createContext, useState, useEffect } from "react"


const LoggingContext = createContext({
  logger: {}
})

const consoleBkp = { ...console };

function createLogging(type) {
  return function (...args) {
    consoleBkp[type](...args);

    window.electronAPI.send('logging', { type, args });
  }
}

export function LoggingProvider(props) {
  const [logger, setLogger] = useState(false);

  useEffect(() => {
    const newLogger = { ...console };

    newLogger.log = createLogging('log');
    newLogger.info = createLogging('info');
    newLogger.debug = createLogging('debug');
    newLogger.error = createLogging('error');
    newLogger.warn = createLogging('warn');

    setLogger(newLogger);
  }, []);

  useEffect(() => {
    console.log = logger.log;
    console.info = logger.info;
    console.debug = logger.debug;
    console.error = logger.error;
    console.warn = logger.warn;
  }, [logger]);

  return (
    <LoggingContext.Provider
      value={{
        logger,
      }}
      {...props}
    />
  )
}

export const useLogging = () => React.useContext(LoggingContext)
