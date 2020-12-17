import { ItemAddable } from '../../types/CoreTypes'
import { App } from '../../types/CoreTypes'
import Alarm from '../ChildrenApp/Alarm'
import Memo from '../ChildrenApp/Memo'
import Photo from '../ChildrenApp/Photo'
import { getTimeText } from '../../utils/time'

export default class Home extends App {
  apps: Array<unknown>

  mainContainer: HTMLElement // 홈화면, 실행중인 앱이 보여질 공간

  timerID: number = null
  selectedApp: number = -1 // -1 : 아무것도 앱 실행 안한 홈화면 초기상태

  constructor(container: HTMLElement) {
    super(container, '홈')
    this.mainContainer = document.createElement('main')

    // 홈 화면에 앱 부착
    this.apps = [
      new Alarm(this.mainContainer),
      new Memo(this.mainContainer),
      new Photo(this.mainContainer),
    ]
  }

  handleAppClick = (e: MouseEvent) => {
    const buttonEl: HTMLButtonElement = e.target as HTMLButtonElement
    const clickedAppId: number = Number(buttonEl.dataset.appId)

    this.appExecute(clickedAppId)
  }

  handleBackButtonClick = () => {
    // 홈으로 돌아가기
    this.selectedApp = -1
    this.render()
  }

  handleAddButtonClick = () => {
    ;(this.apps[this.selectedApp] as ItemAddable).showAddPanel()
  }

  appExecute(appId: number) {
    this.selectedApp = appId
    this.render()
  }

  updateTime(timeEl: HTMLTimeElement) {
    const { fullText, ISOString } = getTimeText(new Date())
    timeEl.textContent = fullText
    timeEl.setAttribute('datetime', ISOString)
    this.timerID = window.setInterval(() => {
      const time = new Date()
      const { fullText, ISOString } = getTimeText(time)
      timeEl.textContent = fullText
      timeEl.setAttribute('datetime', ISOString)

      this.apps.forEach((app) => {
        // 앱중에 알람앱이 있으면? => 알람기능 수행!
        if (app instanceof Alarm) {
          app.checkTime(time)
        }
      })
    }, 1000)
  }

  getHeaderContainer() {
    const header = document.createElement('header')

    // 뒤로가기 버튼
    if (this.selectedApp !== -1) {
      // 홈화면이 아닌 경우
      const backButton = document.createElement('button')
      backButton.textContent = 'BACK'
      backButton.addEventListener('click', this.handleBackButtonClick)
      header.appendChild(backButton)
    }

    // 시계
    const time = document.createElement('time')
    window.clearTimeout(this.timerID)
    this.updateTime(time)
    header.appendChild(time)

    // NEW 버튼
    if (
      this.selectedApp !== -1 &&
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

  renderAppList() {
    this.mainContainer.innerHTML = '' // 메인화면 비우기
    const appListEl = document.createElement('ul')
    appListEl.id = 'app-list'
    this.apps.forEach((app, i) => {
      const itemEl = document.createElement('li')
      const buttonEl = document.createElement('button')
      buttonEl.textContent = (app as App).name
      buttonEl.dataset.appId = String(i)
      buttonEl.addEventListener('click', this.handleAppClick)

      itemEl.appendChild(buttonEl)
      appListEl.appendChild(itemEl)
    })
    this.mainContainer.appendChild(appListEl)
  }

  render() {
    const headerContainer = this.getHeaderContainer()
    const mainContainer = this.mainContainer

    this.container.innerHTML = '' // 전체화면 비우기
    this.container.appendChild(headerContainer)
    this.container.appendChild(mainContainer)

    // mainContainer 내부 렌더링
    if (this.selectedApp === -1) {
      // 홈화면일경우
      this.renderAppList()
    } else {
      // 앱일 경우
      ;(this.apps[this.selectedApp] as App).render()
    }
  }
}
