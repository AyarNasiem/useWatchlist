/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { PropTypes } from "prop-types";
import { BiLeftArrowAlt } from "react-icons/bi";
// to make sure we enter the correct data types

// const tempMovieData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133093",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751668",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
// ];

// const tempWatchedData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//     runtime: 148,
//     imdbRating: 8.8,
//     userRating: 10,
//   },
//   {
//     imdbID: "tt0088763",
//     Title: "Back to the Future",
//     Year: "1985",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
//     runtime: 116,
//     imdbRating: 8.5,
//     userRating: 9,
//   },
// ];


const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "ea9dde5c";

export default function App() {
  // const [movies, setMovies] = useState(tempMovieData); // Movies data
  // const [watched, setWatched] = useState(tempWatchedData); // Watched movie data
  const [movies, setMovies] = useState([]); // Movies data
  const [watched, setWatched] = useState([]); // Watched movie data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const tempQuery = "game";
  const [query, setQuery] = useState(tempQuery); // search query string
  const [selectedId, setSelectedId] = useState(null);

  // useEffect(function () {
  //   fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`)
  //     .then((res) => res.json())
  //     // .then((data)=>console.log(data.Search));
  //     .then((data) => setMovies(data.Search));
  // }, []);

  function handleSelectMovie(id) {
    // setSelectedId( selectedId===id ? null : id);
    setSelectedId((selectedId) => (selectedId === id ? null : id)); // same
  }
  function handleCloseMovie() {
    setSelectedId(null);
  }
  function handleAddWatched(movie){
    setWatched((watched)=> [...watched, movie]);
  }
  function handleDeleteWatched(id){
    setWatched((watched)=> watched.filter(movie=>movie.imdbID !== id))
  }

  // useEffect(function(){
  //   document.addEventListener('keydown', function(e){
  //     if(e.key === "Escape"){
  //       // setSelectedId(null);
  //       handleCloseMovie();
  //       console.log("Escape key pressed");
  //     }
  //   }
  //   )
  // },[]) // movie it to MovieDetails function

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setLoading(true);
          setError(""); // for search
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,{signal:controller.signal}
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
    },
    [query]
  ); // for search

  return (
    <>

      <Navbar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <MovieResults movies={movies} />
      </Navbar>

      <Main>
        <Box>
          {/* {loading ? <Loading/> : <MovieList movies={movies} />} */}
          {loading && <Loading />}
          {!loading && !error && (
            <MovieList movies={movies} onSelectedMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchSummary watched={watched} />
              <WatchMovieList watched={watched} onDeleteWatched={handleDeleteWatched} />
            </>
          )}
        </Box>
      </Main>

    </>
  );
}
function Loading() {
  return <p className="loader">Loading...</p>;
}
function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>❌</span> {message}
    </p>
  );
}

function Navbar({ children }) {
  // children means to contain Logo and Search and Movies Results
  return <nav className="nav-bar">
    {children} 
    {/* childern means contains logo, search box, movie result */}
  </nav>;
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>useWatchlist </h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  // const [query, setQuery] = useState(""); // Search query string
  // cut it from here, and write it in the App, because we need it from there
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
function MovieResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

// -----------------------------------------------------------------------------------------------------------------------------

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen1, setIsOpen1] = useState(true);

  return (
    <div className="box">
      {/*Left Box */}
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)} // open can be any name, but inside (kawana) and after => !() ... should be same
      >
        {isOpen1 ? "–" : "+"}
      </button>
      {/* {isOpen1 && {children} />} */}
      {isOpen1 && children} {/* children is a MovieList */}
    </div>
  );
}
function MovieList({ movies, onSelectedMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((mv) => (
        <Movie mv={mv} onSelectedMovie={onSelectedMovie} key={mv.imdbID} />
      ))}
      {/* End of map */}
    </ul>
  );
}

function Movie({ mv, onSelectedMovie }) {
  return (
    <li onClick={() => onSelectedMovie(mv.imdbID)}>
      <img src={mv.Poster} alt={`${mv.Title} poster`} />
      <h3>{mv.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{mv.Year}</span>
        </p>
      </div>
    </li>
  );
}



function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [loading, setLoading] = useState(false);
  const [userRating, setUserRating] = useState('');

  const isWatched = watched.map(
    (mo)=> (mo.imdbID)).includes(selectedId);
    const watchedUserRating = watched.find((mo)=>mo.imdbID ===selectedId)?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;
  
  function handleAdd(){
    const newWatchMovie ={
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating:Number(imdbRating),
      runtime:Number(runtime.split(" ").at(0)),
      userRating,
    };
    onAddWatched(newWatchMovie);
    onCloseMovie();
  }
  useEffect(function () {
    async function getMovieDetails() {
      setLoading(true);
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
      );
      const data = await res.json();
      // console.log(data);
      setMovie(data); // set the movie data ( do not forget it.....)
      setLoading(false);
    }
    getMovieDetails();
  }, [selectedId]);

  
  // for cleaning up the document title
useEffect(function(){
  if (!title) return;
  document.title=`Movie | ${title}`;

  // clean up function
  return function(){
    document.title="useWatchlist";
    console.log(`you just cleaned up the ${title}`); // for showing previous title that cleaned up
  }
},[title])


