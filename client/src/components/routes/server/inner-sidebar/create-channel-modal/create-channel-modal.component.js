import Modal from 'react-modal';
import './create-channel-modal.styles.scss';
Modal.setAppElement('#root');

const CreateChannelModal = ({ closeModal, afterOpenModal, isModalOpen }) => {
    afterOpenModal = afterOpenModal || (() => null);

    return (
        <Modal
            isOpen={ isModalOpen }
            onAfterOpen={ afterOpenModal }
            onRequestClose={ closeModal }
            className='modal-content fit create-channel-modal-content'
            overlayClassName='modal-overlay'
            contentLabel="Example Modal"
        >
            <h2>Hello</h2>
            <button onClick={ closeModal }>close</button>
            <div>I am a modal</div>
            <form>
            <input />
            <button>tab navigation</button>
            <button>stays</button>
            <button>inside</button>
            <button>the modal</button>
            </form>
        </Modal>
    );
    
}

export default CreateChannelModal;