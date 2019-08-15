// Trip days

export const arrTripDays = [{
  id: 1,
  name: `mar 18`
}, {
  id: 2,
  name: `mar 19`
}, {
  id: 3,
  name: `mar20`
}];


function randomDate(start, end, startHour, endHour) {
  var date = new Date(+start + Math.random() * (end - start));
  var hour = startHour + Math.random() * (endHour - startHour) | 0;
  date.setHours(hour);
  return date;
};

const dates = (new Array(10)).
    fill(null).
    map(() => randomDate(new Date('01.01.2019'), new Date('01.04.2019'), 12, 12)).
    sort((a, b) => a > b ? 1 : -1);
