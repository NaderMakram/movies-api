const autoCompleteConfig = {
  renderOption(movie) {
    let imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster
    return `
    <img src="${imgSrc}" >
    <h3>${movie.Title} (${movie.Year})</h3>`
  },
  inputValue(movie) {
    return movie.Title
  },
  async fetchData(searchTerm) {
    const results = await axios.get('http://www.omdbapi.com/', {
      params: {
        apikey: 'c63dfa6f',
        s: searchTerm
      }
    })
    if (results.data.Error) { return [] }
    return results.data.Search
  }
}

let leftMovie;
let rightMovie;
createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#left-autocomplete'),
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden')
    onMovieSelect(movie, document.querySelector('.left-summary'), 'left')
  }
})
createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#right-autocomplete'),
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden')
    onMovieSelect(movie, document.querySelector('.right-summary'), 'right')
  }
})


const onMovieSelect = async (movie, target, side) => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: 'c63dfa6f',
      i: movie.imdbID
    }
  })
  target.innerHTML = movieTemplate(response.data)
  if (side === 'left') {
    leftMovie = response.data
  }
  else {
    rightMovie = response.data
  }
  if (leftMovie && rightMovie) {
    compare()
  }
}

const compare = () => {
  const leftSideStats = document.querySelectorAll('.left-summary .notification')
  const rightSideStats = document.querySelectorAll('.right-summary .notification')
  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index]
    const leftSideValue = leftStat.dataset.value
    const rightSideValue = rightStat.dataset.value
    if (leftSideValue > rightSideValue) {
      leftStat.classList.remove('is-primary')
      leftStat.classList.add('is-warning')
    }
    else {
      rightStat.classList.remove('is-primary')
      rightStat.classList.add('is-warning')
    }
  });
}

const movieTemplate = (movieDetail) => {
  const imdbRating = parseFloat(movieDetail.imdbRating)
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''))
  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetail.Poster}" />
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
        </div>
      </div>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article data-value=${imdbRating} class="notification is-primary">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value=${imdbVotes} class="notification is-primary">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `;
};