useEffect(
  function(){
    function callback(e){
      if(e.key === "Escape"){
        onCloseMovie();
        console.log("Escape key pressed");
      }
    }
document.addEventListener('keydown', callback);
  // clean up lister function
  return function(){
    document.removeEventListener('keydown',callback);
  }
},[onCloseMovie])

  return (
    <div className="details">
      {loading ? <Loading/> :
      <>
    <header>
      {/* <button className="btn-back" onClick={()=>onCloseMovie()}></button> */}
      <button className="btn-back" onClick={onCloseMovie}>
        <BiLeftArrowAlt />
      </button>
      {/* bam shewaiash har akret chunka id w shti te naxain har asayya bas call bka babe kawanish */}

      <img src={poster} alt={`poster of ${movie}`} />
      <div className="details-overview"> 
        <h2>{title}</h2>
        <p> {released} &bull; {runtime}</p>
        <p>{genre}</p>
        <p>
          <span>⭐</span>
          <p>{imdbRating} IMDb Rating</p>
        </p>
      </div>
    </header>
      <section>
        <div className="rating">
          {
            !isWatched ?  (
          <>
          <StarRating maxRating={10} size={24} onSetRating={setUserRating}/>
          { userRating > 0 && (
            <button className="btn-add" onClick={handleAdd}>
            + add to watch list
            </button>
            )
          }
          </>
          )
          :
            <p>you are rated this moive {watchedUserRating}</p>
        }
          </div>
        <p><em>{plot}</em></p>
        <p>Starring {actors}</p>
        <p>Director by {director}</p>
      </section>
      {/* {selectedId} */}
      </>
      }
    </div>
  );
}



function WatchSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((m) => m.userRating));
  const avgRuntime = average(watched.map((mv) => mv.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(2)} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchMovieList({ watched, onDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((m) => (
        <WatchedMovie m={m} key={m.imdbID} onDeleteWatched={onDeleteWatched } />
      ))}
      {/* End of map */}
    </ul>
  );
}

function WatchedMovie({ m,onDeleteWatched }) {
  return (
    // <li key={m.imdbID}>
    <li>
      <img src={m.poster} alt={`${m.title} poster`} />
      <h3>{m.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{m.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{m.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{m.runtime} min</span>
        </p>
        <button className="btn-delete" onClick={()=>onDeleteWatched(m.imdbID)}>
          X
        </button>
      </div>
    </li>
  );
}

function Test() {
  const [movieRating, setMovieRating] = useState(0);
  return (
    <div>
      <StarRating maxRating={10} color="blue" onSetRating={setMovieRating} />
      <p>This movie was rated {movieRating} stars</p>
    </div>
  );
}

const containerStyle = {
  display: "flex",
  alignItem: "center",
  gap: "1rem",
  alignContent: "center",
  justifyContent: "center",
};
const starContainerStyle = {
  display: "flex",
};

// const textStyles = {
//   fontSize: "18px",
//   lineHeight: "1",
//   margin: "0",
// }; moved to inside function

StarRating.propTypes = {
  // to prevent compiler warning about wrong data types
  maxRating: PropTypes.number,
  defaultRating: PropTypes.number,
  color: PropTypes.string,
  size: PropTypes.number,
  message: PropTypes.array,
  className: PropTypes.string,
  onSetRating: PropTypes.func,
  // we have more like .object or .bool
};
function StarRating({
  maxRating = 5,
  color = "#fcc419",
  size = 48,
  className = "",
  messages = [],
  defaultRating = 0,
  onSetRating,
}) {
  // this 10 is for default rating if not specified
  const [rating, setRating] = useState(defaultRating);
  const [tempRating, setTempRating] = useState(defaultRating);

  function handleRating(rating) {
    setRating(rating);
    onSetRating(rating);
  }
  const textStyles = {
    lineHeight: "1",
    margin: "0",
    fontSize: `${size / 1.3}px`,
    color: color,
  };
  return (
    <div className={className} style={containerStyle}>
      <div className="" style={starContainerStyle}>
        {Array.from({ length: maxRating }, (_, i) => (
          // <span key={i}>S{i + 1}</span>
          <Star
            key={i}
            onRate={() => handleRating(i + 1)}
            // full={rating >= i + 1}
            full={tempRating ? tempRating >= i + 1 : rating >= i + 1}
            onHoverIn={() => setTempRating(i + 1)}
            onHoverOut={() => setTempRating(0)}
            color={color}
            size={size}
          />
        ))}
      </div>
      {/* <p style={textStyles}>10</p> */}
      {/* <p style={textStyles}> {rating || ""}</p> */}
      {/* <p style={textStyles}> {tempRating || ""}</p> */}
      <p style={textStyles}>
        {" "}
        {messages.length === maxRating
          ? messages[tempRating ? tempRating - 1 : rating - 1]
          : tempRating || rating || ""}
      </p>
    </div>
  );
}

function Star({ onRate, full, onHoverIn, onHoverOut, color, size }) {
  const starStyle = {
    // width: "48px",
    width: `${size}px`,
    // height: "48px",
    height: `${size}px`,
    display: "block",
    cursor: "pointer",
  };
  return (

    <span
      role="button"
      style={starStyle}
      onClick={onRate}
      onMouseEnter={onHoverIn}
      onMouseLeave={onHoverOut}
    >
      {full ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          // fill="#000"
          // stroke="#000"
          fill={color}
          stroke={color}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          // stroke="#000"
          stroke={color}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="{2}"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      )}
    </span>
  );
}
