import React, { useEffect, useState } from "react";
import { Calendar } from "rsuite";
import { Container, Row, Col } from "react-bootstrap";
import "rsuite/dist/rsuite.min.css";
import { ModalDisplayOnly } from "./ModalDisplayOnly.jsx";
import { mainUrl } from "../url.js";

export function CalendarComponent() {
  const url = mainUrl;

  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [dataModal, setDataModal] = useState(null);

  // Formata a data como string "DD/MM/YYYY"
  const formatDateAsString = (date) =>
    date.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });

  const handleSelect = (date) => {
    setDataModal(formatDateAsString(date));
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const renderCell = (date) => {
    const eventsForDate = events.filter(
      (event) => event.dateObj.toDateString() === date.toDateString()
    );

    if (eventsForDate.length === 0) return null;

    const firstEvent = eventsForDate[0];
    const moreCount = eventsForDate.length - 1;

    return (
      <div
        className="calendar-cell-events"
        style={{
          padding: "0.25rem",
        }}
      >
        {/* Primeiro evento */}
        <div
          style={{
            backgroundColor: firstEvent.css_bg_color || "",
            padding: "0.25rem 0.5rem",
            borderRadius: "0.25rem",
            fontSize: "0.9em",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {firstEvent.descricao} {firstEvent.hora && `às ${firstEvent.hora}`}
        </div>

        {/* Se houver mais eventos, mostrar "+N mais" */}
        {moreCount > 0 && (
          <div
            style={{
              fontSize: "0.8em",
              color: "#555",
              marginTop: "2px",
              cursor: "pointer",
            }}
            title={eventsForDate
              .slice(1)
              .map((ev) => `${ev.descricao} ${ev.hora ? "às " + ev.hora : ""}`)
              .join("\n")}
          >
            +{moreCount} mais
          </div>
        )}
      </div>
    );
  };

  const updateEvents = async () => {
    try {
      const response = await fetch(url + "/getAllPosts");
      const data = await response.json();

      if (data.message) {
        const normalized = data.message.map((event) => {
          const [dia, mes, ano] = event.data.split("/");
          return {
            ...event,
            dateObj: new Date(ano, mes - 1, dia), // cria Date real
          };
        });

        setEvents(normalized);
      } else {
        console.error(data.errorMessage);
      }
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
    }
  };

  useEffect(() => {
    updateEvents();
  }, []);

  return (
    <Container fluid="md">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <div className="calendar-wrapper">
            <Calendar
              bordered
              renderCell={renderCell}
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
          refreshCalendar={updateEvents}
        />
      )}
    </Container>
  );
}
