import { useState, useEffect } from 'react';
import { Layout } from './layout';
import { Link, useParams } from "react-router-dom";
import { Loader } from './loader';

export function Participants() {
  const { groupId, participantId } = useParams();
  const [isGroupsReady, setIsGroupsReady] = useState(false);
  const [search, setSearch] = useState('');
  const [groupInfo, setGroupInfo] = useState({});
  const [participantsDict, setParticipantsDict] = useState({});

  useEffect(() => {
    let firstLoadOk = false;

    const removeEventListener1 = window.electronAPI.on('participant-info-loaded', (event, response) => {
      console.log(response);

      setGroupInfo(response);

      const dict = response.groupMetadata.participants.reduce((previous, next) => {
        previous[next.id._serialized] = next;

        return previous;
      }, {});

      setParticipantsDict({ ...dict });

      window.electronAPI.send('load-participant-messages', participantId);

      firstLoadOk = true;

      setIsGroupsReady(true);
    })

    const removeEventListener2 = window.electronAPI.on('participant-messages-loaded', (event, response) => {
      setParticipantsDict(participantsDict => {
        const dict = { ...participantsDict }
        console.log(response);

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

    return () => {
      removeEventListener1();
      removeEventListener2();
    };
  }, []);

  useEffect(() => {
    window.electronAPI.send('load-participant-info', participantId);
  }, [participantId]);

  return <Layout>
    <div className='container'>
      {isGroupsReady
        ? (
          <div className='home'>
            <h2>Grupo: {groupInfo.name}</h2>
          </div>
        )
        : (
          <Loader />
        )
      }
    </div>
  </Layout>
}



