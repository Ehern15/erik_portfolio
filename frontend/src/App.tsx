import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { Chatbot } from './components/custom/chatbot'
import { TopNav } from './components/custom/top-nav'
import { About } from './views/about'
import { Background } from './views/background'
import { Footer } from './views/footer'
import { ProjectDetail } from './views/project-detail'
import { Projects } from './views/projects'
import { Skills } from './views/skills'

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full">
      <Background />
      <div className="relative z-10 flex flex-col min-h-screen">
        <TopNav />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
      <Chatbot />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <Shell>
            <About />
            <Projects />
            <Skills />
          </Shell>
        } />
        <Route path="/projects/:slug" element={
          <Shell>
            <ProjectDetail />
          </Shell>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
