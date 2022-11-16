import React, { useState, forwardRef, useImperativeHandle, useContext } from 'react';
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    padding: '0px',
    transform: 'translate(-50%, -50%)',
  },
};

const ModalWrapper = forwardRef((props: any, forwardedRef) => {
  // let subtitle;
  const [modalIsOpen, setIsOpen] = useState(false);
  const { children } = props;

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }

  useImperativeHandle(forwardedRef, () => ({
    openModal,
    closeModal,
  }));

  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
        portalClassName={
        `ReactModalPortal ${props.className}`}
          >
        {children}
      </Modal>
    </>
  );
});

export default ModalWrapper;
