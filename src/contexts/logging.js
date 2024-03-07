import React, { createContext, useState, useEffect } from "react"
import { useEnv } from "./env";


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
  const { logLevel } = useEnv()
  const [logger, setLogger] = useState(false);

  useEffect(() => {
    const newLogger = { ...consoleBkp };

    newLogger.log = createLogging('log');
    newLogger.info = createLogging('info');
    newLogger.error = createLogging('error');
    newLogger.warn = createLogging('warn');
    newLogger.debug = function (...args) {
      if (logLevel === 'debug') {
        const type = 'debug';
        consoleBkp[type](...args);

        window.electronAPI.send('logging', { type, args: JSON.stringify(args) })
      }
    };

    setLogger(newLogger);
  }, []);

  useEffect(() => {
    if (Object.keys(logger).length > 0) {
      window.console.log = logger.log;
      window.console.info = logger.info;
      window.console.debug = logger.debug;
      window.console.error = logger.error;
      window.console.warn = logger.warn;
    }
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
