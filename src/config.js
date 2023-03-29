const version = 0.1;

module.exports = {
    accessToken : process.env.ACCESSTOKEN,
    // change attribution to yours
    attribution : '©Agrofintech',
    // change stylefiles URLs to yours
    
    // change initial location and zoom level to yours
    center: [35.87063, -1.08551],
    zoom: 13,
    // you can put your geojson file for searching functions
    search:{
        url: 'https://narwassco.github.io/vt/meter.geojson',
        target: ['connno', 'serialno'],
        format: (p) => {return `${p.customer}, ${p.connno}, ${p.serialno}, ${p.village}`},
        place_type: ['meter'],
        placeholder: 'Search CONN NO or S/N',
        zoom: 17,
    },
   
    // please specify your covered area if you have multipul locations to do waterworks
   
    // please specify layer name for showing in legend panel.
    
        
    elevation: {
        url: 'https://narwassco.github.io/narok-terrain/tiles/{z}/{x}/{y}.png',
        options: {
            font: ['Roboto Medium'],
            fontSize: 12,
            fontHalo: 1,
            mainColor: '#263238',
            haloColor: '#fff',
        }
    },
    
}