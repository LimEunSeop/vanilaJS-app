import { makeTwoDigits } from './../../utils/time'
import { ChildrenApp, ItemAddable } from '../../types/CoreTypes'

interface TimeData {
  isAM: boolean
  hours: number
  minutes: number
}

export default class Alarm
  extends ChildrenApp<TimeData>
  implements ItemAddable {
  constructor(container: HTMLElement) {
    super(container, 'alarm', '알람')
  }

  addPanelVisible: boolean = false

  removeButtonClickHandler = (e: MouseEvent) => {
    const button = e.target as HTMLButtonElement
    const itemId = Number(button.dataset.itemId)
    this.removeItem(itemId)
    this.render()
  }

  onAddFormSubmit = (e: Event) => {
    e.preventDefault()

    const form = e.target as HTMLFormElement
    const isAM = form.ampm.value.toUpperCase() === 'AM' ? true : false
    const hours = Number(form.hours.value)
    const minutes = Number(form.minutes.value)

    this.addItem({ isAM, hours, minutes })
    this.addPanelVisible = false
    this.render()
    return false
  }

  /**
   * 알람을 울리기 위해 시간을 체크하는 메서드
   * 외부에서 호출되는 인터페이스이므로 매개변수를 일반적인 Date 객체로 설정했습니다.
   *
   * time 매개변수를 Alarm 객체 자체의 시간 체계로 변환시킨 후, 비교작업을 수행할 것입니다.
   *
   * @param time Date
   * @return onTime boolean : 알람시간이 맞았는지의 여부를 리턴
   */
  checkTime(time: Date): boolean {
    const hours = time.getHours()
    const minutes = time.getMinutes()

    const convertedTimeData = {} as TimeData
    if (hours === 0) {
      // 0시면 오후 12시로 인식해야한다.
      convertedTimeData.isAM = false
      convertedTimeData.hours = 12
      convertedTimeData.minutes = minutes
    } else {
      if (hours > 12) {
        // 13 ~ 23시 까지 오후계산
        convertedTimeData.isAM = false
        convertedTimeData.hours = hours - 12
        convertedTimeData.minutes = minutes
      } else {
        // 1 ~ 12시 까지 오전계산
        convertedTimeData.isAM = true
        convertedTimeData.hours = hours
        convertedTimeData.minutes = minutes
      }
    }

    for (let i = 0; i < this.items.length; i++) {
      if (JSON.stringify(this.items[i]) === JSON.stringify(convertedTimeData)) {
        // 시간이 일치하는지
        alert(this.getTimeText(convertedTimeData))
        this.removeItem(i)
        return true
      }
    }

    return false
  }

  // 알람 앱에서의 시간 Display 형식에 맞게 텍스트를 리턴합니다.
  getTimeText(timeItem: TimeData) {
    return `${timeItem.isAM ? '오전' : '오후'} ${makeTwoDigits(
      timeItem.hours
    )}시 ${makeTwoDigits(timeItem.minutes)}분`
  }

  showAddPanel() {
    this.addPanelVisible = true
    this.render()
  }

  /**
   * 알람 추가패널을 반환합니다
   * 
   * HTML 구조
<form id="alarm-form">
  <div class="input-area">
    <select name="ampm">
    </select>
    <label>
      <select name="hours">
      </select>
        시
    </label>
    <label>
      <select name="minutes">
      </select>분
    </label>
  </div>
  <button type="submit">저장</button>
</form>
   */
  getAddPanel() {
    const form = document.createElement('form')
    form.id = 'alarm-form'
    form.addEventListener('submit', this.onAddFormSubmit)

    const ampmSelect = document.createElement('select')
    ampmSelect.setAttribute('name', 'ampm')
    ampmSelect.innerHTML = `
      <option value="am">오전</option>
      <option value="pm">오후</option>
    `

    const hoursSelect = document.createElement('select')
    hoursSelect.setAttribute('name', 'hours')
    Array.from(new Array(12), (x, i) => {
      // 1 ~ 12 까지의 배열 순환 트릭
      const option = document.createElement('option')
      option.setAttribute('value', String(i + 1))
      option.textContent = makeTwoDigits(i + 1)
      hoursSelect.appendChild(option)
    })
    const hoursLabel = document.createElement('label')
    hoursLabel.appendChild(hoursSelect)
    hoursLabel.appendChild(document.createTextNode('시'))

    const minutesSelect = document.createElement('select')
    minutesSelect.setAttribute('name', 'minutes')
    Array.from(new Array(6), (x, i) => {
      // 0 ~ 5
      const option = document.createElement('option')
      option.setAttribute('value', String(i * 10))
      option.textContent = makeTwoDigits(i * 10)
      minutesSelect.appendChild(option)
    })
    const minutesLabel = document.createElement('label')
    minutesLabel.appendChild(minutesSelect)
    minutesLabel.appendChild(document.createTextNode('분'))

    const saveButton = document.createElement('button')
    saveButton.setAttribute('type', 'submit')
    saveButton.textContent = '저장'

    const inputArea = document.createElement('div')
    inputArea.classList.add('input-area')
    inputArea.appendChild(ampmSelect)
    inputArea.appendChild(hoursLabel)
    inputArea.appendChild(minutesLabel)

    form.appendChild(inputArea)
    form.appendChild(saveButton)
    return form
  }

  /**
   * emmet 구조 : ul#alarm-list>li*n>time+button{삭제}
   */
  getItemListContainer() {
    const listEl = document.createElement('ul')
    listEl.id = 'alarm-list'
    this.items.forEach((item, i) => {
      const itemEl = document.createElement('li')

      const timeEl = document.createElement('time')
      timeEl.setAttribute(
        'datetime',
        makeTwoDigits(item.hours) + ':' + makeTwoDigits(item.minutes)
      )
      timeEl.textContent = this.getTimeText(item)
      itemEl.appendChild(timeEl)

      const removeButton = document.createElement('button')
      removeButton.dataset.itemId = String(i)
      removeButton.textContent = '삭제'
      removeButton.addEventListener('click', this.removeButtonClickHandler)
      itemEl.appendChild(removeButton)

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
