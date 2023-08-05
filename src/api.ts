const API_KEY = "d9813bd5b92230bf6a02b02506c10734";
const BASE_PATH = "https://api.themoviedb.org/3";

export function getMovies() {
  return fetch(
    `${BASE_PATH}//movie/now_playing?api_key=${API_KEY}&language=ko&page=1&region=kr`
  ).then((response) => response.json());
}
