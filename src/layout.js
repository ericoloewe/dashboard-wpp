import { Link, useHref, useLocation, useParams, useSearchParams } from 'react-router-dom';
import './layout.scss';
import { useState } from 'react';
import { useEnv } from './contexts/env';


export function Layout({ children }) {
  const { search } = useLocation();

  return (
    <>
      {search.includes('newWindow') ? null : <Header />}
      {children}
    </>
  );
}

function Header() {
  const href = useHref();
  const [show, setShow] = useState(false);
  const { isDev, version } = useEnv();

  return <header className="navbar navbar-expand-sm bg-light">
    <div className="container-fluid">
      <Link
        to="/home"
        rel="noopener noreferrer"
        className='navbar-brand logo-link'
      >
        Dashboard gestão
      </Link>
      <button className="navbar-toggler" type="button" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" onClick={e => setShow(!show)}>
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className={`collapse navbar-collapse ${show && 'show'}`} id="navbarSupportedContent">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className={`nav-link ${href === '/home' ? 'active' : ''}`} to={'/home'}>Grupos</Link>
          </li>
          {isDev &&
            (<li className="nav-item">
              <Link className={`nav-link ${href === '/' ? 'active' : ''}`} to={'/'}>Login</Link>
            </li>)
          }
        </ul>
      </div>
      <span>Versão {version}</span>
    </div>
  </header>;

}