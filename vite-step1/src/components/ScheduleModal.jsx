import { Modal, Button, Form, Toast, ToastContainer } from "react-bootstrap";
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

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = async () => {
    if (new Date(form.end) <= new Date(form.start)) return;

    await onSave(form);

    setToastMessage(
      mode === "create"
        ? "일정이 등록되었습니다."
        : "일정이 수정되었습니다."
    );

    onClose();
    setShowToast(true);
  };

  const isInvalidRange =
    form.start && form.end && new Date(form.end) <= new Date(form.start);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    console.log("삭제할 ID: ", schedule.id)
    await onDelete(schedule.id); // 일정 삭제

    setToastMessage("일정이 삭제되었습니다.");
    setShowToast(true);

    setShowDeleteConfirm(false); // 삭제 확인 모달 닫기
    onClose(); // 일정 수정 모달 닫기
  };

  return (
    <>
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
            <Button
              variant="danger"
              onClick={() => {
                onClose(); //기존 일정 모달 닫기
                setShowDeleteConfirm(true)}}
            >
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
      <ToastContainer position="bottom-end" className="p-3">
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        delay={2000}
        autohide
        bg="success"
      >
        <Toast.Body className="text-white">
          {toastMessage}
        </Toast.Body>
      </Toast>
    </ToastContainer>

    {/* 삭제 확인 모달 */}
    <Modal
      show={showDeleteConfirm}
      onHide={() => setShowDeleteConfirm(false)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>삭제 확인</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        정말 삭제하시겠습니까?
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => setShowDeleteConfirm(false)}
        >
          취소
        </Button>
        <Button
          variant="danger"
          onClick={handleDelete}
        >
          삭제
        </Button>
      </Modal.Footer>
    </Modal>

  </>
  );
  
};

export default ScheduleModal;
