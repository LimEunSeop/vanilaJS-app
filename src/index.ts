import Launcher from './components/RootApp/Launcher'

/************************************************
 * Configs
 ************************************************/

// 100vh 뷰포트 모바일에서 제대로 안되는 문제 해결 https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
let vh = window.innerHeight * 0.01
document.documentElement.style.setProperty('--vh', `${vh}px`)

window.addEventListener('resize', () => {
  // We execute the same script as before
  let vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
})

/************************************************
 * 앱 런치 부분
 ************************************************/
const rootContainer: HTMLElement = document.getElementById('root')
const home = new Launcher(rootContainer)
home.render()
