var Navbar = React.createClass({displayName: "Navbar",
  render: function() {
    return (
      React.createElement("nav", {className: "navbar navbar-default navbar-fixed-top"}, 
        React.createElement("div", {className: "container"}, 
          React.createElement("div", {className: "navbar-header page-scroll"}, 
            React.createElement("button", {type: "button", className: "navbar-toggle", "data-toggle": "collapse", "data-target": "#bs-example-navbar-collapse-1"}, 
              React.createElement("span", {className: "sr-only"}, "Toggle navigation"), 
              React.createElement("span", {className: "icon-bar"}), 
              React.createElement("span", {className: "icon-bar"}), 
              React.createElement("span", {className: "icon-bar"})
            ), 
              React.createElement("a", {className: "navbar-brand", href: "#page-top"}, "우리 아이를 어디에?")
          ), 
          React.createElement("div", {className: "collapse navbar-collapse", id: "bs-example-navbar-collapse-1"}, 
            React.createElement("ul", {className: "nav navbar-nav navbar-right"}, 
              React.createElement("li", {className: "hidden"}, 
                React.createElement("a", {href: "#page-top"})
              ), 
              React.createElement("li", {className: "page-scroll"}, 
                React.createElement("a", {href: "#search"}, "어린이집 찾기")
              ), 
              React.createElement("li", {className: "page-scroll"}, 
                React.createElement("a", {href: "#statistics"}, "통계")
              )
            )
          )
        )
      )
    )
  }
});

var Header = React.createClass({displayName: "Header",
  render: function() {
    return (
      React.createElement("header", null, 
        React.createElement("div", {className: "container"}, 
          React.createElement("div", {className: "row"}, 
            React.createElement("div", {className: "col-lg-12"}, 
              React.createElement("div", {className: "intro-text"}, 
                React.createElement("span", {className: "name"}, "편하게 어린이집 찾기")
              )
            )
          )
        )
      )
    )
  }
});

var Map = React.createClass({displayName: "Map",
  render: function() {
    var style={width:"1000px", height: "800px"};
    return (
      React.createElement("div", {className: "row"}, 
        React.createElement("div", {className: "col-lg-8"}, 
          React.createElement("div", {id: "map", style: style})
        )
      )
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

var Content = React.createClass({displayName: "Content",
  render: function() {
    return (
      React.createElement("div", {id: "content"}, 
        React.createElement(Navbar, null), 
        React.createElement(Map, null)
      )
    )
  }
});

React.render(React.createElement(Content, null), document.getElementById('content'));
