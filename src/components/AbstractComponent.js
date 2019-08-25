export class AbstractComponent {
  constructor() {
    this._element = null;

    if (new.target === AbstractComponent) {
      throw new Error(`Can't instantiate AbstractComponent, only concrete one.`);
    }
  }

  createElement() {
    const newElement = document.createElement(`div`);
    newElement.innerHTML = this.template;
    return newElement.firstChild;
  }

  get element() {
    if (!this._element) {
      this._element = this.createElement();
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  get template() {
    throw new Error(`Abstract getter not implemented: template`);
  }
}
