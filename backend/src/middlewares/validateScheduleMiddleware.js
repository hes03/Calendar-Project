const isValidHexColor = (value) => /^#([0-9a-fA-F]{6})$/.test(value);

const isValidDateValue = (value) => {
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
};

export const validateCreateSchedule = (req, res, next) => {
  const { title, start, end, memo = "", color = "#3b82f6" } = req.body || {};

  if (!title || !title.trim()) {
    return res.status(400).json({ message: "제목은 필수입니다." });
  }

  if (!start || !end) {
    return res.status(400).json({ message: "시작 시간과 종료 시간은 필수입니다." });
  }

  if (!isValidDateValue(start) || !isValidDateValue(end)) {
    return res.status(400).json({ message: "날짜 형식이 올바르지 않습니다." });
  }

  if (new Date(end) <= new Date(start)) {
    return res.status(400).json({ message: "종료 시간은 시작 시간 이후여야 합니다." });
  }

  if (memo && memo.length > 1000) {
    return res.status(400).json({ message: "메모는 1000자 이하만 입력할 수 있습니다." });
  }

  if (color && !isValidHexColor(color)) {
    return res.status(400).json({ message: "색상 형식이 올바르지 않습니다." });
  }

  req.body = {
    title: title.trim(),
    start,
    end,
    memo,
    color,
  };

  next();
};

export const validateUpdateSchedule = (req, res, next) => {
  const { title, start, end, memo, color } = req.body || {};

  if (title !== undefined && !title.trim()) {
    return res.status(400).json({ message: "제목은 비워둘 수 없습니다." });
  }

  if (start !== undefined && !isValidDateValue(start)) {
    return res.status(400).json({ message: "시작 시간 형식이 올바르지 않습니다." });
  }

  if (end !== undefined && !isValidDateValue(end)) {
    return res.status(400).json({ message: "종료 시간 형식이 올바르지 않습니다." });
  }

  if (memo !== undefined && memo.length > 1000) {
    return res.status(400).json({ message: "메모는 1000자 이하만 입력할 수 있습니다." });
  }

  if (color !== undefined && !isValidHexColor(color)) {
    return res.status(400).json({ message: "색상 형식이 올바르지 않습니다." });
  }

  next();
};