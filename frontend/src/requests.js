import { SONGS, ALBUMS, ARTISTS } from './temporary';


export function getItemsListRequest(args) { 
    const limit = args.items_limit;
    var ITEMS;
    switch(args.category) {
        case 'songs':
            ITEMS = SONGS; break;
        case 'albums':
            return ALBUMS;
        case 'artists':
            return ARTISTS;
        default:
            return [];
    }

    var objects = ITEMS.slice(args.page * limit, (args.page * limit) + limit);
    return objects;
}

export async function createItemRequest(category, object) {
    console.log('REQ: Tworzenie obiektu: ');
    console.log(object);
    console.log(' z kategorii ');
    console.log(category);
    alert("Request opisany w konsoli.");
}

export async function deleteItemRequest(category, id) {
    console.log('REQ: Usuwanie elementu z kategorii');
    console.log(category);
    console.log(' o id: ');
    console.log(id);
    alert("Request opisany w konsoli.");
}

export async function putEditedItemRequest(args) {
    console.log('REQ: Zapisywanie obiektu');
    console.log(args.object);
    console.log(' z kategorii ');
    console.log(args.category);
    alert("Request opisany w konsoli.");
}

export function getSearchResultsRequest(args) {
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
}

// good example of async "returning" data request
export async function getCountriesDataRequest() {
    var data = fetch('https://api.first.org/data/v1/countries/')
    .then(response => response.json())
    .then(data => { return data; })
    .catch(function(error) {console.log('Request failed: ', error) });
    return data;
}

/*

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