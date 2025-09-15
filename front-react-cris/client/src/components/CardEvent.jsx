import { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import { ModalEditEvent } from "./ModalEditEvent";
import { ModalAddEvent } from "./ModalAddEvent";
import { mainUrl } from "../url";
import { useNavigate } from 'react-router-dom';



export function CardEvent() {

    const url = mainUrl

    const navigate = useNavigate()


    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState({});
    const [showAddModal, setShowAddModal] = useState(false);
    const [fetchAgain, setFetchAgain] = useState(false);

    useEffect(() => {
        async function getData() {
            try {
                const res = await fetch(url + "/getAllPosts");
                const data = await res.json();
                setEvents(data.message); 
                // console.log(data.message);
            } catch (error) {
                console.error("Erro ao buscar os eventos:", error);
            }
        }

        getData();
    }, [fetchAgain]);

    const deleteFromId = async (id) => {

        // alert(id)
        // console.log(events)
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Você precisa estar logado para excluir um evento. Faça login e tente novamente.");
            navigate('/login')
            return
        }

        let deleteConfirm = confirm("Deseja realmente excluir este evento?");
        if (!deleteConfirm) { return }

        try {
            const res = await fetch(url + `/deletePost/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ id }),
            });

            const data = await res.json();

            if (data.message) {
                const newEvents = events.filter((event) => event.id !== id);
                setEvents(newEvents);
            }
        } catch (error) {
            alert("Erro ao deletar evento. Contato o administrador do sistema.");
            console.error("Erro ao deletar evento:", error);
        }
    }

    const handleOpenModalWithId = (id, descricao, data, hora) => {
        setShowModal(true);
        setModalData({ id, descricao, data, hora });
    }

    const handleOpenAddModal = () => {
        setShowAddModal(true);
    }


  const handleCloseModal = () => setShowModal(false);



    return (
        <>


        <div className="flex flex-col items-center py-3 px-2">

            <div className="buttonAddPost">    
            <Button 
                variant="success" 
                className="mb-4 mb-lg-5" 
                onClick={() => handleOpenAddModal()}
            >
                Adicionar Evento
            </Button>
            </div>
            {events && events.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {events.map((event) => (
                        <div 
                            key={event.id} 
                            className="bg-white w-full sm:max-w-sm md:max-w-md lg:max-w-lg p-4 mb-4 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300"
                        >
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">{event.descricao}</h3>
                            <p className="text-gray-600">
                                <strong>Data:</strong> {event.data}
                            </p>
                            <p className="text-gray-600">
                                <strong>Hora:</strong> {event.hora}
                            </p>
                            <div style={{ display: "flex", marginTop: "1rem",  gap: "0.5rem" }}>
                                <Button onClick={() => handleOpenModalWithId(event.id, event.descricao, event.data, event.hora)}  variant="primary">Editar</Button>
                                <Button onClick={() => deleteFromId(event.id)} variant="danger">Excluir</Button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Carregando eventos...</p>
            )}

            {showModal && (
                <>
                   <ModalEditEvent
                    render={showModal}
                    closeModal={() => handleCloseModal()}
                    id={modalData.id}
                    descricao={modalData.descricao}
                    data={modalData.data}
                    hora={modalData.hora}

                    reRender={() => setFetchAgain(!fetchAgain)}
                   />
                </>
            )}

            {showAddModal && (
                <>
                    <ModalAddEvent
                        // render={showAddModal}
                        closeModal={() => setShowAddModal(false)}
                        reRender={() => setFetchAgain(!fetchAgain)}
                    />
                </>
            )}


            </div>
        </>
    );
}
