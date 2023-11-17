import React from 'react';
import styled from 'styled-components';
import ModalComponent from 'react-modal';

const customStyles = {
  content: {
    maxWidth: 'calc(100vw - 48px)',
    maxHeight: 'calc(100vh - 24px)',
    margin: 'auto',
    background: '#fff',
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'rgba(0, 0, 0, 0.8)',
    zIndex: 1200,
  },
};

ModalComponent.setAppElement('#root');

const ModalWrapper = styled.div`
  overflow: hidden;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

export const Modal = ({ onClose, image }) => {
  return (
    <ModalComponent
      isOpen={image !== null && image !== undefined}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel="Image Modal"
    >
      <ModalWrapper>{image && <img src={image} alt="modal" />}</ModalWrapper>
    </ModalComponent>
  );
};
