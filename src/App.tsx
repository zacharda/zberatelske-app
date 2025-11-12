import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import supabase from "./utils/supabase";
import CoinDetail from "./pages/CoinDetail.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";


type Coin = {
  id: number;
  name: string;
  year: number;
  imageFront: string;
  imageBack: string;
};

function CoinList() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoins = async () => {
      const { data, error } = await supabase.from("coins").select("*").order("issueDate", { ascending: false });;
      if (error) console.error("Error loading coins:", error);
      else setCoins(data);
      setLoading(false);
    };
    fetchCoins();
  }, []);

  return (
    <div className="flex-1 bg-white flex flex-col transition-all duration-300 ease-in-out mt-16 md:mt-16">
      <div className="flex-1 pt-6">
        <h2 className="text-2xl font-bold mb-4 pl-6">Slovenské zberateľské euromince</h2>

        <div className="px-6 pb-6">
          {loading ? (
            <p className="pl-6 text-gray-500">Načítavam mince...</p>
          ) : coins.length === 0 ? (
            <p className="pl-6 text-gray-500">Neboli nájdené žiadne mince.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {coins.map((coin) => (
                <Link
                  key={coin.id}
                  to={`/coin/${coin.id}`}
                  className="group bg-white p-4 flex flex-col justify-between aspect-square rounded-xl 
                    transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-gray-50"
                >
                  <div className="relative w-full aspect-square mb-2 [perspective:1000px]">
                    <div
                      className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] 
                      group-hover:[transform:rotateY(180deg)]"
                    >
                      {/* front */}
                      <div className="absolute inset-0 backface-hidden rounded-lg overflow-hidden">
                        <img
                          src={coin.imageFront}
                          alt={`${coin.name} front`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      {/* back */}
                      <div className="absolute inset-0 [transform:rotateY(180deg)] backface-hidden rounded-lg overflow-hidden">
                        <img
                          src={coin.imageBack}
                          alt={`${coin.name} back`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>
                  </div>

                  <h3 className="font-semibold text-lg transition-colors duration-300 group-hover:text-gray-800">
                    {coin.name}
                  </h3>
                  <p className="text-gray-600">{coin.year}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Sidebar />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<CoinList />} />
        <Route path="/coin/:id" element={<CoinDetail />} />
      </Routes>
    </div>
  );
}

export default App;




