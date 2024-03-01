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