import Home from './components/RootApp/Home'

const rootContainer: HTMLElement = document.getElementById('root')

const home = new Home(rootContainer)
home.render()
