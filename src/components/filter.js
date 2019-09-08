import {AbstractComponent} from './AbstractComponent';
import {FilterValues} from '../utils';

export class Filter extends AbstractComponent {
  constructor(tripController) {
    super();

    this._tripController = tripController;
    this._init();
  }

  _init() {
    this.element.addEventListener(`click`, (evt) => {
      evt.stopPropagation();
      if (evt.target.tagName === `INPUT`) {
        this._tripController.filtering.emit(evt.target.value);
        /* switch (evt.target.value) {
          case FilterValues.everything:
            break;

          default:
            break;
        } */
      }
    });
  }

  _filterEverything() {
    return ``;
  }

  _filterFuture() {
    return ``;
  }

  _filterPast() {
    return ``;
  }

  get template() {
    return `<form class="trip-filters" action="#" method="get">
      <div class="trip-filters__filter">
        <input id="filter-${FilterValues.everything}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" checked>
        <label class="trip-filters__filter-label" for="filter-${FilterValues.everything}">${FilterValues.everything}</label>
      </div>

      <div class="trip-filters__filter">
        <input id="filter-${FilterValues.future}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future">
        <label class="trip-filters__filter-label" for="filter-${FilterValues.future}">${FilterValues.future}</label>
      </div>

      <div class="trip-filters__filter">
        <input id="filter-${FilterValues.past}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="past">
        <label class="trip-filters__filter-label" for="filter-${FilterValues.past}">${FilterValues.past}</label>
      </div>

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
  }
}
