export class ModelOffer {
  constructor(data) {
    this.id = (data.name || data.title).toLowerCase().split(` `).join(`-`);
    this.name = data.name || data.title;
    this.price = data.price;
    this.selected = data.selected || data.accepted || false;
  }
}
