import './App.css'
import { TopNav } from './components/custom/top-nav'
import { About } from './views/about'
import { Background } from './views/background'
import { Footer } from './views/footer'
import { Projects } from './views/projects'
import { Skills } from './views/skills'

function App() {
  return (
    <div className="relative min-h-screen w-full">
      <Background />
      <div className="relative z-10 flex flex-col min-h-screen">
        <TopNav />
        <main className="flex-1">
          <About />
          <Projects />
          <Skills />
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default App
