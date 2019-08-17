  // consts for renderElem function (values for param "place")
  export const where = {
    beforeBegin: `beforeBegin`,
    afterBegin: `afterBegin`,
    beforeEnd: `beforeEnd`,
    afterEnd: `afterEnd`
  };

  // render element function
  export const renderElem = function (elem, htmlCode, place = where.beforeEnd) {
    elem.insertAdjacentHTML(place, htmlCode);
  };

  // get unique elements of array
  export const uniqueArray = function (arr) {
    let result = [];

    for (let str of arr) {
      if (!result.includes(str)) {
        result.push(str);
      }
    }

    return result;
  }


// formate date to "dd.mm.yy hh:mi"
export const formatDate = function (date) {

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

// calc total price
export const getTotalCost = function name(events) {
  return events.reduce((previousValue, event) => {
      return previousValue +
      event.price +
      event.offers.reduce((prevOffersSum, offer) => prevOffersSum + offer.price, 0)
    },
    0
  );
};
