import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import supabase from './utils/supabase'

type Coin = {
  id: number;
  name: string;
  year: number;
  imageFront: string; // optional if you add an image column later
};

function App() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoins = async () => {
      const { data, error } = await supabase.from("coins").select("*");

      if (error) {
        console.error("Error loading coins:", error);
      } else {
        setCoins(data);
      }

      setLoading(false);
    };

    fetchCoins();
  }, []);

  return (
    <div className="flex min-h-screen relative">
      <Sidebar />
      <main className="flex-1 pt-6 bg-white">
        <h1 className="text-2xl font-bold mb-4 pl-6">Coin Collection</h1>

        <div className="px-6 pb-6">
          {loading ? (
            <p className="pl-6 text-gray-500">Loading coins...</p>
          ) : coins.length === 0 ? (
            <p className="pl-6 text-gray-500">No coins found.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-px bg-gray-200">
              {coins.map((coin) => (
                <div
                  key={coin.id}
                  className="bg-white p-4 flex flex-col justify-between aspect-square"
                >
                  <div className="bg-gray-100 flex items-center justify-center mb-2 aspect-square overflow-hidden">
                    <img
                      src={coin.imageFront}
                      alt={coin.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <h2 className="font-semibold text-lg">{coin.name}</h2>
                  <p className="text-gray-600">{coin.year}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;




