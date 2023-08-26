export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  name: string;
  vote_average: number;
  vote_count: number;
  adult: boolean;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export function getList(type: string) {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkOTgxM2JkNWI5MjIzMGJmNmEwMmIwMjUwNmMxMDczNCIsInN1YiI6IjY0Y2UzM2RkNmQ0Yzk3MDE0ZjQxZmRkNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.20S5RVLoYPQZ4mur6abACSuChhsz45VxqaByiSEFxng",
    },
  };

  return fetch(
    `https://api.themoviedb.org/3/${type}?language=ko&region=kr`,
    options
  ).then((response) => response.json());
}
