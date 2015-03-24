var Sidebar = React.createClass({displayName: "Sidebar",
  render: function() {
    return (
      React.createElement("div", {id: "sidebar-wrapper"}, 
        React.createElement("ul", {className: "sidebar-nav"}, 
          React.createElement("li", {className: "sidebar-brand"}, 
              React.createElement("a", {href: "#"}, "어린이집 찾기")
          ), 
          React.createElement("li", null, 
              React.createElement("a", {href: "#"}, "필터")
          )
        )
      )
    )
  }
});


var Map = React.createClass({displayName: "Map",

  drawMarker: function(map) {

    // 마커 이미지의 이미지 주소입니다
    var imageSrc = "http://i1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

    // 마커 이미지의 이미지 크기 입니다
    var imageSize = new daum.maps.Size(24, 35);

    // 마커 이미지를 생성합니다
    var markerImage = new daum.maps.MarkerImage(imageSrc, imageSize);

    // 지도의 현재 영역을 얻어옵니다
    var bounds = map.getBounds();

    // 영역의 남서쪽 좌표를 얻어옵니다
    var swLatLng = bounds.getSouthWest();

    // 영역의 북동쪽 좌표를 얻어옵니다
    var neLatLng = bounds.getNorthEast();

    var onClickMarker = this.props.onClickMarker;
    $.each(this.props.nurseries, function(idx, nursery){
        var marker = new daum.maps.Marker({
          map: map, // 마커를 표시할 지도
          position: new daum.maps.LatLng(nursery.lat, nursery.lng),
          clickable: true,
          title : nursery.name, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
          image : markerImage // 마커 이미지
        });

        daum.maps.event.addListener(marker, 'click', function(){
          onClickMarker(nursery)
        });
    });
  },

  componentDidUpdate: function() {
    var map = this.state.map;
    this.drawMarker(map);
  },

  componentDidMount: function() {
    var container = document.getElementById('map');
    var options = {
      center: new daum.maps.LatLng(37.5639734199, 127.029808732),
      level: 4
    };
    var map = new daum.maps.Map(container, options);
    this.setState({map:map});
  },

  render: function() {
    var style={width:"100%", height: "800px"};
    return (
      React.createElement("div", {className: "col-lg-8"}, 
        React.createElement("div", {id: "map", style: style})
      )
    )
  }
});

var NurseryDetail = React.createClass({displayName: "NurseryDetail",
  getDefaultProps: function() {
    return {
      nursery: null
    }
  },
  render: function() {
    if (this.props.nursery !== null) {
      var table =
        React.createElement("table", {className: "table table-striped table-bordered table-hover table-condensed"}, 
          React.createElement("tr", null, React.createElement("td", null, "이름"), React.createElement("td", null, this.props.nursery.name)), 
          React.createElement("tr", null, React.createElement("td", null, "종류"), React.createElement("td", null, this.props.nursery.type)), 
          React.createElement("tr", null, React.createElement("td", null, "주소"), React.createElement("td", null, this.props.nursery.address)), 
          React.createElement("tr", null, React.createElement("td", null, "우편번호"), React.createElement("td", null, this.props.nursery.zip_code)), 
          React.createElement("tr", null, React.createElement("td", null, "위도"), React.createElement("td", null, this.props.nursery.lat)), 
          React.createElement("tr", null, React.createElement("td", null, "경도"), React.createElement("td", null, this.props.nursery.lng))
        )
    } else {
      var table = ""
    }
    return (
      React.createElement("div", {className: "col-lg-4"}, 
        table
      )
    )
  }
});

var MenuToggle = React.createClass({displayName: "MenuToggle",

  render: function() {
    return(
      React.createElement("a", {onClick: this.toggle, className: "btn btn-default", id: "menu-toggle"}, "Toggle Menu")
    )
  },

  toggle: function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
  }
});

var Content = React.createClass({displayName: "Content",
  getInitialState: function() {
    return {
      nurseries: []
    };
  },
  onClickMarker: function(nursery) {
    this.setState({selected_nursery: nursery});
  },
  loadNurseriesFromServer: function() {
    $.ajax({
        url: this.props.url,
        dataType: 'json',
        success: function(data) {
            this.setState({nurseries:data.nursery});
        }.bind(this),
        error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
        }.bind(this)
    });
  },
  componentDidMount: function() {
    this.loadNurseriesFromServer();
  },
  render: function() {
    return (
      React.createElement("div", {id: "wrapper"}, 
        React.createElement(Sidebar, null), 
        React.createElement("div", {id: "page-content-wrapper"}, 
          React.createElement("div", {className: "row"}, 
            React.createElement(Map, {onClickMarker: this.onClickMarker, nurseries: this.state.nurseries}), 
            React.createElement(MenuToggle, null), 
            React.createElement(NurseryDetail, {nursery: this.state.selected_nursery})
          )
        )
      )
    )
  }
});

React.render(React.createElement(Content, {url: "./data/nursery.json"}), document.getElementById('content'));
