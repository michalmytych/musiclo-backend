
// Wierzba
const API_URL = "https://wierzba.wzks.uj.edu.pl/~19_mytych/projekt/music-db/api/";

// Local
// const API_URL = "http://localhost/api/";

// randint() in es6
const randInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// simulate async api call with random delay
const _simulateApiResponseDelay = () => {
    var delay = randInt(500, 2500);
    return new Promise(res => setTimeout(res, delay))
};

export async function getItemsListRequest(args) { 
    var url = `${API_URL}items_list.php?limit=${args.l}&page=${args.p}&category=${args.c}`;
    var ITEMS = await fetch(url)
    .then(response => { console.log(response.status); return response.json(); }) 
    .then(ITEMS => { return ITEMS; })
    .catch(function(error) { console.log('Request failed: ', error) } );

    return ITEMS;
};

export async function createItemRequest(data) {
    console.log(JSON.stringify(data.obj));
    console.log("createItemRequest");
    /*
        BĘDZIE ZABLOKOWANE PRZEZ CORS
    */
    var url = `${API_URL}create_item.php?category=${data.category}`;
    var response = await fetch(url, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(data.obj)
    })
    .then(response => console.log(response.status))
    .catch(function(error) { 
        console.log('Request failed: ', error) 
    });
};

export async function deleteItemRequest(args) {
    /*
        ZABLOKOWANE PRZEZ CORS
    */
    var url = `${API_URL}delete_item.php?id=${args.id}&category=${args.cat}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(response => console.log(response.status))
};

export async function putEditedItemRequest(data) {
    /*
        BĘDZIE ZABLOKOWANE PRZEZ CORS
    */    
    console.log("putEditedItemRequest");
    console.log(JSON.stringify(data.obj));
    /*
        BĘDZIE ZABLOKOWANE PRZEZ CORS
    */
    var url = `${API_URL}update_item.php?category=${data.category}&id=${data.id}`;
    var response = await fetch(url, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(data.obj)
    })
    .then(response => console.log(response.status))  
    .catch(function(error) {
        console.log('Request failed: ', error) 
    });
};

export async function getSearchResultsRequest(args) {
    var url = `${API_URL}search_item.php?category=${args.c}&phrase=${args.p}`;
    var RESULTS = await fetch(url)
    .then(response => { console.log(response.status); return response.json(); }) 
    .then(RESULTS => { return RESULTS; })
    .catch(function(error) { console.log('Request failed: ', error) } );

    return RESULTS;    
};

export async function getSongsOfAlbumRequest(id) {    
    var SONGS = await fetch(API_URL + `songs_of_album.php?id=${id}`)
    .then(response => { console.log(response.status); return response.json(); }) 
    .then(SONGS => { return SONGS; })
    .catch(function(error) {console.log('Request failed: ', error) });
    
    return SONGS;
};

export async function getCountriesDataRequest() {    
    var data = await fetch(API_URL + `countries_list.php`)
    .then(response => { console.log(response.status); return response.json(); }) 
    .then(data => { return data; })
    .catch(function(error) {console.log('Request failed: ', error) });

    return data;
};

