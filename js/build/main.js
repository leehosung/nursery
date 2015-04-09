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

  addMarker: function(nursery) {

    var bounds = this.map.getBounds();
    var swLatLng = bounds.getSouthWest();
    var neLatLng = bounds.getNorthEast();

    if(swLatLng.eb > nursery.lat || neLatLng.eb < nursery.lat){
      return
    }
    if(swLatLng.cb > nursery.lng || neLatLng.cb < nursery.lng){
      return
    }

    var imageSrc = "http://i1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";
    var imageSize = new daum.maps.Size(24, 35);
    var markerImage = new daum.maps.MarkerImage(imageSrc, imageSize);
    var marker = new daum.maps.Marker({
      position: new daum.maps.LatLng(nursery.lat, nursery.lng),
      clickable: true,
      title : nursery.name, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
      image : markerImage // 마커 이미지
    });
    self = this;
    daum.maps.event.addListener(marker, 'click', function () {
      self.props.onClickMarker(nursery);
    });
    marker.setMap(this.map);
    this.markers.push(marker);
  },

  componentWillReceiveProps: function(nextProps) {
    self = this;
    $.each(nextProps.nurseries, function(idx, nursery){
      self.addMarker(nursery)
    });
  },

  componentDidMount: function() {
    var container = document.getElementById('map');
    var options = {
      center: new daum.maps.LatLng(37.5639734199, 127.029808732),
      level: 4
    };
    this.map = new daum.maps.Map(container, options);
    this.markers = [];
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
      var info_table =
        React.createElement("table", {className: "table table-striped table-bordered table-hover table-condensed"}, 
          React.createElement("tr", null, React.createElement("td", null, "시설명"), React.createElement("td", null, this.props.nursery.facility_name)), 
          React.createElement("tr", null, React.createElement("td", null, "시설유형"), React.createElement("td", null, this.props.nursery.cr_type)), 
          React.createElement("tr", null, React.createElement("td", null, "시설특성"), React.createElement("td", null, this.props.nursery.cr_spec)), 
          React.createElement("tr", null, React.createElement("td", null, "정원"), React.createElement("td", null, this.props.nursery.fixed_number)), 
          React.createElement("tr", null, React.createElement("td", null, "현원"), React.createElement("td", null, this.props.nursery.present_number)), 
          React.createElement("tr", null, React.createElement("td", null, "시설장명"), React.createElement("td", null, this.props.nursery.president_name)), 
          React.createElement("tr", null, React.createElement("td", null, "개원일"), React.createElement("td", null, this.props.nursery.open_date)), 
          React.createElement("tr", null, React.createElement("td", null, "차량운행"), React.createElement("td", null, this.props.nursery.vehicle)), 
          React.createElement("tr", null, React.createElement("td", null, "평가인증유무"), React.createElement("td", null, this.props.nursery.certification)), 
          React.createElement("tr", null, React.createElement("td", null, "시설전화"), React.createElement("td", null, this.props.nursery.telephone)), 
          React.createElement("tr", null, React.createElement("td", null, "주소"), React.createElement("td", null, this.props.nursery.address)), 
          React.createElement("tr", null, React.createElement("td", null, "정부지원시설"), React.createElement("td", null, this.props.nursery.gov_support)), 
          React.createElement("tr", null, React.createElement("td", null, "상해보험가입"), React.createElement("td", null, this.props.nursery.accident_insurance)), 
          React.createElement("tr", null, React.createElement("td", null, "화재보험가입"), React.createElement("td", null, this.props.nursery.fire_insurance)), 
          React.createElement("tr", null, React.createElement("td", null, "배상보험가입"), React.createElement("td", null, this.props.nursery.compensation_insurance)), 
          React.createElement("tr", null, React.createElement("td", null, "위도"), React.createElement("td", null, this.props.nursery.lat)), 
          React.createElement("tr", null, React.createElement("td", null, "경도"), React.createElement("td", null, this.props.nursery.lng)), 
          React.createElement("tr", null, React.createElement("td", null, "상세보기"), React.createElement("td", null, React.createElement("a", {href: "http://info.childcare.go.kr/info/pnis/search/preview/SummaryInfoSlPu.jsp?flag=YJ&STCODE_POP=" + this.props.nursery.facility_id}, "링크")))
        )
    } else {
      var info_table = ""
    }
    return (
      React.createElement("div", {className: "col-lg-4"}, 
        info_table
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
            this.setState({nurseries:data});
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
