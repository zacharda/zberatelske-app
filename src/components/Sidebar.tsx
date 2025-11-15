import { useState } from "react"
import { Menu } from "lucide-react"
import { useNavigate } from "react-router-dom"
import type { FaceValue } from "../App"

type SidebarProps = {
  selectedFaceValue: FaceValue
  onSelect: (value: FaceValue) => void
}

export default function Sidebar({ selectedFaceValue, onSelect }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const handleSelect = (value: FaceValue) => {
    onSelect(value)

    const url = value === "all" ? "/coins/all" : `/coins/${value}-euro`

    navigate(url)
    setIsOpen(false)
  }

  const linkClasses = (value: FaceValue) =>
    `px-4 py-2 rounded-xl transition text-black ${selectedFaceValue === value ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"}`

  return (
    <>
      {/* desktop navbar on top */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 flex items-center justify-start p-4 gap-3">
        <button onClick={() => setIsOpen(!isOpen)} className="z-50 md:hidden">
          <Menu size={24} />
        </button>

        <h1
          style={{ fontFamily: '"Leckerli One", cursive', fontWeight: 400 }}
          className="text-3xl mb-1 cursor-pointer"
          onClick={() => navigate("/")}>
          zberatelske
        </h1>

        <div className="hidden md:flex gap-6 text-lg ml-8">
          <button className={linkClasses("all")} onClick={() => handleSelect("all")}>
            Všetky
          </button>
          <button className={linkClasses(5)} onClick={() => handleSelect(5)}>
            5 euro
          </button>
          <button className={linkClasses(10)} onClick={() => handleSelect(10)}>
            10 euro
          </button>
          <button className={linkClasses(20)} onClick={() => handleSelect(20)}>
            20 euro
          </button>
        </div>
      </div>

      {/* slide in mobile sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 
    p-4 pt-20 z-40 transform transition-transform duration-300 md:hidden
    ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <nav className="flex flex-col text-lg mt-4 gap-3">
          <button
            className={`${linkClasses("all")} text-left px-3 py-2 rounded hover:bg-gray-100 transition`}
            onClick={() => handleSelect("all")}>
            Všetky
          </button>
          <button className={`${linkClasses(5)} text-left px-3 py-2 rounded hover:bg-gray-100 transition`} onClick={() => handleSelect(5)}>
            5 eurové mince
          </button>
          <button
            className={`${linkClasses(10)} text-left px-3 py-2 rounded hover:bg-gray-100 transition`}
            onClick={() => handleSelect(10)}>
            10 eurové mince
          </button>
          <button
            className={`${linkClasses(20)} text-left px-3 py-2 rounded hover:bg-gray-100 transition`}
            onClick={() => handleSelect(20)}>
            20 eurové mince
          </button>
        </nav>
      </aside>

      {/* overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}
