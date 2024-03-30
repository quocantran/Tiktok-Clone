"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerUser = exports.loginUser = void 0;

var _authSlice = require("./authSlice");

var _reactToastify = require("react-toastify");

var _jsCookie = _interopRequireDefault(require("js-cookie"));

var _request = _interopRequireDefault(require("../ultis/request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var loginUser = function loginUser(user, dispatch, navigate, routes) {
  var res, lastRoute;
  return regeneratorRuntime.async(function loginUser$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          dispatch((0, _authSlice.loginStart)());
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(_request["default"].post("/auth/login", user));

        case 4:
          res = _context.sent;
          dispatch((0, _authSlice.loginSuccess)(res.data.data));

          _reactToastify.toast.success("Đăng nhập thành công");

          _jsCookie["default"].set("access_token", res.data.meta.token, {
            expires: 1,
            path: "/",
            secure: true,
            sameSite: "strict"
          });

          lastRoute = routes[routes.length - 2]; // check if user first time navigate to page

          if (!(routes.length <= 2)) {
            _context.next = 12;
            break;
          }

          navigate("/");
          return _context.abrupt("return");

        case 12:
          if (lastRoute != "/register") {
            navigate(-1);
          } else navigate("/");

          _context.next = 20;
          break;

        case 15:
          _context.prev = 15;
          _context.t0 = _context["catch"](1);

          if (!_context.t0.response) {
            _context.next = 20;
            break;
          }

          _reactToastify.toast.error("Email hoặc mật khẩu không chính xác!");

          return _context.abrupt("return", _context.t0);

        case 20:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 15]]);
};

exports.loginUser = loginUser;

var registerUser = function registerUser(user, dispatch, navigate) {
  return regeneratorRuntime.async(function registerUser$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          dispatch((0, _authSlice.registerStart)());
          _context2.prev = 1;
          _context2.next = 4;
          return regeneratorRuntime.awrap(_request["default"].post("/auth/register", user));

        case 4:
          dispatch((0, _authSlice.registerSucces)());

          _reactToastify.toast.success("Đăng ký thành công!");

          navigate("/login");
          _context2.next = 12;
          break;

        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](1);

          if (_context2.t0.response) {
            console.log(_context2.t0);

            _reactToastify.toast.error("Email đã tồn tại!");

            dispatch((0, _authSlice.registerFailed)());
          }

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 9]]);
};

exports.registerUser = registerUser;