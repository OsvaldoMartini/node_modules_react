Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var getActiveChildNavigationOptions=function getActiveChildNavigationOptions(navigation,screenProps){var state=navigation.state,router=navigation.router,getChildNavigation=navigation.getChildNavigation;var activeRoute=state.routes[state.index];var activeNavigation=getChildNavigation(activeRoute.key);var options=router.getScreenOptions(activeNavigation,screenProps);return options;};var _default=getActiveChildNavigationOptions;exports.default=_default;
//# sourceMappingURL=getActiveChildNavigationOptions.js.map