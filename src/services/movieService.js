import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/movies";

function movieUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getMovies() {
  return http.get(apiEndpoint);
}

export function getMovie(movieId) {
  return http.get(movieUrl(movieId));
}

export function saveMovie(movie) {    
  movie.genreId=movie.genreId.split(':')[1];
  // if (movie.id) {
  //   const body = { ...movie };
  //   delete body.id;
  //   return http.put(movieUrl(movie.id), body);
  // }
  // console.log(movie);
  return http.put(apiEndpoint, movie);
}

export function deleteMovie(movieId) {
  return http.delete(movieUrl(movieId));
}
