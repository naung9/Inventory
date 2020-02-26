export class User {
  _name;
  _email;
  _phoneNo;
  _address;

  constructor(name, email, phoneNo, address) {
    this._name = name;
    this._email = email;
    this._phoneNo = phoneNo;
    this._address = address;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }

  get email() {
    return this._email;
  }

  set email(value) {
    this._email = value;
  }

  get phoneNo() {
    return this._phoneNo;
  }

  set phoneNo(value) {
    this._phoneNo = value;
  }

  get address() {
    return this._address;
  }

  set address(value) {
    this._address = value;
  }
}
