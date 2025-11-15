import { Routes, Route } from "react-router-dom"
import Sidebar from "./components/Sidebar"
import CoinList from "./components/CoinList"
import CoinDetail from "./pages/CoinDetail"
import { useState } from "react"

export type FaceValue = number | "all"

function App() {
  const [selectedFaceValue, setSelectedFaceValue] = useState<FaceValue>("all")

  return (
    <div className="flex flex-col min-h-screen relative">
      <Sidebar selectedFaceValue={selectedFaceValue} onSelect={setSelectedFaceValue} />

      <Routes>
        <Route path="/coins/:filter" element={<CoinList selectedFaceValue={selectedFaceValue} onSelect={setSelectedFaceValue} />} />

        <Route path="/coins/:filter/coin/:id" element={<CoinDetail />} />

        <Route path="/" element={<CoinList selectedFaceValue={selectedFaceValue} onSelect={setSelectedFaceValue} />} />
      </Routes>
    </div>
  )
}

export default App
