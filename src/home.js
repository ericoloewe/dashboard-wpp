import { useState, useEffect } from 'react';
import { Layout } from './layout';
import { Link } from 'react-router-dom';
import { Loader } from './loader';


let alreadyLoaded = false;

export function Home() {
  const [isGroupsReady, setIsGroupsReady] = useState(false);
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const removeEventListener1 = window.electronAPI.on('chats-loaded', (event, response) => {
      const groups = response;

      console.debug(response);

      setGroups(groups);
      setIsGroupsReady(true);
    })

    if (!alreadyLoaded) {
      alreadyLoaded = true;
      window.electronAPI.send('load-chats', 'ok');
    }

    return () => {
      removeEventListener1();
    };
  }, []);

  return <Layout>
    <div className='container' style={{ paddingBottom: 30 }}>
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
          <Loader />
        )
      }
    </div>
  </Layout>
}


export function Card({ group }) {
  return (
    <button type='button' className="card" onClick={e => window.electronAPI.send('new-window', { hash: `/groups/${group.id._serialized}?newWindow` })}>
      <img src={group.profilePicture || './no-profile.jpg'} alt={group.name} />
      <h4>{group.name}</h4>
      <hr />
    </button>
  );
}
