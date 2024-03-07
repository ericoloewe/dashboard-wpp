import { useState, useEffect } from 'react';
import { Layout } from './layout';
import { Link, useParams } from "react-router-dom";
import { Loader } from './loader';

export function Groups() {
  const { groupId } = useParams();
  const [isGroupsReady, setIsGroupsReady] = useState(false);
  const [search, setSearch] = useState('');
  const [groupInfo, setGroupInfo] = useState({});
  const [participantsDict, setParticipantsDict] = useState({});

  useEffect(() => {
    let firstLoadOk = false;

    const removeEventListener1 = window.electronAPI.on('group-info-loaded', (event, response) => {
      console.debug(response);

      setGroupInfo(response);

      const dict = response.groupMetadata.participants.reduce((previous, next) => {
        previous[next.id._serialized] = next;

        return previous;
      }, {});

      setParticipantsDict({ ...dict });

      window.electronAPI.send('load-group-messages', groupId);

      firstLoadOk = true;

      setIsGroupsReady(true);
    })

    const removeEventListener2 = window.electronAPI.on('group-messages-loaded', (event, response) => {
      setParticipantsDict(participantsDict => {
        const dict = { ...participantsDict }
        console.debug(response);

        Object.keys(dict).forEach(x => {
          dict[x].messages = [];
        })

        for (let index = 0; index < response.length; index++) {
          const message = response[index];

          dict[message.author]?.messages?.push(message);
        }

        return dict;
      })
    })

    const interval = setInterval(() => {
      if (firstLoadOk)
        window.electronAPI.send('load-group-messages', groupId);
    }, 5000);


    return () => {
      removeEventListener1();
      removeEventListener2();
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    window.electronAPI.send('load-group-info', groupId);
  }, [groupId]);

  return <Layout>
    <div className='container' style={{ paddingBottom: 30 }}>
      {isGroupsReady
        ? (
          <div className='home'>
            <h2>Grupo: {groupInfo.name}</h2>
            <div className="mark-section">
              <div className="form-group">
                <label htmlFor="buscaParticipante" className="form-label">Buscar participante:</label>
                <input type="search" id="buscaParticipante" name="buscaParticipante" className="form-control" placeholder="Nome do participante" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
            <div className='cards'>
              {Object.values(participantsDict)
                .filter(x => search.length === 0 || x?.contact?.name?.toLowerCase()?.includes(search))
                .sort((a, b) => (a.messages?.length > b.messages?.length ? -1 : 1))
                .map(x => (
                  <Card key={x?.id?._serialized} participant={x} groupId={groupId} />
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

export function Card({ participant, groupId }) {
  return (
    <Link to={`/groups/${groupId}/${participant.id._serialized}`} className="card">
      <img src={participant.profilePicture || './no-profile.jpg'} alt={participant?.contact?.name} className='card-img' />
      <h4>{participant?.contact?.name}</h4>
      <hr />
      <h6>Quantidade de mensagens: {participant.messages?.length}</h6>
    </Link>
  );
}
