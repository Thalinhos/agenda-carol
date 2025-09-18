import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { ChromePicker } from "react-color";
import { mainUrl } from "../url";

export function ModalDisplayOnly({ render = false, dataToShow = "", closeModal, refreshCalendar }) {
  const url = mainUrl;

  const dataToPost = dataToShow.replaceAll("/", "-");
  const [dataFromDB, setDataFromDB] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({ descricao: "", data: dataToShow, hora: "" });
  const [showAddForm, setShowAddForm] = useState(false);

  const [selectedColor, setSelectedColor] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    if (!render) return;
    (async () => {
      try {
        const response = await fetch(url + `/getPostFromDate/${dataToPost}`);
        const data = await response.json();

        if (data.message) {
          setDataFromDB(data.message);
        } else {
          setDataFromDB([]);
        }
      } catch (error) {
        setErrorMessage("Erro ao buscar dados");
      }
    })();
  }, [dataToPost, render]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(url + "/addPost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setDataFromDB([...dataFromDB, formData]);
        resetForm(); 
        setErrorMessage("");
      } else {
        setErrorMessage(data.errorMessage || "Erro ao adicionar evento.");
      }
    } catch (error) {
      setErrorMessage("Erro ao adicionar evento.");
    }
    refreshCalendar();
  };

  const handleEdit = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(url + `/updatePost/${editingEvent.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setDataFromDB((prev) =>
          prev.map((ev) => (ev.id === editingEvent.id ? { ...ev, ...formData } : ev))
        );
        resetForm();
        setErrorMessage("");
      } else {
        setErrorMessage(data.errorMessage || "Erro ao editar evento.");
      }
    } catch (error) {
      setErrorMessage("Erro ao editar evento.");
    }
    refreshCalendar();
  };

  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja excluir este evento?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(url + `/deletePost/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setDataFromDB((prev) => prev.filter((ev) => ev.id !== id));
      } else {
        setErrorMessage(data.errorMessage);
      }
    } catch (error) {
      setErrorMessage("Erro ao excluir evento.");
    }
    refreshCalendar();
  };

  const handleUpdateColor = async () => {
    if (!selectedColor) return alert("Selecione uma cor primeiro");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${url}/editColor/${dataToPost}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ color: selectedColor }),
      });

      if (!response.ok) {
        alert("Erro ao atualizar a cor");
      } else {
        alert("Cor atualizada com sucesso!");
      }
    } catch (error) {
      console.log(error);
      alert("Erro ao atualizar a cor.");
    }
    refreshCalendar();
    setShowColorPicker(false);
  };

  const resetForm = () => {
    setFormData({ descricao: "", data: dataToShow, hora: "" });
    setEditingEvent(null);
    setShowAddForm(false);
  };

  const displayDataInModal = () => {
    if (dataFromDB.length === 0) {
      return <p>Sem dados para exibir.</p>;
    }

    return dataFromDB.map((data, index) => (
      <div key={index} className="border-bottom mb-2 pb-2">
        <p><strong>Descrição:</strong> {data.descricao}</p>
        <p><strong>Data:</strong> {data.data}</p>
        {data.hora && <p><strong>Hora:</strong> {data.hora}</p>}
        <div className="d-flex gap-2">
          <Button
            variant="warning"
            size="sm"
            onClick={() => {
              setEditingEvent(data);
              setFormData({ descricao: data.descricao, data: data.data, hora: data.hora });
              setShowAddForm(true);
            }}
          >
            Editar
          </Button>
          <Button variant="danger" size="sm" onClick={() => handleDelete(data.id)}>
            Excluir
          </Button>
        </div>
      </div>
    ));
  };

  return (
    <Modal show={render} onHide={closeModal} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {editingEvent ? "Editar Evento" : "Eventos"} - {dataToShow}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {displayDataInModal()}

        <Button
          variant={showAddForm ? "secondary" : "success"}
          onClick={() => {
            setShowAddForm((prev) => !prev);
            setEditingEvent(null);
            setFormData({ descricao: "", data: dataToShow, hora: "" });
          }}
        >
          {showAddForm ? "Cancelar" : "Adicionar Novo Evento"}
        </Button>

        {(showAddForm || editingEvent) && (
          <Form className="mt-3">
            <Form.Group className="mb-3">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                type="text"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                placeholder="Descrição do evento"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Hora</Form.Label>
              <Form.Control
                type="text"
                name="hora"
                placeholder="HH:MM"
                value={formData.hora}
                onChange={handleChange}
              />
            </Form.Group>

             {errorMessage && <p className="text-danger">{errorMessage}</p>}

            {editingEvent ? (
              <div className="d-flex gap-2">
                <Button variant="secondary" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button variant="primary" onClick={handleEdit}>
                  Salvar Alterações
                </Button>
              </div>
            ) : (
              <Button variant="success" onClick={handleAdd}>
                Salvar Novo Evento
              </Button>
            )}
          </Form>
        )}

        {showColorPicker && (
          <div className="mt-3">
            <p><strong>Escolher cor de fundo para a data:</strong></p>
            <ChromePicker
              color={selectedColor}
              onChangeComplete={(color) => setSelectedColor(color.hex)}
            />
            <Button className="mt-3" variant="primary" onClick={handleUpdateColor}>
              Atualizar
            </Button>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-between">
        {dataFromDB.length > 0 && (
          <Button
            variant="secondary"
            onClick={() => setShowColorPicker((prev) => !prev)}
          >
            {showColorPicker ? "Cancelar Cor" : "Trocar a Cor"}
          </Button>
        )}

        <Button variant="outline-secondary" onClick={closeModal}>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
