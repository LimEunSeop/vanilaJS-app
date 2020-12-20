describe('Launcher app', () => {
  it('알람, 메모, 사진 앱이 보이는가?', () => {
    expect(true).toBe(false)
  })
  it('상단바에 시간이 보이는가?', () => {
    expect(true).toBe(false)
  })
  it('알람앱 실행 테스트 및 상단바 변화 체크', () => {
    // 알람 앱 클릭시 알람앱 켜지는가? (#alarm-list 가 렌더링 되는가?)
    // 알람앱 상단에 BACK, 시간, NEW 가 보이는가?
    // NEW 클릭 시 #alarm-form 이라는 폼이 렌더링 되는가? (내용은 Alarm.test.ts 에서 테스트)
    // BACK 버튼 클릭 시 홈화면으로 돌아가고 상단에 BACK, NEW 가 없어지는가?
    expect(true).toBe(false)
  })
  it('메모앱 실행 테스트 및 상단바 변화 체크', () => {
    // 메모 앱 클릭시 메모앱 켜지는가? (#memo-list 가 렌더링 되는가?)
    // 메모앱 상단에 BACK, 시간, NEW 가 보이는가?
    // NEW 클릭 시 #memo-form 이라는 폼이 렌더링 되는가? (내용은 Memo.test.ts 에서 테스트)
    // BACK 버튼 클릭 시 홈화면으로 돌아가고 상단에 BACK, NEW 가 없어지는가?
    expect(true).toBe(false)
  })
  it('사진앱 실행 테스트 및 상단바 변화 체크', () => {
    // 사진 앱 클릭시 사진앱 켜지는가? (#photo-list, #photo-view 가 렌더링 되는가?)
    // 사진앱 상단에 BACK, 시간이 보이는가?
    // BACK 버튼 클릭 시 홈화면으로 돌아가고 상단에 BACK 버튼이 없어지는가?
    expect(true).toBe(false)
  })
  it('앱 Drag & Drop이 제대로 동작하는가?', () => {
    // Drag & Drop 시 순서정보 데이터가 제대로 Swap 되는가?
    // LocalStorage 에 반영 되는가?
    expect(true).toBe(false)
  })
  it('로컬스토리지의 데이터가 제대로 로드되는가?', () => {
    expect(true).toBe(false)
  })
})