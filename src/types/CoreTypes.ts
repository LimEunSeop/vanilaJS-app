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
  items: Array<T> = []

  constructor(container: HTMLElement, id: string, displayName: string) {
    super(container, id, displayName)
    this.loadItems()
  }

  loadItems() {
    if (localStorage[this.id]) {
      this.items = JSON.parse(localStorage[this.id])
    }
  }

  addItem(item: T) {
    this.items.push(item)
    localStorage[this.id] = JSON.stringify(this.items)
  }

  removeItem(idx: number) {
    this.items.splice(idx, 1)
    localStorage[this.id] = JSON.stringify(this.items)
  }

  abstract getItemListContainer(): HTMLElement
}

// 아이템을 추가할 수 있는 컴포넌트만 이것을 implement 시켜 add panel 이 보이도록 할 것.
export interface ItemAddable {
  addPanelVisible: boolean
  showAddPanel(): void
  getAddPanel(): HTMLElement
}
