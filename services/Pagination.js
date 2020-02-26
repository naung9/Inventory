export class Pagination {
  _pageNo;
  _count;
  _sort;
  _order;

  constructor(pageNo = 1, count = 20, sort = "id", order = "asc") {
    this._pageNo = pageNo;
    this._count = count;
    this._sort = sort;
    this._order = order;
  }

  get pageNo() {
    return this._pageNo;
  }

  set pageNo(value) {
    this._pageNo = value;
  }

  get count() {
    return this._count;
  }

  set count(value) {
    this._count = value;
  }

  get sort() {
    return this._sort;
  }

  set sort(value) {
    this._sort = value;
  }

  get order() {
    return this._order;
  }

  set order(value) {
    this._order = value;
  }
}
