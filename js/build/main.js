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


var Search = React.createClass({displayName: "Search",

   searchPlaces: function(e) {
    e.preventDefault();
    var keyword = React.findDOMNode(this.refs.keyword).value.trim();

    if (!keyword.replace(/^\s+|\s+$/g, '')) {
      alert('키워드를 입력해주세요!');
      return false;
    }

    // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
    this.ps.keywordSearch(keyword, this.placesSearchCB);
  },

  placesSearchCB: function(status, data, pagination) {
    if (status === daum.maps.services.Status.OK) {
      var places = data.places,
          bounds = new daum.maps.LatLngBounds();

      // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
      // LatLngBounds 객체에 좌표를 추가합니다
      var placePosition = new daum.maps.LatLng(places[0].latitude, places[0].longitude);
      bounds.extend(placePosition);
      this.props.onBoundsChanged(bounds);
    } else if (status === daum.maps.services.Status.ZERO_RESULT) {
      alert('검색 결과가 존재하지 않습니다.');
      return;
    } else if (status === daum.maps.services.Status.ERROR) {
      alert('검색 결과 중 오류가 발생했습니다.');
      return;
    }
  },

  componentDidMount: function() {
    // 장소 검색 객체를 생성합니다
    this.ps = new daum.maps.services.Places();
  },

  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("form", {onSubmit: this.searchPlaces}, 
          React.createElement("input", {type: "text", placeholder: "강남역", ref: "keyword", size: "15"}), 
          React.createElement("input", {type: "submit"})
        )
      )
    )
  }
});

var Map = React.createClass({displayName: "Map",

  inMap: function(lat, lng) {
    var bounds = this.map.getBounds();
    var swLatLng = bounds.getSouthWest();
    var neLatLng = bounds.getNorthEast();
    if(swLatLng.eb > lat || neLatLng.eb < lat){
      return false;
    }
    if(swLatLng.cb > lng || neLatLng.cb < lng){
      return false;
    }
    return true;
  },

  // 현재 지도 영역에 포함되지 않는 마커들을 지도에서 제거하고, 포함되는 마커들만 표시합니다.
  refreshMarker: function() {
    this.addMarker(self.props.nurseries);
    var map = this.map;
    self = this
    $.each(self.markers.values(), function(i, marker) {
      var markerPosition = marker.getPosition();
      if(self.inMap(markerPosition.getLat(), markerPosition.getLng())){
        marker.setMap(map);
      } else {
        marker.setMap(null);
      }
    });
  },

  // 현재 영역을 기준으로 지금 까지 추가되지 않은 어린이집 마커를 추가합니다.
  addMarker: function(nurseries) {
    self = this;
    $.each(nurseries, function(idx, nursery){
      if (self.markers.hasItem(nursery.facility_id)){
        return true;
      }
      if (!self.inMap(nursery.lat, nursery.lng)) {
        return true;
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
      daum.maps.event.addListener(marker, 'click', function () {
        self.props.onClickMarker(nursery);
      });
      marker.setMap(self.map);
      self.markers.setItem(nursery.facility_id, marker);
    });
  },

  componentWillReceiveProps: function(nextProps) {
    this.addMarker(nextProps.nurseries);
  },

  componentDidMount: function() {
    var container = document.getElementById('map');
    var options = {
      center: new daum.maps.LatLng(37.5639734199, 127.029808732),
      level: 4
    };
    var map = new daum.maps.Map(container, options);

    var zoomControl = new daum.maps.ZoomControl();
    map.addControl(zoomControl, daum.maps.ControlPosition.RIGHT);

    daum.maps.event.addListener(map, 'zoom_changed', this.refreshMarker);
    daum.maps.event.addListener(map, 'dragend', this.refreshMarker);

    this.map = map;
    this.markers = new HashTable();
  },

  render: function() {
    var style={width:"100%", height: "800px"};

    if(this.props.bounds){
      this.map.setBounds(this.props.bounds);
      this.map.setLevel(4);
    }

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
      nurseries: [],
      bounds: null
    };
  },
  onClickMarker: function(nursery) {
    this.setState({selected_nursery: nursery});
  },
  onBoundsChanged: function(bounds) {
    this.setState({bounds: bounds});
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
            React.createElement(Map, {onClickMarker: this.onClickMarker, nurseries: this.state.nurseries, bounds: this.state.bounds}), 
            React.createElement(MenuToggle, null), 
            React.createElement(Search, {onBoundsChanged: this.onBoundsChanged}), 
            React.createElement(NurseryDetail, {nursery: this.state.selected_nursery})
          )
        )
      )
    )
  }
});

React.render(React.createElement(Content, {url: "./data/nursery.json"}), document.getElementById('content'));
