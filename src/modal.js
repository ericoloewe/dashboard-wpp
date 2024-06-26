import { useState } from 'react';

export function Modal({ children, title, onClose }) {
  const [isOpen, setIsOpen] = useState(true);

  function onCloseClick() {
    setIsOpen(false);
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
  );
}
