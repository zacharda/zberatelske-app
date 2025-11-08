import { useEffect, useState } from "react";
import { Menu } from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* topbar */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 flex items-center justify-start p-4 gap-3">
        {/* menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          className="z-50"
        >
          {isOpen ? <Menu size={24} /> : <Menu size={24} />}
        </button>

        {/* logo */}
        <h1
          style={{ fontFamily: '"Leckerli One", cursive', fontWeight: 400 }}
          className="text-3xl mb-1"
        >
          zberatelske.
        </h1>
      </div>

      {/* sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-400 
          p-6 pt-20 z-40 transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="mb-8">
          <h1
            style={{ fontFamily: '"Leckerli One", cursive', fontWeight: 400 }}
            className="text-3xl mb-1"
          >
            zberatelske.
          </h1>
          <p>rgrg</p>
        </div>
      </aside>

      {/* mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* desktop layout */}
      <style>{`
        @media (min-width: 768px) {
          body {
            transition: margin-left 0.3s ease-in-out;
            margin-left: ${isOpen ? "16rem" : "0"};
          }
        }
      `}</style>
    </>
  );
}




