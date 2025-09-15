// ModalEvent.jsx

import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

export function ModalEvent({ render = false, descricao = "descrição", data = "sem data", hora = "sem hora", closeModal }) {

    const [formData, setFormData] = useState({
        descricao,
        data,
        hora,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSave = () => {
        // console.log('Salvando dados:', formData);
        closeModal(); // chamando o handleCloseModal no Calendarcomponent
    };

    return (
        <Modal show={render} onHide={closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>Editar Evento</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Form.Group controlId="formDescricao">
                        <Form.Label>Descrição</Form.Label>
                        <Form.Control
                            type="text"
                            name="descricao"
                            value={formData.descricao}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formData">
                        <Form.Label>Data</Form.Label>
                        <Form.Control
                            type="text"
                            name="data"
                            value={formData.data}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formHora">
                        <Form.Label>Hora</Form.Label>
                        <Form.Control
                            type="text"
                            name="hora"
                            value={formData.hora}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Save changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
