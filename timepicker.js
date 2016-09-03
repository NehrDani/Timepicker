/*!
 * Timepicker
 *
 * Copyright © 2016 Daniel Nehring | MIT license | https://github.com/NehrDani/Timepicker
 */

(function (window, document) {
  window.Timepicker = Timepicker;

  function Timepicker () {
    var defaults = {
      container: null,
      hours: 12
    };

    this.time = new Date();

    this._state = {
      mode: "time",
      hour: null,
      minute: null
    };

    this._timepicker = null;

    this._config = extend(defaults, arguments[0]);

    this._init();
  }

  Timepicker.prototype = {
    _init: init,
    _setState: setState,
    setTime: setTime
  };

  function setTime (time) {
    this._setState({
      action: "SET_TIME",
      value: time
    });
  }

  function setState (state) {
    switch (state.action) {
    case "SET_TIME":
      this.time = new Date(state.value);
      break;
    case "SET_HOUR":
      this.time.setHours(state.value, this._state.minute, 0, 0);
      this._state.mode = "time";
      renderTimepicker.call(this);
      break;
    case "HOUR_UP":
      this.time.setHours(this._state.hour + 1, this._state.minute, 0, 0);
      break;
    case "HOUR_DOWN":
      this.time.setHours(this._state.hour - 1, this._state.minute, 0, 0);
      break;
    case "SET_MINUTE":
      this.time.setMinutes(state.value, 0, 0);
      this._state.mode = "time";
      renderTimepicker.call(this);
      break;
    case "MINUTE_UP":
      this.time.setMinutes(this._state.minute + 1, 0, 0);
      break;
    case "MINUTE_DOWN":
      this.time.setMinutes(this._state.minute - 1, 0, 0);
      break;
    case "SET_PERIOD":
      this._state.hour = (this._state.hour > 12) ?
        this._state.hour -= 12 : this._state.hour += 12;
      this.time.setHours(this._state.hour, this._state.minute, 0, 0);
      break;
    case "SET_MODE":
      this._state.mode = state.value;
      switch (this._state.mode) {
      case "hour":
        renderHourpicker.call(this);
        break;
      case "minute":
        renderMinutepicker.call(this);
        break;
      }
      break;
    }

    this._state.hour = this.time.getHours();
    this._state.minute = this.time.getMinutes();

    if (this._state.mode === "time") {
      render.call(this);
    }
  }

  function render () {
    var hour = getHour(this._state.hour, this._config.hours);
    var minute = (this._state.minute !== null) ?
      ("0" + this._state.minute).slice(-2) : "_";
    var period = this._state.hour >= 12 ? "PM" : "AM";

    this._timepicker
      .querySelector(".timepicker-hour").innerHTML = hour;
    this._timepicker
      .querySelector(".timepicker-minute").innerHTML = minute;
    this._timepicker
      .querySelector(".timepicker-period").innerHTML = period;
  }

  function init () {
    this._timepicker = document.createElement("div");
    this._timepicker.className = "timepicker";
    this._config.container.appendChild(this._timepicker);

    renderTimepicker.call(this);
  }

  function renderTimepicker () {
    /* eslint-disable */
    var timepicker = [
      '<table>',
        '<tr>',
          '<td><button class="timepicker-btn" data-action="HOUR_UP" type="button">',
            '<i class="chevron-up"></i>',
          '</button></td>',
          '<td></td>',
          '<td><button class="timepicker-btn" data-action="MINUTE_UP" type="button">',
            '<i class="chevron-up"></i>',
          '</button></td>',
          '<td></td>',
        '</tr>',
        '<tr>',
          '<td><button class="timepicker-btn timepicker-hour" data-action="SET_MODE" value="hour" type="button">',
            '_',
          '</button></td>',
          '<td>:</td>',
          '<td><button class="timepicker-btn timepicker-minute" data-action="SET_MODE" value="minute" type="button">',
            '_',
          '</button></td>',
          '<td><button class="timepicker-btn timepicker-period" data-action="SET_PERIOD" type="button">',
            'AM',
          '</button></td>',
        '</tr>',
        '<tr>',
          '<td><button class="timepicker-btn" data-action="HOUR_DOWN" type="button">',
            '<i class="chevron-down"></i>',
          '</button></td>',
          '<td></td>',
          '<td><button class="timepicker-btn" data-action="MINUTE_DOWN" type="button">',
            '<i class="chevron-down"></i>',
          '</button></td>',
        '</tr>',
      '</table>'
    ].join("");
    /* eslint-enable */

    this._timepicker.innerHTML = timepicker;

    var setState = this._setState.bind(this);
    var buttons = this._timepicker.querySelectorAll(".timepicker-btn");
    for (var i = 0, len = buttons.length; i < len; i++) {
      buttons[i].addEventListener("mousedown", function () {
        setState({
          action: this.getAttribute("data-action"),
          value: this.value
        });
      });
    }

    return timepicker;
  }

  function renderHourpicker () {
    var row, col, btn;
    var setState = this._setState.bind(this);
    var hours = this._config.hours;
    var add = (hours === 12) ? 1 : 0;

    // <table>
    var hourpicker = createElement("table");

    // <tr>
    row = createElement("tr");

    for (var i = 0, c = 0; i < hours; i++) {
      // <td>
      col = createElement("td");
      // <button .timepicker-btn>
      btn = createElement("button", {
        class: "timepicker-btn",
        "data-action": "SET_HOUR",
        type: "button",
        value: i + add
      });
      btn.innerHTML = ("0" + (i + add)).slice(-2);
      btn.addEventListener("click", function () {
        setState({
          action: this.getAttribute("data-action"),
          value: this.value
        });
      });
      col.appendChild(btn);
      // </button .timepicker-btn>
      row.appendChild(col);
      // </td>

      if (++c === 4) {
        hourpicker.appendChild(row);
        // </tr>

        // <tr>
        row = createElement("tr");
        c = 0;
      }
    }
    // </table>

    this._timepicker.innerHTML = null;
    this._timepicker.appendChild(hourpicker);
    return hourpicker;
  }

  function renderMinutepicker () {
    var row, col, btn;
    var setState = this._setState.bind(this);

    // <table>
    var minutepicker = createElement("table");

    // <tr>
    row = createElement("tr");

    for (var i = 0, c = 0; i < 12; i++) {
      // <td>
      col = createElement("td");
      // <button .timepicker-btn>
      btn = createElement("button", {
        class: "timepicker-btn",
        "data-action": "SET_MINUTE",
        type: "button",
        value: i * 5
      });
      btn.innerHTML = ("0" + (i * 5)).slice(-2);
      btn.addEventListener("click", function () {
        setState({
          action: this.getAttribute("data-action"),
          value: this.value
        });
      });
      col.appendChild(btn);
      // </button .timepicker-btn>
      row.appendChild(col);
      // </td>

      if (++c === 4) {
        minutepicker.appendChild(row);
        // </tr>

        // <tr>
        row = createElement("tr");
        c = 0;
      }
    }
    // </table>

    this._timepicker.innerHTML = null;
    this._timepicker.appendChild(minutepicker);
    return minutepicker;
  }

  /* Utility methods */
  function createElement (element, options) {
    var node = document.createElement(element);

    if (options !== undefined) {
      for (var option in options) {
        switch (option) {
        case "class":
          node.className = options[option];
          break;
        default:
          node.setAttribute(option, options[option]);
          break;
        }
      }
    }

    return node;
  }

  function getHour (hour, hours) {
    if (hour !== null) {
      if (hours === 12 && (hour > 12 || hour === 0)) {
        hour = Math.abs(hour - 12);
      }
      hour = ("0" + hour).slice(-2);
    } else {
      hour = "_";
    }

    return hour;
  }

  function extend (properties) {
    properties = properties || {};

    for (var i = 1; i < arguments.length; i++) {
      if (!arguments[i]) continue;

      for (var key in arguments[i]) {
        if (arguments[i].hasOwnProperty(key))
          properties[key] = arguments[i][key];
      }
    }

    return properties;
  }
})(window, document);
