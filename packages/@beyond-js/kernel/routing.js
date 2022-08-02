define(["exports", "@beyond-js/kernel/bundle", "@beyond-js/kernel/core"], function (_exports, dependency_0, dependency_1) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.routing = _exports.URI = void 0;
  const {
    Bundle: __Bundle,
    externals
  } = dependency_0;

  const __pkg = new __Bundle({
    "module": "@beyond-js/kernel/routing",
    "bundle": "ts"
  }).package();

  ;
  externals.register(new Map([]));
  const ims = new Map();
  /*********************************
  INTERNAL MODULE: ./history/history
  *********************************/

  ims.set('./history/history', {
    hash: 2957503106,
    creator: function (require, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.BeyondHistory = void 0;

      var _position = require("./position");

      var _records = require("./records");
      /**
       * Beyond keeps its own history list
       * @constructor
       */


      class BeyondHistory {
        #position;

        get position() {
          return this.#position;
        }

        #records;

        get records() {
          return this.#records;
        }

        get current() {
          return this.#records.current.uri;
        }

        #initial = history.length;

        get initial() {
          return this.#initial;
        }
        /**
         * Process the browser URI that takes into consideration the routing mode
         *
         * @param {string} uri The internal URI (always starts with '/')
         * @return {string} The URI to be pushed or replaced in the browser considering the routing mode
         * @private
         */


        #processBrowserURI(uri) {
          void this;
          if (uri === void 0) return;

          const {
            routing
          } = require('../routing');

          const RoutingModeEnum = require('../routing').RoutingMode;

          return routing.mode === RoutingModeEnum.Hash ? `#${uri.substr(1)}` : uri;
        }

        #push(uri) {
          this.#records.reset();
          this.#records.push(uri);
          this.#position.save(this.#records.length);
        }

        replaceState(state, title, uri) {
          state = state ? state : {};
          if (typeof state !== 'object') throw new Error('Invalid state parameter');
          this.#records.updateCurrentURI(uri); // The uri in the browser considering the routing mode

          const position = this.#position.value;
          history.replaceState(state, title, this.#processBrowserURI(uri));
          this.#position.save(position);
        }

        pushState(uri, state) {
          if (uri === `${location.pathname}${location.search}${location.hash}`) return;
          state = state ? state : {};
          if (typeof state !== 'object') throw new Error('Invalid state parameter');
          history.pushState(state, null, this.#processBrowserURI(uri));
          this.#push(uri);
        }

        back() {
          const previous = this.#records.previous?.position;
          const current = this.#records.current?.position;
          if (!previous) return;
          history.go(previous - current);
        }

        forward() {
          const following = this.#records.following?.position;
          const current = this.#records.current?.position;
          if (!following) return;
          history.go(following - current);
        }

        constructor(routing, Mode) {
          this.#position = new _position.HistoryPosition();
          this.#records = new _records.HistoryRecords(this.#position);

          if (this.#position.value === void 0) {
            // It is not a refresh of a previously navigated page
            let uri = routing.mode === Mode.Hash ? location.hash.slice(1) : `${location.pathname}${location.search}${location.hash}`;
            this.#push(uri);
          }
        }

      }

      exports.BeyondHistory = BeyondHistory;
    }
  });
  /**********************************
  INTERNAL MODULE: ./history/position
  **********************************/

  ims.set('./history/position', {
    hash: 3613484025,
    creator: function (require, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.HistoryPosition = void 0;
      /**
       * The position of the navigation is stored this way:
       *      1. In the state of each page (the history.state object), it is stored the position
       *         in which the page is located. To achieve this, the __beyond_navigation_position property
       *         is added to the state object.
       *      2. In the sessionStorage is stored the current position (__beyond_navigation_position)
       */

      class HistoryPosition {
        check() {
          if (this.value) return true;
          console.error('History state is not defined. ' + 'This happen when state is changed outside the beyond defined navigation flows.');
          return false;
        }
        /**
         * Returns the position from the history.state
         * @returns {number | undefined}
         */


        get value() {
          return history.state?.__beyond_navigation_position;
        }

        save(position) {
          const state = history.state ? history.state : {};
          state.__beyond_navigation_position = position;
          history.replaceState(state, null);
        }

      }

      exports.HistoryPosition = HistoryPosition;
    }
  });
  /*********************************
  INTERNAL MODULE: ./history/records
  *********************************/

  ims.set('./history/records', {
    hash: 3276675750,
    creator: function (require, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.HistoryRecords = void 0;

      class HistoryRecords {
        #position;
        #entries = [];

        get entries() {
          return this.#entries.slice();
        }

        get length() {
          return this.#entries.length;
        }

        get current() {
          return this.#entries[this.#position.value - 1];
        }

        get previous() {
          const previous = this.#position.value - 2;
          if (previous < 0) return;
          return this.#entries[previous];
        }

        get following() {
          const following = this.#position.value;
          if (following >= this.#entries.length) return;
          return this.#entries[following];
        }

        constructor(position) {
          this.#position = position;
          let parsed;

          try {
            const stored = sessionStorage.getItem('__beyond_navigation_records');
            parsed = stored ? JSON.parse(stored) : [];
          } catch (exc) {
            console.error('Error loading beyond navigation state', exc instanceof Error ? exc.stack : exc);
            this.#entries = [];
          }

          if (!(parsed instanceof Array)) {
            const warning = 'The beyond navigation data, stored in session store is invalid.';
            console.warn(warning, parsed);
          }

          this.#entries = parsed;
        }
        /**
         * Set the URI always starting with '/' no matter the routing mode (hash or pathname)
         *
         * @param {string} uri
         * @return {string}
         */


        #sanitizeURI(uri) {
          void this;
          if (uri === void 0) return;
          return uri.startsWith('/') ? uri : `/${uri}`;
        }

        get(index) {
          return this.#entries[index];
        }
        /**
         * Push a uri to the records stored in the sessionStorage
         * @param {string} uri
         */


        push(uri) {
          uri = this.#sanitizeURI(uri);
          this.#entries.push({
            uri,
            position: history.length
          });
          this.save();
        }
        /**
         * Reset the list of records from the current position
         * This is required when:
         *      1. The list of browsed pages is greater than one (ex: page1 and page2)
         *      2. The user goes back in the history (ex: to position 1: page1)
         *      3. The user navigates another page (ex: page3)
         *
         * This method is required in step 3, to clean the records from position 1, and after this
         * execution, the navigation flow can push page3
         */


        reset() {
          const position = this.#position.value;
          if (position) return;
          this.#entries = this.#entries.filter(entry => entry.position < history.length);
        }

        updateCurrentURI(uri) {
          const position = this.#position.value;
          uri = this.#sanitizeURI(uri);
          this.#entries[position - 1] = {
            uri,
            position: history.length
          };
          this.save();
        }

        save() {
          sessionStorage.setItem('__beyond_navigation_records', JSON.stringify(this.#entries));
        }

      }

      exports.HistoryRecords = HistoryRecords;
    }
  });
  /*************************
  INTERNAL MODULE: ./routing
  *************************/

  ims.set('./routing', {
    hash: 2191558165,
    creator: function (require, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.routing = exports.RoutingMode = exports.Routing = void 0;

      var _uri2 = require("./uri/uri");

      var _core = require("@beyond-js/kernel/core");

      var _history = require("./history/history");

      var RoutingMode;
      exports.RoutingMode = RoutingMode;

      (function (RoutingMode) {
        RoutingMode[RoutingMode["Hash"] = 0] = "Hash";
        RoutingMode[RoutingMode["Pathname"] = 1] = "Pathname";
      })(RoutingMode || (exports.RoutingMode = RoutingMode = {}));

      const serverside = typeof window !== 'object';

      class Routing extends _core.Events {
        #mode;

        get mode() {
          return this.#mode;
        }

        #history;

        get history() {
          return this.#history;
        }

        #initialised = false;

        get initialised() {
          return this.#initialised;
        }

        #resolve;
        #ready = new Promise(resolve => this.#resolve = resolve);

        get ready() {
          return this.#ready;
        }

        #uri;

        get uri() {
          return this.#uri;
        }

        missing;
        redirect;

        constructor() {
          super();
          let configured = globalThis.__beyond_config.application.routing?.mode;
          let routingMode = configured === 'hash' ? RoutingMode.Hash : RoutingMode.Pathname;
          !serverside && location.protocol === 'file:' && (routingMode = RoutingMode.Hash);
          !serverside && ![0, 1].includes(routingMode) && (routingMode = location.protocol === 'file:' ? RoutingMode.Hash : RoutingMode.Pathname);
          this.#mode = routingMode;
          this.#history = !serverside && new _history.BeyondHistory(this, RoutingMode);
          !serverside && this.update().catch(exc => console.error(exc.stack));
        }

        #redirect = async uri => {
          if (typeof this.redirect !== 'function') return;
          const redirected = await this.redirect(uri);
          if (!redirected) return;

          if (typeof redirected !== 'string') {
            console.error(`Invalid route value set by custom routing function`, redirected);
            return;
          }

          if (uri.pathname === redirected) return; // Routing function returned the actual route

          this.pushState(redirected);
          return true;
        };

        pushState(uri, state) {
          this.#history.pushState(uri, state);
          this.update().catch(exc => console.error(exc.stack));
        }

        replaceState(state, title, uri) {
          this.#history.replaceState(state, title, uri);
          this.update().catch(exc => console.error(exc.stack));
        } // Avoid to continue the execution on asynchronous calls, when a newest call's been made


        #cancellationToken = new _core.CancellationToken();
        update = async () => {
          const cancellationTokenId = this.#cancellationToken.reset();
          const {
            hash,
            pathname,
            search
          } = location;

          const _uri = this.#mode === RoutingMode.Hash ? `/${hash.slice(1)}` : pathname + search + hash;

          if (this.#uri?.uri === _uri) return;
          const uri = this.#uri = new _uri2.URI(_uri); // Check for uri redirect

          const redirected = await this.#redirect(uri);
          if (!this.#cancellationToken.check(cancellationTokenId)) return;
          if (redirected) return; // The page was redirected to another uri
          // Verify the state of the history registry to check for possible errors

          this.#history && uri.uri !== this.#history.current && console.error(`History current "${this.#history.current}" is not equal to actual uri "${uri.uri}"`);
          this.#initialised ? this.trigger('change') : this.#resolve();
          this.#initialised = true;
        };

        back() {
          this.#history.back();
        }

        forward() {
          this.#history.forward();
        }

      }

      exports.Routing = Routing;
      /*bundle*/

      const routing = new Routing();
      exports.routing = routing;
      globalThis.routing = routing;
      !serverside && (beyond.navigate = (uri, state) => routing.pushState(uri, state));
      !serverside && (beyond.pushState = (uri, state) => routing.pushState(uri, state));
      !serverside && (beyond.back = () => routing.back());
      !serverside && (beyond.forward = () => routing.forward()); // Only on client side

      !serverside && window.addEventListener('popstate', () => routing.update().catch(exc => console.error(exc.stack)));
    }
  });
  /*********************************
  INTERNAL MODULE: ./uri/querystring
  *********************************/

  ims.set('./uri/querystring', {
    hash: 187911159,
    creator: function (require, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.QueryString = void 0;

      class QueryString extends Map {
        constructor(search) {
          super();
          if (search.trim() === '') return;
          search = search.slice(0, 1) === '?' ? search.slice(1) : search;
          const split = search.split('&');

          for (let i = 0; i < split.length; ++i) {
            const param = split[i].split('=', 2);
            const value = param[1] ? decodeURIComponent(param[1].replace(/\+/g, ' ')) : undefined;
            this.set(param[0], value);
          }
        }

      }

      exports.QueryString = QueryString;
    }
  });
  /*************************
  INTERNAL MODULE: ./uri/uri
  *************************/

  ims.set('./uri/uri', {
    hash: 748332499,
    creator: function (require, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.URI = void 0;

      var _querystring = require("./querystring");
      /*bundle*/

      /**
       * Uri parser
       *
       * @param href {string} The href to be parsed
       * @constructor
       */


      class URI {
        #uri;

        get uri() {
          return this.#uri;
        }

        #pathname;

        get pathname() {
          return this.#pathname;
        }

        #search;

        get search() {
          return this.#search;
        }

        #qs;

        get qs() {
          return this.#qs;
        }

        #hash;

        get hash() {
          return this.#hash;
        }

        constructor(uri) {
          this.#uri = uri;
          const [u, hash] = uri.split('#');
          const [pathname, search] = u.split('?');
          this.#pathname = pathname.startsWith('/') ? pathname : `/${pathname}`;
          this.#search = search ? search : '';
          this.#qs = new _querystring.QueryString(this.#search);
          this.#hash = hash;
        }

      }

      exports.URI = URI;
    }
  });
  __pkg.exports.descriptor = [{
    "im": "./routing",
    "from": "routing",
    "name": "routing"
  }, {
    "im": "./uri/uri",
    "from": "URI",
    "name": "URI"
  }];
  let routing, URI; // Module exports

  _exports.URI = URI;
  _exports.routing = routing;

  __pkg.exports.process = function ({
    require,
    prop,
    value
  }) {
    (require || prop === 'routing') && (_exports.routing = routing = require ? require('./routing').routing : value);
    (require || prop === 'URI') && (_exports.URI = URI = require ? require('./uri/uri').URI : value);
  };

  __pkg.initialise(ims);
});