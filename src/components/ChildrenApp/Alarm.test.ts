import {
  screen,
  getByTestId,
  getByText,
  getByLabelText,
  getAllByText,
  queryByText,
} from '@testing-library/dom'
import '@testing-library/jest-dom' // DOM 테스트 Matcher 를 지원해줌
import userEvent from '@testing-library/user-event'
import Alarm from './Alarm'

describe('Alarm App', () => {
  it('알람 추가 폼이 제대로 나오고 추가버튼이 동작하는가?', () => {
    const alarmApp = new Alarm(document.body)
    alarmApp.items = []
    /**
     * 로컬스토리지에도 items 0개가 있는가?
     */
    expect(JSON.parse(localStorage[alarmApp.id])).toHaveLength(0)

    /**
     * 폼 필수 요소들이 제대로 렌더링 되는가?
     */
    alarmApp.showAddPanel() // 알람 추가 버튼 클릭시 호출되는 메서드
    const form = screen.getByTestId('alarm-form')
    expect(form).toBeInTheDocument()
    expect(form).toContainElement(getByText(form, '오전'))
    expect(form).toContainElement(getByText(form, '오후'))
    expect(form).toContainElement(getByLabelText(form, '시'))
    expect(form).toContainElement(getByLabelText(form, '분'))
    expect(form).toContainElement(getByText(form, '저장'))

    /**
     * 분은 10분 단위로 입력받도록 렌더링 되는가?
     */
    const minutes = getByLabelText(form, '분')
    expect(minutes).toHaveDisplayValue(/00|10|20|30|40|50/)
    expect(minutes).toHaveLength(6)

    /**
     * 저장 클릭시 item 하나가 추가 되고 추가 폼이 사라지는가?
     */
    const saveButton = getByText(form, '저장')
    userEvent.click(saveButton)
    expect(alarmApp.items).toHaveLength(1)
    expect(form).not.toBeInTheDocument()

    /**
     * 로컬스토리지에 반영되는가?
     */
    expect(JSON.parse(localStorage[alarmApp.id])).toHaveLength(1)
  })

  it('알람 리스트에 아이템이 제대로 나오고 삭제버튼이 동작하는가?', () => {
    const alarmApp = new Alarm(document.body)
    alarmApp.items = [
      { isAM: true, hours: 3, minutes: 30 },
      { isAM: false, hours: 6, minutes: 10 },
    ]
    alarmApp.render() // 알람 실행시 최초 실행되어야 하는 메서드
    /**
     *  로컬스토리지에도 items 2개가 있는가?
     */
    expect(JSON.parse(localStorage[alarmApp.id])).toHaveLength(2)

    /**
     * 알람이 제대로 렌더링 되는가?
     */
    const list = screen.getByTestId('alarm-list')
    const item1 = getByText(list, '오전 03시 30분')
    const item2 = getByText(list, '오후 06시 10분')
    expect(list).toContainElement(item1)
    expect(list).toContainElement(item2)
    const buttons = getAllByText(list, '삭제')
    expect(buttons).toHaveLength(2)

    /**
     * 1번째 삭제버튼 클릭 시 첫번째 아이템 하나가 지워지는가?
     */
    userEvent.click(buttons[0])
    expect(item1).not.toBeInTheDocument()

    /**
     * 로컬스토리지에 반영되는가?
     */
    expect(JSON.parse(localStorage[alarmApp.id])).toHaveLength(1)
  })
  it('알림시간이 되면 alert 호출되고 알람이 삭제되는가?', () => {
    const currentDate = new Date()
    const convertedCurrentTime = Alarm.convertDateToAlarmTime(currentDate) // 앱에 들어갈 데이터로 변환

    /**
     * 현재시간을 그대로 주입해서 알람이 울리는지 확인할 것
     */
    const alarmApp = new Alarm(document.body)
    alarmApp.items = [convertedCurrentTime]
    window.alert = jest.fn() // alert 모킹
    alarmApp.checkTime(currentDate)
    expect(alert).toBeCalled()

    /**
     * 임의의 시간이면?
     */
    window.alert = jest.fn() // alert 재 모킹 (호출여부 clear)
    alarmApp.checkTime(new Date('December 17, 1995 03:24:00'))
    expect(alert).not.toBeCalled()
  })

  it('재 실행시 데이터가 그대로인가?', () => {
    // App을 destroy 하고 다시 new 했을때 데이터 갯수가 같은지를 체크하겠습니다.
    const obj = { alarmApp: new Alarm(document.body) }
    obj.alarmApp.items = []
    expect(JSON.parse(localStorage[obj.alarmApp.id])).toHaveLength(0)
    obj.alarmApp.items = [
      { isAM: true, hours: 3, minutes: 30 },
      { isAM: false, hours: 6, minutes: 10 },
    ]
    expect(JSON.parse(localStorage[obj.alarmApp.id])).toHaveLength(2)

    // 알람 앱 종료
    delete obj.alarmApp

    // 알람 앱 다시 시작
    const restartedApp = new Alarm(document.body)
    expect(JSON.parse(localStorage[restartedApp.id])).toHaveLength(2)
  })
})
