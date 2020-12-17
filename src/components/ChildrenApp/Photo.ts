import { ChildrenApp } from '../../types/CoreTypes'

const imageDB: Array<PhotoData> = [
  { title: '석양과 함께있는 에펠탑', src: 'images/1.jpg' },
  { title: '석양에 겹친 나무', src: 'images/2.jpg' },
  { title: '3명이 멋진배경과 함께 농구', src: 'images/3.jpg' },
  { title: '별똥별 타임랩스', src: 'images/4.jpg' },
  { title: '달에비춰지는 사람의 실루엣', src: 'images/5.jpg' },
  { title: '손하트로 태양품기', src: 'images/6.jpg' },
  { title: '알록달록한 석양', src: 'images/7.jpg' },
  { title: '밤하늘 속에서 울부짓는 늑대', src: 'images/8.jpg' },
  { title: '개기일식 직전', src: 'images/9.jpg' },
  { title: '태양을 머금은 파도', src: 'images/10.jpg' },
  { title: '선물을 주고받는 두 여자의 우정', src: 'images/11.jpg' },
]

interface PhotoData {
  title: string
  src: string
}

export default class Photo extends ChildrenApp<PhotoData> {
  selectedItem: number = 0
  photoViewContainer: HTMLElement // 사진 View Area

  constructor(container: HTMLElement) {
    super(container, '사진')
    this.photoViewContainer = document.createElement('figure')
    this.photoViewContainer.id = 'photo-view'
    this.loadItems()
  }

  handleItemClick = (e: MouseEvent) => {
    const clickedButton = e.currentTarget as HTMLButtonElement // currentTarget 이 정확한 타겟을 리턴한다.
    const item = clickedButton.parentElement // li요소가 parent
    const itemId = Number(item.dataset.itemId)
    this.selectedItem = itemId

    const items = item.parentElement.getElementsByTagName('li')
    Array.prototype.forEach.call(items, (item: HTMLLIElement) => {
      item.classList.remove('selected')
    })
    item.classList.add('selected')

    this.renderPhotoView()
  }

  loadItems() {
    this.items = [...imageDB]
  }

  getItemListContainer(): HTMLElement {
    const listEl = document.createElement('ul')
    listEl.id = 'photo-list'

    this.items.forEach((item, i) => {
      // item 정보(selected, itemId)는 li 요소가 관리하고, 이벤트 관련은 버튼이 담당하는 방식
      // button 요소가 Focusable 하므로 button 을 포함시키는 것은 매우 중요
      const itemEl = document.createElement('li')
      if (i === this.selectedItem) itemEl.classList.add('selected')
      itemEl.dataset.itemId = String(i)
      const buttonEl = document.createElement('button')
      buttonEl.addEventListener('click', this.handleItemClick)
      const imgEl = document.createElement('img')
      imgEl.setAttribute('src', item.src)
      imgEl.setAttribute('alt', item.title)
      buttonEl.appendChild(imgEl)

      itemEl.appendChild(buttonEl)
      listEl.appendChild(itemEl)
    })
    return listEl
  }

  renderPhotoView() {
    this.photoViewContainer.innerHTML = ''
    const selectedImgData = this.items[this.selectedItem]

    // 이미지가 모두 contain 되도록 구성하기 위하여 img 보다는 background 테크닉을 사용하기로 했습니다.
    // 하지만 시각장애인의 경우 이 이미지를 인식하지 못하기 때문에 img 태그도 같이 넣어줬습니다.
    // 그 img 태그는 스크린리더에만 읽히도록 a11yHidden 클래스 처리했습니다. (figcaption 포함)
    this.photoViewContainer.setAttribute(
      'style',
      `background: url(${selectedImgData.src}) #000 no-repeat center; background-size: contain;`
    )
    const imgEl = document.createElement('img')
    imgEl.setAttribute('src', selectedImgData.src)
    imgEl.setAttribute('alt', selectedImgData.title)
    imgEl.classList.add('a11yHidden')
    const figCaption = document.createElement('figcaption')
    figCaption.textContent = '선택된 사진'
    figCaption.classList.add('a11yHidden') // 스크린리더엔 읽히면서 눈으로 안보이게 처리

    this.photoViewContainer.appendChild(imgEl)
    this.photoViewContainer.appendChild(figCaption)
  }

  render() {
    this.container.innerHTML = ''

    // 컨테이너 배치
    const photoListContainer = this.getItemListContainer()
    const photoViewContainer = this.photoViewContainer
    this.container.appendChild(photoListContainer)
    this.container.appendChild(photoViewContainer)

    // photoView 컨테이너 렌더링: 사용자 경험 향상을 위해 photoView 렌더링 함수 따로 만듬.
    // photoList 까지 자주 재렌더링 되면 깜빡거리고 스크롤 초기화 되는 것이 좋지 않다)
    this.renderPhotoView()
  }
}
