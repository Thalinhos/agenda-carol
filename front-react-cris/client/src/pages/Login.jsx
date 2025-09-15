import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { mainUrl } from '../url';

const Login = () => {

    useEffect(() => {
        document.title = 'Login';
      }, []); 


    const url = mainUrl;

    const navigate = useNavigate()

    const [formLogin, setFormLogin] = useState({ usuario: '', senha: '' });
    
    const [errorMessage, setErrorMessage] = useState();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormLogin((prevState) => ({
            ...prevState,
            [name]: value, 
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // console.log(formLogin)
        
        try {
            const res = await fetch(url + '/handleLogin', {
                method: 'POST', 
                headers: {
                  'Content-Type': 'application/json' 
                },
                body: JSON.stringify({
                    usuario: formLogin.usuario,
                    senha: formLogin.senha
                })
              });

              const data = await res.json();

              if(data.errorMessage){
                setErrorMessage('Erro ao fazer login: ' + data.errorMessage);
              }
              if(data.token){
                localStorage.setItem('token', data.token);
                navigate('/admin');
              }

        } catch (error) {
            setErrorMessage('Erro ao fazer login: Servidor indisponível: ' + error);
        }
    };

    return (
        <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <Row className="w-100">
                <Col xs={12} md={6} lg={4} className="mx-auto">
                    <div className="p-4 border rounded shadow">
                        <h2 className="text-center mb-4">Login</h2>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="formBasicText">
                                <Form.Label>Usuário</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Digite seu usuario"
                                    name="usuario"
                                    value={formLogin.usuario}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword" className="mt-2">
                                <Form.Label>Senha</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Digite sua senha"
                                    name="senha" 
                                    value={formLogin.senha}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100 mt-3">
                                Entrar
                            </Button>

                            {errorMessage && (
                                <>
                                    <p className='mt-4 text-center'>{errorMessage}</p>
                                </>
                            )}
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
