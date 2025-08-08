// export function useKey(){

import { useEffect } from "react";

//       useEffect(() => {
//         function callback(e) {
//           if (e.key === "Escape") {
//             onCloseMovie();
//           }
//         }
    
//         document.addEventListener("keydown", callback);
//         return () => document.removeEventListener("keydown", callback);
//       }, [onCloseMovie]);

// }

export function useKey(key, action) {

      useEffect(() => {
        function callback(e) {
          if (e.key.toLowerCase() === key.toLowerCase()) {
            action();
          }
        }
    
        document.addEventListener("keydown", callback);
        return () => document.removeEventListener("keydown", callback);
      }, [action,key]);
}// export function useKey(){

import { useEffect } from "react";

//       useEffect(() => {
//         function callback(e) {
//           if (e.key === "Escape") {
//             onCloseMovie();
//           }
//         }
    
//         document.addEventListener("keydown", callback);
//         return () => document.removeEventListener("keydown", callback);
//       }, [onCloseMovie]);

// }

export function useKey(key, action) {

      useEffect(() => {
        function callback(e) {
          if (e.key.toLowerCase() === key.toLowerCase()) {
            action();
          }
        }
    
        document.addEventListener("keydown", callback);
        return () => document.removeEventListener("keydown", callback);
      }, [action,key]);
}
