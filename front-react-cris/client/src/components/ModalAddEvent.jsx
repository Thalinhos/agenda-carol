import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import { mainUrl } from '../url';

export function ModalAddEvent({ closeModal, reRender }) {

    const url = mainUrl

    const [formData, setFormData] = useState({ descricao: '', data: '', hora: '' });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAddSubmit = async (event) => {
        event.preventDefault(); 

        try {
            const response = await fetch(url + '/addPost', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData), 
            });

            const result = await response.json();

            if (result.message) {
                alert('Evento adicionado com sucesso!');
                closeModal();
                reRender(); 
            } else {
                alert('Erro ao adicionar evento: ' + result.errorMessage);
            }
        } catch (error) {
            console.error('Erro ao adicionar evento:', error);
            alert('Erro ao adicionar evento');
        }
    };

    return (
        <Modal show={true} onHide={closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>Adicionar Evento</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    {/* Campo de descrição */}
                    <Form.Group className="mb-3" controlId="descricao">
                        <Form.Label>Descrição</Form.Label>
                        <Form.Control
                            type="text"
                            name="descricao"
                            value={formData.descricao}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    {/* Campo de data */}
                    <Form.Group className="mb-3" controlId="data">
                        <Form.Label>Data</Form.Label>
                        <Form.Control
                            type="text"
                            name="data"
                            value={formData.data}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    {/* Campo de hora */}
                    <Form.Group className="mb-3" controlId="hora">
                        <Form.Label>Hora</Form.Label>
                        <Form.Control
                            type="text"
                            name="hora"
                            value={formData.hora}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    
                </Form>
            </Modal.Body>

            <Modal.Footer>
                    <Button variant="primary" type="submit" onClick={handleAddSubmit}>
                        Salvar
                    </Button>
                <Button variant="secondary" onClick={closeModal}>
                    Fechar
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
