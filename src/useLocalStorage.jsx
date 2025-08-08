// import { useState } from "react";

// export function useLocalStorage(initiallState){
//       const [value, setValue] = useState(() => {
//     const saved = localStorage.getItem("watched");
//     return saved ? JSON.parse(saved) : [];
//   }); 

//     useEffect(() => {
//     localStorage.setItem("watched", JSON.stringify(watched));
//   }, [watched]);
// }


import { useEffect, useState } from "react";

export function useLocalStorage(initiallState, key){
  
    const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initiallState;
  }); 

    useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);
  
  return [value, setValue];

}