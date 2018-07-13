const helpFromNpm = require('yargs');
const  helpFromNpm2 = require('axios');

const parsedYargs = helpFromNpm
    .option('i', {
        alias: 'ipAddress',
        demandOption: true,
        describe: 'Ip to show a location ***.***.***.***',
        string: true
    })
    .help().alias('h', 'help')
    .argv;

let inputIp = parsedYargs.ipAddress;
let coordinatesUrl = `http://api.ipstack.com/${inputIp}?access_key=a690d859ca69cf463ec76784323e294b`;


helpFromNpm2.get(coordinatesUrl).then((response) => {

    if (response.data.continent_name === null) {
        throw new Error('There is no such IP. Try to use \'134.101.250.155\'');
    }
    console.log(`Comtinent: ${response.data.continent_name}. City: ${response.data.city}`);
    let weatherUrl = `https://api.darksky.net/forecast/073d97889b4f5f2a3f94926c1f025b91/${response.data.latitude},${response.data.longitude}`;

    return helpFromNpm2.get(weatherUrl);      //chaining

    }).then((response2) => {
        console.log(`The weather is ${response2.data.currently.summary}. The temperature is ${response2.data.currently.temperature} F`);

    }).catch((error) => {
    if (error.code === 'ENOTFOUND') {
        console.log('Unable to connect to coordinates server. Something wrong with coordinates block');
    } else {
        console.log(error.message); //new Error
    }
});