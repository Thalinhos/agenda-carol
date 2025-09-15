// ModalEvent.jsx

import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { mainUrl } from '../url';

export function ModalDisplayOnly({ render = false, dataToShow = "", closeModal }) {

    const url = mainUrl

    const dataToPost = dataToShow.replaceAll('/', '-');
    const [dataFromDB, setDataFromDB] = useState([]);
    const [errorMessage, setErrorMessage] = useState();

    useEffect(() => {
      (async () => {
        try {
          const response = await fetch(url +`/getPostFromDate/${dataToPost}`);
          const data = await response.json();
    
          if (data.message) {
            setDataFromDB(data.message);
          } else {
            setErrorMessage(data.errorMessage);
          }
        } catch (error) {
          setErrorMessage("Erro ao buscar dados");
        }
      })();
    }, [dataToPost]);

    const displayDataInModal = () => {
      let hasHRElement = false;
      if(dataFromDB.length > 1){
        hasHRElement = true;
      }

      if(dataFromDB.length > 0){
        return dataFromDB.map((data, index) => (
          <div key={index}>
            <p>{data.descricao}</p>
            <p>{data.data}</p>
            <p>{data.hora}</p>
            {hasHRElement && (
              <hr />
            )}
          </div>
        )
      )} else {
        return <p>Sem dados para exibir.</p>
      }
    }


    return (
        <Modal show={render} onHide={closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>Evento</Modal.Title>
            </Modal.Header>

            <Modal.Body>
            {displayDataInModal()}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                    Close
                </Button>
               
            </Modal.Footer>
        </Modal>
    );
}
