
// Wierzba
const API_URL = "https://wierzba.wzks.uj.edu.pl/~19_mytych/projekt/music-db/api/";


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
    var url = `${API_URL}create_item.php?category=${data.category}`;
    let res = await fetch(url, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(data.obj)
    })
    .then(response => {
        if (response.status === 200) { return true; } else { return false; }
    })
    .catch(function(error) { 
        console.log('Request failed: ', error) 
    });    

    return res;
};


export async function deleteItemRequest(args) {
    var url = `${API_URL}delete_item.php?id=${args.id}&category=${args.cat}`;

    let res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(response => {
        if (response.status === 200) { return true; } else { return false; }
    })

    return res;
};


export async function getItemRequest(args) {
    var url = `${API_URL}get_item.php?category=${args.category}&id=${args.id}`;

    let res = await fetch(url, { method: 'GET' })
    .then(response => { console.log(response.status); return response.json(); }) 
    .then(ITEM => { return ITEM; })
    .catch(function(error) { console.log('Request failed: ', error) } );

    return res;
};


export async function putEditedItemRequest(data) {
    console.log("putEditedItemRequest");
    console.log(JSON.stringify(data.obj));
    var url = `${API_URL}update_item.php?category=${data.category}&id=${data.id}`;
    var res = await fetch(url, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(data.obj)
    })
    .then(response => {
        if (response.status === 200) { return true; } else { return false; }
    })  
    .catch(function(error) {
        console.log('Request failed: ', error) 
    });

    return res;
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

