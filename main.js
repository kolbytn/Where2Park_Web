var lots = [{"name": "34Y", "lat":40.244746, "long":-111.655403},
  {"name": "37T", "lat":40.249640, "long":-111.656133},
  {"name": "38Y", "lat":40.247410, "long":-111.656214},
  {"name": "36Y", "lat":40.246476, "long":-111.656439},
  {"name": "57Y", "lat":40.243447, "long":-111.656475},
  {"name": "56Y", "lat":40.244236, "long":-111.654159},
  {"name": "33Y", "lat":40.244244, "long":-111.651166},
  {"name": "59Y", "lat":40.244270, "long":-111.649239},
  {"name": "30Y", "lat":40.245617, "long":-111.646032},
  {"name": "53Y", "lat":40.248559, "long":-111.642725},
  {"name": "1430 North Y", "lat":40.252956, "long":-111.648774},
  {"name": "24Y", "lat":40.255522, "long":-111.643236},
  {"name": "50Y", "lat":40.257439, "long":-111.645282},
  {"name": "20Y", "lat":40.255023, "long":-111.648192},
  {"name": "19Y", "lat":40.254935, "long":-111.649940},
  {"name": "49Y", "lat":40.256254, "long":-111.652365},
  {"name": "48Y", "lat":40.256031, "long":-111.654566},
  {"name": "45Y", "lat":40.256054, "long":-111.657029},
  {"name": "47Y", "lat":40.258169, "long":-111.652811},
  {"name": "58Y", "lat":40.252131, "long":-111.656460},
  {"name": "37Y", "lat":40.247972, "long":-111.656530}];
var markers = [];
var map;

$(document).ready(function() {

});

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center:new google.maps.LatLng(40.2518435,-111.6493156),
    zoom:15,
  });

  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }

  for (var i = 0; i < lots.length; i++) {
    var marker = new google.maps.Marker({
      position: {lat: lots[i].lat, lng: lots[i].long},
      map: map,
      title: lots[i].name
    });
    markers.push(marker);
  }

  google.maps.event.addListener(map, "click", function (event) {
    var lat = event.latLng.lat();
    var long = event.latLng.lng();
    getDistance(lat, long);
  });
}

function getDistance(lat, long) {
  var dest = new google.maps.LatLng(lat, long);
  var service = new google.maps.DistanceMatrixService();
  var LatLngs = [];
  for (var i = 0; i < lots.length; i++)
    LatLngs.push(new google.maps.LatLng(lots[i].lat, lots[i].long));

  service.getDistanceMatrix({
    origins: LatLngs,
    destinations: [dest],
    travelMode: 'WALKING',
  }, function (res, status) {
    if (status == 'OK') {
      var list = [];
      for (var i = 0; i < res.rows.length; i++) {
        var dist = res.rows[i].elements[0].distance.text;
        var dur = res.rows[i].elements[0].duration.text;
        var element = {"name": lots[i].name, "lat": lots[i].lat,
          "long": lots[i].long, "dur": dur, "dist": dist};
        list.push(element);
      }
      printList(list);
    }
  });
}

function printList(lotArray) {
  lotArray.sort(compareDuration);
  console.log(lotArray);
  var html = "The closest parking lots are: <br><br>";

  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }

  for (var i = 0; i < lotArray.length; i++) {
    var marker = new google.maps.Marker({
      position: {lat: lotArray[i].lat, lng: lotArray[i].long},
      map: map,
      title: lotArray[i].name,
      label: (i + 1).toString()
    });
    markers.push(marker);

    html += i + 1 + ") " + lotArray[i].name + ", " + lotArray[i].dur + ", ";
    html += lotArray[i].dist + "<br>";
  }
  $("#result").html(html);
}

function compareDuration(a, b) {
  var dur1 = parseInt(a.dur.substr(0, a.dur.indexOf(' ')));
  var dur2 = parseInt(b.dur.substr(0, b.dur.indexOf(' ')));
  return dur1 - dur2;
}
