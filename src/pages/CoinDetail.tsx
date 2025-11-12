import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import supabase from "../utils/supabase";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";

type Coin = {
  id: number;
  name: string;
  year: number;
  imageFront: string;
  imageBack: string;
  description: string;
  isuueDate: string;
};

export default function CoinDetail() {
  const { id } = useParams();
  const [coin, setCoin] = useState<Coin | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const fetchCoin = async () => {
      const { data, error } = await supabase
        .from("coins")
        .select("*")
        .eq("id", id)
        .single();

      if (error) console.error("Error loading coin:", error);
      else setCoin(data);

      setLoading(false);
    };
    fetchCoin();
  }, [id]);

  if (loading) {
    return <p className="mt-24 text-center text-gray-500">Loading...</p>;
  }

  if (!coin) {
    return <p className="mt-24 text-center text-gray-500">Coin not found.</p>;
  }

  const images = [coin.imageFront, coin.imageBack];

  return (
    <div className="mt-20 md:mt-20 px-6 pb-10">
      <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4">
        <ArrowLeft size={20} />
        Späť
      </Link>

      <h2 className="text-3xl font-bold mb-6">{coin.name}</h2>

      {/* FLEX LAYOUT FOR DESKTOP */}
      <div className="flex flex-col md:flex-row md:items-start md:gap-10">
        {/* Image Carousel */}
        <div className="relative w-full max-w-md md:w-1/2 aspect-square mb-6 md:mb-0">
          <img
            src={images[currentImage]}
            alt={`Coin image ${currentImage + 1}`}
            className="w-full h-full object-cover rounded-xl shadow-md transition-all duration-500"
          />

          <button
            onClick={() =>
              setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))
            }
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setCurrentImage((prev) => (prev + 1) % images.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Description and Date */}
        <div className="md:flex-1 md:pr-8">
          <p className="text-gray-700 mb-4 whitespace-pre-line leading-relaxed">
            {coin.description}
          </p>
          <p className="text-gray-700 text-lg">
            <strong>Dátum vydania:</strong> {coin.isuueDate}
          </p>
        </div>
      </div>
    </div>
  );
}

