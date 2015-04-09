var Sidebar = React.createClass({
  render: function() {
    return (
      <div id="sidebar-wrapper">
        <ul className="sidebar-nav">
          <li className="sidebar-brand">
              <a href="#">어린이집 찾기</a>
          </li>
          <li>
              <a href="#">필터</a>
          </li>
        </ul>
      </div>
    )
  }
});


var Map = React.createClass({

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
      <div className="col-lg-8">
        <div id="map" style={style}></div>
      </div>
    )
  }
});

var NurseryDetail = React.createClass({
  getDefaultProps: function() {
    return {
      nursery: null
    }
  },
  render: function() {
    if (this.props.nursery !== null) {
      var info_table =
        <table className="table table-striped table-bordered table-hover table-condensed">
          <tr><td>시설명</td><td>{this.props.nursery.facility_name}</td></tr>
          <tr><td>시설유형</td><td>{this.props.nursery.cr_type}</td></tr>
          <tr><td>시설특성</td><td>{this.props.nursery.cr_spec}</td></tr>
          <tr><td>정원</td><td>{this.props.nursery.fixed_number}</td></tr>
          <tr><td>현원</td><td>{this.props.nursery.present_number}</td></tr>
          <tr><td>시설장명</td><td>{this.props.nursery.president_name}</td></tr>
          <tr><td>개원일</td><td>{this.props.nursery.open_date}</td></tr>
          <tr><td>차량운행</td><td>{this.props.nursery.vehicle}</td></tr>
          <tr><td>평가인증유무</td><td>{this.props.nursery.certification}</td></tr>
          <tr><td>시설전화</td><td>{this.props.nursery.telephone}</td></tr>
          <tr><td>주소</td><td>{this.props.nursery.address}</td></tr>
          <tr><td>정부지원시설</td><td>{this.props.nursery.gov_support}</td></tr>
          <tr><td>상해보험가입</td><td>{this.props.nursery.accident_insurance}</td></tr>
          <tr><td>화재보험가입</td><td>{this.props.nursery.fire_insurance}</td></tr>
          <tr><td>배상보험가입</td><td>{this.props.nursery.compensation_insurance}</td></tr>
          <tr><td>위도</td><td>{this.props.nursery.lat}</td></tr>
          <tr><td>경도</td><td>{this.props.nursery.lng}</td></tr>
          <tr><td>상세보기</td><td><a href={"http://info.childcare.go.kr/info/pnis/search/preview/SummaryInfoSlPu.jsp?flag=YJ&STCODE_POP=" + this.props.nursery.facility_id}>링크</a></td></tr>
        </table>
    } else {
      var info_table = ""
    }
    return (
      <div className="col-lg-4">
        {info_table}
      </div>
    )
  }
});

var MenuToggle = React.createClass({

  render: function() {
    return(
      <a onClick={this.toggle} className="btn btn-default" id="menu-toggle">Toggle Menu</a>
    )
  },

  toggle: function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
  }
});

var Content = React.createClass({
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
      <div id="wrapper">
        <Sidebar />
        <div id="page-content-wrapper">
          <div className="row">
            <Map onClickMarker={this.onClickMarker} nurseries={this.state.nurseries} />
            <MenuToggle />
            <NurseryDetail nursery={this.state.selected_nursery} />
          </div>
        </div>
      </div>
    )
  }
});

React.render(<Content url="./data/nursery.json" />, document.getElementById('content'));
