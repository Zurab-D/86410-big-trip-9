export const getEventEmpty = () => ({
  type: {
    name: `Select type`,
    group: ``,
    actionName: `Select the event type`,
    icon: `trip.png`
  },
  place: {name: ``, type: ``},
  description: ``,
  dateBegin: (new Date()).getTime(),
  duration: 0, // miliseconds
  price: 0,
  offers: [],
  photos: [],
  favorite: false
});
