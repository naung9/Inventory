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

  getAllItems(itemType) {
    return this.getCollection(itemType);
  }
  getItemById(itemType, id) {
    return this.getCollection(itemType)
      .doc(id)
      .get();
  }
  addItem(itemType, item) {
    return this.getCollection(itemType).add(item);
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
  async searchItems(itemType, searchParams) {}
}
