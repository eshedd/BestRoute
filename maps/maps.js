var maps = module.exports = {};
var request = require('sync-request');
var key = 'pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2lqbmplN3k2MDBsY3RobTU2N2hoNTY2cSJ9.3M776Z2hLCr6j1sqBBSbDw';
maps.getGeometry = (arr) => {
    return maps.getBestRoute(arr).trips[0].geometry;
}
maps.timeLeft = (arr, index, leg = 0) => {
    tripDuration([maps.driverPosition(), ...arr.slice(leg + 1, index)]);
};
maps.distanceLeft = (arr, index, leg = 0) => {
    tripDistance([maps.driverPosition(), ...arr.slice(leg + 1, index)]);
};
maps.driverPosition = () => {
    return geocode('2100 University Avenue, East Palo Alto');
};
maps.getEmbed = (route) => {
    
};
maps.getBestRoute = (arr) => {
    var str = "";
    for (let point of arr) {
        str += `${point[0]},${point[1]};`;
    }
    return bestRouteJSON(str);
};
maps.getBestRouteCoords = (arr) => {
    var json = maps.getBestRoute(arr);
    return json.waypoints.map((x) => x.location);
};
maps.getBestRouteBySearch = (arr) => {
    var str = "",
        res = [];
    for (let loc of arr) {
        let pos = geocode(loc);
        str += `${pos[0]},${pos[1]};`;
    }
    var json = bestRouteJSON(str);
    for (let i in arr) {
        res.push(arr[json.waypoints[i].waypoint_index]);
    }
    return res;
};
// maps.getBestRoute = (arr) => {
//     var from = arr[0], mids = arr.slice(1, arr.length - 1), to = arr[arr.length - 1];
//     var perms = permutations(mids);
//     var all = tryall();
//     return [from, ...perms[all.indexOf(Math.min(...all))], to];
//     function permutations(inputArr) {
//         let result = [];
//         function permute(arr, m = []) {
//             if (arr.length === 0) {
//                 result.push(m);
//             }
//             else {
//                 for (let i = 0; i < arr.length; i++) {
//                     let curr = arr.slice();
//                     let next = curr.splice(i, 1);
//                     permute(curr.slice(), m.concat(next));
//                 }
//             }
//         }
//         permute(inputArr);
//         console.log(result);
//         return result;
//     }
//     function tryall() {
//         let poss = [];
//         for (let i in permutations(mids)) {
//             poss.push([]);
//             for(let j = 0; j < perms[i].length - 1; j++) {
//                 poss[i].push(routeDuration(perms[i][j], perms[i][j + 1]));
//             }
//             poss[i] = poss[i].reduce((a, b) => a + b, routeDuration(from, perms[i][0]) + routeDuration(perms[i][perms[i].length - 1], to));
//         }
//         return poss;
//     }
// };
function bestRouteJSON(str) {
    return getJSON(`https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${str.slice(0, str.length - 1)}?source=first&destination=last&access_token=${key}`);
} 
function tripDuration(arr) {
    return maps.getBestRoute(arr).trips[0].duration;
}
function tripDistance(arr) {
    return maps.getBestRoute(arr).trips[0].distance;
}
function getJSON(url) {
    return JSON.parse(request('GET', url).getBody('utf8'));
}

var geocode = maps.geocode = (query) => {
    var json = getJSON(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${key}`);
    return json.features[0].center;
}

var geocodes = maps.geocodes = (points) => {
    var res = [];
    for (let point of points) {
        res.push(geocode(point));
    }
    return res;
}
// console.log(maps.getBestRouteBySearch(['1 parklane dr orinda', 'palo alto', 'miramonte high school', 'oakland', 'piedmont', 'berkeley']));
// console.log(maps.getGeometry(geocodes(['1 parklane dr orinda', 'palo alto', 'miramonte high school', 'oakland', 'piedmont', 'berkeley'])));
