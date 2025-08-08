/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */

import { useEffect, useState } from "react";


const KEY = "ea9dde5c"; 

export function useMovies(query, callback) {
  

    const [movies, setMovies] = useState([]); // Movies data
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    
    useEffect(
    function () {
      callback?.();
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setLoading(true);
          setError(""); // for search
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,{signal:controller.signal}
          );
          if (!res.ok)
            throw new Error("something went wrong with fetching movies");

          const data = await res.json();
          if (data.Response === "False") 
            throw new Error("Movie not found");

          console.log(data.Search);
          setMovies(data.Search);
          // setLoading(false);
          setError(""); 

        } catch (err) {
          if(err.name !== "AbortError"){
            setError(err.message);
          }
          // console.log(err.message);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
      if (query.length < 3) {
        // for search
        setMovies([]);
        setError("");
        return;
      }
      fetchMovies();
      return () => {
        controller.abort(); // Cleanup function to abort fetch on unmount
      };
    },
    [query]
  ); // for search
  return { movies, loading, error };

}