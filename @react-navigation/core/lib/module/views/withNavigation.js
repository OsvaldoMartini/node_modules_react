import _extends from"@babel/runtime/helpers/extends";import _classCallCheck from"@babel/runtime/helpers/classCallCheck";import _createClass from"@babel/runtime/helpers/createClass";import _possibleConstructorReturn from"@babel/runtime/helpers/possibleConstructorReturn";import _getPrototypeOf from"@babel/runtime/helpers/getPrototypeOf";import _inherits from"@babel/runtime/helpers/inherits";var _jsxFileName="/Users/brentvatne/coding/react-navigation-core/src/views/withNavigation.js";import React from'react';import hoistStatics from'hoist-non-react-statics';import invariant from'../utils/invariant';import NavigationContext from'./NavigationContext';export default function withNavigation(Component){var config=arguments.length>1&&arguments[1]!==undefined?arguments[1]:{forwardRef:true};var ComponentWithNavigation=function(_React$Component){_inherits(ComponentWithNavigation,_React$Component);function ComponentWithNavigation(){_classCallCheck(this,ComponentWithNavigation);return _possibleConstructorReturn(this,_getPrototypeOf(ComponentWithNavigation).apply(this,arguments));}_createClass(ComponentWithNavigation,[{key:"render",value:function render(){var _this=this;var navigationProp=this.props.navigation;return React.createElement(NavigationContext.Consumer,{__source:{fileName:_jsxFileName,lineNumber:17}},function(navigationContext){var navigation=navigationProp||navigationContext;invariant(!!navigation,'withNavigation can only be used on a view hierarchy of a navigator. The wrapped component is unable to get access to navigation from props or context.');return React.createElement(Component,_extends({},_this.props,{navigation:navigation,ref:config.forwardRef?_this.props.onRef:undefined,__source:{fileName:_jsxFileName,lineNumber:25}}));});}}]);return ComponentWithNavigation;}(React.Component);ComponentWithNavigation.displayName="withNavigation("+(Component.displayName||Component.name)+")";return hoistStatics(ComponentWithNavigation,Component);}
//# sourceMappingURL=withNavigation.js.map