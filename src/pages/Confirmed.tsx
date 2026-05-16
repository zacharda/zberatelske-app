import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { CheckCircle, XCircle } from "lucide-react"
import { useAuth } from "../context/AuthContext"

type Status = "pending" | "success" | "error"

export default function Confirmed() {
  const { user, loading } = useAuth()
  const [status, setStatus] = useState<Status>("pending")
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1))
    const errorDescription = hash.get("error_description")
    if (errorDescription) {
      setStatus("error")
      setMessage(decodeURIComponent(errorDescription))
    }
  }, [])

  useEffect(() => {
    if (status === "error") return
    if (user) {
      setStatus("success")
      return
    }
    if (loading) return

    const timeout = setTimeout(() => {
      setStatus((prev) => (prev === "pending" ? "error" : prev))
      setMessage((prev) => prev ?? "Potvrdenie sa nepodarilo overiť. Skúste sa prihlásiť alebo požiadajte o nový email.")
    }, 6000)

    return () => clearTimeout(timeout)
  }, [user, loading, status])

  return (
    <div className="mt-24 px-6 pb-10 flex justify-center">
      <div className="w-full max-w-md text-center">
        {status === "pending" && <p className="text-gray-500">Overujem potvrdenie...</p>}

        {status === "success" && (
          <>
            <CheckCircle size={56} className="mx-auto text-green-600 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Email potvrdený</h2>
            <p className="text-gray-700 mb-6">Vaša adresa bola úspešne overená. Ste prihlásený.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/profil"
                className="bg-black text-white rounded-xl px-5 py-2.5 font-semibold hover:bg-gray-800 transition">
                Prejsť na profil
              </Link>
              <Link
                to="/"
                className="border border-gray-300 rounded-xl px-5 py-2.5 font-semibold text-gray-700 hover:bg-gray-100 transition">
                Prehľad mincí
              </Link>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle size={56} className="mx-auto text-red-600 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Potvrdenie zlyhalo</h2>
            <p className="text-gray-700 mb-6">{message}</p>
            <Link
              to="/prihlasenie"
              className="bg-black text-white rounded-xl px-5 py-2.5 font-semibold hover:bg-gray-800 transition">
              Späť na prihlásenie
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
