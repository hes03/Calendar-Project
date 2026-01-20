import { Modal, Button, Form } from "react-bootstrap";
import { useEffect, useState } from "react";

const ScheduleModal = ({ show, mode, schedule, onSave, onDelete, onClose }) => {
  const [form, setForm] = useState({
    id: "",
    title: "",
    start: "",
    end: "",
    memo: "",
    color: "#3b82f6",
  });

useEffect(() => {
  // 생성 모드 → 항상 초기화
  if (mode ==="create") {
  setForm({
    id:"",
    title:"",
    start: schedule?.start ||"",
    end: schedule?.end ||"",
    memo:"",
    color:"#3b82f6",
    });
  }

  // 수정 모드 → 기존 데이터 세팅
  if (mode ==="edit" && schedule) {
  setForm({
    id: schedule.id ||"",
    title: schedule.title ||"",
    start: schedule.start ||"",
    end: schedule.end ||"",
    memo: schedule.memo ||"",
    color: schedule.color ||"#3b82f6",
    });
  }
}, [mode, schedule]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (new Date(form.end) <= new Date(form.start)) {
      alert("종료 날짜/시간은 시작 이후여야 합니다.");
      return;
    }
    onSave(form);
  };

  const isInvalidRange =
    form.start && form.end && new Date(form.end) <= new Date(form.start);

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
              min={form.start} /*시작 이전 선택 불가*/
              onChange={handleChange}
              isInvalid={isInvalidRange} /*부트스트랩 유효성 검사. input테두리 빨간색으로 표시*/
            />
            {/* isInvalid=true일 때만 화면에 표시되는 에러 메시지 */}
            <Form.Control.Feedback type="invalid">
              종료 날짜는 시작 이후여야 합니다.
            </Form.Control.Feedback>
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
        <Button variant="primary" onClick={handleSubmit}>
          저장
        </Button>
        <Button variant="secondary" onClick={onClose}>
          취소
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ScheduleModal;
