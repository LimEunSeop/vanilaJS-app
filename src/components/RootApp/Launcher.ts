import { ItemAddable } from '../../types/CoreTypes'
import { App } from '../../types/CoreTypes'
import Alarm from '../ChildrenApp/Alarm'
import Memo from '../ChildrenApp/Memo'
import Photo from '../ChildrenApp/Photo'
import { getTimeText } from '../../utils/time'

type AppId = string

interface AppMap {
  [appId: string]: App
}

export default class Launcher extends App {
  apps: AppMap = {}
  _appOrder: Array<AppId> // Local Storage 에 저장되고 불러올 앱 순서정보 데이터

  mainContainer: HTMLElement // 런쳐 홈, 실행중인 앱이 보여질 공간

  timerID: number = null
  selectedApp: AppId = this.id // this.id : 아무것도 앱 실행 안한 현재 런쳐 앱 초기상태

  constructor(container: HTMLElement) {
    super(container, 'home', '홈')

    // 헤더바가 제외된 앱이 실행될 Container
    this.mainContainer = document.createElement('main')
    // 런처에 앱 등록
    ;[
      new Alarm(this.mainContainer),
      new Memo(this.mainContainer),
      new Photo(this.mainContainer),
    ].forEach((app) => {
      this.apps[app.id] = app
    })

    // localStorage 에서 런처 앱 순서 데이터 불러오기
    if (localStorage[this.id]) {
      this.appOrder = JSON.parse(localStorage[this.id])
    } else {
      // default
      this.appOrder = Object.keys(this.apps)
    }
  }

  get appOrder() {
    return this._appOrder
  }

  set appOrder(appOrder: Array<AppId>) {
    this._appOrder = appOrder
    localStorage[this.id] = JSON.stringify(appOrder)
  }

  handleAppClick = (e: MouseEvent) => {
    const buttonEl: HTMLButtonElement = e.currentTarget as HTMLButtonElement
    const itemEl: HTMLLIElement = buttonEl.parentElement as HTMLLIElement
    const clickedAppId: AppId = itemEl.dataset.appId
    this.appExecute(clickedAppId)
  }

  handleBackButtonClick = () => {
    // 홈으로 돌아가기
    this.selectedApp = this.id
    this.render()
  }

  handleAddButtonClick = () => {
    // 이 메서드를 호출하는 경우는 itemAddable 인터페이스 구현체인 경우이기 때문에 안전함.
    const app: ItemAddable = this.apps[this.selectedApp] as any
    app.showAddPanel()
  }

  handleAppDrag = (e: DragEvent) => {
    const selectedItem = e.currentTarget as HTMLLIElement
    const list = selectedItem.parentNode
    const x = e.clientX
    const y = e.clientY

    selectedItem.classList.add('drag-sort-active')
    const listItem = document.elementFromPoint(x, y)?.parentElement // 가장 말단 노드인 button 이 인식되므로 parent로 올라와야함
    let swapItem: any =
      listItem?.getAttribute('draggable') === 'true' &&
      listItem?.parentElement.id === 'app-list' // app-list 안의 draggable 아이템이 확실한 경우
        ? listItem
        : selectedItem

    if (list === swapItem.parentNode) {
      swapItem =
        swapItem !== selectedItem.nextSibling ? swapItem : swapItem.nextSibling
      list.insertBefore(selectedItem, swapItem)
    }
  }

  handleAppDrop = (e: DragEvent) => {
    const droppedItem = e.currentTarget as HTMLLIElement
    droppedItem.classList.remove('drag-sort-active')

    // localStorage 앱 순서정보 저장
    localStorage[this.id] = JSON.stringify(
      Array.prototype.map.call(
        droppedItem.parentElement.children,
        (item: HTMLLIElement) => item.dataset.appId
      )
    )
  }

  appExecute(appId: AppId) {
    this.selectedApp = appId
    this.render()
  }

