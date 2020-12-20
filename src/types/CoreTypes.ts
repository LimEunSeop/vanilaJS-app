export abstract class App {
  container: HTMLElement
  id: string
  displayName: string

  constructor(container: HTMLElement, id: string, displayName: string) {
    this.container = container
    this.id = id
    this.displayName = displayName
  }

  abstract render(): void
}

export abstract class ChildrenApp<T> extends App {
  _items: Array<T> = []

  constructor(container: HTMLElement, id: string, displayName: string) {
    super(container, id, displayName)
    this.loadItems()
  }

  get items() {
    return this._items
  }

  set items(items: Array<T>) {
    this._items = items
    localStorage[this.id] = JSON.stringify(this._items)
  }

  loadItems() {
    if (localStorage[this.id]) {
      this._items = JSON.parse(localStorage[this.id])
    }
  }

  addItem(item: T) {
    this._items.push(item)
    localStorage[this.id] = JSON.stringify(this._items)
  }

  removeItem(idx: number) {
    this._items.splice(idx, 1)
    localStorage[this.id] = JSON.stringify(this._items)
  }

  abstract getItemListContainer(): HTMLElement
}

// 아이템을 추가할 수 있는 컴포넌트만 이것을 implement 시켜 add panel 이 보이도록 할 것.
export interface ItemAddable {
  addPanelVisible: boolean
  showAddPanel(): void
  getAddPanel(): HTMLElement
}
