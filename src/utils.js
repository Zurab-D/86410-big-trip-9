// consts for renderElem function (values for param "position")
export const Position = {
  beforeBegin: `beforeBegin`,
  afterBegin: `afterBegin`,
  beforeEnd: `beforeEnd`,
  afterEnd: `afterEnd`
};

export const render = (container, element, position = Position.beforeEnd) => {
  switch (position) {
    case Position.beforeBegin:
      container.before(element);
      break;
    case Position.afterBegin:
      container.prepend(element);
      break;
    case Position.beforeEnd:
      container.append(element);
      break;
    case Position.afterEnd:
      container.after(element);
      break;
  }
};

export const unrender = (element) => {
  if (element) {
    element.remove();
  }
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

const arrMonthNames = [
  `Jan`,
  `Feb`,
  `Mar`,
  `Apr`,
  `May`,
  `Jun`,
  `Jul`,
  `Aug`,
  `Sep`,
  `Oct`,
  `Nov`,
  `Dec`,
];

// date to string short format
export const getDateStrShort = (date) => arrMonthNames[(new Date(date)).getMonth()] + ` ` + (new Date(date)).getDate();

// get unique elements of array
export const uniqueArray = (arr) => {
  let result = [];

  for (let str of arr) {
    if (!result.includes(str)) {
      result.push(str);
    }
  }

  return result;
};

// formate date to "dd.mm.yy hh:mi"
export const formatDate = (date) => {
  let dd = date.getDate();
  if (dd < 10) {
    dd = `0` + dd;
  }

  let mm = date.getMonth() + 1;
  if (mm < 10) {
    mm = `0` + mm;
  }

  let yy = date.getFullYear() % 100;
  if (yy < 10) {
    yy = `0` + yy;
  }

  let hh = date.getHours();
  if (hh < 10) {
    hh = `0` + hh;
  }

  let mi = date.getMinutes();
  if (mi < 10) {
    mi = `0` + mi;
  }

  return dd + `.` + mm + `.` + yy + ` ` + hh + `:` + mi;
};

// get random date
export const randomDate = function (startDate, endDate, startHour, endHour) {
  const date = new Date(startDate.getTime() + Math.random() * (endDate - startDate));
  const hour = startHour + Math.random() * (endHour - startHour) | 0;
  date.setHours(hour);
  return date;
};

export const getDurationHours = (durationMiliseconds) => Math.floor(durationMiliseconds / 1000 / 60 / 60);

export const getDurationMinutes = (durationMiliseconds) => durationMiliseconds / 1000 / 60 % 60;
