import _toConsumableArray from"@babel/runtime/helpers/toConsumableArray";import _objectSpread from"@babel/runtime/helpers/objectSpread";import invariant from'../utils/invariant';import getScreenForRouteName from'./getScreenForRouteName';import createConfigGetter from'./createConfigGetter';import*as NavigationActions from'../NavigationActions';import*as SwitchActions from'./SwitchActions';import validateRouteConfigMap from'./validateRouteConfigMap';import{createPathParser}from'./pathUtils';var defaultActionCreators=function defaultActionCreators(){return{};};export default(function(routeConfigs){var config=arguments.length>1&&arguments[1]!==undefined?arguments[1]:{};validateRouteConfigMap(routeConfigs);var order=config.order||Object.keys(routeConfigs);var getCustomActionCreators=config.getCustomActionCreators||defaultActionCreators;var initialRouteParams=config.initialRouteParams;var initialRouteName=config.initialRouteName||order[0];var backBehavior=config.backBehavior||'none';var resetOnBlur=config.hasOwnProperty('resetOnBlur')?config.resetOnBlur:true;var initialRouteIndex=order.indexOf(initialRouteName);if(initialRouteIndex===-1){throw new Error("Invalid initialRouteName '"+initialRouteName+"'."+("Should be one of "+order.map(function(n){return"\""+n+"\"";}).join(', ')));}var childRouters={};order.forEach(function(routeName){childRouters[routeName]=null;var screen=getScreenForRouteName(routeConfigs,routeName);if(screen.router){childRouters[routeName]=screen.router;}});function getParamsForRoute(routeName,params){var routeConfig=routeConfigs[routeName];if(routeConfig&&routeConfig.params){return _objectSpread({},routeConfig.params,params);}else{return params;}}var _createPathParser=createPathParser(childRouters,routeConfigs,config),getPathAndParamsForRoute=_createPathParser.getPathAndParamsForRoute,_getActionForPathAndParams=_createPathParser.getActionForPathAndParams;function resetChildRoute(routeName){var initialParams=routeName===initialRouteName?initialRouteParams:undefined;var params=getParamsForRoute(routeName,initialParams);var childRouter=childRouters[routeName];if(childRouter){var childAction=NavigationActions.init();return _objectSpread({},childRouter.getStateForAction(childAction),{key:routeName,routeName:routeName,params:params});}return{key:routeName,routeName:routeName,params:params};}function getNextState(action,prevState,possibleNextState){function updateNextStateHistory(nextState){if(backBehavior!=='history'){return nextState;}var nextRouteKeyHistory=prevState?prevState.routeKeyHistory:[];if(action.type===NavigationActions.NAVIGATE){nextRouteKeyHistory=_toConsumableArray(nextRouteKeyHistory);var keyToAdd=nextState.routes[nextState.index].key;nextRouteKeyHistory=nextRouteKeyHistory.filter(function(k){return k!==keyToAdd;});nextRouteKeyHistory.push(keyToAdd);}else if(action.type===NavigationActions.BACK){nextRouteKeyHistory=_toConsumableArray(nextRouteKeyHistory);nextRouteKeyHistory.pop();}return _objectSpread({},nextState,{routeKeyHistory:nextRouteKeyHistory});}var nextState=possibleNextState;if(prevState&&prevState.index!==possibleNextState.index&&resetOnBlur){var prevRouteName=prevState.routes[prevState.index].routeName;var nextRoutes=_toConsumableArray(possibleNextState.routes);nextRoutes[prevState.index]=resetChildRoute(prevRouteName);nextState=_objectSpread({},possibleNextState,{routes:nextRoutes});}return updateNextStateHistory(nextState);}function getInitialState(){var routes=order.map(resetChildRoute);var initialState={routes:routes,index:initialRouteIndex,isTransitioning:false};if(backBehavior==='history'){var initialKey=routes[initialRouteIndex].key;initialState['routeKeyHistory']=[initialKey];}return initialState;}return{childRouters:childRouters,getActionCreators:function getActionCreators(route,stateKey){return getCustomActionCreators(route,stateKey);},getStateForAction:function getStateForAction(action,inputState){var prevState=inputState?_objectSpread({},inputState):inputState;var state=inputState||getInitialState();var activeChildIndex=state.index;if(action.type===NavigationActions.INIT){var params=action.params;if(params){state.routes=state.routes.map(function(route){return _objectSpread({},route,{params:_objectSpread({},route.params,params,route.routeName===initialRouteName?initialRouteParams:null)});});}}if(action.type===SwitchActions.JUMP_TO&&(action.key==null||action.key===state.key)){var _params=action.params;var _index=state.routes.findIndex(function(route){return route.routeName===action.routeName;});if(_index===-1){throw new Error("There is no route named '"+action.routeName+"' in the navigator with the key '"+action.key+"'.\n"+("Must be one of: "+state.routes.map(function(route){return"'"+route.routeName+"'";}).join(',')));}return getNextState(action,prevState,_objectSpread({},state,{routes:state.routes.map(function(route,i){return i===_index?_objectSpread({},route,{params:_objectSpread({},route.params,_params)}):route;}),index:_index}));}var activeChildLastState=state.routes[state.index];var activeChildRouter=childRouters[order[state.index]];if(activeChildRouter){var activeChildState=activeChildRouter.getStateForAction(action,activeChildLastState);if(!activeChildState&&inputState){return null;}if(activeChildState&&activeChildState!==activeChildLastState){var _routes=_toConsumableArray(state.routes);_routes[state.index]=activeChildState;return getNextState(action,prevState,_objectSpread({},state,{routes:_routes}));}}var isBackEligible=action.key==null||action.key===activeChildLastState.key;if(action.type===NavigationActions.BACK){if(isBackEligible&&backBehavior==='initialRoute'){activeChildIndex=initialRouteIndex;}else if(isBackEligible&&backBehavior==='order'){activeChildIndex=Math.max(0,activeChildIndex-1);}else if(isBackEligible&&backBehavior==='history'&&state.routeKeyHistory.length>1){var routeKey=state.routeKeyHistory[state.routeKeyHistory.length-2];activeChildIndex=order.indexOf(routeKey);}else{return state;}}var didNavigate=false;if(action.type===NavigationActions.NAVIGATE){didNavigate=!!order.find(function(childId,i){if(childId===action.routeName){activeChildIndex=i;return true;}return false;});if(didNavigate){var childState=state.routes[activeChildIndex];var childRouter=childRouters[action.routeName];var newChildState=childState;if(action.action&&childRouter){var childStateUpdate=childRouter.getStateForAction(action.action,childState);if(childStateUpdate){newChildState=childStateUpdate;}}if(action.params){newChildState=_objectSpread({},newChildState,{params:_objectSpread({},newChildState.params||{},action.params)});}if(newChildState!==childState){var _routes2=_toConsumableArray(state.routes);_routes2[activeChildIndex]=newChildState;var nextState=_objectSpread({},state,{routes:_routes2,index:activeChildIndex});return getNextState(action,prevState,nextState);}else if(newChildState===childState&&state.index===activeChildIndex&&prevState){return null;}}}if(action.type===NavigationActions.SET_PARAMS){var key=action.key;var lastRoute=state.routes.find(function(route){return route.key===key;});if(lastRoute){var _params2=_objectSpread({},lastRoute.params,action.params);var _routes3=_toConsumableArray(state.routes);_routes3[state.routes.indexOf(lastRoute)]=_objectSpread({},lastRoute,{params:_params2});return getNextState(action,prevState,_objectSpread({},state,{routes:_routes3}));}}if(activeChildIndex!==state.index){return getNextState(action,prevState,_objectSpread({},state,{index:activeChildIndex}));}else if(didNavigate&&!inputState){return state;}else if(didNavigate){return _objectSpread({},state);}var index=state.index;var routes=state.routes;order.find(function(childId,i){var childRouter=childRouters[childId];if(i===index){return false;}var childState=routes[i];if(childRouter){childState=childRouter.getStateForAction(action,childState);}if(!childState){index=i;return true;}if(childState!==routes[i]){routes=_toConsumableArray(routes);routes[i]=childState;index=i;return true;}return false;});if(action.preserveFocus){index=state.index;}if(index!==state.index||routes!==state.routes){return getNextState(action,prevState,_objectSpread({},state,{index:index,routes:routes}));}return state;},getComponentForState:function getComponentForState(state){var routeName=state.routes[state.index].routeName;invariant(routeName,"There is no route defined for index "+state.index+". Check that\n        that you passed in a navigation state with a valid tab/screen index.");var childRouter=childRouters[routeName];if(childRouter){return childRouter.getComponentForState(state.routes[state.index]);}return getScreenForRouteName(routeConfigs,routeName);},getComponentForRouteName:function getComponentForRouteName(routeName){return getScreenForRouteName(routeConfigs,routeName);},getPathAndParamsForState:function getPathAndParamsForState(state){var route=state.routes[state.index];return getPathAndParamsForRoute(route);},getActionForPathAndParams:function getActionForPathAndParams(path,params){return _getActionForPathAndParams(path,params);},getScreenOptions:createConfigGetter(routeConfigs,config.defaultNavigationOptions)};});
//# sourceMappingURL=SwitchRouter.js.map