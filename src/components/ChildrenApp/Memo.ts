import { ChildrenApp, ItemAddable } from '../../types/CoreTypes'

interface MemoData {
  content: string
}

export default class Memo extends ChildrenApp<MemoData> implements ItemAddable {
  addPanelVisible: boolean = false

  constructor(container: HTMLElement) {
    super(container, '메모')
    this.loadItems()
  }

  onAddFormSubmit = (e: Event) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const content = form.content.value.trim()

    this.addItem({ content })
    this.addPanelVisible = false
    this.render()
    return false
  }

  handleMemoClick = (e: MouseEvent) => {
    const memoItem = e.target as HTMLLIElement

    const siblings = memoItem.parentElement.getElementsByTagName('li')
    // forEach 가 존재하지 않는 유사배열을 위한 메소드 빌려쓰기 패턴
    Array.prototype.forEach.call(siblings, (item: HTMLLIElement) => {
      item.classList.remove('active')
    })
    memoItem.classList.add('active')
  }

  loadItems() {
    this.items = [
      {
        content:
          '샘플 메모입니다. 샘플 메모입니다. 샘플 메모입니다. 샘플 메모입니다. 샘플 메모입니다. 샘플 메모입니다. 샘플 메모입니다. 샘플 메모입니다. 샘플 메모입니다. 샘플 메모입니다. 샘플 메모입니다. 샘플 메모입니다. 샘플 메모입니다.',
      },
      {
        content:
          '샘플 메모입니다. 샘플 메모입니다. 샘플 메모입니다. 샘플 메모입니다. 샘플 메모입니다. 샘플 메모입니다. 샘플 메모입니다. 샘플 메모입니다. 샘플 메모입니다. 샘플 메모입니다. 샘플 메모입니다. 샘플 메모입니다. 샘플 메모입니다.',
      },
      {
        content:
          '샘플 메모입니다. 샘플 메모입니다. 샘플 메모입니다. 샘플 메모입니다. 샘플 메모입니다. 샘플 메모입니다. 샘플 메모입니다. 샘플 메모입니다. 샘플 메모입니다. 샘플 메모입니다. 샘플 메모입니다. 샘플 메모입니다. 샘플 메모입니다.',
      },
      {
        content:
          '샘플 메모입니다. 샘플 메모입니다. 샘플 메모입니다. 샘플 메모입니다. 샘플 메모입니다. 샘플 메모입니다. 샘플 메모입니다. 샘플 메모입니다. 샘플 메모입니다. 샘플 메모입니다. 샘플 메모입니다. 샘플 메모입니다. 샘플 메모입니다.',
      },
    ]
  }

  showAddPanel() {
    this.addPanelVisible = true
    this.render()
  }

  getAddPanel(): HTMLFormElement {
    const form = document.createElement('form')
    form.id = 'memo-form'
    form.addEventListener('submit', this.onAddFormSubmit)

    const textInput = document.createElement('input')
    textInput.setAttribute('type', 'text')
    textInput.setAttribute('name', 'content')
    textInput.setAttribute('placeholder', '메모를 입력하세요')

    form.append(textInput)
    return form
  }

  getItemListContainer(): HTMLUListElement {
    const listEl = document.createElement('ul')
    listEl.id = 'memo-list'
    this.items.forEach((item, i) => {
      const itemEl = document.createElement('li')
      itemEl.textContent = item.content
      itemEl.addEventListener('click', this.handleMemoClick)

      listEl.appendChild(itemEl)
    })
    return listEl
  }

  render() {
    this.container.innerHTML = ''

    if (this.addPanelVisible === true) {
      const addPanel = this.getAddPanel()
      this.container.appendChild(addPanel)
    }

    const itemListContainer = this.getItemListContainer()
    this.container.appendChild(itemListContainer)
  }
}
