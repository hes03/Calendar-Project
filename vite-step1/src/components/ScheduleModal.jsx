import { Modal, Button, Form } from "react-bootstrap";
import { useEffect, useState } from "react";

const ScheduleModal = ({ show, mode, schedule, onSave, onDelete, onClose }) => {
  const [form, setForm] = useState({
    title: "",
    start: "",
    end: "",
    memo: "",
    color: "#3b82f6",
  });

  // 수정 모드일 때 기존 데이터 세팅
  useEffect(() => {
    if (mode === "edit" && schedule) {
      setForm(schedule);
    }
  }, [mode, schedule]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {mode === "create" ? "일정 등록" : "일정 수정"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>제목</Form.Label>
            <Form.Control
              name="title"
              value={form.title}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>시작</Form.Label>
            <Form.Control
              type="datetime-local"
              name="start"
              value={form.start}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>종료</Form.Label>
            <Form.Control
              type="datetime-local"
              name="end"
              value={form.end}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>메모</Form.Label>
            <Form.Control
              as="textarea"
              name="memo"
              value={form.memo}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>색상</Form.Label>
            <Form.Control
              type="color"
              name="color"
              value={form.color}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        {mode === "edit" && (
          <Button variant="danger" onClick={onDelete}>
            삭제
          </Button>
        )}
        <Button variant="secondary" onClick={onClose}>
          취소
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          저장
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ScheduleModal;
