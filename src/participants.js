import { useState, useEffect } from 'react';
import { Layout } from './layout';
import { useNavigate, useParams } from "react-router-dom";
import { Loader } from './loader';
import moment from 'moment';

export function Participants() {
  const { groupId, participantId } = useParams();
  const [isReady, setIsReady] = useState(false);
  const [search, setSearch] = useState('');
  const [info, setInfo] = useState({});
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let firstLoadOk = false;

    const removeEventListener1 = window.electronAPI.on('participant-info-loaded', (event, response) => {
      console.log(response);
      setInfo(response);

      window.electronAPI.send('load-participant-messages', { groupId, participantId });

      firstLoadOk = true;

      setIsReady(true);
    })

    const removeEventListener2 = window.electronAPI.on('participant-messages-loaded', (event, response) => {
      console.log(response);
      setMessages(response);
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
      {isReady
        ? (
          <div className='home'>
            <div className='d-flex justify-content-space-between'>
              <h2>Participante: {info.name}</h2>
              <button className='btn btn-secondary' onClick={e => navigate(-1)}>Voltar</button>
            </div>
            <br />
            <ul className="list-group">
              {messages.map(x => (
                <li key={x.id._serialized} className="list-group-item d-flex justify-content-between align-items-start">
                  <div className="ms-2 me-auto">
                    <div className="fw-bold">{info.name}</div>
                    {x.body}
                  </div>
                  <span className="badge text-bg-secondary rounded-pill">&nbsp;{moment.unix(x.timestamp).format('hh:mm')}&nbsp;</span>
                </li>
              ))}
            </ul>
          </div>
        )
        : (
          <Loader />
        )
      }
    </div>
  </Layout>
}



