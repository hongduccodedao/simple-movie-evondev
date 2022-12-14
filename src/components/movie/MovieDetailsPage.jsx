import React from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import useSWR from "swr";
import { apiKey, fetcher, tmdbAPI } from "apiConfig/config";
import MovieCard from "components/movie/MovieCard";

// https://api.themoviedb.org/3/movie/{movie_id}?api_key=6557cc874dda0f42183d0f81b2746b3b

const MovieDetailsPage = () => {
   const { movieId } = useParams();

   const { data, error } = useSWR(
      tmdbAPI.getMovieDetails(movieId),
      fetcher
   );

   if (!data) {
      return null;
   }
   const { backdrop_path, poster_path, title, genres, overview } = data || {};

   return (
      <>
         <div className="w-full h-[600px] relative">
            <div className="overlay w-full h-full bg-black bg-opacity-70 absolute inset-0"></div>
            <div
               className="w-full h-full bg-cover bg-no-repeat bg-center"
               style={{
                  backgroundImage: `url(${tmdbAPI.imageOriginal(backdrop_path)})`,
               }}></div>
         </div>
         <div className="w-full h-[400px] max-w-[800px] mx-auto -mt-[200px] relative z-10 pb-10">
            <img
               src={tmdbAPI.imageOriginal(poster_path)}
               alt=""
               className="w-full h-full object-cover bg-center rounded-xl"
            />
         </div>
         <h1 className="text-white text-center text-3xl font-bold mb-10">
            {title}
         </h1>
         {genres.length > 0 && (
            <div className="flex items-center gap-x-5 mb-10 justify-center">
               {genres.map((genre) => (
                  <span
                     className="text-primary px-4 py-3 border border-primary rounded-full"
                     key={genre.id}>
                     {genre.name}
                  </span>
               ))}
            </div>
         )}

         <p className="text-white text-center text-sm leading-relaxed max-w-[800px] mx-auto mb-10">
            {overview}
         </p>
         <MovieMeta type={"credits"} />
         <MovieMeta type={"videos"} />
         <MovieMeta type={"similar"} />
      </>
   );
};

function MovieMeta({ type = "videos" }) {
   const { movieId } = useParams();

   const { data, error } = useSWR(tmdbAPI.getMovieMeta(movieId, type), fetcher);

   if (type === "credits") {
      const { cast } = data || {};
      if (!cast || cast.length <= 0) return null;

      return (
         <div>
            <h2 className="text-center text-3xl mb-10 text-white font-semibold">
               Casts
            </h2>
            <div className="grid grid-cols-4 gap-5 mb-10 max-w-[1000px] mx-auto">
               {cast.slice(0, 4).map((item) => (
                  <div className="cast-item" key={item.id}>
                     <img
                        src={tmdbAPI.imageW500(item.profile_path)}
                        alt=""
                        className="w-full h-[350px] object-cover rounded-lg"
                     />
                     <h3 className="text-white text-center mt-3 font-semibold">
                        {item.name}
                     </h3>
                     <p className="text-primary text-center">
                        {item.character}
                     </p>
                  </div>
               ))}
            </div>
         </div>
      );
   } else {
      const { results } = data || {};
      if (!results || results.length <= 0) return null;

      if (type === "videos") {
         return (
            <div>
               <h2 className="text-center text-3xl mb-10 text-white font-semibold">
                  Videos
               </h2>
               <div className="flex flex-col gap-10">
                  {results.slice(0, 5).map((item) => (
                     <div key={item.id}>
                        <h3 className="text-primary text-center mb-10 text-2xl font-semibold">
                           {item.name} - {item.type}
                        </h3>
                        <div className="w-full aspect-video">
                           <iframe
                              width="1280"
                              height="720"
                              src={`https://www.youtube.com/embed/${item.key}`}
                              title={item.name}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full h-full object-cover"></iframe>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         );
      }

      if (type === "similar") {
         return (
            <div className="py-10">
               <h2 className="text-center text-3xl mb-10 text-white font-semibold">
                  Similar Movies
               </h2>
               <div className="movie-list">
                  <Swiper
                     grabCursor={"true"}
                     spaceBetween={40}
                     slidesPerView={"auto"}>
                     {results.length > 0 &&
                        results.map((item) => (
                           <SwiperSlide key={item.id}>
                              <MovieCard item={item} />
                           </SwiperSlide>
                        ))}
                  </Swiper>
               </div>
            </div>
         );
      }
   }
   return null;
}

export default MovieDetailsPage;
