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
      notation: 12
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
    this.time = new Date(time);
    this._state.hour = this.time.getHours();
    this._state.minute = this.time.getMinutes();

    renderTimepicker.call(this);
  }

  function setState (state) {
    switch (state.action) {
      case "HOUR_UP":
        this._state.hour += 1;
        if (this._state.hour > 23)
          this._state.hour = 0;
        break;
      case "HOUR_DOWN":
        this._state.hour -= 1;
        if (this._state.hour < 0)
          this._state.hour = 23;
        break;
      case "MINUTE_UP":
        this._state.minute += 1;
        if (this._state.minute > 60)
          this._state.minute = 0;
        break;
      case "MINUTE_DOWN":
        this._state.minute -= 1;
        if (this._state.minute < 0)
          this._state.minute = 60;
        break;
    }

    if (this._state.mode === "time") {
      var hour = this._config.notation === 12 && (this._state.hour > 12 || this._state.hour === 0) ?
        Math.abs(this._state.hour - 12) : this._state.hour;
      hour = hour !== null ? ("0" + hour).slice(-2) : "---";
      this._timepicker.querySelector(".timepicker-hour")
        .innerHTML = hour;
      // renderTimepicker.call(this);
    }
  }

  function init () {
    this._timepicker = document.createElement("div");
    this._timepicker.className = "timepicker";
    this._config.container.appendChild(this._timepicker);

    renderTimepicker.call(this);
  }

  function renderTimepicker () {
    var setState = this._setState.bind(this);
    var notation = this._config.notation;
    var hour = notation === 12 && (this._state.hour > 12 || this._state.hour === 0) ?
      Math.abs(this._state.hour - 12) : this._state.hour;
    hour = hour !== null ? ("0" + hour).slice(-2) : "---";
    var minute = this._state.minute;
    minute = minute !== null ? ("0" + minute).slice(-2) : "---";
    var period = this._state.hour >= 12 ? "PM" : "AM";

    /* eslint quotes: 0, indent: 0*/
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
          '<td><button class="timepicker-btn timepicker-hour" type="button">',
            hour,
          '</button></td>',
          '<td>:</td>',
          '<td><button class="timepicker-btn timepicker-minute" type="button">',
            minute,
          '</button></td>',
          '<td><button class="timepicker-btn timepicker-period" type="button">',
            period,
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

    this._timepicker.innerHTML = timepicker;

    var buttons = this._timepicker.querySelectorAll(".timepicker-btn");
    for (var i = 0, len = buttons.length; i < len; i++) {
      buttons[i].addEventListener("mousedown", function () {
        console.log("down");
        setState({
          action: this.getAttribute("data-action"),
          value: this.value
        });
      });
    }

    return this._timepicker;
  }

  /* Utility methods */
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
