import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { useState } from 'react';
import { mainUrl } from '../url';

export function ModalEditEvent(props) {

    const url = mainUrl

    console.log(props)

    const { render, closeModal, id, descricao, data, hora, reRender } = props;

    const [formData, setFormData] = useState({id, descricao, data, hora});

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        // console.log(formData);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(url + `/updatePost/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`

                },
                body: JSON.stringify({
                    descricao: formData.descricao,
                    data: formData.data,
                    hora: formData.hora,
                }),
            });

            const data = await response.json();
            if (data.message) {
                alert('Evento atualizado com sucesso!');
                closeModal();
                reRender();
            } 
            if(data.errorMessage) {
                alert('Erro ao atualizar o evento: ' + data.errorMessage);
            }
        } catch (error) {
            alert('Erro ao atualizar o evento.');
        }
    };

    return (
        
            <div>
                <Modal show={render} onHide={closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>Editar Evento</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    {/* Campo oculto para o ID */}
                    <input type="hidden" name="id" value={id} />

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
                    <Button variant="primary" type="submit" onClick={handleSubmit}>
                        Salvar
                    </Button>
                <Button variant="secondary" onClick={closeModal}>
                    Fechar
                </Button>
            </Modal.Footer>
        </Modal>
                
            </div>
    )
}