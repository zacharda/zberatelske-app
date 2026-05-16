import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { useNavigate, Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import supabase from "../utils/supabase"
import { useAuth } from "../context/AuthContext"

export default function Auth() {
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (user) navigate("/profil")
  }, [user, navigate])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setInfo(null)
    setSubmitting(true)

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else navigate("/profil")
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else if (!data.session) setInfo("Registrácia úspešná. Skontrolujte si email a potvrďte svoju adresu.")
      else navigate("/profil")
    }

    setSubmitting(false)
  }

  return (
    <div className="mt-24 px-6 pb-10 flex justify-center">
      <div className="w-full max-w-sm">
        <Link
          to="#"
          onClick={(e) => {
            e.preventDefault()
            window.history.back()
          }}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6">
          <ArrowLeft size={20} />
          Späť
        </Link>

        <h2 className="text-2xl font-bold mb-6">{mode === "login" ? "Prihlásenie" : "Registrácia"}</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Heslo"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}
          {info && <p className="text-green-700 text-sm">{info}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="bg-black text-white rounded-xl px-4 py-2 font-semibold hover:bg-gray-800 transition disabled:opacity-50">
            {submitting ? "Načítavam..." : mode === "login" ? "Prihlásiť sa" : "Zaregistrovať sa"}
          </button>
        </form>

        <button
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login")
            setError(null)
            setInfo(null)
          }}
          className="mt-6 text-gray-600 hover:text-gray-800 text-sm">
          {mode === "login" ? "Nemáte účet? Zaregistrujte sa" : "Už máte účet? Prihláste sa"}
        </button>
      </div>
    </div>
  )
}
