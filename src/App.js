import logo from './logo.svg';
import './App.scss';
import { useState, useEffect } from 'react';
import QRCode from 'qrcode';

// const { ipcRenderer } = require('electron')

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [isGroupsReady, setIsGroupsReady] = useState(false);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const removeEventListener1 = window.electronAPI.on('contacts-loaded', (event, response) => {
      const groups = response;

      console.log(response);

      setGroups(groups);
      setIsGroupsReady(true);
    })

    const removeEventListener2 = window.electronAPI.on('whats-ready', (event, response) => {
      setIsReady(true);
    })

    return () => {
      removeEventListener1();
      removeEventListener2();
    };
  }, []);

  return (
    <>
      <Header />
      <div className="App container">
        {isReady
          ? <Home isGroupsReady={isGroupsReady} groups={groups} />
          : (
            <Login />
          )
        }
      </div>
    </>
  );
}

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [qrcode, setQrCode] = useState('');

  useEffect(() => {
    const removeEventListener1 = window.electronAPI.on('qrcode-loaded', (event, response) => {
      QRCode.toDataURL(response, function (err, url) {
        console.log(url);
        setQrCode(url);
      })
    });

    return () => {
      removeEventListener1();
    };
  }, []);

  function onClick() {
    setIsLoading(true);
    window.electronAPI.send('init-login', 'ok');
  }

  return <header className="App-header">
    <img src={qrcode || logo} className={`App-logo ${qrcode && 'qrcode-ok'}`} alt="logo" />

    {!qrcode && (
      <button type='button' className='btn btn-primary' onClick={onClick} disabled={isLoading}>
        {isLoading
          ? <><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...</>
          : <>Entrar / Gerar Qr Code</>
        }
      </button>
    )}
  </header>;
}

function Home({ groups, isGroupsReady }) {
  const [search, setSearch] = useState('');

  return isGroupsReady
    ? (
      <div className='home'>
        <div className="mark-section">
          <div className="form-group">
            <label htmlFor="buscaGrupo" className="form-label">Buscar grupo:</label>
            <input type="search" id="buscaGrupo" name="buscaGrupo" className="form-control" placeholder="Nome do seu grupo" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className='cards'>
          {groups.filter(x => search.length === 0 || x.name.toLowerCase().includes(search)).map(x => (
            <Card key={x?.id?.user} group={x} />
          ))}
        </div>
      </div>
    )
    : (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
}

function Card({ group }) {
  return (
    <div className='card'>
      <img src={group.profilePicture} alt={group.name} />
      <h4>{group.name}</h4>
      <hr />
      <div className='participants'>
        {group.groupMetadata.participants.slice(0, 5).map(x => (
          <img key={x.id.user} src={x.profilePicture} alt={x.id.user} className='rounded' />
        ))}
      </div>
    </div>
  )
}


function Header() {
  const [show, setShow] = useState(false);

  return <header className="navbar navbar-expand-sm">
    <div className="container-fluid">
      <div
        href="/"
        rel="noopener noreferrer"
        className='navbar-brand logo-link'
      >
        Dashboard gestão
      </div>
      <button className="navbar-toggler" type="button" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" onClick={e => setShow(!show)}>
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className={`collapse navbar-collapse ${show && 'show'}`} id="navbarSupportedContent">
      </div>
    </div>
  </header>;

}