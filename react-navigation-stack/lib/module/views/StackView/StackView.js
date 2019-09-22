import _extends from"@babel/runtime/helpers/extends";import _objectSpread from"@babel/runtime/helpers/objectSpread";import _classCallCheck from"@babel/runtime/helpers/classCallCheck";import _createClass from"@babel/runtime/helpers/createClass";import _possibleConstructorReturn from"@babel/runtime/helpers/possibleConstructorReturn";import _getPrototypeOf from"@babel/runtime/helpers/getPrototypeOf";import _inherits from"@babel/runtime/helpers/inherits";var _jsxFileName="/Users/brentvatne/coding/react-navigation-stack/src/views/StackView/StackView.tsx";import*as React from'react';import{StackActions}from'@react-navigation/core';import StackViewLayout from'./StackViewLayout';import Transitioner from'../Transitioner';import TransitionConfigs from'./StackViewTransitionConfigs';var USE_NATIVE_DRIVER=true;var DefaultNavigationConfig={mode:'card',cardShadowEnabled:true,cardOverlayEnabled:false};var StackView=function(_React$Component){_inherits(StackView,_React$Component);function StackView(){var _getPrototypeOf2;var _this;_classCallCheck(this,StackView);for(var _len=arguments.length,args=new Array(_len),_key=0;_key<_len;_key++){args[_key]=arguments[_key];}_this=_possibleConstructorReturn(this,(_getPrototypeOf2=_getPrototypeOf(StackView)).call.apply(_getPrototypeOf2,[this].concat(args)));_this.configureTransition=function(transitionProps,prevTransitionProps){return _objectSpread({useNativeDriver:USE_NATIVE_DRIVER},TransitionConfigs.getTransitionConfig(_this.props.navigationConfig.transitionConfig,transitionProps,prevTransitionProps,_this.props.navigationConfig.mode==='modal').transitionSpec);};_this.getShadowEnabled=function(){var navigationConfig=_this.props.navigationConfig;return navigationConfig&&navigationConfig.hasOwnProperty('cardShadowEnabled')?navigationConfig.cardShadowEnabled:DefaultNavigationConfig.cardShadowEnabled;};_this.getCardOverlayEnabled=function(){var navigationConfig=_this.props.navigationConfig;return navigationConfig&&navigationConfig.hasOwnProperty('cardOverlayEnabled')?navigationConfig.cardOverlayEnabled:DefaultNavigationConfig.cardOverlayEnabled;};_this.renderStackviewLayout=function(transitionProps,lastTransitionProps){var _this$props=_this.props,screenProps=_this$props.screenProps,navigationConfig=_this$props.navigationConfig;return React.createElement(StackViewLayout,_extends({},navigationConfig,{shadowEnabled:_this.getShadowEnabled(),cardOverlayEnabled:_this.getCardOverlayEnabled(),onGestureBegin:_this.props.onGestureBegin,onGestureCanceled:_this.props.onGestureCanceled,onGestureEnd:_this.props.onGestureEnd,screenProps:screenProps,transitionProps:transitionProps,lastTransitionProps:lastTransitionProps,__source:{fileName:_jsxFileName,lineNumber:103}}));};_this.handleTransitionEnd=function(transition,lastTransition){var _this$props2=_this.props,navigationConfig=_this$props2.navigationConfig,navigation=_this$props2.navigation,_this$props2$onTransi=_this$props2.onTransitionEnd,onTransitionEnd=_this$props2$onTransi===void 0?navigationConfig.onTransitionEnd:_this$props2$onTransi;var transitionDestKey=transition.scene.route.key;var isCurrentKey=navigation.state.routes[navigation.state.index].key===transitionDestKey;if(transition.navigation.state.isTransitioning&&isCurrentKey){navigation.dispatch(StackActions.completeTransition({key:navigation.state.key,toChildKey:transitionDestKey}));}onTransitionEnd&&onTransitionEnd(transition,lastTransition);};return _this;}_createClass(StackView,[{key:"render",value:function render(){return React.createElement(Transitioner,{render:this.renderStackviewLayout,configureTransition:this.configureTransition,screenProps:this.props.screenProps,navigation:this.props.navigation,descriptors:this.props.descriptors,onTransitionStart:this.props.onTransitionStart||this.props.navigationConfig.onTransitionStart,onTransitionEnd:this.handleTransitionEnd,__source:{fileName:_jsxFileName,lineNumber:40}});}},{key:"componentDidMount",value:function componentDidMount(){var navigation=this.props.navigation;if(navigation.state.isTransitioning){navigation.dispatch(StackActions.completeTransition({key:navigation.state.key}));}}}]);return StackView;}(React.Component);export default StackView;
//# sourceMappingURL=StackView.js.map