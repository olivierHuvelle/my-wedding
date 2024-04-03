export abstract class BaseFactory<T> {
  protected _uniqueConstraints: Record<string, unknown[]> = {}

  constructor() {
    this._uniqueConstraints = {}
  }

  abstract create(): T

  bulkCreate(nbRecords: number): T[] {
    const records: T[] = []
    for (let i = 0; i < nbRecords; i++) {
      records.push(this.create())
    }
    return records
  }
}
