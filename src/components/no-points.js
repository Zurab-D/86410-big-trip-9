import {AbstractComponent} from './AbstractComponent';

export class NoPoints extends AbstractComponent {
  constructor() {
    super();
  }

  get template() {
    return `<p class="trip-events__msg">Click New Event to create your first point</p>`;
  }
}
