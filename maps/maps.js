var maps = module.exports = {};
var http = require('http');
var key = process.env.GCP_API_Key;
const gMaps = require('@google/maps').createClient({
    key: key
});


maps.getBestRoute = (from, mids, to) => {
    var possibilities = [];
    function permutations(inputArr) {
        let result = [];
        function permute(arr, m = []) {
            if (arr.length === 0) {
                result.push(m)
            }
            else {
                for (let i = 0; i < arr.length; i++) {
                    let curr = arr.slice();
                    let next = curr.splice(i, 1);
                    permute(curr.slice(), m.concat(next))
                }
            }
        }
        permute(inputArr)
        return result;
    }

    function tryall() {
        for (let permutation of permutations(mids)) {
            possibilities.push();
        }
    }
}

function routeDuration(start, end) {
    getJSON(`https://maps.googleapis.com/maps/api/directions/json?origin=${start}&destination=${start}&key=${key}`);
}

function getJSON(url) {
    http.get(url, (res) => {
        let body = '';

        res.on('data', (chunk) => {
            body += chunk;
        });

        res.on('end', () => {
            return JSON.parse(body);
        });
    }).on('error', function(e) {
        console.log("Got an error: ", e);
    });
}
