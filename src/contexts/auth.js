import React, { createContext, useState, useEffect } from "react"

import QRCode from 'qrcode';
import { useNavigate } from "react-router-dom";

const AuthContext = createContext({
  isLoadingAuth: false
})

export function AuthProvider(props) {
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [qrcode, setQrCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const removeEventListener1 = window.electronAPI.on('qrcode-loaded', (event, response) => {
      QRCode.toDataURL(response, function (err, url) {
        console.log(url);
        setQrCode(url);
      });
    });

    const removeEventListener2 = window.electronAPI.on('whats-ready', (event, response) => {
      navigate('/home')
    })

    return () => {
      removeEventListener1();
      removeEventListener2();
    };
  }, []);

  function doLogin() {
    setIsLoadingAuth(true);
    window.electronAPI.send('init-login', 'ok');
  }

  return (
    <AuthContext.Provider
      value={{
        doLogin,
        qrcode,
        isLoadingAuth,
      }}
      {...props}
    />
  )
}

export const useAuth = () => React.useContext(AuthContext)
