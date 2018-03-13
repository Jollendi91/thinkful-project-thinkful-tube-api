const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

function getDataFromApi(searchTerm, callback) {
    //get the jSON data from the api
    const query = {
        part: 'snippet',
        q: `${searchTerm}`,
        key: 'AIzaSyAI0ixIyxcDDXrPDjECt32oim-eMPQR4Uo'
    }
    $.getJSON(YOUTUBE_SEARCH_URL, query, callback);
}

function renderResults(result) {
    return `
        <div>
            <a href="https://www.youtube.com/watch?v=${result.id.videoId}"><img src='${result.snippet.thumbnails.medium.url}'></a>
            <h3>${result.snippet.title}</h3>
            <p>${result.snippet.description}</p>
            <a href="https://www.youtube.com/channel/${result.snippet.channelId}"><p>More from this channel</p></a>
        </div>
    `
}

function displayYoutubeSearchResults(data) {
    //render the search thumbnails on the page
    const results = data.items.map((item, index) => renderResults(item));
    $('.js-search-results').html(results);
}

function watchSubmit() {
    //watch for the form to be submitted
    $('.js-input-form').submit(event => {
        event.preventDefault();
        const queryTarget = $(event.currentTarget).find('.js-search-input');
        const query = queryTarget.val();
        queryTarget.val("");
        getDataFromApi(query, displayYoutubeSearchResults);
    }
    )
}

$(watchSubmit);