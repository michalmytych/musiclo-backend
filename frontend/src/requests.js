import { SONGS, ALBUMS, ARTISTS } from './temporary';


export function getItemsListRequest(category) {
    switch(category) {
        case 'songs':
            console.log("REQ: Pobieram piosenki!"); return SONGS;
        case 'albums':
            console.log("REQ: Pobieram albumy!"); return ALBUMS;
        case 'artists':
            console.log("REQ: Pobieram artystów!"); return ARTISTS;
        default:
            console.log("REQ: Pobieram piosenki!"); return SONGS;
    }
}

export async function deleteItemRequest(category, id) {
    console.log('REQ: Usuwanie elementu z kategorii ' + category + ' o id ' + id);
}

export async function putEditedItemRequest(category, object) {
    alert('REQ: Zapisywanie obiektu: ' + object + ' z kategorii ' + category);
}

export function getSearchResultsRequest(category, search_input) {
    switch (category) {
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
