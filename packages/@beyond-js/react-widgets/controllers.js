define(["exports", "@beyond-js/kernel/bundle", "react", "react-dom/client", "@beyond-js/widgets/controller", "@beyond-js/widgets/render"], function (_exports, dependency_0, dependency_1, dependency_2, dependency_3, dependency_4) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.hmr = _exports.ReactWidgetController = _exports.PageReactWidgetController = void 0;
  const {
    Bundle: __Bundle,
    externals
  } = dependency_0;

  const __pkg = new __Bundle({
    "module": "@beyond-js/react-widgets/controllers",
    "bundle": "ts"
  }).package();

  ;
  externals.register(new Map([["@beyond-js/kernel/bundle", dependency_0], ["react", dependency_1], ["react-dom/client", dependency_2], ["@beyond-js/widgets/controller", dependency_3], ["@beyond-js/widgets/render", dependency_4]]));
  const ims = new Map();
  /****************************
  INTERNAL MODULE: ./controller
  ****************************/

  ims.set('./controller', {
    hash: 4071237356,
    creator: function (require, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.ReactWidgetController = void 0;

      var React = require("react");

      var _client = require("react-dom/client");

      var _controller = require("@beyond-js/widgets/controller");

      var _widget = require("./widget");

      var _wrapper = require("./wrapper");
      /*bundle*/


      class ReactWidgetController extends _controller.WidgetClientController {
        #wrapper;
        #root; // This property must be overwritten

        get Widget() {
          return null;
        }

        mount(props) {
          if (!this.Widget) {
            return {
              errors: [`Widget "${this.element}" does not export a Widget class`]
            };
          }

          props = Object.assign({
            widget: this.widget,
            attributes: this.attributes,
            component: this.widget,
            store: this.store
          }, props ? props : {});
          const holder = this.widget.holder;
          const hydrate = !!holder.children.length; // Render the widget

          try {
            const wrapper = this.#wrapper = new _wrapper.Wrapper(this);
            const p = {
              wrapper,
              props,
              styles: this.styles,
              holder: this.widget.holder
            };
            const element = React.createElement(_widget.default, p);

            if (hydrate) {
              this.#root = (0, _client.hydrateRoot)(holder, element);
            } else {
              const root = this.#root = (0, _client.createRoot)(holder);
              root.render(element);
            }
          } catch (exc) {
            console.log(`Error rendering widget "${this.widget.localName}":`);
            console.log(exc.stack);
          }
        }

        unmount() {
          this.#root.unmount();
        }

        refresh() {
          this.#wrapper.changed();
        }

      }

      exports.ReactWidgetController = ReactWidgetController;
    }
  });
  /**********************
  INTERNAL MODULE: ./page
  **********************/

  ims.set('./page', {
    hash: 3306123120,
    creator: function (require, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.PageReactWidgetController = void 0;

      var _controller = require("./controller");

      var _controller2 = require("@beyond-js/widgets/controller");
      /*bundle*/


      class PageReactWidgetController extends _controller.ReactWidgetController {
        #uri;

        get uri() {
          return this.#uri;
        }

        mount() {
          return super.mount({
            uri: this.#uri
          });
        }

        async initialise() {
          this.#uri = new _controller2.PageURI({
            widget: this.widget
          });
          await super.initialise();
        }

      }

      exports.PageReactWidgetController = PageReactWidgetController;
    }
  });
  /************************
  INTERNAL MODULE: ./styles
  ************************/

  ims.set('./styles', {
    hash: 3125546841,
    creator: function (require, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = _default;

      var React = require("react");

      function _default({
        styles
      }) {
        const rs = React.useState(0); // Listen for .css bundle changes

        React.useEffect(() => {
          const refresh = () => rs[1](prev => prev + 1);

          styles.on('change', refresh);
          return () => styles.off('change', refresh) && void 0;
        }, []);
        const head = [...styles.resources].map(url => {
          return React.createElement("link", {
            key: url,
            href: url,
            rel: 'stylesheet',
            onLoad: () => styles.onloaded(url)
          });
        });
        return React.createElement(React.Fragment, null, head);
      }
    }
  });
  /************************
  INTERNAL MODULE: ./widget
  ************************/

  ims.set('./widget', {
    hash: 1316246600,
    creator: function (require, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = _default;

      var React = require("react");

      var _styles = require("./styles");

      function _default({
        wrapper,
        props,
        styles,
        holder
      }) {
        const elements = [];
        elements.push(React.createElement(_styles.default, {
          key: "styles",
          styles: styles,
          widget: props.widget
        }));
        const rs = React.useState(0);

        const refresh = () => rs[1](rs[0] + 1); // Listen for .js bundle changes


        wrapper.changed = refresh; // Check for styles to be loaded

        const loaded = (() => {
          !styles.loaded && styles.ready.then(refresh);
          holder.style.display = '';
          return styles.loaded;
        })();

        const {
          Widget
        } = wrapper;
        const widget = React.createElement(Widget, {
          key: "widgets",
          ...props
        });
        loaded && elements.push(widget);
        return React.createElement(React.Fragment, null, elements);
      }
    }
  });
  /*************************
  INTERNAL MODULE: ./wrapper
  *************************/

  ims.set('./wrapper', {
    hash: 4175409966,
    creator: function (require, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.Wrapper = void 0;

      class Wrapper {
        #Widget;

        get Widget() {
          return this.#Widget.Widget;
        } // Property changed should be overwritten to get notified about HMR changes


        changed = () => void 0;

        constructor(Widget) {
          this.#Widget = Widget;
        }

      }

      exports.Wrapper = Wrapper;
    }
  });
  __pkg.exports.descriptor = [{
    "im": "./controller",
    "from": "ReactWidgetController",
    "name": "ReactWidgetController"
  }, {
    "im": "./page",
    "from": "PageReactWidgetController",
    "name": "PageReactWidgetController"
  }];
  let ReactWidgetController, PageReactWidgetController; // Module exports

  _exports.PageReactWidgetController = PageReactWidgetController;
  _exports.ReactWidgetController = ReactWidgetController;

  __pkg.exports.process = function ({
    require,
    prop,
    value
  }) {
    (require || prop === 'ReactWidgetController') && (_exports.ReactWidgetController = ReactWidgetController = require ? require('./controller').ReactWidgetController : value);
    (require || prop === 'PageReactWidgetController') && (_exports.PageReactWidgetController = PageReactWidgetController = require ? require('./page').PageReactWidgetController : value);
  };

  const hmr = new function () {
    this.on = (event, listener) => void 0;

    this.off = (event, listener) => void 0;
  }();
  _exports.hmr = hmr;

  __pkg.initialise(ims);
});