import './App.css'
import { TopNav } from './components/custom/top-nav'
import { About } from './views/about'
import { Background } from './views/background'
import { Footer } from './views/footer'
import { Projects } from './views/projects'
import { Skills } from './views/skills'

function App() {

  return (
    <div>
      <Background/>
      <TopNav/>
      <About/>
      <Projects/>
      <Skills/>
      <Footer/>
    </div>
  )
}

export default App
