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

  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (mode === "create") {
      setForm({
        id: "",
        title: "",
        start: schedule?.start || "",
        end: schedule?.end || "",
        memo: "",
        color: "#3b82f6",
      });
    }

    if (mode === "edit" && schedule) {
      setForm({
        id: schedule.id || "",
        title: schedule.title || "",
        start: schedule.start || "",
        end: schedule.end || "",
        memo: schedule.memo || "",
        color: schedule.color || "#3b82f6",
      });
    }
  }, [mode, schedule]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) return;
    if (new Date(form.end) <= new Date(form.start)) return;

    try {
      await onSave(form);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const isInvalidRange =
    form.start && form.end && new Date(form.end) <= new Date(form.start);

  const handleDeleteClick = () => {
    if (!schedule?.id) return;
    setDeleteTargetId(schedule.id);
    setShowDeleteConfirm(true);
    onClose();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;

    try {
      await onDelete(deleteTargetId);
      setShowDeleteConfirm(false);
      setDeleteTargetId(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Modal show={show} onHide={onClose} centered>
        <Modal.Header closeButton className="schedule-modal-header">
          <Modal.Title className="schedule-modal-title">
            {mode === "create" ? "새 일정 등록" : "일정 수정"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="schedule-modal-body">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="schedule-form-label">제목</Form.Label>
              <Form.Control
                className="schedule-form-input"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="일정 제목을 입력하세요"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="schedule-form-label">시작</Form.Label>
              <Form.Control
                className="schedule-form-input"
                type="datetime-local"
                name="start"
                value={form.start}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="schedule-form-label">종료</Form.Label>
              <Form.Control
                className="schedule-form-input"
                type="datetime-local"
                name="end"
                value={form.end}
                min={form.start}
                onChange={handleChange}
                isInvalid={isInvalidRange}
              />
              <Form.Control.Feedback type="invalid">
                종료 시간은 시작 시간 이후여야 합니다.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="schedule-form-label">메모</Form.Label>
              <Form.Control
                className="schedule-form-textarea"
                as="textarea"
                rows={4}
                name="memo"
                value={form.memo}
                onChange={handleChange}
                placeholder="메모를 입력하세요"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label className="schedule-form-label">색상</Form.Label>
              <div className="schedule-color-row">
                <Form.Control
                  className="schedule-color-input"
                  type="color"
                  name="color"
                  value={form.color}
                  onChange={handleChange}
                />
                <span className="schedule-color-code">{form.color}</span>
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer className="schedule-modal-footer">
          {mode === "edit" && (
            <Button
              variant="danger"
              className="schedule-btn-danger"
              onClick={handleDeleteClick}
            >
              삭제
            </Button>
          )}

          <Button
            variant="secondary"
            className="schedule-btn-secondary"
            onClick={onClose}
          >
            취소
          </Button>

          <Button
            variant="primary"
            className="schedule-btn-primary"
            onClick={handleSubmit}
          >
            저장
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showDeleteConfirm}
        onHide={() => setShowDeleteConfirm(false)}
        centered
      >
        <Modal.Header closeButton className="schedule-modal-header">
          <Modal.Title className="schedule-modal-title">삭제 확인</Modal.Title>
        </Modal.Header>

        <Modal.Body className="schedule-modal-body">
          <div className="schedule-delete-box">
            <h5>정말 삭제하시겠습니까?</h5>
            <p>삭제한 일정은 다시 복구할 수 없습니다.</p>
          </div>
        </Modal.Body>

        <Modal.Footer className="schedule-modal-footer">
          <Button
            variant="secondary"
            className="schedule-btn-secondary"
            onClick={() => setShowDeleteConfirm(false)}
          >
            취소
          </Button>
          <Button
            variant="danger"
            className="schedule-btn-danger"
            onClick={handleDeleteConfirm}
          >
            삭제
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ScheduleModal;
