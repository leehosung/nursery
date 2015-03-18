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
    var style={width:"500px", height: "400px"};
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
      center: new daum.maps.LatLng(33.450701, 126.570667),
      level: 3
    };
    var map = new daum.maps.Map(container, options);
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
