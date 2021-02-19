
// Wierzba
const API_URL = "https://wierzba.wzks.uj.edu.pl/~19_mytych/projekt/music-db/api/";


export async function getItemsListRequest(args) { 
    var url = `${API_URL}items_list.php?limit=${args.l}&page=${args.p}&category=${args.c}`;
    
    var ITEMS = await fetch(url)
    .then(response => { return response.json(); }) 
    .catch(err => { console.log('Request failed: ', err) });

    return ITEMS;
};


export async function createItemRequest(data) {
    var url = `${API_URL}create_item.php?category=${data.category}`;
    
    let res = await fetch(url, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(data.obj)
    })
    .then(response => response.status)
    .catch(err => { console.log('Request failed: ', err) });    

    return res;
};


export async function deleteItemRequest(args) {
    var url = `${API_URL}delete_item.php?id=${args.id}&category=${args.cat}`;

    let res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', }
    })
    .then(response => response.status)
    .catch(err => { console.log('Request failed: ', err) });

    return res;
};


export async function getItemRequest(args) {
    var url = `${API_URL}get_item.php?category=${args.category}&id=${args.id}`;

    let res = await fetch(url, { method: 'GET' })
    .then(response => { return response.json(); }) 
    .catch(err => { console.log('Request failed: ', err) });

    return res;
};


export async function putEditedItemRequest(data) {
    var url = `${API_URL}update_item.php?category=${data.category}&id=${data.id}`;
    
    var res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data.obj),
        headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    })
    .then( response => response.status ) 
    .catch(err => { console.log('Request failed: ', err) });

    return res;
};


export async function getSearchResultsRequest(args) {
    var url = `${API_URL}search_item.php?category=${args.c}&phrase=${args.p}`;
    
    var RESULTS = await fetch(url)
    .then(response => { return response.json(); }) 
    .catch(err => { console.log('Request failed: ', err) } );

    return RESULTS;    
};


export async function getSongsOfAlbumRequest(id) {    
    var url = API_URL + `songs_of_album.php?id=${id}`;

    var SONGS = await fetch(url)
    .then(response => { return response.json(); }) 
    .catch(err => { console.log('Request failed: ', err) });
    
    return SONGS;
};


export async function getCountriesDataRequest() {    
    var url = API_URL + `countries_list.php`;
    
    var data = await fetch(url)
    .then(response => { return response.json(); }) 
    .catch(err => { console.log('Request failed: ', err) });

    return data;
};


export async function getItemsCountDataRequest() {    
    var url = API_URL + `items_count.php`;
    
    var data = await fetch(url)
    .then(response => { return response.json(); }) 
    .catch(err => { console.log('Request failed: ', err) });

    var counted = {
        so  : data.filter(c => (c.category === 'songs'))[0].count,
        al  : data.filter(c => (c.category === 'albums'))[0].count,
        ar  : data.filter(c => (c.category === 'artists'))[0].count
    }

    return counted;
};

