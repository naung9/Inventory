export class Item {
  _id;
  _name;
  _type;
  _imageUrl;
  _status;
  _previousOwners;
  _currentOwner;

  constructor(obj?) {
    if (obj) {
      Object.assign(this, obj);
    }
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }
  get previousOwners() {
    return this._previousOwners;
  }

  set previousOwners(value) {
    this._previousOwners = value;
  }

  get currentOwner() {
    return this._currentOwner;
  }

  set currentOwner(value) {
    this._currentOwner = value;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }

  get type() {
    return this._type;
  }

  set type(value) {
    this._type = value;
  }

  get imageUrl() {
    return this._imageUrl;
  }

  set imageUrl(value) {
    this._imageUrl = value;
  }
}
