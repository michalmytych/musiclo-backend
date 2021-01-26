import React from 'react'

import { CanvasJSChart } from 'canvasjs-react-charts';


export default function SpotifyFeaturesChart(props) {
    const PREPARED_DATASET = [
        { label: "Taneczność",       y: props.DATASET.danceability,      color: 'rgb(0, 218, 145)', },
        { label: "Energiczność",     y: props.DATASET.energy,            color: 'rgb(0, 218, 145)', },
        { label: "Akustyczność",     y: props.DATASET.acousticness,      color: 'rgb(0, 218, 145)', },
        { label: "Instrumentalność", y: props.DATASET.instrumentalness,  color: 'rgb(0, 218, 145)', },
        { label: "Pozytywność",      y: props.DATASET.valence,           color: 'rgb(0, 218, 145)' }
    ];

    const CHART_CONFIG = {
		title: {
			text: "Statystyki utworu według Spotify"              
		},
        axisY: {
            maximum: 1,
        },
        height: 150,
        width: 360,
        theme: "dark1",
		data: [              
            {
                type: "column",
                dataPoints: PREPARED_DATASET
            }
		]
	}
    
    return (
        <CanvasJSChart options={CHART_CONFIG}/>  
    )
}
