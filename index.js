const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

let query;

function getDataFromApi(searchTerm, callback) {
    //get the jSON data from the api
    query = {
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
            <a href="https://www.youtube.com/channel/${result.snippet.channelId}"><p>See more from ${result.snippet.channelTitle}</p></a>
        </div>
    `
}

function displayYoutubeSearchResults(data) {
    //render the search thumbnails on the page
    const results = data.items.map((item, index) => renderResults(item));
    $('.js-search-results').html(results);

    if (data.prevPageToken) {
        $('.js-search-results').append(`<button class="js-button js-prev" role="button">Previous</button>`);
    }

    if (data.nextPageToken) {
        $('.js-search-results').append(`<button class="js-button js-next" role="button">Next</button>`);
    }
}

function getPrevResults() {
    query.pageToken = "CAUQAQ";
    $.getJSON(YOUTUBE_SEARCH_URL, query, displayYoutubeSearchResults);
}

function getNextResults() {
    query.pageToken = "CAUQAA";
    $.getJSON(YOUTUBE_SEARCH_URL, query, displayYoutubeSearchResults);
}

function listenForMoreResultsClick() {
    $('.js-search-results').on('click', '.js-prev', event => {
        event.preventDefault();
         getPrevResults();
    });
    
    $('.js-search-results').on('click', '.js-next', event => {
        event.preventDefault();
        getNextResults();
    })
}

function watchSubmit() {
    //watch for the form to be submitted
    $('.js-input-form').submit(event => {
        event.preventDefault();
        const queryTarget = $(event.currentTarget).find('.js-search-input');
        const searchInput = queryTarget.val();
        queryTarget.val("");
        getDataFromApi(searchInput, displayYoutubeSearchResults);
    }
    )
}

$(watchSubmit);

$(listenForMoreResultsClick);