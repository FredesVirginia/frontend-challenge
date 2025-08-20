import { Routes, Route } from 'react-router-dom'


import ProductList from './pages/ProductList'
import ProductDetail from './pages/ProductDetail'
import './App.css'
import { Header } from './components/Header'
import Cart from './pages/Cart'

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </main>
    </div>
  )
}

export default App