import axios from 'axios';
import { SONGS, ALBUMS, ARTISTS } from './temporary';

const BASE_API_URL = "https://wierzba.wzks.uj.edu.pl/~19_mytych/projekt/music-db/api/";


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
    var url = `${BASE_API_URL}items_list.php?limit=${args.l}&page=${args.p}&category=${args.c}`;
    var ITEMS = await fetch(url)
    .then(response => response.json())
    .then(ITEMS => { return ITEMS; })
    .catch(function(error) { console.log('Request failed: ', error) } );

    return ITEMS;
};

export async function createItemRequest(args) {
    await _simulateApiResponseDelay();
    console.log('REQ: Tworzenie obiektu: ');
    console.log(args.obj);
    console.log(' z kategorii ');
    console.log(args.category);
    //alert("Request opisany w konsoli.");
};

export async function deleteItemRequest(args) {
    var url = `${BASE_API_URL}delete_item.php?id=${args.id}&category=${args.cat}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    
    console.log(response.json());
    return response.json();    
};

export async function putEditedItemRequest(args) {
    await _simulateApiResponseDelay();
    console.log('REQ: Zapisywanie obiektu');
    console.log(args.obj);
    console.log(' z kategorii ');
    console.log(args.category);
    //alert("Request opisany w konsoli.");
};

export async function getSearchResultsRequest(args) {
    await _simulateApiResponseDelay();
    switch (args.category) {
        case 'songs':
            return SONGS; 
        case 'albums':
            return ALBUMS;
        case 'artists':
            return ARTISTS;
        default:
            return [{"name" : "Nie znaleziono."}];
    }
};




// good example of async "returning" data request
export async function getCountriesDataRequest() {    
    var data = await fetch(BASE_API_URL + `countries_list.php`)
    .then(response => response.json())
    .then(data => { return data; })
    .catch(function(error) {console.log('Request failed: ', error) });
    return data;
};

/*

const sendPostRequest = async () => {
    try {
        const resp = await axios.post('https://jsonplaceholder.typicode.com/posts', newPost);
        console.log(resp.data);
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
};

sendPostRequest();

export async function getCountriesDataRequest() {
    var data = fetch('https://api.first.org/data/v1/countries/')
    .then(response => response.json())
    .then(data => { return data; })
    .catch(function(error) {console.log('Request failed: ', error) });
    return data;
}

REQUEST WITH QWEST:

qwest.get(url, {
    client_id: api.client_id,
    linked_partitioning: 1,
    page_size: 10
}, {
    cache: true
})
.then(function(xhr, resp) {
    if(resp) {
        var tracks = self.state.tracks;
        resp.collection.map((track) => {
            if(track.artwork_url == null) {
                track.artwork_url = track.user.avatar_url;
            }

            tracks.push(track);
        });

        if(resp.next_href) {
            self.setState({
                tracks: tracks,
                nextHref: resp.next_href
            });
        } else {
            self.setState({
                hasMoreItems: false
            });
        }
    }
});

*/