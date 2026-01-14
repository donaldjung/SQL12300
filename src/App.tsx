import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Module1_Fundamentals from './pages/modules/Module1_Fundamentals'
import Module2_Filtering from './pages/modules/Module2_Filtering'
import Module3_Joins from './pages/modules/Module3_Joins'
import Module4_Aggregation from './pages/modules/Module4_Aggregation'
import Module5_Subqueries from './pages/modules/Module5_Subqueries'
import Module6_WindowFunctions from './pages/modules/Module6_WindowFunctions'
import Module7_AdvancedAnalytics from './pages/modules/Module7_AdvancedAnalytics'
import Playground from './pages/Playground'
import CheatSheet from './pages/CheatSheet'
import Glossary from './pages/Glossary'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/module/1" element={<Module1_Fundamentals />} />
          <Route path="/module/2" element={<Module2_Filtering />} />
          <Route path="/module/3" element={<Module3_Joins />} />
          <Route path="/module/4" element={<Module4_Aggregation />} />
          <Route path="/module/5" element={<Module5_Subqueries />} />
          <Route path="/module/6" element={<Module6_WindowFunctions />} />
          <Route path="/module/7" element={<Module7_AdvancedAnalytics />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/cheatsheet" element={<CheatSheet />} />
          <Route path="/glossary" element={<Glossary />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
