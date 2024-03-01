import logo from './logo.svg';
import './App.scss';
import { useState } from 'react';
import QRCode from 'qrcode';

// const { ipcRenderer } = require('electron')

function App() {
  const [qrcode, setQrCode] = useState('');
  const [ready, setReady] = useState(false);

  window.electronAPI.on('qrcode-loaded', (event, response) => {
    QRCode.toDataURL(response, function (err, url) {
      console.log(url);
      setQrCode(url);
    })
  })

  window.electronAPI.on('contacts-loaded', (event, response) => {
    console.log(response);
  })

  window.electronAPI.on('whats-ready', (event, response) => {
    setReady(true);
  })

  return (
    <div className="App">
      <header className="App-header">
        {ready
          ? <div>okkk</div>
          : (
            <>
              <img src={qrcode || logo} className={`App-logo ${qrcode && 'qrcode-ok'}`} alt="logo" />

              {!qrcode && <button type='button' className='btn btn-primary' onClick={e => window.electronAPI.send('load-qrcode', 'ok')}>Gerar Qr Code</button>}
            </>
          )
        }
      </header>
    </div>
  );
}

export default App;
