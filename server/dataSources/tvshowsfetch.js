const { RESTDataSource } = require('apollo-datasource-rest');

class TvShowAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://api.tvmaze.com/';
  }
   // get all tv shows
   async getAllTVShows() {
    const response = await this.get('schedule/full/');
    return Array.isArray(response)
      ? response.map((tvShow) => {
          return {
            name: tvShow._embedded.show.name,
            season: tvShow.season,
            episode: tvShow.name,
            airDate: tvShow.airdate,
            crew: tvShow.crew,
            aka: tvShow.aka,
            cast: tvShow.cast,
            image: tvShow._embedded.show.image,
            language: tvShow._embedded.show.language,
            genre: tvShow._embedded.show.genre,
            duration: tvShow._embedded.show.runtime,
            rating: tvShow._embedded.show.rating.average,
            summary: tvShow._embedded.show.summary,
            premiered: tvShow._embedded.show.premiered,
            status: tvShow._embedded.show.status,
            id: tvShow._embedded.show.id,
            url: tvShow._embedded.show.url,
            image:
              tvShow._embedded.show.image &&
              tvShow._embedded.show.image.original,
          };
        })
      : [];
  }

  // get a single tv show
  async getTVShowById(id) {
    const res = await this.get(`shows/${id}`);
    return {
      name: res.name,
      crew: res.crew,
      aka: res.aka,
      cast: res.cast,
      image: res.image,
      language: res.language,
      genre: res.genre,
      duration: res.runtime,
      rating: res.rating.average,
      summary: res.summary,
      premiered: res.premiered,
      status: res.status,
      id: res.id,
      url: res.url,
      image: res.image && res.image.original,
    };
  }

  // search tv show by name
  async searchTVShowByName(name) {
    const response = await this.get(`search/shows?q=${name}`);
    return Array.isArray(response) ? response.map((res) => {
      return {
        name: res.show.name,
        image: res.show.image && res.show.image.original,
        language: res.show.language,
        duration: res.show.runtime,
        rating: res.show.rating.average,
        summary: res.show.summary,
        premiered: res.show.premiered,
        status: res.show.status,
        id: res.show.id,
        url: res.show.url,
      };
    }) : [];
  }
}

module.exports = TvShowAPI;