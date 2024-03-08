import { useEffect } from 'react';
import { Layout } from './layout';
import { Loader } from './loader';
import { useNavigate } from 'react-router-dom';

export function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const removeEventListener1 = window.electronAPI.on('logout-ok', (event, response) => {
      navigate('/');
    })

    window.electronAPI.send('logout', 'ok');

    return () => {
      removeEventListener1();
    };
  }, []);

  return <Layout noHeader={true}>
    <div className='container' style={{ paddingTop: 30 }}>
      <h3>Saindo da aplicação</h3>
      <Loader />
    </div>
  </Layout>
}
