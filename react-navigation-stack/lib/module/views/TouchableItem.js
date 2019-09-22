import _extends from"@babel/runtime/helpers/extends";import _objectWithoutProperties from"@babel/runtime/helpers/objectWithoutProperties";import _classCallCheck from"@babel/runtime/helpers/classCallCheck";import _createClass from"@babel/runtime/helpers/createClass";import _possibleConstructorReturn from"@babel/runtime/helpers/possibleConstructorReturn";import _getPrototypeOf from"@babel/runtime/helpers/getPrototypeOf";import _inherits from"@babel/runtime/helpers/inherits";var _jsxFileName="/Users/brentvatne/coding/react-navigation-stack/src/views/TouchableItem.tsx";import*as React from'react';import{Platform,TouchableNativeFeedback,TouchableOpacity,View}from'react-native';import BorderlessButton from'./BorderlessButton';var ANDROID_VERSION_LOLLIPOP=21;var TouchableItem=function(_React$Component){_inherits(TouchableItem,_React$Component);function TouchableItem(){_classCallCheck(this,TouchableItem);return _possibleConstructorReturn(this,_getPrototypeOf(TouchableItem).apply(this,arguments));}_createClass(TouchableItem,[{key:"render",value:function render(){if(Platform.OS==='android'&&Platform.Version>=ANDROID_VERSION_LOLLIPOP){var _this$props=this.props,style=_this$props.style,rest=_objectWithoutProperties(_this$props,["style"]);return React.createElement(TouchableNativeFeedback,_extends({},rest,{style:null,background:TouchableNativeFeedback.Ripple(this.props.pressColor,this.props.borderless),__source:{fileName:_jsxFileName,lineNumber:52}}),React.createElement(View,{style:style,__source:{fileName:_jsxFileName,lineNumber:60}},React.Children.only(this.props.children)));}else if(Platform.OS==='ios'){return React.createElement(BorderlessButton,_extends({hitSlop:{top:10,bottom:10,right:10,left:10},disallowInterruption:true,enabled:!this.props.disabled},this.props,{__source:{fileName:_jsxFileName,lineNumber:65}}),this.props.children);}else{return React.createElement(TouchableOpacity,_extends({},this.props,{__source:{fileName:_jsxFileName,lineNumber:76}}),this.props.children);}}}]);return TouchableItem;}(React.Component);TouchableItem.defaultProps={borderless:false,pressColor:'rgba(0, 0, 0, .32)'};export{TouchableItem as default};
//# sourceMappingURL=TouchableItem.js.map