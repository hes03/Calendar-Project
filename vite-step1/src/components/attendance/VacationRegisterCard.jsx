import { useState } from "react";

function VacationRegisterCard({ onRegisterVacation, actionLoading }) {
  const [workDate, setWorkDate] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegisterVacation({ workDate, note });
  };

  return (
    <section className="attendance-panel-card">
      <div className="attendance-panel-card__header">
        <div>
          <h2>휴가 등록</h2>
          <p>특정 날짜에 휴가 일정을 등록할 수 있습니다.</p>
        </div>
      </div>

      <form className="attendance-form" onSubmit={handleSubmit}>
        <div className="attendance-form-group">
          <label>날짜</label>
          <input
            type="date"
            value={workDate}
            onChange={(e) => setWorkDate(e.target.value)}
            required
          />
        </div>

        <div className="attendance-form-group">
          <label>사유</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="예: 연차 사용"
          />
        </div>

        <button
          type="submit"
          className="attendance-button attendance-button--primary"
          disabled={actionLoading}
        >
          휴가 등록
        </button>
      </form>
    </section>
  );
}

export default VacationRegisterCard;
