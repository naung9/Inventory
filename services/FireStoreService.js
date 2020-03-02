import {Pagination} from './Pagination';

export class FireStoreService {
  _fireStore;
  collections = {};

  constructor(fireStore) {
    this._fireStore = fireStore;
  }

  get fireStore() {
    return this._fireStore;
  }

  set fireStore(value) {
    this._fireStore = value;
  }

  getCollection(itemType) {
    if (
      this.collections[itemType] === null ||
      this.collections[itemType] === undefined
    ) {
      this.collections[itemType] = this._fireStore.collection(itemType);
    }
    return this.collections[itemType];
  }

  async getAllItems(itemType, pagination?: Pagination) {
    return await this.getCollection(itemType);
  }
  async getItemById(itemType, id) {
    return await this.getCollection(itemType)
      .doc(id)
      .get();
  }
  async addItem(itemType, item) {
    return await this.getCollection(itemType).add(item);
  }
  saveItem(itemType, item) {
    return this.getCollection(itemType)
      .doc(item.id)
      .update(item);
  }
  deleteItem(itemType, id) {
    return this.getCollection(itemType)
      .doc(id)
      .delete();
  }
  async searchItems(itemType, searchParams, pagination?: Pagination) {}
}
