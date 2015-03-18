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
    var style={width:"500px", height: "400px"};
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
      center: new daum.maps.LatLng(33.450701, 126.570667),
      level: 3
    };
    var map = new daum.maps.Map(container, options);
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
