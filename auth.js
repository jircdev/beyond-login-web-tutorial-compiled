define(["exports", "@beyond-js/kernel/bundle", "@beyond-js/backend/client"], function (_exports, dependency_0, dependency_1) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.hmr = _exports.Auth = void 0;
  const {
    Bundle: __Bundle,
    externals
  } = dependency_0;

  const __pkg = new __Bundle({
    "module": "@beyond/web-tutorial/auth",
    "bundle": "bridge"
  }).package();

  ;
  externals.register(new Map([["@beyond-js/kernel/bundle", dependency_0], ["@beyond-js/backend/client", dependency_1]]));

  const {
    ActionsBridge
  } = require('@beyond-js/backend/client');

  const ims = new Map();
  /***********************
  INTERNAL MODULE: ./index
  ***********************/

  ims.set('./index', {
    hash: 659769672,
    creator: function (require, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.Auth = void 0;

      var _beyond_context = require("beyond_context");
      /*actions*/

      /*bundle*/


      class Auth extends ActionsBridge {
        async login(user, password) {
          return await this.execute("index//Auth//login", ...arguments);
        }

        constructor() {
          super("backend", _beyond_context.bundle);
        }

      }

      exports.Auth = Auth;
    }
  });
  __pkg.exports.descriptor = [{
    "im": "./index",
    "from": "Auth",
    "name": "Auth"
  }];
  let Auth; // Module exports

  _exports.Auth = Auth;

  __pkg.exports.process = function ({
    require,
    prop,
    value
  }) {
    (require || prop === 'Auth') && (_exports.Auth = Auth = require ? require('./index').Auth : value);
  };

  const hmr = new function () {
    this.on = (event, listener) => __pkg.hmr.on(event, listener);

    this.off = (event, listener) => __pkg.hmr.off(event, listener);
  }();
  _exports.hmr = hmr;

  __pkg.initialise(ims);
});