import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import supabase from "../utils/supabase"
import { useAuth } from "../context/AuthContext"

type Coin = {
  id: number
  name: string
  year: number
  imageFront: string
  imageBack: string
}

export default function Profile() {
  const { user, loading: authLoading, signOut } = useAuth()
  const navigate = useNavigate()
  const [total, setTotal] = useState(0)
  const [collected, setCollected] = useState<Coin[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) navigate("/prihlasenie")
  }, [user, authLoading, navigate])

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      const { count } = await supabase.from("coins").select("*", { count: "exact", head: true })
      setTotal(count ?? 0)

      const { data: rows } = await supabase.from("collections").select("coin_id").eq("user_id", user.id)
      const ids = (rows ?? []).map((r) => r.coin_id)

      if (ids.length > 0) {
        const { data: coins } = await supabase
          .from("coins")
          .select("id, name, year, imageFront, imageBack")
          .in("id", ids)
          .order("issueDate", { ascending: false })
        setCollected(coins ?? [])
      } else {
        setCollected([])
      }

      setLoading(false)
    }

    fetchData()
  }, [user])

  const handleSignOut = async () => {
    await signOut()
    navigate("/")
  }

  if (authLoading || !user) {
    return <p className="mt-24 text-center text-gray-500">Načítavam...</p>
  }

  const percent = total > 0 ? Math.round((collected.length / total) * 100) : 0

  return (
    <div className="mt-20 px-6 pb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Môj profil</h2>
        <button
          onClick={handleSignOut}
          className="text-gray-600 hover:text-gray-800 border border-gray-300 rounded-xl px-4 py-2 transition hover:bg-gray-100">
          Odhlásiť sa
        </button>
      </div>

      <p className="text-gray-700 mb-2">{user.email}</p>

      <div className="bg-gray-100 rounded-xl p-6 mb-8">
        <p className="text-lg text-gray-700">
          Vyzbierané mince:{" "}
          <strong>
            {collected.length} z {total}
          </strong>{" "}
          ({percent} %)
        </p>
        <div className="w-full bg-gray-300 rounded-full h-3 mt-3">
          <div className="bg-black h-3 rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <h3 className="text-2xl font-bold mb-4">Moja zbierka</h3>

      {loading ? (
        <p className="text-gray-500">Načítavam...</p>
      ) : collected.length === 0 ? (
        <p className="text-gray-500">Zatiaľ nemáte žiadne mince v zbierke.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {collected.map((coin) => (
            <Link
              key={coin.id}
              to={`/coins/all/coin/${coin.id}`}
              className="group bg-white p-4 rounded-xl transition hover:shadow-lg hover:-translate-y-1">
              <div className="relative w-full aspect-square mb-2">
                <img src={coin.imageFront} className="w-full h-full object-cover rounded-lg" />
              </div>
              <h3 className="font-semibold">{coin.name}</h3>
              <p className="text-gray-600">{coin.year}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
