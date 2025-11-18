import { useParams, Link } from "react-router-dom"
import { useEffect, useState } from "react"
import supabase from "../utils/supabase"
import type { FaceValue } from "../App"

type Coin = {
  id: number
  name: string
  year: number
  faceValue: number
  imageFront: string
  imageBack: string
}

type Props = {
  selectedFaceValue: FaceValue
  onSelect: (v: FaceValue) => void
}

export default function CoinList({ selectedFaceValue, onSelect }: Props) {
  const { filter } = useParams()
  const [coins, setCoins] = useState<Coin[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!filter) {
      onSelect("all")
      return
    }
    if (filter === "all") onSelect("all")
    else if (filter.includes("5")) onSelect(5)
    else if (filter.includes("10")) onSelect(10)
    else if (filter.includes("20")) onSelect(20)
  }, [filter])

  useEffect(() => {
    const fetchData = async () => {
      let query = supabase.from("coins").select("*").order("issueDate", { ascending: false })

      if (filter && filter !== "all") {
        if (filter.includes("5")) query = query.eq("faceValue", 5)
        else if (filter.includes("10")) query = query.eq("faceValue", 10)
        else if (filter.includes("20")) query = query.eq("faceValue", 20)
      }

      const { data, error } = await query
      if (!error) setCoins(data || [])
      setLoading(false)
    }

    fetchData()
  }, [filter])

  const currentFilter = filter || "all"

  return (
    <div className="flex-1 bg-white flex flex-col mt-20">
      <h2 className="text-2xl font-bold mb-4 pl-6">Zberateľské euromince</h2>

      <div className="px-6 pb-6">
        {loading ? (
          <p>Načítavam...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {coins.map((coin) => (
              <Link
                key={coin.id}
                to={`/coins/${currentFilter}/coin/${coin.id}`}
                className="group bg-white p-4 rounded-xl transition hover:shadow-lg hover:-translate-y-1">
                {/* flip effect */}
                <div className="relative w-full aspect-square [perspective:1000px] mb-2">
                  <div className="relative w-full h-full transition-transform duration-700 group-hover:[transform:rotateY(180deg)] [transform-style:preserve-3d]">
                    <img src={coin.imageFront} className="absolute inset-0 w-full h-full object-cover backface-hidden" />
                    <img
                      src={coin.imageBack}
                      className="absolute inset-0 w-full h-full object-cover [transform:rotateY(180deg)] backface-hidden"
                    />
                  </div>
                </div>

                <h3 className="font-semibold">{coin.name}</h3>
                <p className="text-gray-600">{coin.year}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
