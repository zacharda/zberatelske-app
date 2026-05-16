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
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false)
  const [resending, setResending] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()

  const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin
  const redirectUrl = `${siteUrl}/potvrdene`

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
      if (password !== confirmPassword) {
        setError("Heslá sa nezhodujú.")
        setSubmitting(false)
        return
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: redirectUrl },
      })
      if (error) setError(error.message)
      else if (!data.session) {
        setInfo("Registrácia úspešná. Skontrolujte si email a potvrďte svoju adresu.")
        setAwaitingConfirmation(true)
      } else navigate("/profil")
    }

    setSubmitting(false)
  }

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const passwordsMatch = password === confirmPassword
  const showEmailError = email.length > 0 && !emailValid
  const showMatchError = mode === "signup" && confirmPassword.length > 0 && !passwordsMatch
  const canSubmit =
    emailValid && password.length >= 6 && (mode === "login" || (confirmPassword.length >= 6 && passwordsMatch))

  const handleResend = async () => {
    setError(null)
    setResending(true)

    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: redirectUrl },
    })

    if (error) setError(error.message)
    else setInfo("Potvrdzovací email bol znova odoslaný.")

    setResending(false)
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
          <div>
            <input
              type="email"
              required
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

          <input
            type="password"
            required
            minLength={6}
            placeholder="Heslo"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
          />

          {mode === "signup" && (
            <div>
              <input
                type="password"
                required
                minLength={6}
                placeholder="Zopakujte heslo"
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
          )}

          {error && <p className="text-red-600 text-sm">{error}</p>}
          {info && <p className="text-green-700 text-sm">{info}</p>}

          <button
            type="submit"
            disabled={submitting || !canSubmit}
            className="bg-black text-white rounded-xl px-4 py-2 font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed">
            {submitting ? "Načítavam..." : mode === "login" ? "Prihlásiť sa" : "Zaregistrovať sa"}
          </button>

          {awaitingConfirmation && (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="text-gray-600 hover:text-gray-800 text-sm underline disabled:opacity-50">
              {resending ? "Odosielam..." : "Znova odoslať potvrdzovací email"}
            </button>
          )}
        </form>

        <button
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login")
            setError(null)
            setInfo(null)
            setConfirmPassword("")
            setAwaitingConfirmation(false)
          }}
          className="mt-6 text-gray-600 hover:text-gray-800 text-sm">
          {mode === "login" ? "Nemáte účet? Zaregistrujte sa" : "Už máte účet? Prihláste sa"}
        </button>
      </div>
    </div>
  )
}
