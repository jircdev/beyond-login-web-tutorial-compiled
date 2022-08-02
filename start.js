define(["@beyond-js/kernel/bundle", "@beyond-js/kernel/transversals", "@beyond-js/widgets/render"], function (dependency_0, dependency_1, dependency_2) {
  "use strict";

  const {
    externals
  } = dependency_0;
  externals.register(new Map([["@beyond-js/kernel/bundle", dependency_0], ["@beyond-js/kernel/transversals", dependency_1], ["@beyond-js/widgets/render", dependency_2]]));

  const {
    Transversal
  } = require('@beyond-js/kernel/transversals');

  const transversal = new Transversal('start', '');
  /*************
  BUNDLE: WIDGET
  *************/

  const {
    widgets
  } = require('@beyond-js/widgets/render');

  widgets.register([{
    "name": "home-page",
    "id": "@beyond/web-tutorial/home",
    "is": "page",
    "route": "/"
  }, {
    "name": "main-layout",
    "id": "@beyond/web-tutorial/layout/main",
    "is": "layout"
  }, {
    "name": "welcome-page",
    "id": "@beyond/web-tutorial/welcome",
    "is": "page",
    "route": "/welcome"
  }]);
  const bundles = new Map();
  transversal.initialise(bundles);
});