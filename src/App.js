import React, { Component } from "react"
import "./App.css"
import "./style.css"
import ControlPanel from "./controlPanel"

class App extends Component {
  constructor(props) {
         super(props);

         this.state = {
             map: "",
             places: require("./places.json"),
             markers: [],
             infoWindow: ""
        };

        this.initMap = this.initMap.bind(this);
        this.createMarkers = this.createMarkers.bind(this);
        this.openInfoWindow = this.openInfoWindow.bind(this);
    }

    componentDidMount() {
        window.initMap = this.initMap;
        createMap("https://maps.googleapis.com/maps/api/js?key=AIzaSyDxd8HjqrKz7zKany-KM5TQihlHyiECXbI&callback=initMap");
      }

    // Create a map
    initMap () {
      var map;
      map = new window.google.maps.Map(document.getElementById("map"), {
        center: {lat: 52.186940, lng: 21.019320},
        zoom: 13
      });

      var moreInfo = new window.google.maps.InfoWindow({});
      this.setState({map: map, infoWindow: moreInfo});
      this.createMarkers(map);
    }

    // Add markers on the map
    createMarkers (map) {
      let self = this;
      this.state.places.forEach(place=>{
      var mark = new window.google.maps.Marker({
        position: new window.google.maps.LatLng(
          place.latitude,
          place.longitude
        ),
        map: map,
        animation: window.google.maps.Animation.DROP,
        title: `${place.name} - ${place.type}`
      });

      mark.addListener('click', function() {
               self.openInfoWindow(mark);
           });

        let marker = this.state.markers;
        marker.push(mark);
        this.setState({markers: marker});
        }
      )
    }

    // Open InfoWindow
    openInfoWindow(marker='') {
      // Login requirements for foursquare
      const clientId = "TR3D1HXN0WMNSYWE0OOTEYB1X0JR05Q2SCPL50NDY3NVIXNX";
      const clientSecret = "4X0ZNEYYOCDMK5RWZMWAHZDJAAV4NOY4AZMJLL5B5JUH4FVF";
      const url = "https://api.foursquare.com/v2/venues/search?client_id=" +
          clientId +
          "&client_secret=" +
          clientSecret +
          "&v=20180810&ll=" +
         marker.getPosition().lat() +
         "," +
         marker.getPosition().lng() +
         "&limit=1";

      if (this.state.infoWindow.marker !== marker) {
           this.setState((state) =>
              state.infoWindow.marker = marker
        )}

         this.state.infoWindow.open(this.state.map, marker);
         marker.setAnimation(window.google.maps.Animation.BOUNCE);
         // Bounce 4 times and stop
         setTimeout(() => {
          marker.setAnimation(null);
        }, 2500);

         this.state.infoWindow.addListener('closeClick', function () {
             this.state.infoWindow.setMarker(null);
           });

         this.getInfo(url);
     }

// Get info for infoWindow
getInfo (url) {
  let flag = this.state.infoWindow;
  let position;
  fetch(url)
    // Manage errors
    .then(function(response) {
      if(response.status !== 200) {
        var error = "No data available";
        this.state.InfoWindow.setContent(response);
      }

      // Get data
      response.json().then(function(data) {
        var position = data.response.venues[0];
        var name = `<h3>${position.name}</h3>`;
        var address = "";
        if(position.location.formattedAddress) {
          address = `<p>${position.location.formattedAddress[0]}</p>`};
        var contact = "";
        if (position.phone) {
          contact = `<p>${position.phone}</p>`};
        var description = "";
        if (position.rating) {
          description = `<p>${position.rating}</p>`
        };
        var info = "<div id='marker'>" +
                          "<h2>" + flag.marker.title + "</h2>" +
                          name + address + contact + description
                      "</div>";
        flag.setContent (info);
      }
    );
    }
  )
      .catch(function(error) {
        flag.setContent("Sorry, there is a problem with loading data")
      }
    );
  }

  render() {
  return (
    <div>
     <ControlPanel
        infoWindow={this.state.infoWindow}
        info={this.openInfoWindow}
        markers={this.state.markers}>
      </ControlPanel>
      <div id="map" role="application"/>
    </div>
    )
  }
}

// Load the google maps
function createMap(url) {
    let tag = window.document.getElementsByTagName("script")[0];
    let script = window.document.createElement("script");
    script.src = url;
    script.async = true;
    script.onerror = function () {
        document.write("Ups! There is a problem with loading Google Maps");
    };
    tag.parentNode.insertBefore(script, tag);
}

export default App;
