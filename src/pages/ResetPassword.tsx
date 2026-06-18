import { useState } from "react"
import type { FormEvent } from "react"
import { Link } from "react-router-dom"
import { CheckCircle } from "lucide-react"
import supabase from "../utils/supabase"
import { useAuth } from "../context/AuthContext"

export default function ResetPassword() {
  const { user, loading } = useAuth()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const passwordLongEnough = password.length >= 6
  const passwordsMatch = password === confirmPassword
  const showLengthError = submitted && !passwordLongEnough
  const showMatchError = submitted && !passwordsMatch

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setError(null)
    if (!passwordLongEnough || !passwordsMatch) return

    setSubmitting(true)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) setError(error.message)
    else setDone(true)
    setSubmitting(false)
  }

  if (loading) {
    return <p className="mt-24 text-center text-gray-500">Načítavam...</p>
  }

  if (!user) {
    return (
      <div className="mt-24 px-6 pb-10 text-center">
        <h2 className="text-2xl font-bold mb-4">Neplatný odkaz</h2>
        <p className="text-gray-700 mb-6">Odkaz na obnovu hesla je neplatný alebo expirovaný. Požiadajte o nový.</p>
        <Link
          to="/zabudnute-heslo"
          className="bg-black text-white rounded-xl px-5 py-2.5 font-semibold hover:bg-gray-800 transition">
          Požiadať o nový odkaz
        </Link>
      </div>
    )
  }

  if (done) {
    return (
      <div className="mt-24 px-6 pb-10 text-center">
        <CheckCircle size={56} className="mx-auto text-green-600 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Heslo bolo zmenené</h2>
        <p className="text-gray-700 mb-6">Môžete pokračovať na svoj profil.</p>
        <Link
          to="/profil"
          className="bg-black text-white rounded-xl px-5 py-2.5 font-semibold hover:bg-gray-800 transition">
          Prejsť na profil
        </Link>
      </div>
    )
  }

  return (
    <div className="mt-24 px-6 pb-10 flex justify-center">
      <div className="w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6">Nové heslo</h2>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div>
            <input
              type="password"
              placeholder="Nové heslo"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 ${
                showLengthError
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:ring-gray-300"
              }`}
            />
            {showLengthError && <p className="text-red-600 text-xs mt-1">Heslo musí mať aspoň 6 znakov.</p>}
          </div>

          <div>
            <input
              type="password"
              placeholder="Zopakujte nové heslo"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 ${
                showMatchError
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:ring-gray-300"
              }`}
            />
            {showMatchError && <p className="text-red-600 text-xs mt-1">Heslá sa nezhodujú.</p>}
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="bg-black text-white rounded-xl px-4 py-2 font-semibold hover:bg-gray-800 transition disabled:opacity-50">
            {submitting ? "Ukladám..." : "Nastaviť nové heslo"}
          </button>
        </form>
      </div>
    </div>
  )
}
