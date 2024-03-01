import { useState, useEffect } from 'react';
import { Card } from './card';
import { Layout } from './layout';
import { useLocation } from "react-router-dom";

export function Groups() {
  const { state: groupInfo } = useLocation();
  const [isGroupsReady, setIsGroupsReady] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setIsGroupsReady(true);
    
    const removeEventListener1 = window.electronAPI.on('group-info-loaded', (event, response) => {
      console.log(response);

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
            {groupInfo.groupMetadata.participants.filter(x => search.length === 0 || x.name.toLowerCase().includes(search)).map(x => (
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
