define(["exports", "@beyond-js/kernel/bundle", "@beyond-js/widgets/render", "@beyond-js/kernel/styles", "@beyond-js/react-widgets/controllers", "react", "@beyond/web-tutorial/auth"], function (_exports, dependency_0, dependency_1, dependency_2, dependency_3, dependency_4, dependency_5) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.hmr = _exports.Controller = void 0;
  const {
    Bundle: __Bundle,
    externals
  } = dependency_0;

  const __pkg = new __Bundle({
    "module": "@beyond/web-tutorial/home",
    "bundle": "widget"
  }).package();

  ;
  externals.register(new Map([["@beyond-js/kernel/bundle", dependency_0], ["@beyond-js/widgets/render", dependency_1], ["@beyond-js/kernel/styles", dependency_2], ["@beyond-js/react-widgets/controllers", dependency_3], ["react", dependency_4]]));

  __pkg.dependencies.update(new Set(["@beyond/web-tutorial/auth"]));

  require('@beyond-js/widgets/render').widgets.register([{
    "name": "home-page",
    "id": "@beyond/web-tutorial/home",
    "is": "page",
    "route": "/"
  }]);

  require('@beyond-js/kernel/styles').styles.register('@beyond/web-tutorial/home');

  const ims = new Map();
  /****************************
  INTERNAL MODULE: ./controller
  ****************************/

  ims.set('./controller', {
    hash: 3993917803,
    creator: function (require, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.Controller = void 0;

      var _controllers = require("@beyond-js/react-widgets/controllers");

      var _views = require("./views");
      /*bundle*/


      class Controller extends _controllers.PageReactWidgetController {
        get Widget() {
          return _views.View;
        }

      }

      exports.Controller = Controller;
    }
  });
  /*****************************
  INTERNAL MODULE: ./views/index
  *****************************/

  ims.set('./views/index', {
    hash: 2706808831,
    creator: function (require, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.View = View;

      var React = require("react");

      var _auth = require("@beyond/web-tutorial/auth");

      const model = new _auth.Auth();
      /*page*/

      function View() {
        const defaultValues = {
          username: '',
          password: '',
          fetching: false
        };
        const [values, setValues] = React.useState(defaultValues);
        const [error, setError] = React.useState();

        const handleChange = ({
          currentTarget: target
        }) => {
          const currentValue = { ...values
          };
          currentValue[target.name] = target.value;
          setValues(currentValue);
        };

        const formDisabled = {};
        const {
          username,
          password
        } = values;

        if (!username || !password) {
          formDisabled.disabled = true;
        }

        const onSubmit = async event => {
          try {
            event.preventDefault();
            const response = await model.login(username, password);

            if (response.data?.valid) {
              console.log('valid data');
              return;
            }

            setError(response.error);
          } catch (e) {
            console.log(e);
          }
        };

        return React.createElement("div", {
          className: "page__container"
        }, React.createElement("form", {
          onSubmit: onSubmit
        }, error && React.createElement("div", {
          className: "form__error"
        }, error), React.createElement("label", null, "User: "), React.createElement("input", {
          onChange: handleChange,
          type: "text",
          name: "username"
        }), React.createElement("label", null, "Password"), React.createElement("input", {
          onChange: handleChange,
          type: "password",
          name: "password"
        }), React.createElement("div", {
          className: "form__actions"
        }, React.createElement("button", {
          onClick: onSubmit,
          ...formDisabled
        }, "Login"))));
      }
    }
  });
  __pkg.exports.descriptor = [{
    "im": "./controller",
    "from": "Controller",
    "name": "Controller"
  }];
  let Controller; // Module exports

  _exports.Controller = Controller;

  __pkg.exports.process = function ({
    require,
    prop,
    value
  }) {
    (require || prop === 'Controller') && (_exports.Controller = Controller = require ? require('./controller').Controller : value);
  };

  const hmr = new function () {
    this.on = (event, listener) => __pkg.hmr.on(event, listener);

    this.off = (event, listener) => __pkg.hmr.off(event, listener);
  }();
  _exports.hmr = hmr;

  __pkg.initialise(ims);
});