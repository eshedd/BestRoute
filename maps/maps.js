var maps = module.exports = {};
var https = require('https');
var request = require('sync-request');
var key = process.env.GCP_API_Key;
const gMaps = require('@google/maps').createClient({
    key: key
});


maps.getBestRoute = (arr) => {
    var from = arr[0], mids = arr.slice(1, arr.length - 1), to = arr[arr.length - 1];
    var perms = permutations(mids);
    var all = tryall();
    return [from, ...perms[all.indexOf(Math.min(...all))], to];
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
        console.log(result);
        return result;
    }
    function tryall() {
        let poss = [];
        for (let i in permutations(mids)) {
            poss.push([]);
            for(let j = 0; j < perms[i].length - 1; j++) {
                poss[i].push(routeDuration(perms[i][j], perms[i][j + 1]));
            }
            poss[i] = poss[i].reduce((a, b) => a + b, routeDuration(from, perms[i][0]) + routeDuration(perms[i][perms[i].length - 1], to));
        }
        return poss;
    }
}

function routeDuration(start, end) {
    return getJSON(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${start}&destinations=${end}&key=AIzaSyAW8vHOPnGkiK9VbfD5657OTynlenNCBVk`).rows[0].elements[0].duration.value;
}

function getJSON(url) {
    return JSON.parse(request('GET', url).getBody('utf8'));
}
console.log(maps.getBestRoute(['San+Francisco,+CA', 'Orinda,+CA', 'Piedmont,+CA', 'Pacifica,+CA', 'Palo+Alto,+CA']));
