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

// consts for renderElem function (values for param "place")
export const where = {
  beforeBegin: `beforeBegin`,
  afterBegin: `afterBegin`,
  beforeEnd: `beforeEnd`,
  afterEnd: `afterEnd`
};

// render element function
export const renderElem = (elem, htmlCode, place = where.beforeEnd) => {
  elem.insertAdjacentHTML(place, htmlCode);
};

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

// get trip title
export const getTripTitle = (arrTripEvents) => {
  return arrTripEvents.
    filter((event) => event.place.type === `sity`).
    map((event) => event.place.name).
    reduce((previousValue, sity, idx, arr) => {
      if (idx === 0) {
        if (arr.length === 1) {
          return sity + ` &mdash; ` + sity;
        }
        return sity;
      }

      if (arr.length <= 3) {
        return previousValue + ` &mdash; ` + sity;
      } else {
        if (idx === arr.length - 1) {
          return previousValue + ` &mdash; ... &mdash; ` + sity;
        } else {
          return previousValue;
        }
      }
    }, ``);
};

// get trip dates
export const getTripTitleDates = (arrTripEvents) => {
  return arrTripEvents.reduce((previousValue, event, idx, arr) => {
    if (idx === 0) {
      return getDateStrShort(event.dateBegin);
    }
    if (idx === arr.length - 1) {
      return previousValue + ` &mdash; ` + getDateStrShort(event.dateBegin);
    }
    return previousValue;
  }, ``);
};

// calc total price
export const getTotalCost = (events) =>
  events.reduce((previousValue, event) =>
    previousValue + event.price + event.offers.reduce((prevOffersSum, offer) =>
      prevOffersSum + offer.price, 0), 0);
