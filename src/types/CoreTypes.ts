export abstract class App {
  container: HTMLElement
  name: string

  constructor(container: HTMLElement, name: string) {
    this.container = container
    this.name = name
  }

  abstract render(): void
}

export abstract class ChildrenApp<T> extends App {
  items: Array<T>

  constructor(container: HTMLElement, name: string) {
    super(container, name)
  }

  addItem(item: T) {
    this.items.push(item)
  }
  removeItem(idx: number) {
    this.items.splice(idx, 1)
  }
  abstract loadItems(): void
  abstract getItemListContainer(): HTMLElement
}

// 아이템을 추가할 수 있는 컴포넌트만 이것을 implement 시켜 add panel 이 보이도록 할 것.
export interface ItemAddable {
  addPanelVisible: boolean
  showAddPanel(): void
  getAddPanel(): HTMLElement
}

// export interface ChildrenApp<T> extends App {
//   loadItems
//   addItem
//   removeItem
// }

// interface ClockConstructor {
//   new(hour: number, minute: number): ClockInterface;
// }

// interface ClockInterface {
//   tick(): void;
// }

// const Clock: ClockConstructor = class Clock implements ClockInterface {
//   constructor(h: number, m: number) {}
//   tick() {
//     console.log('beep beep')
//   }
// }
