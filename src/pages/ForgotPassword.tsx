import { useState } from "react"
import type { FormEvent } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import supabase from "../utils/supabase"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const showEmailError = submitted && !emailValid

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setError(null)
    setInfo(null)
    if (!emailValid) return

    setSubmitting(true)
    const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/obnova-hesla`,
    })
    if (error) setError(error.message)
    else setInfo("Ak email existuje, poslali sme vám odkaz na obnovu hesla. Skontrolujte si schránku.")
    setSubmitting(false)
  }

  return (
    <div className="mt-24 px-6 pb-10 flex justify-center">
      <div className="w-full max-w-sm">
        <Link to="/prihlasenie" className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6">
          <ArrowLeft size={20} />
          Späť na prihlásenie
        </Link>

        <h2 className="text-2xl font-bold mb-2">Zabudnuté heslo</h2>
        <p className="text-gray-600 text-sm mb-6">Zadajte email, na ktorý ste sa registrovali. Pošleme vám odkaz na nastavenie nového hesla.</p>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 ${
                showEmailError
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:ring-gray-300"
              }`}
            />
            {showEmailError && <p className="text-red-600 text-xs mt-1">Zadajte platný email.</p>}
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
          {info && <p className="text-green-700 text-sm">{info}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="bg-black text-white rounded-xl px-4 py-2 font-semibold hover:bg-gray-800 transition disabled:opacity-50">
            {submitting ? "Odosielam..." : "Poslať odkaz"}
          </button>
        </form>
      </div>
    </div>
  )
}
