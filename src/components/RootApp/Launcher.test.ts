import { getByText, queryByText, screen } from '@testing-library/dom'
import '@testing-library/jest-dom'
import { getTimeText } from '../../utils/time'
import userEvent from '@testing-library/user-event'

import Launcher from './Launcher'

describe('Launcher app', () => {
  const home = new Launcher(document.body)
  home.render()

  const timeFormat = /\d+년 \d+월 \d+일 \d+시 \d+분 \d+초/

  it('알람, 메모, 사진 앱이 보이는가?', () => {
    expect(screen.getByText('알람')).toBeInTheDocument()
    expect(screen.getByText('메모')).toBeInTheDocument()
    expect(screen.getByText('사진')).toBeInTheDocument()
  })
  it('메인에서 상단바에 시간만 보이는가?', () => {
    const headerBar = screen.getByTestId('header-bar')
    expect(getByText(headerBar, timeFormat)).toBeInTheDocument()
    expect(queryByText(headerBar, 'BACK')).toBe(null)
    expect(queryByText(headerBar, 'NEW')).toBe(null)
  })
  it('알람앱 실행 시 상단바 변화, 앱 실행 여부 및 NEW 동작 체크', () => {
    // 알람 앱 클릭시 알람앱 켜지는가? (알람리스트자 보이는가?, 내용은 Alarm.test.ts 에서 테스트)
    userEvent.click(screen.getByText('알람'))
    expect(screen.getByTestId('alarm-list')).toBeInTheDocument()

    // 알람앱 상단에 BACK, 시간, NEW 가 보이는가?
    let headerBar = screen.getByTestId('header-bar')
    expect(getByText(headerBar, timeFormat)).toBeInTheDocument()
    expect(getByText(headerBar, 'BACK')).toBeInTheDocument()
    expect(getByText(headerBar, 'NEW')).toBeInTheDocument()

    // NEW 클릭 시 폼이 렌더링 되는가? (내용은 Alarm.test.ts 에서 테스트)
    userEvent.click(getByText(headerBar, 'NEW'))
    expect(screen.getByTestId('alarm-form')).toBeInTheDocument()

    // BACK 버튼 클릭 시 홈화면으로 돌아가고 상단에 BACK, NEW 가 없어지는가?
    userEvent.click(getByText(headerBar, 'BACK'))
    headerBar = screen.getByTestId('header-bar')
    expect(getByText(headerBar, timeFormat)).toBeInTheDocument()
    expect(queryByText(headerBar, 'BACK')).toBe(null)
    expect(queryByText(headerBar, 'NEW')).toBe(null)
  })
  it('메모앱 실행 시 상단바 변화, 앱 실행 여부 및 NEW 동작 체크', () => {
    // 메모 앱 클릭시 메모앱 켜지는가? (메모 리스트가 렌더링 되는가?, 자세한 내용은 Memo.test.ts 에서 테스트)
    userEvent.click(screen.getByText('메모'))
    expect(screen.getByTestId('memo-list')).toBeInTheDocument()

    // 메모앱 상단에 BACK, 시간, NEW 가 보이는가?
    let headerBar = screen.getByTestId('header-bar')
    expect(getByText(headerBar, timeFormat)).toBeInTheDocument()
    expect(getByText(headerBar, 'BACK')).toBeInTheDocument()
    expect(getByText(headerBar, 'NEW')).toBeInTheDocument()

    // NEW 클릭 시 폼이 렌더링 되는가? (내용은 Memo.test.ts 에서 테스트)
    userEvent.click(getByText(headerBar, 'NEW'))
    expect(screen.getByTestId('memo-form')).toBeInTheDocument()

    // BACK 버튼 클릭 시 홈화면으로 돌아가고 상단에 BACK, NEW 가 없어지는가?
    userEvent.click(getByText(headerBar, 'BACK'))
    headerBar = screen.getByTestId('header-bar')
    expect(getByText(headerBar, timeFormat)).toBeInTheDocument()
    expect(queryByText(headerBar, 'BACK')).toBe(null)
    expect(queryByText(headerBar, 'NEW')).toBe(null)
  })
  it('사진앱 실행 시 상단바 변화, 앱 실행 여부 체크', () => {
    // 사진 앱 클릭시 사진앱 켜지는가? (사진 리스트, 사진뷰가 렌더링 되는가?, 자세한 내용은 Photo.test.ts 에서 테스트)
    userEvent.click(screen.getByText('사진'))
    expect(screen.getByTestId('photo-list')).toBeInTheDocument()
    expect(screen.getByTestId('photo-view')).toBeInTheDocument()

    // 사진앱 상단에 BACK, 시간이 보이는가?
    let headerBar = screen.getByTestId('header-bar')
    expect(getByText(headerBar, timeFormat)).toBeInTheDocument()
    expect(getByText(headerBar, 'BACK')).toBeInTheDocument()

    // BACK 버튼 클릭 시 홈화면으로 돌아가고 상단에 BACK 버튼이 없어지는가?
    userEvent.click(getByText(headerBar, 'BACK'))
    headerBar = screen.getByTestId('header-bar')
    expect(getByText(headerBar, timeFormat)).toBeInTheDocument()
    expect(queryByText(headerBar, 'BACK')).toBe(null)
    expect(queryByText(headerBar, 'NEW')).toBe(null)
  })
  it('앱 Drag & Drop이 제대로 동작하는가?', () => {
    // Drag & Drop 을 구현할 수가 없어 순서데이터 바꾼대로 LocalStorage 에 적용되는지 보겠습니다.
    const appOrderSnapshot = JSON.stringify(home.appOrder)
    expect(localStorage[home.id]).toEqual(appOrderSnapshot) // 스냅샷 뜨고 로컬스토리지와 같은지 확인

    // 첫번째와 마지막 아이템 체인지. LocalStorage 에 반영 되는가?
    const firstItem = home.appOrder.splice(0, 1)[0]
    home.appOrder = [...home.appOrder, firstItem]
    expect(localStorage[home.id]).not.toEqual(appOrderSnapshot) // 스냅샷과 로컬스토리지가 달라짐
    expect(localStorage[home.id]).toEqual(JSON.stringify(home.appOrder)) // 새로운 순서와 로컬스토리지가 같아짐
  })
  it('앱 순서 바꾸고 재 실행시 앱 아이콘 순서가 그대로인가?', () => {
    // App을 destroy 하고 다시 new 했을때 데이터 갯수가 같은지를 체크하겠습니다.
    const obj = { launcherApp: new Launcher(document.body) }
    const appOrderSnapshot = JSON.stringify(obj.launcherApp.appOrder)
    expect(localStorage[obj.launcherApp.id]).toEqual(appOrderSnapshot)

    // 첫번째와 마지막 아이템 체인지.
    const firstItem = obj.launcherApp.appOrder.splice(0, 1)[0]
    obj.launcherApp.appOrder = [...obj.launcherApp.appOrder, firstItem]
    expect(localStorage[obj.launcherApp.id]).not.toEqual(appOrderSnapshot) // 스냅샷과 로컬스토리지가 달라짐
    expect(localStorage[obj.launcherApp.id]).toEqual(
      JSON.stringify(obj.launcherApp.appOrder)
    ) // 새로운 순서와 로컬스토리지가 같아짐)

    // 런쳐 앱 종료
    delete obj.launcherApp

    // 런쳐 앱 다시 시작
    const restartedApp = new Launcher(document.body)
    expect(localStorage[restartedApp.id]).toEqual(
      JSON.stringify(restartedApp.appOrder)
    )
  })
})
