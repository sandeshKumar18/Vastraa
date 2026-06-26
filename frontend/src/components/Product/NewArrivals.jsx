import { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";

const NewArrivals = () => {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

 const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    // Fetch new arrivals from the backend
    const fetchNewArrivals = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`);
        setNewArrivals(response.data);
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
      }
    };

    fetchNewArrivals();
  }, []);

  const scroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = direction === "left" ? -300 : 300;
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const updateScrollButtons = () => {
    const container = scrollRef.current;
    if (container) {
      const left = container.scrollLeft;
      setCanScrollLeft(left > 0);
      setCanScrollRight(left < container.scrollWidth - container.clientWidth);
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
      updateScrollButtons();
      return () => container.removeEventListener("scroll", updateScrollButtons);
    }
  }, [newArrivals]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const stopDragging = () => setIsDragging(false);

  return (
    <section className="py-16 px-4 lg:px-0">
      <div className="container mx-auto text-center mb-10 relative">
        <h2 className="text-3xl font-bold mb-4">Explore New Arrivals</h2>
        <p className="text-lg text-gray-600 mb-8">
          Discover the latest styles straight off the runway, freshly added to
          keep your wardrobe on the cutting edge of fashion.
        </p>

        {/* Scroll Buttons */}
        <div className="absolute right-0 bottom-[-30px] flex space-x-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`p-2 rounded border bg-white text-black ${!canScrollLeft ? "opacity-30 cursor-not-allowed" : ""}`}
          >
            <FiChevronLeft className="text-2xl" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`p-2 rounded border bg-white text-black ${!canScrollRight ? "opacity-30 cursor-not-allowed" : ""}`}
          >
            <FiChevronRight className="text-2xl" />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={stopDragging}
        onMouseUp={stopDragging}
        className={`container mx-auto overflow-x-auto flex space-x-6 no-scrollbar ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      >
        {newArrivals.map((product) => (
          <div key={product._id} className="group min-w-[100%] sm:min-w-[50%] lg:min-w-[30%] relative overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="w-full h-[500px] overflow-hidden rounded-lg">
              <img
                src={product.images[0].url}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                draggable="false"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 text-white rounded-b-lg transition-all duration-300">
              <Link to={`/product/${product._id}`} className="block">
                <h4 className="font-medium text-lg tracking-wide group-hover:text-gray-200 transition-colors duration-300">{product.name}</h4>
                <p className="text-gray-200 group-hover:text-white transition-colors duration-300 mt-1">${product.price}</p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewArrivals;