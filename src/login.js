import logo from './logo.svg';
import QRCode from 'qrcode';
import { useState, useEffect } from 'react';
import { Layout } from './layout';
import { useNavigate } from "react-router-dom";

export function Login() {
  const [isLoading, setIsLoading] = useState(false);
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

  function onClick() {
    setIsLoading(true);
    window.electronAPI.send('init-login', 'ok');
  }

  return <Layout>
    <header className="App-header">
      <img src={qrcode || logo} className={`App-logo ${qrcode && 'qrcode-ok'}`} alt="logo" />

      {!qrcode && (
        <button type='button' className='btn btn-primary' onClick={onClick} disabled={isLoading}>
          {isLoading
            ? <><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...</>
            : <>Entrar / Gerar Qr Code</>}
        </button>
      )}
    </header>
  </Layout>
}
