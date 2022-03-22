import { Routes, Route } from 'react-router-dom'

import Main from './pages/Main'
import Pad from './pages/Pad'

function Routers() {
  return (
    <Routes>
      <Route path='/' element={<Main />} />
      <Route path='/*' element={<Pad />} />
    </Routes>
  )
}

export default Routers
