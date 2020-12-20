import { getByText, getByPlaceholderText, screen } from '@testing-library/dom'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import Memo from './Memo'
import Alarm from './Memo'

describe('Memo App', () => {
  it('메모 추가 폼이 제대로 나오고 동작하는가?', () => {
    const memoApp = new Memo(document.body)
    memoApp.items = []
    /**
     * 로컬스토리지에도 item이 0개가 있는가?
     */
    expect(JSON.parse(localStorage[memoApp.id])).toHaveLength(0)

    /**
     * 폼 필수 요소들이 제대로 렌더링 되는가?
     */
    memoApp.showAddPanel() // 메모 추가 버튼 클릭 시 호출되는 메서드
    const form = screen.getByTestId('memo-form')
    expect(form).toBeInTheDocument()
    expect(form).toContainElement(
      getByPlaceholderText(form, '메모를 입력하세요')
    )

    /**
     * 메모 입력후 엔터 입력시 저장되고 입력창 사라지는가?
     */
    const input = getByPlaceholderText(form, '메모를 입력하세요')
    userEvent.type(input, 'Hello World!')
    userEvent.type(input, '{enter}')
    const list = screen.getByTestId('memo-list')
    expect(list).toContainElement(getByText(list, 'Hello World!'))
    expect(input).not.toBeInTheDocument()

    /**
     * 로컬스토리지에 저장되는가?
     */
    expect(JSON.parse(localStorage[memoApp.id])).toHaveLength(1)
  })
  it('메모 리스트에 아이템이 제대로 나오고 동작하는가?', () => {
    const memoApp = new Memo(document.body)
    memoApp.items = [
      { content: 'Hello~~~~~~~~!@#$' },
      { content: 'World!!!!!!!!!!!!!!!!!!!!' },
      { content: '임은섭 11번가 입사 기원!!' },
    ]
    memoApp.render()
    /**
     * 로컬스토리지에도 items 2개가 있는가?
     */
    expect(JSON.parse(localStorage[memoApp.id])).toHaveLength(3)

    /**
     * 메모가 제대로 들어가는가?
     */
    const list = screen.getByTestId('memo-list')
    const item1 = getByText(list, 'Hello~~~~~~~~!@#$')
    const item2 = getByText(list, 'World!!!!!!!!!!!!!!!!!!!!')
    const item3 = getByText(list, '임은섭 11번가 입사 기원!!')
    expect(list).toContainElement(item1)
    expect(list).toContainElement(item2)
    expect(list).toContainElement(item3)

    /**
     * 각각의 메모 클릭 시 item에 active 클래스가 추가되고 나머지 아이템은 active 클래스 사라지는가?
     */
    userEvent.click(item1)
    expect(item1.parentElement).toHaveClass('active') // 버튼을 담고있는 부모 item(li)요소에 active 가 붙음
    expect(item2.parentElement).not.toHaveClass('active')
    expect(item3.parentElement).not.toHaveClass('active')
    userEvent.click(item2)
    expect(item1.parentElement).not.toHaveClass('active')
    expect(item2.parentElement).toHaveClass('active')
    expect(item3.parentElement).not.toHaveClass('active')
    userEvent.click(item3)
    expect(item1.parentElement).not.toHaveClass('active')
    expect(item2.parentElement).not.toHaveClass('active')
    expect(item3.parentElement).toHaveClass('active')
  })

  it('재 실행시 데이터가 그대로인가?', () => {
    // App을 destroy 하고 다시 new 했을때 데이터 갯수가 같은지를 체크하겠습니다.
    const obj = { memoApp: new Memo(document.body) }
    obj.memoApp.items = []
    expect(JSON.parse(localStorage[obj.memoApp.id])).toHaveLength(0)
    obj.memoApp.items = [
      { content: 'Hello~~~~~~~~!@#$' },
      { content: 'World!!!!!!!!!!!!!!!!!!!!' },
      { content: '임은섭 11번가 입사 기원!!' },
    ]
    expect(JSON.parse(localStorage[obj.memoApp.id])).toHaveLength(3)

    // 알람 앱 종료
    delete obj.memoApp

    // 알람 앱 다시 시작
    const restartedApp = new Alarm(document.body)
    expect(JSON.parse(localStorage[restartedApp.id])).toHaveLength(3)
  })
})
