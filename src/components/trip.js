export const getTripHTML = function (title = ``, dates = ``) {
  return `<div class="trip-info__main">
    <!-- h1 class="trip-info__title">Amsterdam &mdash; ... &mdash; Amsterdam</h1 -->
    <h1 class="trip-info__title">${title}</h1>

    <p class="trip-info__dates">${dates}</p>
  </div>`;
};
