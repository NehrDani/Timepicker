/*!
 * Timepicker
 *
 * Copyright © 2016 Daniel Nehring | MIT license | https://github.com/NehrDani/Timepicker
 */

(function (window, document, undefined) {
  window.Timepicker = Timepicker;

  function Timepicker () {
    var defaults = {
      container: null,
      clock: 12,
      hourStep: 1,
      minuteStep: 1,
      onChange: null
    };

    this.time = null;

    this._state = {
      mode: "time",
      hour: null,
      minute: null,
      period: "AM"
    };

    this._timepicker = null;

    this._config = extend(defaults, arguments[0]);

    this._init();
  }

  Timepicker.prototype = {
    _init: init,
    _render: render,
    _setState: setState,
    setTime: setTime,
    clearTime: clearTime,
    destroy: destroy
  };

  function setTime (time) {
    return this._setState({
      action: "SET_TIME",
      value: time
    });
  }

  function clearTime () {
    return this._setState({
      action: "CLEAR_TIME"
    });
  }

  function destroy () {
    this._timepicker.parentNode.removeChild(this._timepicker);
    this._timepicker = null;
    return null;
  }

  function setState (state) {
    var step;

    switch (state.action) {
    case "SET_TIME":
      if (state.value) {
        this.time = new Date(state.value);
        this._state.hour = this.time.getHours();
        this._state.minute = this.time.getMinutes();
        this._state.period = (this._state.hour >= 12) ? "PM" : "AM";
      } else {
        this.time = null;
        this._state.hour = null;
        this._state.minute = null;
      }
      this._render();
      return this.time;
    case "CLEAR_TIME":
      this.time = null;
      this._state.hour = null;
      this._state.minute = null;
      this._render();
      return null;
    case "SET_HOUR":
      this._state.hour = +state.value;
      this._state.mode = "time";
      renderTimepicker.call(this);
      break;
    case "HOUR_UP":
      step = this._config.hourStep;
      this._state.hour += step;
      this._state.hour = Math.floor(this._state.hour / step) * step;
      break;
    case "HOUR_DOWN":
      step = this._config.hourStep;
      this._state.hour -= step;
      this._state.hour = Math.ceil(this._state.hour / step) * step;
      break;
    case "SET_MINUTE":
      this._state.minute = +state.value;
      this._state.mode = "time";
      renderTimepicker.call(this);
      break;
    case "MINUTE_UP":
      step = this._config.minuteStep;
      this._state.minute += step;
      this._state.minute = Math.floor(this._state.minute / step) * step;
      break;
    case "MINUTE_DOWN":
      step = this._config.minuteStep;
      this._state.minute -= step;
      this._state.minute = Math.ceil(this._state.minute / step) * step;
      break;
    case "SET_PERIOD":
      if (this._state.hour) {
        this._state.hour = (this._state.hour > 12) ?
          this._state.hour -= 12 : this._state.hour += 12;
      }
      break;
    case "SET_MODE":
      this._state.mode = state.value;
      switch (this._state.mode) {
      case "time":
        renderTimepicker.call(this);
        this._render();
        break;
      case "hour":
        renderHourpicker.call(this);
        break;
      case "minute":
        renderMinutepicker.call(this);
        break;
      }
      return;
    }

    // Update and save state
    if (this._state.hour !== null && this._state.minute !== null) {
      this.time = new Date();
      this.time.setHours(this._state.hour, this._state.minute, 0, 0);
      this._state.hour = this.time.getHours();
      this._state.minute = this.time.getMinutes();
      this._state.period = this._state.hour >= 12 ? "PM" : "AM";

      // call onChange handler
      if (typeof this._config.onChange === "function") {
        this._config.onChange.call(this, this.time);
      }
    }

    // Rerender current state
    this._render();

    return this.time;
  }

  function render () {
    if (this._state.mode === "time") {
      var hour = getHour(this._state.hour, this._config.clock);
      var minute = (this._state.minute !== null) ?
        ("0" + this._state.minute).slice(-2) : "-";

      this._timepicker
        .querySelector(".timepicker-hour").innerHTML = hour;
      this._timepicker
        .querySelector(".timepicker-minute").innerHTML = minute;
      if (this._config.clock === 12) {
        this._timepicker
          .querySelector(".timepicker-period").innerHTML = this._state.period;
      }
    }
  }

  function init () {
    this._timepicker = document.createElement("div");
    this._timepicker.className = "timepicker";
    this._config.container.appendChild(this._timepicker);

    renderTimepicker.call(this);
    this._render();
  }

  function renderTimepicker () {
    var row, col, btn;
    var setState = this._setState.bind(this);

    // <table>
    var table = createElement("table");

    // <tr>
    row = table.insertRow();

    /* HOUR_UP */
    // <td>
    col = row.insertCell();
    // <button .timepicker-btn>
    btn = createElement("button", {
      class: "timepicker-btn",
      "data-action": "HOUR_UP",
      type: "button"
    });
    btn.appendChild(createElement("i", {
      class: "chevron-up"
    }));
    btn.addEventListener("click", function () {
      setState({
        action: this.getAttribute("data-action")
      });
    });
    // </button .timepicker-btn>
    col.appendChild(btn);
    // </td>

    /* Placeholder */
    // <td>
    row.insertCell();
    // </td>

    /* MINUTE_UP */
    // <td>
    col = row.insertCell();
    // <button .timepicker-btn>
    btn = createElement("button", {
      class: "timepicker-btn",
      "data-action": "MINUTE_UP",
      type: "button"
    });
    btn.appendChild(createElement("i", {
      class: "chevron-up"
    }));
    btn.addEventListener("click", function () {
      setState({
        action: this.getAttribute("data-action")
      });
    });
    // </button .timepicker-btn>
    col.appendChild(btn);
    // </td>

    /* Placeholder if 12 hr clock is set */
    if (this._config.clock === 12) {
      // <td>
      row.insertCell();
      // </td>
    }
    // </tr>

    // <tr>
    row = table.insertRow();

    /* Display hour */
    // <td>
    col = row.insertCell();
    // <button .timepicker-btn>
    btn = createElement("button", {
      class: "timepicker-btn timepicker-hour",
      "data-action": "SET_MODE",
      value: "hour",
      type: "button"
    });
    btn.addEventListener("click", function () {
      setState({
        action: this.getAttribute("data-action"),
        value: this.value
      });
    });
    // </button .timepicker-btn>
    col.appendChild(btn);
    // </td>

    /* colon */
    // <td>
    col = row.insertCell();
    col.innerHTML = ":";
    // </td>

    /* Display Minute */
    // <td>
    col = row.insertCell();
    // <button .timepicker-btn>
    btn = createElement("button", {
      class: "timepicker-btn timepicker-minute",
      "data-action": "SET_MODE",
      value: "minute",
      type: "button"
    });
    btn.addEventListener("click", function () {
      setState({
        action: this.getAttribute("data-action"),
        value: this.value
      });
    });
    // </button .timepicker-btn>
    col.appendChild(btn);
    // </td>

    /* Display period if 12 hr clock is set */
    if (this._config.clock === 12) {
      // <td>
      col = row.insertCell();
      // <button .timepicker-btn>
      btn = createElement("button", {
        class: "timepicker-btn timepicker-period",
        "data-action": "SET_PERIOD",
        type: "button"
      });
      btn.addEventListener("click", function () {
        setState({
          action: this.getAttribute("data-action")
        });
      });
      // </button .timepicker-btn>
      col.appendChild(btn);
    }
    // </td>
    // </tr>

    // <tr>
    row = table.insertRow();

    /* HOUR_UP */
    // <td>
    col = row.insertCell();
    // <button .timepicker-btn>
    btn = createElement("button", {
      class: "timepicker-btn",
      "data-action": "HOUR_DOWN",
      type: "button"
    });
    btn.appendChild(createElement("i", {
      class: "chevron-down"
    }));
    btn.addEventListener("click", function () {
      setState({
        action: this.getAttribute("data-action")
      });
    });
    // </button .timepicker-btn>
    col.appendChild(btn);
    // </td>

    /* Placeholder */
    // <td>
    row.insertCell();
    // </td>

    /* MINUTE_UP */
    // <td>
    col = row.insertCell();
    // <button .timepicker-btn>
    btn = createElement("button", {
      class: "timepicker-btn",
      "data-action": "MINUTE_DOWN",
      type: "button"
    });
    btn.appendChild(createElement("i", {
      class: "chevron-down"
    }));
    btn.addEventListener("click", function () {
      setState({
        action: this.getAttribute("data-action")
      });
    });
    // </button .timepicker-btn>
    col.appendChild(btn);
    // </td>

    /* Placeholder if 12 hr clock is set */
    if (this._config.clock === 12) {
      // <td>
      row.insertCell();
      // </td>
    }
    // </tr>

    this._timepicker.innerHTML = null;
    this._timepicker.appendChild(table);
    return table;
  }

  function renderHourpicker () {
    var row, col, btn;
    var setState = this._setState.bind(this);
    var clock = this._config.clock, hour;

    // <table>
    var table = createElement("table");

    // <tr>
    row = table.insertRow();

    for (var i = 0, c = 0; i < clock; i++) {
      hour = i;
      // Add 1 hour since there is no 0 hour in AM/PM
      // Add 12 hours if in PM
      if (clock === 12) {
        if (i === 0) {
          if (this._state.period === "PM")
            hour = 12;
          else if (this._state.period === "AM")
            hour = 24;
        } else {
          if (this._state.period === "PM")
            hour += 12;
        }
      }

      // <td>
      col = row.insertCell();
      // <button .timepicker-btn>
      btn = createElement("button", {
        class: "timepicker-btn",
        "data-action": "SET_HOUR",
        type: "button",
        value: hour
      });
      // Convert hour to correct clock
      hour = (clock === 12 && hour > 12) ? hour - 12 : hour;
      btn.innerHTML = ("0" + hour).slice(-2);
      btn.addEventListener("click", function () {
        setState({
          action: this.getAttribute("data-action"),
          value: this.value
        });
      });
      col.appendChild(btn);
      // </button .timepicker-btn>
      // </td>
      // </tr>

      if (++c === (clock / 4)) {
        // <tr>
        row = table.insertRow();
        c = 0;
      }
    }
    // </table>

    this._timepicker.innerHTML = null;
    this._timepicker.appendChild(table);
    return table;
  }

  function renderMinutepicker () {
    var row, col, btn;
    var setState = this._setState.bind(this);

    // <table>
    var table = createElement("table");

    // <tr>
    row = table.insertRow();

    for (var i = 0, c = 0; i < 12; i++) {
      // <td>
      col = row.insertCell();
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
      // </td>
      // </tr>

      if (++c === 3) {
        // <tr>
        row = table.insertRow();
        c = 0;
      }
    }
    // </table>

    this._timepicker.innerHTML = null;
    this._timepicker.appendChild(table);
    return table;
  }

  /* Utility & helper methods */
  function getHour (hour, clock) {
    if (hour !== null) {
      if (clock === 12 && (hour > 12 || hour === 0)) {
        hour = Math.abs(hour - 12);
      }
      hour = ("0" + hour).slice(-2);
    } else {
      hour = "-";
    }

    return hour;
  }

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
