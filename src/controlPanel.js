import React, {Component} from "react"

class ControlPanel extends Component {

  constructor () {
    super();

    this.state = {
      markers: [],
      infoWindow: "",
      query: ""
    };
  }

  componentDidMount() {
    this.setState({markers: this.props.markers});
  }


  display = () => {
    var controlPanel = document.getElementsbyClassName('controlPanel');
    if (controlPanel.style.display==='none') {
      controlPanel.style.display = 'block'
    } else {
      controlPanel.style.display = 'none'
    }
  }

  // Filter places
  filter = (event) => {
    var markers = this.props.markers;
    var query = event.target.value.toLowerCase();
    var newPoints = [];

    markers.forEach((location) => {
      if(location.title.toLowerCase().indexOf(query.toLowerCase()) >=0) {
        location.setVisible(true);
        newPoints.push(location);
      } else {
        location.setVisible(false);
      }
    });

  this.setState({markers: newPoints});

}

openInfoWindow (location) {
  this.props.info(location);
  // if (location.getAnimation() !== null) {
  //       location.setAnimation(null);
  //     } else {
  //       location.setAnimation(window.google.maps.Animation.BOUNCE);
  //           }
 //  var flag = this.props.info(location);
 // flag.setAnimation(window.google.maps.Animation.BOUNCE);
}

// toggleBounce(location) {
//     var flag = this.props.info(location);
//     flag.setAnimation(window.google.maps.Animation.BOUNCE);
// }

// Render controlPanel
render() {
  return (
    <div>
      <div className="controlPanel">
        <div className="form" role="form">
        <input type="text"
          className="input"
          placeholder="Filter places"
          aria-labelledby="filter"
          role="search"
          onChange={this.filter}
        />
      </div>
      <ul>
        {this.state.markers && this.state.markers.map((location, index) =>
          <li key={index}>
            <a href="#" onKeyPress={this.props.info.bind(this, location)}
              onClick={this.props.info.bind(this, location)}>
              {location.title}
            </a>
          </li>
        )}
      </ul>
    </div>
  </div>
  );
  }
}

export default ControlPanel;
