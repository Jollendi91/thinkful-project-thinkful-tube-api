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
        <article class="result">
            <a href="https://www.youtube.com/watch?v=${result.id.videoId}"><img class="result-img" src='${result.snippet.thumbnails.medium.url}' alt="${result.snippet.title}"></a>
            <section class="result-text">
                <h3>${result.snippet.title}</h3>
                <p>${result.snippet.description}</p>
                <a href="https://www.youtube.com/channel/${result.snippet.channelId}"><p>View more from ${result.snippet.channelTitle}</p></a>
            </section>
        </article>
    `
}

function displayYoutubeSearchResults(data) {
    //render the search thumbnails on the page
    const results = data.items.map((item, index) => renderResults(item));
    $('.js-search-results').html(results);
    $('.js-search-results').append(`<div class="page-buttons js-page-buttons"></div>`);

    if (data.prevPageToken) {
        $('.js-page-buttons').append(`<button class="prev button js-button js-prev" role="button" value="${data.prevPageToken}">Previous</button>`);
    }

    if (data.nextPageToken) {
        $('.js-page-buttons').append(`<button class="next button js-button js-next" role="button" value="${data.nextPageToken}">Next</button>`);
    }
}

function listenForMoreResultsClick() {
    $('.js-search-results').on('click', '.js-button', event => {
        event.preventDefault();
        if ($(event.target).hasClass('js-prev')) {
            query.pageToken = $('.js-prev').val();
        } else {
            query.pageToken = $('.js-next').val();
        }
        $.getJSON(YOUTUBE_SEARCH_URL, query, displayYoutubeSearchResults);
    });
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

function loadEventListeners() {
    watchSubmit();
    listenForMoreResultsClick();
}

$(loadEventListeners);
