'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const FloatingButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <>
      <motion.div 
        className="fixed bottom-4 right-4 z-50 group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <button
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 p-2 rounded-full bg-white/10 backdrop-blur-[6px] border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Abrir reproductor de música"
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M2.25 6C2.25 5.58579 2.58579 5.25 3 5.25H21C21.4142 5.25 21.75 5.58579 21.75 6C21.75 6.41421 21.4142 6.75 21 6.75H3C2.58579 6.75 2.25 6.41421 2.25 6ZM2.25 10C2.25 9.58579 2.58579 9.25 3 9.25H21C21.4142 9.25 21.75 9.58579 21.75 10C21.75 10.4142 21.4142 10.75 21 10.75H3C2.58579 10.75 2.25 10.4142 2.25 10ZM19.2053 13.4431L19.2948 13.4948C20.0836 13.9501 20.7374 14.3276 21.2037 14.681C21.6788 15.041 22.105 15.4808 22.2158 16.1093C22.2614 16.3678 22.2614 16.6322 22.2158 16.8907C22.105 17.5192 21.6788 17.959 21.2037 18.319C20.7374 18.6724 20.0836 19.0499 19.2947 19.5053L19.2053 19.5569C18.4165 20.0124 17.7626 20.3899 17.2235 20.617C16.6741 20.8485 16.0802 20.9977 15.4805 20.7794C15.2338 20.6896 15.0048 20.5574 14.8037 20.3887C14.3148 19.9784 14.1471 19.3894 14.0728 18.798C14 18.2175 14 17.4625 14 16.5517V16.4483C14 15.5375 14 14.7825 14.0728 14.202C14.1471 13.6106 14.3148 13.0216 14.8037 12.6113C15.0048 12.4426 15.2338 12.3104 15.4805 12.2206C16.0802 12.0023 16.6741 12.1515 17.2235 12.383C17.7626 12.6101 18.4165 12.9876 19.2053 13.4431ZM16.6411 13.7653C16.1992 13.5791 16.051 13.6092 15.9935 13.6302C15.9113 13.6601 15.8349 13.7042 15.7679 13.7604C15.721 13.7998 15.6209 13.913 15.5611 14.3888C15.5014 14.8646 15.5 15.5243 15.5 16.5C15.5 17.4757 15.5014 18.1354 15.5611 18.6112C15.6209 19.087 15.721 19.2002 15.7679 19.2396C15.8349 19.2958 15.9113 19.3399 15.9935 19.3698C16.051 19.3908 16.1992 19.4209 16.6411 19.2347C17.083 19.0485 17.655 18.7199 18.5 18.2321C19.345 17.7442 19.9156 17.4131 20.2978 17.1235C20.68 16.8339 20.728 16.6905 20.7386 16.6302C20.7538 16.5441 20.7538 16.4559 20.7386 16.3698C20.728 16.3095 20.68 16.1661 20.2978 15.8765C19.9156 15.5869 19.345 15.2558 18.5 14.7679C17.655 14.2801 17.083 13.9515 16.6411 13.7653ZM2.25 14C2.25 13.5858 2.58579 13.25 3 13.25H11C11.4142 13.25 11.75 13.5858 11.75 14C11.75 14.4142 11.4142 14.75 11 14.75H3C2.58579 14.75 2.25 14.4142 2.25 14ZM2.25 18C2.25 17.5858 2.58579 17.25 3 17.25H11C11.4142 17.25 11.75 17.5858 11.75 18C11.75 18.4142 11.4142 18.75 11 18.75H3C2.58579 18.75 2.25 18.4142 2.25 18Z" fill="#ffffff"></path> </g></svg>
        </button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 z-50 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/70 backdrop-blur-[6px]" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Modal */}
            <div 
              className="fixed inset-0 flex items-center justify-center p-4 z-50"
              onClick={() => setIsOpen(false)}
            >
              <motion.div 
                className="relative w-full max-w-4xl max-h-[95vh] overflow-y-auto"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative w-full max-h-[90vh] overflow-y-auto bg-piedra/80 backdrop-blur-[6px] rounded-2xl shadow-2xl p-6 scrollbar-hide">
                  {/* Scrollbar styles */}
                  <style jsx global>{`
                    .scrollbar-hide::-webkit-scrollbar {
                      width: 0px;
                      background: transparent;
                    }
                    .scrollbar-hide {
                      -ms-overflow-style: none;
                      scrollbar-width: none;
                    }
                  `}</style>
                  {/* Glass overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl w-full h-full -z-10" />
                  
                          
                {/* Close button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/10 backdrop-blur-[6px] rounded-full text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                  aria-label="Cerrar"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
                
                <div className="p-6 h-full">
                  <h2 className="text-3xl font-bold text-white mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                    Nuestras Playlists
                  </h2>
                  
                  <div id="playlists" className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Playlist 1 */}
                    <a 
                      href="https://www.youtube.com/playlist?list=PLK-g3qjdIUJnrtIyopZUFlRjjgLKOxFft" 
                      className="group relative bg-white/10 backdrop-blur-[6px] rounded-2xl p-4 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/20 hover:border-white/30"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="w-16 h-16 p-1 bg-white/20 backdrop-blur-[6px] rounded-xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:bg-white/30 group-hover:scale-110">
                      <svg viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg" fill="none"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="12" d="M96 170c40.869 0 74-33.131 74-74 0-40.87-33.131-74-74-74-40.87 0-74 33.13-74 74 0 40.869 33.13 74 74 74Z"></path><path stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="12" d="M74 130V62l60 34-60 34Z"></path></g></svg>
                      </div>
                      <h3 className="font-semibold text-white mb-1">Youtube Music</h3>
                    </a>

                    {/* Playlist 2 */}
                    <a 
                      href="https://open.spotify.com/playlist/4HMJ34CMCECQx0RyNojIil?si=BIxOsMZvSZq_Dnvw93kPdQ&nd=1&dlsi=bf579502402243df" 
                      className="group relative bg-white/10 backdrop-blur-[6px] rounded-2xl p-4 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/20 hover:border-white/30"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="w-16 h-16 p-2 bg-white/20 backdrop-blur-[6px] rounded-xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:bg-white/30 group-hover:scale-110">
                      <svg fill="#ffffff" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 186.845 186.845"  stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M128.875,120.962c-31.094-14.37-74.616-8.014-76.453-7.737c-4.096,0.619-6.915,4.44-6.296,8.536 c0.619,4.096,4.443,6.912,8.536,6.296c0.406-0.062,40.867-5.982,67.92,6.521c1.018,0.471,2.089,0.694,3.142,0.694 c2.834-0.001,5.546-1.614,6.813-4.355C134.274,127.157,132.635,122.7,128.875,120.962z"></path> <path d="M137.614,93.953c-35.313-16.319-84.833-9.087-86.924-8.772c-4.094,0.619-6.911,4.438-6.294,8.532 c0.616,4.095,4.438,6.916,8.531,6.301c0.468-0.071,47.206-6.857,78.394,7.556c1.02,0.471,2.089,0.694,3.142,0.694 c2.834-0.001,5.546-1.614,6.814-4.356C143.014,100.148,141.374,95.691,137.614,93.953z"></path> <path d="M143.49,65.736c-39.006-18.027-93.79-10.028-96.103-9.679c-4.094,0.619-6.911,4.438-6.294,8.532s4.44,6.919,8.531,6.3 c0.523-0.079,52.691-7.657,87.573,8.463c1.018,0.471,2.089,0.694,3.142,0.694c2.834,0,5.546-1.614,6.813-4.355 C148.89,71.93,147.25,67.474,143.49,65.736z"></path> <path d="M93.423,0.001C41.909,0.001,0,41.909,0,93.42c0,51.514,41.909,93.424,93.423,93.424c51.513,0,93.422-41.91,93.422-93.424 C186.845,41.909,144.936,0.001,93.423,0.001z M93.423,171.844C50.18,171.844,15,136.664,15,93.42 c0-43.241,35.18-78.42,78.423-78.42c43.242,0,78.422,35.179,78.422,78.42C171.845,136.664,136.665,171.844,93.423,171.844z"></path> </g> </g></svg>
                      </div>
                      <h3 className="font-semibold text-white mb-1">Spotify</h3>
                    </a>

                    {/* Playlist 3 */}
                    <a 
                      href="https://music.youtube.com/playlist?list=PLK-g3qjdIUJnrtIyopZUFlRjjgLKOxFft&si=PJPW-PZrAMA714bt" 
                      className="group relative bg-white/10 backdrop-blur-[6px] rounded-2xl p-4 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/20 hover:border-white/30"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="w-16 h-16 p-2 bg-white/20 backdrop-blur-[6px] rounded-xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:bg-white/30 group-hover:scale-110">
                      <svg fill="#ffffff" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 209.673 209.673"  stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M173.075,29.203H36.599C16.418,29.203,0,45.626,0,65.812v78.05c0,20.186,16.418,36.608,36.599,36.608h136.477 c20.18,0,36.598-16.422,36.598-36.608v-78.05C209.673,45.626,193.255,29.203,173.075,29.203z M194.673,143.861 c0,11.915-9.689,21.608-21.598,21.608H36.599c-11.91,0-21.599-9.693-21.599-21.608v-78.05c0-11.915,9.689-21.608,21.599-21.608 h136.477c11.909,0,21.598,9.693,21.598,21.608V143.861z"></path> <path d="M145.095,98.57L89.499,61.92c-2.303-1.519-5.254-1.649-7.684-0.342c-2.429,1.308-3.944,3.845-3.944,6.604v73.309 c0,2.759,1.515,5.295,3.944,6.604c1.113,0.6,2.336,0.896,3.555,0.896c1.442,0,2.881-0.415,4.129-1.239l55.596-36.659 c2.105-1.388,3.372-3.74,3.372-6.262C148.467,102.31,147.2,99.958,145.095,98.57z M92.871,127.562V82.109l34.471,22.723 L92.871,127.562z"></path> </g> </g></svg>
                      </div>
                      <h3 className="font-semibold text-white mb-1">Youtube</h3>
                    </a>
                  </div>
                </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
