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
    const newLogger = { ...consoleBkp };

    newLogger.log = createLogging('log');
    newLogger.info = createLogging('info');
    newLogger.debug = createLogging('debug');
    newLogger.error = createLogging('error');
    newLogger.warn = createLogging('warn');

    setLogger(newLogger);
  }, []);

  useEffect(() => {
    window.console.log = logger.log;
    window.console.info = logger.info;
    window.console.debug = logger.debug;
    window.console.error = logger.error;
    window.console.warn = logger.warn;
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
