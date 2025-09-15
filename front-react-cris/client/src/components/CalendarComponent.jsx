import React, { useEffect, useState } from "react";
import { Calendar } from "rsuite";
import { Container, Row, Col } from "react-bootstrap";
import "rsuite/dist/rsuite.min.css";
import { ModalDisplayOnly } from "./ModalDisplayOnly.jsx";
import { mainUrl } from "../url.js";


export function CalendarComponent() {

  const url = mainUrl

  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [dataModal, setDataModal] = useState(null)

  const formatDateAsString = (date) => date.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
  
  const handleSelect = (data) => {
    const formatedData = formatDateAsString(data);
    setDataModal(formatedData);
    setShowModal(true);
  }
  const handleCloseModal = () => setShowModal(false);
  

  const renderCell = (date) => {
    const formattedDate = formatDateAsString(date);

    const eventsForDate = events.filter((event) => event.data === formattedDate);

    let hasHRElement;
    if(eventsForDate.length > 1){
      hasHRElement = true;
    }


    return eventsForDate.map((event, index) => (
      <div key={index}  className="container">
        <p style={{ fontSize: "0.9em", margin: 0 }}>
          {event.descricao} às {event.hora}
        </p>

        {hasHRElement && (
              <hr className="mt-1 m-0"/>
            )}
      </div>
    ));
  };
  
  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(url + "/getAllPosts");
        const data = await response.json();
        if (data.message) {
          setEvents(data.message);
        } else {
          console.error(data.errorMessage);
        }
      } catch (error) {
        console.error("Erro ao buscar eventos:", error);
      }
    })();
  }, []);





  return (
    <Container fluid="md">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <div className="calendar-wrapper">
            <Calendar
              bordered
              renderCell={renderCell} //a data é passada automatica
              onSelect={handleSelect}
              style={{ width: "100%", margin: "0 auto" }}
            />
          </div>
        </Col>
      </Row>

      {showModal && (
        <ModalDisplayOnly
          render={showModal}
          dataToShow={dataModal}
          closeModal={handleCloseModal}
        />
      )}
    </Container>
  );
}
