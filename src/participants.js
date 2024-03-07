import { useState, useEffect } from 'react';
import { Layout } from './layout';
import { useNavigate, useParams } from "react-router-dom";
import { Loader } from './loader';
import moment from 'moment';

export function Participants() {
  const { groupId, participantId } = useParams();
  const [isReady, setIsReady] = useState(false);
  const [isMediaLoading, setIsMediaLoading] = useState(false);
  const [isMessagesLoading, setIsMessagesLoading] = useState(true);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [info, setInfo] = useState({});
  const [messages, setMessages] = useState([]);
  const [media, setMedia] = useState();

  useEffect(() => {
    let firstLoadOk = false;

    const removeEventListener1 = window.electronAPI.on('participant-info-loaded', (event, response) => {
      console.debug(response);
      setInfo(response);

      window.electronAPI.send('load-participant-messages', { groupId, participantId });

      firstLoadOk = true;

      setIsReady(true);
    })

    const removeEventListener2 = window.electronAPI.on('participant-messages-loaded', (event, messages) => {
      console.info(messages);

      setMessages(messages);
      setIsMessagesLoading(false);
    })

    const removeEventListener3 = window.electronAPI.on('media-loaded', (event, response) => {
      console.debug(response);
      setMedia(response);
      setIsMediaLoading(false);
    })

    return () => {
      removeEventListener1();
      removeEventListener2();
      removeEventListener3();
    };
  }, []);

  useEffect(() => {
    window.electronAPI.send('load-participant-info', participantId);
  }, [participantId]);

  useEffect(() => {
    if (isReady && messages.length > 0)
      window.scrollTo(0, document.body.scrollHeight);
  }, [isReady, messages]);

  function onMediaClick(messageId) {
    window.electronAPI.send('load-media', messageId);
    setIsMediaLoading(true);
    setIsMediaModalOpen(true);
  }

  function onCloseModal() {
    setIsMediaModalOpen(false);
    setMedia(null);
  }

  function getMediaElement() {
    let element = <div>Mídia invalida</div>;
    const base64 = `data:${media?.mimetype};base64,${media?.data}`;

    if (media?.mimetype?.includes('image')) {
      element = <img style={{ display: 'block', maxWidth: '100%' }} src={`data:${media?.mimetype};base64,${media?.data}`} />;
    } else if (media?.mimetype?.includes('video')) {
      element = <video style={{ display: 'block', maxWidth: '100%' }} src={`data:${media?.mimetype};base64,${media?.data}`} controls />
    } else if (media?.mimetype?.includes('pdf')) {
      element = <embed src={base64} style={{ minHeight: '50vh', width: '100%' }} />
    }

    return element;
  }

  return <Layout>
    <div className='container' style={{ paddingBottom: 30, paddingTop: 30 }}>
      {isReady
        ? (
          <div className='home d-flex flex-column gap-3'>
            <div className='d-flex justify-content-between'>
              <h2>Participante: {info.name}</h2>
            </div>
            <br />
            {isMessagesLoading ? <Loader /> : <Messages messages={messages} info={info} onMediaClick={onMediaClick} />}
            {(isMediaModalOpen) && <Modal title="Mídia" onClose={onCloseModal}>
              {isMediaLoading
                ? <Loader />
                : (
                  <div className='d-flex justify-content-center align-items-center'>
                    {getMediaElement()}
                  </div>
                )
              }
            </Modal>}
          </div>
        )
        : (
          <Loader />
        )
      }
    </div>
  </Layout>
}



function Messages({ messages, info, onMediaClick }) {
  return <ul className="list-group">
    {messages.map(x => (
      <li key={x.id._serialized} className="list-group-item d-flex justify-content-between align-items-start">
        <div className="ms-2 me-auto" style={{ maxWidth: '85%' }}>
          <div className="fw-bold">{info.name}</div>
          {x.body}
        </div>
        <div className='d-flex flex-column align-items-end gap-2'>
          <span className="badge text-bg-light rounded-pill">&nbsp;{moment.unix(x.timestamp).format('DD/MM/YY HH:mm')}&nbsp;</span>
          {x.hasMedia && (
            <button type='button' className='btn btn-secondary align-self-end' onClick={e => onMediaClick(x.id._serialized)}>Ver mídia</button>
          )}
        </div>
      </li>
    ))}
  </ul>;
}

function Modal({ children, title, onClose }) {
  const [isOpen, setIsOpen] = useState(true);

  function onCloseClick() {
    setIsOpen(false)
    onClose();
  }

  function onCloseClickBackdrop(event) {
    if (event?.target?.id === 'modal') {
      onCloseClick();
    }
  }


  return (
    <>
      <div className={`modal modal-lg fade ${isOpen && 'show'}`} id="modal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ zIndex: 99, display: isOpen && 'block' }} onClick={onCloseClickBackdrop}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">{title}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onCloseClick}></button>
            </div>
            <div className="modal-body">
              {children}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={onCloseClick}>Close</button>
            </div>
          </div>
        </div>
      </div>
      <div className={`modal-backdrop fade ${isOpen && 'show'}`} style={{ zIndex: 98 }} onClick={onCloseClickBackdrop}></div>
    </>
  )
}