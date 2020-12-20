import { getAllByTestId, getByAltText, screen } from '@testing-library/dom'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { forEachChild } from 'typescript'
import Photo, { imageDB } from './Photo'

describe('Photo App', () => {
  it('사진 리스트, 뷰가 올바르게 보이는가?', () => {
    const photoApp = new Photo(document.body)
    photoApp.render()
    /**
     * 사진 리스트 들에 이미지DB에 있는 사진 alt 가 제대로 들어갔는가?
     */
    const list = screen.getByTestId('photo-list')
    imageDB.forEach((imageData) => {
      expect(list).toContainElement(getByAltText(list, imageData.title))
    })

    /**
     * 사진 앱이 처음 실행됐을때
     * 사진 리스트에서 첫번째 사진에 selected 클래스(테두리)가 생기고
     * 뷰가 첫번째 사진을 표현하는가?
     */
    const photoItems = getAllByTestId(list, 'photo-item')
    photoItems.forEach((item, i) => {
      if (i === 0) {
        expect(item).toHaveClass('selected')
      } else {
        expect(item).not.toHaveClass('selected')
      }
    })
    const view = screen.getByTestId('photo-view')
    expect(view).toContainElement(getByAltText(view, imageDB[0].title))
  })

  it('사진 하나 선택하면 그 사진에만 테두리(selected 클래스)가 생기고 view에 제대로 표시되는가?', () => {
    const photoApp = new Photo(document.body)
    photoApp.render()

    const photoItems = screen.getAllByTestId('photo-item')
    const view = screen.getByTestId('photo-view')
    for (let i = 0; i < photoItems.length; i++) {
      // 클릭할 요소의 idx 을 정해주는 루프
      userEvent.click(photoItems[i].querySelector('button')) // 이벤트 핸들러를 연결한 버튼을 지정하여 클릭해야 클릭이 인정됨.
      /**
       * 사진 하나 클릭 시 해당 요소에  selected 클래스가 생기는가?
       */
      expect(photoItems[i]).toHaveClass('selected')
      /**
       * 선택한 사진이 view 에 표시 되는가?
       */
      const toFindAltText = photoItems[i]
        .querySelector('img')
        .getAttribute('alt')
      expect(view).toContainElement(getByAltText(view, toFindAltText))
      for (let j = 0; j < photoItems.length; j++) {
        // 클릭안한 나머지 요소를 순회하기 위한 루프
        if (i !== j) {
          /**
           * 클릭 안한 나머지 사진들은 selected 클래스가 없는가?(테두리가 없는가?)
           */
          expect(photoItems[j]).not.toHaveClass('selected')
        }
      }
    }
  })
})
