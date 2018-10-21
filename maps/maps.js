var maps = module.exports = {};
var https = require('https');
var request = require('request');
var key = process.env.GCP_API_Key;
const gMaps = require('@google/maps').createClient({
    key: key
});


maps.getBestRoute = (from, mids, to) => {
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
        return result;
    }
    function tryall() {
        let poss = [];
        for (let i in permutations(mids)) {
            poss.push([]);
            for(let j = 0; j < perms[i].length() - 1; j++) {
                poss[i].push(routeDuration(perms[i][j], perms[i][j + 1]));
            }
            poss[i].reduce((a, b) => a + b, routeDuration(from, poss[i][0]) + routeDuration(poss[i][poss[i].length], to));
        }
        return poss;
    }
    
}

function routeDuration(start, end) {
    gMaps.distanceMatrix({
        
    });
    return getJSON(`http://maps.googleapis.com/maps/api/directions/json?origin=${start}&destination=${start}&key=${key}`);
}

function getJSON(url) {
    var data;
    https.get(url, function(res){
        res.on('data', function(chunk){
            data += chunk;
        });
        res.on('end', function(){
            var data = JSON.parse(data);
        });
    }).on('error', function(e){
    }).end();
    return data;
}
console.log(getJSON('https://maps.googleapis.com/maps/api/distancematrix/json?origins=Washington,DC&destinations=New+York+City,NY%20Disneyland&key=AIzaSyCZMNFyJg6qmMh6MVw-ez_5BNBGVv9fwk8'));
