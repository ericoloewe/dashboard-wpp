import { useState, useEffect } from 'react';
import { Card } from './card';
import { Layout } from './layout';

export function Home() {
  const [isGroupsReady, setIsGroupsReady] = useState(false);
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const removeEventListener1 = window.electronAPI.on('groups-loaded', (event, response) => {
      const groups = response;

      console.log(response);

      setGroups(groups);
      setIsGroupsReady(true);
    })

    return () => {
      removeEventListener1();
    };
  }, []);

  return <Layout>
    {isGroupsReady
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
      )
    }
  </Layout>
}      