  updateTime(timeEl: HTMLTimeElement) {
    const { fullText, ISOString } = getTimeText(new Date())
    timeEl.textContent = fullText
    timeEl.setAttribute('datetime', ISOString)
    window.clearTimeout(this.timerID)
    this.timerID = window.setInterval(() => {
      const time = new Date()
      const { fullText, ISOString } = getTimeText(time)
      timeEl.textContent = fullText
      timeEl.setAttribute('datetime', ISOString)

      // 앱중에 알람앱이 있으면? => 알람기능 수행!
      // id는 정해진 것이 아니기 때문에 타입으로 체킹하는 것이 합당하다 생각했습니다.
      Object.values(this.apps).forEach((app) => {
        if (app instanceof Alarm) {
          const onTime = app.checkTime(time)
          // 알람 시간이 일치하고 현재 보고있는 앱이 알람앱이다? 알람리스트 업데이트. 다른앱 실행중이면 굳이 할 필요 없음.
          if (onTime && this.selectedApp === app.id) {
            this.apps[this.selectedApp].render()
          }
        }
      })
    }, 1000)
  }

  /**
   * 상단 헤더바를 가져옵니다.
   *
   * emmet 구조 : header>button{BACK}+time+button{NEW}
   */
  getHeaderContainer() {
    const header = document.createElement('header')
    header.dataset.testid = 'header-bar'

    // 뒤로가기 버튼
    if (this.selectedApp !== this.id) {
      // 홈화면이 아닌 경우
      const backButton = document.createElement('button')
      backButton.textContent = 'BACK'
      backButton.addEventListener('click', this.handleBackButtonClick)
      header.appendChild(backButton)
    }

    // 시계
    const time = document.createElement('time')
    this.updateTime(time)
    header.appendChild(time)

    // NEW 버튼
    if (
      this.selectedApp !== this.id &&
      'showAddPanel' in (this.apps[this.selectedApp] as any)
    ) {
      // ItemAddable 인터페이스인경우
      const newButton = document.createElement('button')
      newButton.textContent = 'NEW'
      newButton.addEventListener('click', this.handleAddButtonClick)
      header.appendChild(newButton)
    }

    return header
  }

  mousedown(e: any) {
    console.log('mousedown', e)
  }

  /**
   * 런쳐의 부분 화면인 홈화면(앱리스트)를 렌더링합니다
   *
   * emmet 구조 : ul#app-list>li*n>button
   */
  renderAppList() {
    this.mainContainer.innerHTML = '' // 메인화면 비우기
    const appListEl = document.createElement('ul')
    appListEl.id = 'app-list'
    this.appOrder.forEach((appId) => {
      const app = this.apps[appId]

      const itemEl = document.createElement('li')
      itemEl.dataset.appId = app.id
      itemEl.setAttribute('draggable', 'true')
      itemEl.addEventListener('drag', this.handleAppDrag)
      itemEl.addEventListener('dragend', this.handleAppDrop)

      const buttonEl = document.createElement('button')
      buttonEl.textContent = app.displayName
      buttonEl.addEventListener('click', this.handleAppClick)

      itemEl.appendChild(buttonEl)
      appListEl.appendChild(itemEl)
    })
    this.mainContainer.appendChild(appListEl)
  }

  /**
   * 런처의 전체화면을 렌더링합니다.
   *
   * emmet 구조 : div#root>HeaderContainer+MainContainer
   */
  render() {
    const headerContainer = this.getHeaderContainer()
    const mainContainer = this.mainContainer

    this.container.innerHTML = '' // 전체화면 비우기
    this.container.appendChild(headerContainer)
    this.container.appendChild(mainContainer)

    // mainContainer 내부 렌더링
    if (this.selectedApp === this.id) {
      // 홈화면일경우
      this.renderAppList()
    } else {
      // 앱일 경우
      this.apps[this.selectedApp].render()
    }
  }
}
