import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import Pagination from "../../components/UserModule/HomeComponents/Pagination";
import FilterDialog from "../../components//UserModule/FilterDialog";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist, fetchYachts } from "../../Redux/yachtReducer/action";
import YachtCard from "../../components/UserModule/YachtCard";
import { useNavigate, useSearchParams } from "react-router-dom";
import CompareProductsModal from "../../components/UserModule/CompareProduct";
import CompareSnackbar from "../../hooks/Snackbar";

const YachtRentals = ({ loading }) => {
  const [activeCard, setActiveCard] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(9);
  const dispatch = useDispatch();
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const [searchParams, setSearchParams] = useSearchParams();
  const [isCompareActive, setIsCompareActive] = useState(false);

  const handleToggle = () => {
    setIsCompareActive((prev) => !prev);
  };

  const location = searchParams.get("location") || "";
  const minPrice = searchParams.get("minPrice") || 0;
  const maxPrice = searchParams.get("maxPrice") || 100000;
  const capacity = searchParams.get("capacity") || "";
  const filteredYachts = useSelector((store) => store.yachtReducer.yachts);
  const [selectedYachts, setSelectedYachts] = useState([]);
  const [open, setOpen] = useState(false);
  const wishlist = useSelector((state) => state.yachtReducer.wishlist);

  const user = JSON.parse(sessionStorage.getItem("user"));
  
  const navigate = useNavigate();

  const indexOfLastYacht = currentPage * resultsPerPage;
  const indexOfFirstYacht = indexOfLastYacht - resultsPerPage;
  const currentYachts =
    filteredYachts.length > 0
      ? filteredYachts.slice(indexOfFirstYacht, indexOfLastYacht)
      : filteredYachts.slice(indexOfFirstYacht, indexOfLastYacht);

  const totalPages = Math.ceil(
    (filteredYachts.length > 0
      ? filteredYachts.length
      : filteredYachts.length) / resultsPerPage
  );

  // Animate when in view
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  useEffect(() => {
    const paramsObj = {
      min_price: searchParams.get("min_price"),
      max_price: searchParams.get("max_price"),
      location: searchParams.get("location"),
      capacity: searchParams.get("capacity"),
      date: searchParams.get("date"),
    };
    dispatch(fetchYachts(paramsObj));
  }, [searchParams, dispatch]);

  useEffect(() => {
    if(user){
      dispatch(fetchWishlist(user.id));
    }
  }, [dispatch, user]);
  
  const handleRemoveCompare = (id) => {
    setSelectedYachts((prevYachts) => prevYachts.filter((yacht) => yacht._id !== id));
  };

  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 pt-24 pb-16 relative overflow-hidden" ref={ref}>
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute w-[500px] h-[500px] -top-32 -left-64 rounded-full bg-gradient-to-r from-blue-400/10 to-purple-500/10"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2 }}
        />
        <motion.div 
          className="absolute w-[400px] h-[400px] -bottom-32 -right-32 rounded-full bg-gradient-to-r from-blue-400/10 to-purple-500/10"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        />
      </div>
      
      {/* Page header */}
      <div className="max-w-[90%] mx-auto mb-12 relative z-10">
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-900 to-purple-700 bg-clip-text text-transparent inline-block mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
          }}
        >
          Find Your Dream Yacht
        </motion.h1>
        
        <motion.div 
          className="h-[3px] w-20 bg-gradient-to-r from-blue-800 to-blue-500 rounded-md mt-2"
          initial={{ width: "0px" }}
          animate={{ width: "80px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
        
        <motion.p
          className="text-lg text-slate-600 max-w-2xl mt-4 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } }
          }}
        >
          Filter through our exclusive collection of luxury yachts and set sail on the journey of a lifetime
        </motion.p>
      </div>
      
      {/* Compare toggle */}
      <div className="max-w-[90%] mx-auto mb-6 flex justify-end items-center relative z-10">
        <div 
          className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          onClick={handleToggle}
        >
          <span className="text-sm font-medium text-gray-600">Compare Yachts</span>
          <div 
            className={`relative w-9 h-[18px] rounded-full transition-colors duration-300 flex items-center px-[2px] ${isCompareActive ? 'bg-blue-600' : 'bg-gray-200'}`}
          >
            <div 
              className={`w-3.5 h-3.5 bg-white rounded-full transition-transform duration-300 flex items-center justify-center ${isCompareActive ? 'translate-x-[18px]' : 'translate-x-0'}`}
            >
              <div className={`absolute text-[10px] font-bold text-white transition-opacity duration-300 ${isCompareActive ? 'opacity-100' : 'opacity-0'}`}>✓</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Compare snackbar */}
      {selectedYachts.length > 0 && (
        <CompareSnackbar selectedItems={selectedYachts} onCompare={setOpen}/>
      )}
      
      {/* Compare modal */}
      <CompareProductsModal
        open={open}
        onClose={() => setOpen(false)}
        products={selectedYachts}
        onRemove={handleRemoveCompare}
      />
      
      {/* Main content */}
      <div className="max-w-[90%] mx-auto px-4 flex flex-col md:flex-row md:gap-8 relative z-10">
        {/* Filters section */}
        <div className="w-full md:w-1/4 mb-8 md:mb-0 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200">
            <h3 className="text-xl font-semibold text-blue-900 flex items-center gap-2 m-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6H21M6 12H18M10 18H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Filter Options
            </h3>
          </div>
          <div className="p-1">
            <FilterDialog
              yachts={filteredYachts}
              searchParams={searchParams}
              setSearchParams={setSearchParams}
            />
          </div>
        </div>
        
        {/* Yacht grid section */}
        <div className="w-full md:flex-1">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {!currentYachts ? (
              <div className="col-span-full flex justify-center items-center min-h-[300px]">
                <div className="w-10 h-10 border-3 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            ) : currentYachts?.length === 0 ? (
              <motion.div
                className="col-span-full flex flex-col items-center justify-center py-12 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-500 mb-4">
                  <path d="M3 22L12 2L21 22M5.5 16H18.5M7.5 11H16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h3 className="text-2xl font-semibold text-blue-900 mb-3">No Yachts Found</h3>
                <p className="text-slate-600 max-w-md mb-6">Try adjusting your filters or search criteria to find available yachts.</p>
              </motion.div>
            ) : (
              currentYachts.map((yacht, index) => (
                <motion.div 
                  key={yacht._id}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                  variants={cardVariants}
                  initial="hidden"
                  animate={controls}
                  custom={index}
                >
                  <YachtCard
                    yacht={yacht}
                    setIsCompareActive={setIsCompareActive}
                    isCompareActive={isCompareActive}
                    selectedYachts={selectedYachts}
                    setSelectedYachts={setSelectedYachts}
                    wishlist={wishlist}
                  />
                </motion.div>
              ))
            )}
          </motion.div>
          
          {/* Pagination */}
          {currentYachts?.length > 0 && (
            <div className="mt-12 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                paginate={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default YachtRentals;