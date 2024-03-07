import { Link, useHref } from 'react-router-dom';
import './layout.scss';
import { useState } from 'react';


export function Layout({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}

function Header() {
  const href = useHref();
  const [show, setShow] = useState(false);

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
            <Link className={`nav-link ${href === '/home' ? 'active' : ''}`} to={'/home'}>Inicio</Link>
          </li>
          <li className="nav-item">
            <Link className={`nav-link ${href === '/' ? 'active' : ''}`} to={'/'}>Login</Link>
          </li>
        </ul>
      </div>
    </div>
  </header>;

}