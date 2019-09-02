import moment from 'moment';

export const MOMENT_DATE_FORMAT = `DD.MM.YY hh:mm`;
export const FLATPICKR_DATE_FORMAT = `d.m.y H:i`;

export const SortTypes = {
  event: `event`,
  time: `time`,
  price: `price`
};

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

// date to string short format
export const getDateStrShort = (date) => moment(date).format(`MMM DD`);

export const uniqueDays = (events) => {
  return events.reduce((prevValue, event) => {
    if (!prevValue[prevValue.length - 1] || prevValue[prevValue.length - 1] !== truncDT(event.dateBegin)) {
      prevValue.push(truncDT(event.dateBegin));
    }
    event.dayIndex = prevValue.length - 1;
    return prevValue;
  }, []);
};

// formate date to "dd.mm.yy hh:mi"
export const formatDate = (date) => moment(date).format(MOMENT_DATE_FORMAT);

export const strToDate = (str) => {
  let dt = new Date();
  str.split(` `).forEach((item, idx) => {
    if (idx === 0) {
      item.split(`.`).forEach((it, i) => {
        switch (i) {
          case 0:
            dt.setDate(+it);
            break;
          case 1:
            dt.setMonth(it - 1);
            break;
          case 2:
            dt.setFullYear(+(`20` + it));
            break;
        }
      });
    } else {
      item.split(`:`).forEach((it, i) => {
        if (i === 0) {
          dt.setHours(+it);
        } else {
          dt.setMinutes(+it);
        }
      });
    }
  });
  return dt;
};

// get random date
export const randomDate = function (startDate, endDate, startHour, endHour) {
  const date = new Date(startDate.getTime() + Math.random() * (endDate - startDate));
  const hour = startHour + Math.random() * (endHour - startHour) | 0;
  date.setHours(hour);
  return date;
};

export const truncDT = (ms) => new Date(ms).setHours(0, 0, 0, 0);

export const getDuration = (durationMiliseconds) => {
  const diffDuration = moment.duration(durationMiliseconds);

  return (diffDuration.days() > 0 ? diffDuration.days() + `d ` : ``) +
    diffDuration.hours() + `h ` +
    diffDuration.minutes() + `m`;
};
