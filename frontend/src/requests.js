import { SONGS, ALBUMS, ARTISTS } from './temporary';

export function getItemsListRequest(category) {
    switch(category) {
        case 'songs':
            alert("REQ: Pobieram piosenki!"); return SONGS;
        case 'albums':
            alert("REQ: Pobieram albumy!"); return ALBUMS;
        case 'artists':
            alert("REQ: Pobieram artystów!"); return ARTISTS;
        default:
            alert("REQ: Pobieram piosenki!");
    }
}

export async function deleteItemRequest(category, id) {
    alert('REQ: Usuwanie elementu z kategorii ' + category + ' o id ' + id);
}

export async function putEditedItemRequest(object, category) {
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
            return [{"name" : "Nie znaleziono."}]
    }
    // alert('REQ: Wyszukiwanie: ' + search_input + ' z kategorii ' + category);
}


/*

!async function(){
let data = await fetch("https://raw.githubusercontent.com/IbrahimTanyalcin/LEXICON/master/lexiconLogo.png")
    .then((response) => response.blob())
    .then(data => {
        return data;
    })
    .catch(error => {
        console.error(error);
    });

console.log(data);
}();

*/
