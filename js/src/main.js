var Navbar = React.createClass({
  render: function() {
    return (
      <nav className="navbar navbar-default navbar-fixed-top">
        <div className="container">
          <div className="navbar-header page-scroll">
            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
              <a className="navbar-brand" href="#page-top">우리 아이를 어디에?</a>
          </div>
          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav navbar-right">
              <li className="hidden">
                <a href="#page-top"></a>
              </li>
              <li className="page-scroll">
                <a href="#search">어린이집 찾기</a>
              </li>
              <li className="page-scroll">
                <a href="#statistics">통계</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    )
  }
});

var Header = React.createClass({
  render: function() {
    return (
      <header>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="intro-text">
                <span className="name">편하게 어린이집 찾기</span>
              </div>
            </div>
          </div>
        </div>
      </header>
    )
  }
});

var Map = React.createClass({
  render: function() {
    var style={width:"1000px", height: "800px"};
    return (
      <div className="row">
        <div className="col-lg-8">
          <div id="map" style={style}></div>
        </div>
      </div>
    )
  },
  componentDidMount: function() {
    var container = document.getElementById('map');
    var options = {
      center: new daum.maps.LatLng(37.5639734199, 127.029808732),
      level: 4
    };
    var map = new daum.maps.Map(container, options);

    // 마커를 표시할 위치와 title 객체 배열입니다
    var positions = [
        {
            title: '구립 홍익어린이집',
            latlng: new daum.maps.LatLng(37.5678739341, 127.025527095)
        },
        {
            title: '구립 도선어린이집',
            latlng: new daum.maps.LatLng(37.5660995656, 127.030610961)
        },
        {
            title: '구립 왕도어린이집',
            latlng: new daum.maps.LatLng(37.5654831494, 127.031126848)
        }
    ]

    // 마커 이미지의 이미지 주소입니다
    var imageSrc = "http://i1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

    for (var i = 0; i < positions.length; i ++) {

        // 마커 이미지의 이미지 크기 입니다
        var imageSize = new daum.maps.Size(24, 35);

        // 마커 이미지를 생성합니다
        var markerImage = new daum.maps.MarkerImage(imageSrc, imageSize);

        // 마커를 생성합니다
        var marker = new daum.maps.Marker({
            map: map, // 마커를 표시할 지도
            position: positions[i].latlng, // 마커를 표시할 위치
            title : positions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
            image : markerImage // 마커 이미지
        });
      }
    }
});

var Content = React.createClass({
  render: function() {
    return (
      <div id="content">
        <Navbar />
        <Map />
      </div>
    )
  }
});

React.render(<Content />, document.getElementById('content'));
