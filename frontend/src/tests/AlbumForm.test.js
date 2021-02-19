import React from 'react';

import AlbumForm from '../components/AlbumForm';

import { render, screen, cleanup } from '@testing-library/react';


afterEach(cleanup);

it('Inserts instance object into form when editing', () => {
    const albumInstance = {
        "id"            : "0aODrxJCgCKmmwYZSyld4O",
        "name"          : "Watchful",
        "artists_ids"   : ["06xa1OLBsMQJFXcl2tQkH4", "06yvjjrPokJGC66DzFfCkF"],
        "songs_ids"     : ["01IHhVntPehbczBRYSdzD0", "01IIzsHQSRsf9Lcgyuf1Qt"],
        "release_date"  : "2019-02-22",
        "spotify_link"  : "https://open.spotify.com/embed/track/01iHdmvQgccSo8FgBsfB3g"
    };
    
    const albumForm = render(
        <AlbumForm 
            _editing={true}
            category={"albums"}
            instance={albumInstance}/>
    );

    const nameInput =               albumForm.getByPlaceholderText("Nazwa...");    
    const releaseDateInput =        albumForm.getByLabelText("Data wydania");        
    const spotifyLinkDateInput =    albumForm.getByLabelText("Link do albumu w Spotify");   

    expect(nameInput.value)             .toBe(albumInstance.name);        
    expect(releaseDateInput.value)      .toBe(albumInstance.release_date);
    expect(spotifyLinkDateInput.value)  .toBe(albumInstance.spotify_link);        

        /*
            Songs ids and artists ids should be tested
            in SelectSearch component.
        */
})
