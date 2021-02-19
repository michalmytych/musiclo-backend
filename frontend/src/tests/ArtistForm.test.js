import React from 'react';

import ArtistForm from '../components/ArtistForm';

import { render, cleanup } from '@testing-library/react';


afterEach(cleanup);

it('Inserts instance object into form when editing', () => {
    const artistInstance = {
        "name"          : "Metallica",
        "albums_ids"    : ["0aODrxJCgCKmmwYZSyld4O", "0APePhDDGAvshjJ88zRdWc"],            
        "description"   : "Amerykański zespół thrashmetalowy z Los Angeles",
        "country"       : "US",
        "spotify_link"  : "https://open.spotify.com/artist/2ye2Wgw4gimLv2eAKyk1NB?si=uo9QgEVOR8ywfuvE73kFAQ"
    };
    
    const artistForm = render(
        <ArtistForm 
            _editing={true}
            category={"artists"}
            instance={artistInstance}/>
    );

    const nameInput         = artistForm.getByLabelText("Nazwa wykonawcy");    
    const descriptionInput  = artistForm.getByLabelText("Opis");        
    const countryInput      = artistForm.getByLabelText("Kraj");        
    const spotifyLinkInput  = artistForm.getByLabelText("Artysta w Spotify");   

    expect(nameInput.value)         .toBe(artistInstance.name);        
    expect(descriptionInput.value)  .toBe(artistInstance.description);
    expect(spotifyLinkInput.value)  .toBe(artistInstance.spotify_link);        
    /* 
        Country is selected from fetched countries data by iso_code. At componentDidMount() async api call
        somehow refreshes component state which causes render() call without full form being completed.
    */
    expect(countryInput.value)      .toBe(artistInstance.country);

        /*
            Albums ids should be tested in SelectSearch component.
        */
})
