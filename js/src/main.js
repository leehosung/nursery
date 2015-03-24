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
      var table =
        <table className="table table-striped table-bordered table-hover table-condensed">
          <tr><td>이름</td><td>{this.props.nursery.name}</td></tr>
          <tr><td>종류</td><td>{this.props.nursery.type}</td></tr>
          <tr><td>주소</td><td>{this.props.nursery.address}</td></tr>
          <tr><td>우편번호</td><td>{this.props.nursery.zip_code}</td></tr>
          <tr><td>위도</td><td>{this.props.nursery.lat}</td></tr>
          <tr><td>경도</td><td>{this.props.nursery.lng}</td></tr>
        </table>
    } else {
      var table = ""
    }
    return (
      <div className="col-lg-4">
        {table}
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
