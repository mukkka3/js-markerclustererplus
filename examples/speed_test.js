/**
 * @fileoverview This demo is used for MarkerClusterer. It will show 100 markers
 * using MarkerClusterer and count the time to show the difference between using
 * MarkerClusterer and without MarkerClusterer.
 * @author Luke Mahe (v2 author: Xiaoxi Wu)
 */

function $(element) {
  return document.getElementById(element);
}

let speedTest = {};

speedTest.pics = null;
speedTest.map = null;
speedTest.markerClusterer = null;
speedTest.markers = [];
speedTest.infoWindow = null;

speedTest.init = function () {
  let latlng = new google.maps.LatLng(39.91, 116.38);
  let options = {
    zoom: 2,
    center: latlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  };

  speedTest.map = new google.maps.Map($("map"), options);

  let useGmm = document.getElementById("usegmm");
  google.maps.event.addDomListener(useGmm, "click", speedTest.change);

  let numMarkers = document.getElementById("nummarkers");
  google.maps.event.addDomListener(numMarkers, "change", speedTest.change);

  speedTest.infoWindow = new google.maps.InfoWindow();

  speedTest.showMarkers();
};

speedTest.showMarkers = function () {
  speedTest.markers = [];

  let type = 1;
  if ($("usegmm").checked) {
    type = 0;
  }

  if (speedTest.markerClusterer) {
    speedTest.markerClusterer.clearMarkers();
  }

  let panel = $("markerlist");
  panel.innerHTML = "";
  let numMarkers = $("nummarkers").value;

  for (let i = 0; i < numMarkers; i++) {
    let titleText = speedTest.pics[i].photo_title;
    if (titleText == "") {
      titleText = "No title";
    }

    let item = document.createElement("DIV");
    let title = document.createElement("A");
    title.href = "#";
    title.className = "title";
    title.innerHTML = titleText;

    item.appendChild(title);
    panel.appendChild(item);

    let latLng = new google.maps.LatLng(
      speedTest.pics[i].latitude,
      speedTest.pics[i].longitude
    );

    let imageUrl =
      "http://chart.apis.google.com/chart?cht=mm&chs=24x32&chco=" +
      "FFFFFF,008CFF,000000&ext=.png";
    let markerImage = new google.maps.MarkerImage(
      imageUrl,
      new google.maps.Size(24, 32)
    );

    let marker = new google.maps.Marker({
      position: latLng,
      icon: markerImage,
    });

    let fn = speedTest.markerClickFunction(speedTest.pics[i], latLng);
    google.maps.event.addListener(marker, "click", fn);
    google.maps.event.addDomListener(title, "click", fn);
    speedTest.markers.push(marker);
  }

  window.setTimeout(speedTest.time, 0);
};

speedTest.markerClickFunction = function (pic, latlng) {
  return function (e) {
    e.cancelBubble = true;
    e.returnValue = false;
    if (e.stopPropagation) {
      e.stopPropagation();
      e.preventDefault();
    }
    let title = pic.photo_title;
    let url = pic.photo_url;
    let fileurl = pic.photo_file_url;

    let infoHtml =
      '<div class="info"><h3>' +
      title +
      '</h3><div class="info-body">' +
      '<a href="' +
      url +
      '" target="_blank"><img src="' +
      fileurl +
      '" class="info-img"/></a></div>' +
      '<a href="http://www.panoramio.com/" target="_blank">' +
      '<img src="http://maps.google.com/intl/en_ALL/mapfiles/' +
      'iw_panoramio.png"/></a><br/>' +
      '<a href="' +
      pic.owner_url +
      '" target="_blank">' +
      pic.owner_name +
      "</a></div></div>";

    speedTest.infoWindow.setContent(infoHtml);
    speedTest.infoWindow.setPosition(latlng);
    speedTest.infoWindow.open(speedTest.map);
  };
};

speedTest.clear = function () {
  $("timetaken").innerHTML = "cleaning...";
  for (let i = 0, marker; (marker = speedTest.markers[i]); i++) {
    marker.setMap(null);
  }
};

speedTest.change = function () {
  speedTest.clear();
  speedTest.showMarkers();
};

speedTest.time = function () {
  $("timetaken").innerHTML = "timing...";
  let start = new Date();
  if ($("usegmm").checked) {
    // eslint-disable-next-line no-undef
    speedTest.markerClusterer = new MarkerClusterer(
      speedTest.map,
      speedTest.markers
    );
  } else {
    for (let i = 0, marker; (marker = speedTest.markers[i]); i++) {
      marker.setMap(speedTest.map);
    }
  }

  let end = new Date();
  $("timetaken").innerHTML = end - start;
};
