define(["exports", "@beyond-js/kernel/bundle"], function (_exports, dependency_0) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.hmr = _exports.beyond = _exports.SingleCall = _exports.PendingPromise = _exports.ListenerFunction = _exports.Events = _exports.CancellationToken = void 0;
  const amd_require = require;
  const {
    Bundle: __Bundle,
    externals
  } = dependency_0;

  const __pkg = new __Bundle({
    "module": "@beyond-js/kernel/core",
    "bundle": "ts"
  }).package();

  ;
  externals.register(new Map([]));
  const ims = new Map();
  /*****************************************
  INTERNAL MODULE: ./application/application
  *****************************************/

  ims.set('./application/application', {
    hash: 1653905038,
    creator: function (require, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.Application = void 0;

      var _languages = require("./languages");

      var _data = require("../package/data");

      class Application {
        get is() {
          return 'application';
        }

        #beyond;

        constructor(beyond) {
          this.#beyond = beyond;
        }

        #package;

        get package() {
          return this.#package;
        }

        get id() {
          return this.#package.id;
        }

        #version;

        get version() {
          return this.#version;
        }

        #layout;

        get layout() {
          return this.#layout;
        }

        #params;

        get params() {
          return this.#params;
        }

        #languages;

        get languages() {
          return this.#languages;
        }

        setup(config) {
          // The configuration of the application package is not required when
          // it is a web page that is not being created with BeyondJS,
          // but where it is going to import packages created with BeyondJS as standalone modules and/or libraries
          this.#package = config.package && new _data.PackageData(config.package);
          this.#version = config.version ? config.version : '';
          this.#layout = config.layout;
          this.#params = config.params;
          this.#languages = new _languages.Languages(config.languages);

          if (typeof amd_require !== 'undefined') {
            const paths = {};
            paths[config.package] = this.#beyond.baseUrl;
            amd_require.config({
              paths
            });
          }
        }

      }

      exports.Application = Application;
    }
  });
  /***************************************
  INTERNAL MODULE: ./application/languages
  ***************************************/

  ims.set('./application/languages', {
    hash: 948998472,
    creator: function (require, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.Languages = void 0;

      var _events = require("../utils/events/events");

      class Languages extends _events.Events {
        #config;
        #storage = typeof localStorage === 'object' ? localStorage : void 0;
        #supported;

        get supported() {
          return this.#supported;
        }

        get default() {
          return this.#config.default;
        }

        #current;

        get current() {
          return this.#current;
        }

        #configure(value) {
          if (this.#current === value) return true;

          if (typeof value !== 'string' || value.length !== 2) {
            console.warn(`Configured language "${value}" is invalid`);
            return false;
          }

          if (value && !this.#supported.has(value)) {
            console.log(`Language "${value}" is not supported`);
            return false;
          }

          const previous = this.#current;
          this.#current = value;
          previous && this.trigger('change');
          return true;
        }

        set current(value) {
          if (!this.#configure(value)) return;
          this.#storage?.setItem('__beyond_language', value);
        }

        constructor(config) {
          super(); // Check if the default language is valid

          if (config.default && typeof config.default !== 'string' || config.default.length !== 2) {
            console.log(`Default language "${config.default}" is invalid`);
            config.default = undefined;
          } // Check the supported languages, if not set, default will be english


          const def = config.default ? config.default : 'en';
          config.supported = config.supported instanceof Array ? config.supported : [def];
          !config.supported.length && config.supported.push(def);
          this.#supported = new Set(config.supported); // If default language not set or was invalid, take the first supported language

          config.default = config.default ? config.default : [...this.#supported][0]; // If default language was configured, but not set in the supported list, warn it

          if (!this.#supported.has(config.default)) {
            console.warn(`Default language "${config.default}" is not supported by current application`);
            config.default = [...this.#supported][0];
          }

          this.#config = config;
          const configured = this.#storage?.getItem('__beyond_language'); // Try to configure the locally previously configured language

          if (configured && this.#configure(configured)) return; // Try to configure the language configured in the device

          const device = typeof navigator === 'object' ? navigator.language.split('-')[0] : void 0;
          if (device && this.#configure(device)) return;
          this.#configure(config.default);
        }

      }

      exports.Languages = Languages;
    }
  });
  /************************
  INTERNAL MODULE: ./beyond
  ************************/

  ims.set('./beyond', {
    hash: 737209118,
    creator: function (require, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.beyond = exports.Beyond = void 0;

      var _application = require("./application/application");

      var _import = require("./import");

      class Beyond {
        #application = new _application.Application(this);

        get application() {
          return this.#application;
        }

        #local;

        get local() {
          return this.#local;
        }

        #distribution;

        get distribution() {
          return this.#distribution;
        }

        #environment;

        get environment() {
          return this.#environment;
        }

        get params() {
          return this.#application.params;
        }

        get languages() {
          return this.#application.languages;
        }

        #mode;

        get mode() {
          return this.#mode;
        }

        #baseDir;

        get baseDir() {
          return this.#baseDir;
        }

        #baseUrl;

        get baseUrl() {
          return this.#baseUrl;
        }

        #import;
        import = module => this.#import.import(module); // Required by HMR only in local environment
        // Note: in AMD mode, the querystring is not allowed (it is used require.undef by the beyond.reload method)

        reload = (module, version) => this.#import.reload(module, version);
        require = module => this.#import.require(module);

        setup(distribution) {
          let {
            key,
            local,
            baseDir,
            environment,
            mode
          } = distribution; // The distribution key is only required in local environment to support HMR

          this.#distribution = local ? key : void 0;
          this.#environment = environment ? environment : 'production';
          this.#local = local ? local : false;
          this.#mode = typeof window === 'object' ? 'amd' : 'cjs';

          if (mode && this.#mode !== mode) {
            throw new Error(`Expected module packaging type to be "${this.#mode}" instead of "${mode}"`);
          }

          this.#baseDir = baseDir = (() => {
            if (typeof window === 'undefined') return;
            baseDir = baseDir ? baseDir : '';

            if (location.protocol === 'file:' && baseDir.startsWith('/')) {
              return baseDir.slice(1);
            } else if (location.protocol !== 'file:' && !baseDir.startsWith('/')) {
              return `/${baseDir}`;
            }

            return baseDir;
          })();

          this.#baseUrl = (() => {
            if (typeof window === 'undefined') return;
            const {
              protocol,
              host,
              pathname
            } = location;

            if (protocol === 'file:') {
              const path = pathname.split('/');
              path.pop(); // Remove 'index.html'

              path.join('/');
              return `${protocol}//${path.join('/')}`;
            } else {
              const baseUrl = this.#baseDir === '/' ? '' : this.#baseDir;
              return `${protocol}//${host}${baseUrl}`;
            }
          })();

          this.#import = new _import.BeyondImport(this.#mode, this.#baseUrl);
        }

      }

      exports.Beyond = Beyond;
      /*bundle*/

      const beyond = new Beyond();
      exports.beyond = beyond;
      globalThis.beyond = beyond;

      if (typeof __beyond_config === 'object') {
        const {
          distribution,
          application
        } = __beyond_config;
        beyond.setup(distribution);
        beyond.application.setup(application);
      }
    }
  });
  /******************************
  INTERNAL MODULE: ./import/index
  ******************************/

  ims.set('./import/index', {
    hash: 4276228816,
    creator: function (require, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.BeyondImport = void 0;

      var _require = require("./require");

      class BeyondImport {
        #require;
        #mode;
        #baseUrl;

        constructor(mode, baseUrl) {
          this.#mode = mode;
          this.#baseUrl = baseUrl ? `${baseUrl}/packages/` : void 0;

          if (['amd', 'cjs'].includes(mode)) {
            this.#require = new _require.BeyondRequire(mode);
            mode === 'amd' && this.#require.setup(baseUrl);
          }
        }
        /**
         * Import a module with baseURL resolution
         *
         * @param module {string} The module to be imported
         * @param version {number} The version required by hmr to update a bundle's processor
         * @returns {Promise<*>}
         */


        async import(module, version) {
          if (module.startsWith('/') || module.startsWith('.')) {
            console.warn(`Module "${module}" must only specify non-relative paths`);
            module = module.substr(1);
          }

          if (this.#mode === 'cjs' && typeof bimport !== 'undefined') return await bimport(module, version);
          if (this.#mode !== 'es6') return await this.#require.require(module);
          let url;

          if (/^https?:\/\/.*$/.test(module)) {
            url = module;
          } else {
            url = `${this.#baseUrl}${module}` + (version ? `?version=${version}` : '');
          }

          return await es6_import(url);
        }
        /**
         * Used only in local environment to support HMR
         *
         * @param {string} module The module to be loaded
         * @param {number} version
         * @return {Promise<*>}
         */


        async reload(module, version) {
          if (this.#mode === 'cjs') return await bimport(module, version);
          if (this.#mode === 'es6') return await this.import(module, version);
          return await this.#require.reload(module);
        }

        require(module) {
          return this.#require.require(module);
        }

      }

      exports.BeyondImport = BeyondImport;
    }
  });
  /********************************
  INTERNAL MODULE: ./import/require
  ********************************/

  ims.set('./import/require', {
    hash: 3361867872,
    creator: function (require, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.BeyondRequire = void 0;

      class BeyondRequire {
        #mode;

        constructor(mode) {
          this.#mode = mode;
        }

        setup(baseUrl) {
          const mode = this.#mode;
          if (mode !== 'amd') throw new Error(`Setup should only be called on amd mode. Actual mode is "${mode}"`);
          baseUrl = `${baseUrl}/packages`;
          amd_require.config({
            baseUrl
          });

          amd_require.onError = function (error) {
            if (error.requireType === 'timeout') {
              let modules = error.requireModules;

              for (let module of modules) {
                amd_require.undef(module);
              } // Try again loading modules


              console.log('Retrying to load AMD modules:', modules);
              amd_require(modules, () => null);
            } else {
              console.error(error.stack);
            }
          };
        }
        /**
         * Require a module
         * @param module {string} The module to be required
         * @returns {Promise<any>>}
         */


        require(module) {
          if (this.#mode === 'cjs') {
            return cjs_require(module);
          }

          return new Promise((resolve, reject) => {
            if (typeof module !== "string") throw 'Invalid module parameter';
            module = module.endsWith('.js') ? module.substr(0, module.length - 3) : module;
            const error = new Error(`Error loading or processing module "${module}"`);
            amd_require([module], returned => resolve(returned), exc => {
              console.error(`Error loading module "${module}."`, exc.stack);
              reject(error);
            });
          });
        }
        /**
         * Used only in local environment to support HMR
         * Note: in AMD mode, the querystring is not allowed (it is used require.undef by the beyond.reload method)
         *
         * @param {string} module
         * @return {Promise<*>}
         */


        async reload(module) {
          const mode = this.#mode;
          if (mode !== 'amd') throw new Error(`This method is only supported in amd mode. Current mode is "${mode}"`);
          amd_require.undef(module);
          return await this.require(module);
        }

      }

      exports.BeyondRequire = BeyondRequire;
    }
  });
  /**********************************
  INTERNAL MODULE: ./import/requirejs
  **********************************/

  ims.set('./import/requirejs', {
    hash: 2243979856,
    creator: function (require, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
    }
  });
  /******************************
  INTERNAL MODULE: ./package/data
  ******************************/

  ims.set('./package/data', {
    hash: 97481503,
    creator: function (require, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.PackageData = void 0;

      class PackageData {
        #id;

        get id() {
          return this.#id;
        }

        #scope;

        get scope() {
          return this.#scope;
        }

        #name;

        get name() {
          return this.#name;
        }
        /**
         * Package data constructor
         *
         * @param {string} id The id of the application, library or module
         */


        constructor(id) {
          if (!id) throw new Error('Package id not set');
          const split = id.split('/');

          if (split[0].startsWith('@')) {
            if (split.length < 2) throw new Error(`Package id "${id}" is invalid`);
            this.#scope = split.shift();
            this.#name = split.shift();
          } else {
            this.#name = split.shift();
          }

          this.#id = (this.#scope ? `${this.#scope}/` : '') + this.#name;
        }

      }

      exports.PackageData = PackageData;
    }
  });
  /*************************************
  INTERNAL MODULE: ./utils/events/events
  *************************************/

  ims.set('./utils/events/events', {
    hash: 3993267980,
    creator: function (require, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.Events = void 0;
      /*bundle*/

      class Events {
        #specs;
        #listeners = new Map();
        #destroyed = false;

        get destroyed() {
          return this.#destroyed;
        }

        constructor(specs) {
          specs = specs ? specs : {};
          if (specs.supported && !(specs.supported instanceof Array)) throw new Error('Invalid parameters');
          this.#specs = specs;

          if (specs.bind) {
            specs.bind.bind = (event, listener, priority) => this.on(event, listener, priority);

            specs.bind.unbind = (event, listener) => this.off(event, listener);
          }
        }
        /**
         * Binds an event handler to an event name
         *
         * @param {string} event
         * @param {ListenerFunction} listener
         * @param {number} priority
         * @returns {this}
         */


        on(event, listener, priority) {
          if (this.#destroyed) {
            throw new Error('Events object is destroyed');
          }

          if (this.#specs.supported && !this.#specs.supported.includes(event)) {
            throw new Error(`Event "${event}" is not defined`);
          }

          if (typeof listener !== 'function') {
            throw new Error('Listener is not a function');
          }

          this.off(event, listener); // Just in case the listener is already registered

          const l = this.#listeners.has(event) ? this.#listeners.get(event) : [];
          this.#listeners.set(event, l);
          l.push({
            listener: listener,
            priority: priority ? priority : 0
          });
          return this;
        }

        bind = (event, listener, priority) => this.on(event, listener, priority);
        /**
         * Unbind an event listener
         *
         * @param {string} event
         * @param {ListenerFunction} listener
         * @param {number} force
         * @returns {this}
         */

        off(event, listener, force) {
          if (this.#destroyed) {
            throw new Error('Events object is destroyed');
          }

          if (!event) {
            throw new Error(`Event name not specified`);
          }

          if (this.#specs.supported && !this.#specs.supported.includes(event)) {
            throw new Error(`Event "${event}" is not defined`);
          }

          if (!listener) {
            if (!force) throw new Error('Listener function not set');
            this.#listeners.delete(event);
            return this;
          }

          if (!this.#listeners.has(event)) {
            return this;
          }

          const e = this.#listeners.get(event);
          const filtered = e.filter(item => item.listener !== listener);
          this.#listeners.set(event, filtered);
          return this;
        }

        unbind = (event, listener, force) => this.off(event, listener, force);
        /**
         * Triggers an event
         *
         * @param {Trigger} event
         * @param {*} rest
         * @returns {Promise<*>}
         */

        trigger(event, ...rest) {
          if (this.#destroyed) {
            throw new Error('Events object is destroyed');
          }

          event = typeof event === 'string' ? {
            'name': event
          } : event;
          if (typeof event !== 'object') throw new Error('Invalid parameters');
          if (typeof event.name !== 'string') throw new Error('Invalid event name');

          if (this.#specs.supported && !this.#specs.supported.includes(event.name)) {
            throw new Error(`Event "${event.name}" is not defined`);
          }

          let args = [...arguments];
          args.shift(); // Remove the event name from the list of arguments

          if (!this.#listeners.has(event.name)) return;
          let l = this.#listeners.get(event.name); // Sort by priority

          l.sort((a, b) => b.priority - a.priority);

          if (event.async) {
            const trigger = async function () {
              const promises = [];

              for (let listener of l) {
                promises.push(listener.listener(...args));
              }

              await Promise.all(promises);
            };

            return trigger.call(this, ...args).catch(exc => console.error(exc.stack));
          } else {
            for (let listener of l) {
              listener.listener(...args);
            }
          }
        }

        destroy() {
          this.#destroyed = true;
          this.#listeners.clear();
        }

      }

      exports.Events = Events;
      globalThis.Events = Events;
    }
  });
  /************************************
  INTERNAL MODULE: ./utils/events/types
  ************************************/

  ims.set('./utils/events/types', {
    hash: 1632705009,
    creator: function (require, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
    }
  });
  /*******************************************************************************
  INTERNAL MODULE: ./utils/execution-control/cancellation-token/cancellation-token
  *******************************************************************************/

  ims.set('./utils/execution-control/cancellation-token/cancellation-token', {
    hash: 4200323006,
    creator: function (require, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.CancellationToken = void 0;
      /*bundle*/

      class CancellationToken {
        #id = 0;

        get current() {
          return this.#id;
        }

        reset = () => ++this.#id;
        check = id => id === this.#id;
      }

      exports.CancellationToken = CancellationToken;
    }
  });
  /*****************************************************************
  INTERNAL MODULE: ./utils/execution-control/single-call/single-call
  *****************************************************************/

  ims.set('./utils/execution-control/single-call/single-call', {
    hash: 783668127,
    creator: function (require, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.SingleCall = SingleCall;
      /*bundle*/

      function SingleCall(target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        let promises = new WeakMap();

        descriptor.value = function (...args) {
          if (promises.has(this)) return promises.get(this);
          const promise = originalMethod.apply(this, args);
          promises.set(this, promise);

          const clean = () => promises.delete(this);

          promise.then(clean).catch(clean);
          return promise;
        };

        return descriptor;
      }
    }
  });
  /*******************************************************
  INTERNAL MODULE: ./utils/pending-promise/pending-promise
  *******************************************************/

  ims.set('./utils/pending-promise/pending-promise', {
    hash: 3725650226,
    creator: function (require, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.PendingPromise = void 0;
      /*bundle*/

      class PendingPromise extends Promise {
        resolve;
        reject;

        constructor(executor) {
          // needed for PendingPromise.race/all ecc
          if (executor instanceof Function) {
            super(executor);
            return;
          }

          let resolve = undefined;
          let reject = undefined;
          super((a, b) => {
            resolve = a;
            reject = b;
          });
          this.resolve = resolve;
          this.reject = reject;
        }

      } // For backward compatibility


      exports.PendingPromise = PendingPromise;
      typeof window === 'object' && (window.PendingPromise = PendingPromise);
    }
  });
  __pkg.exports.descriptor = [{
    "im": "./beyond",
    "from": "beyond",
    "name": "beyond"
  }, {
    "im": "./utils/events/events",
    "from": "Events",
    "name": "Events"
  }, {
    "im": "./utils/events/types",
    "from": "ListenerFunction",
    "name": "ListenerFunction"
  }, {
    "im": "./utils/execution-control/cancellation-token/cancellation-token",
    "from": "CancellationToken",
    "name": "CancellationToken"
  }, {
    "im": "./utils/execution-control/single-call/single-call",
    "from": "SingleCall",
    "name": "SingleCall"
  }, {
    "im": "./utils/pending-promise/pending-promise",
    "from": "PendingPromise",
    "name": "PendingPromise"
  }];
  let beyond, Events, ListenerFunction, CancellationToken, SingleCall, PendingPromise; // Module exports

  _exports.PendingPromise = PendingPromise;
  _exports.SingleCall = SingleCall;
  _exports.CancellationToken = CancellationToken;
  _exports.ListenerFunction = ListenerFunction;
  _exports.Events = Events;
  _exports.beyond = beyond;

  __pkg.exports.process = function ({
    require,
    prop,
    value
  }) {
    (require || prop === 'beyond') && (_exports.beyond = beyond = require ? require('./beyond').beyond : value);
    (require || prop === 'Events') && (_exports.Events = Events = require ? require('./utils/events/events').Events : value);
    (require || prop === 'ListenerFunction') && (_exports.ListenerFunction = ListenerFunction = require ? require('./utils/events/types').ListenerFunction : value);
    (require || prop === 'CancellationToken') && (_exports.CancellationToken = CancellationToken = require ? require('./utils/execution-control/cancellation-token/cancellation-token').CancellationToken : value);
    (require || prop === 'SingleCall') && (_exports.SingleCall = SingleCall = require ? require('./utils/execution-control/single-call/single-call').SingleCall : value);
    (require || prop === 'PendingPromise') && (_exports.PendingPromise = PendingPromise = require ? require('./utils/pending-promise/pending-promise').PendingPromise : value);
  };

  const hmr = new function () {
    this.on = (event, listener) => void 0;

    this.off = (event, listener) => void 0;
  }();
  _exports.hmr = hmr;

  __pkg.initialise(ims);
});