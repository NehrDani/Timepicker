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
      notation: "12"
    };

    this._config = extend(defaults, arguments[0]);

    assemble.call(this);
  }

  Timepicker.prototype = {
  };

  function assemble () {
    var btn = {
      hourUp: null,
      hourDown: null,
      minuteUp: null,
      minuteDown: null,
      hour: null,
      minute: null,
      period: null
    };

    var timepicker = document.createElement("div");
    timepicker.className = "timepicker";
    timepicker.innerHTML = getTemplate();

    // Catching all necessary dom elements
    var buttons = timepicker.querySelectorAll(".timepicker-btn");
    for (var i = 0, len = buttons.length; i < len; i++) {
      switch (buttons[i].name) {
      case "hour-up":
        btn.hourUp = buttons[i];
        break;
      case "hour-down":
        btn.hourDown = buttons[i];
        break;
      case "minute-up":
        btn.minuteUp = buttons[i];
        break;
      case "minute-down":
        btn.minuteDown = buttons[i];
        break;
      case "hour":
        btn.hour = buttons[i];
        break;
      case "minute":
        btn.minute = buttons[i];
        break;
      case "period":
        btn.period = buttons[i];
        break;
      }
    }

    this._config.container.appendChild(timepicker);
  }

  function getTemplate () {
    /* eslint quotes: 0, indent: 0*/
    return [
      '<table>',
        '<tr>',
          '<td><button class="timepicker-btn" name="hour-up" type="button">',
            '<i class="chevron-up"></i>',
          '</button></td>',
          '<td></td>',
          '<td><button class="timepicker-btn" name="minute-up" type="button">',
            '<i class="chevron-up"></i>',
          '</button></td>',
          '<td></td>',
        '</tr>',
        '<tr>',
          '<td><button class="timepicker-btn" name="hour" type="button">',
          '</button></td>',
          '<td>:</td>',
          '<td><button class="timepicker-btn" name="minute" type="button">',
          '</button></td>',
          '<td><button class="timepicker-btn" name="period" type="button">',
          '</button></td>',
        '</tr>',
        '<tr>',
          '<td><button class="timepicker-btn" name="hour-down" type="button">',
            '<i class="chevron-down"></i>',
          '</button></td>',
          '<td></td>',
          '<td><button class="timepicker-btn" name="minute-down" type="button">',
            '<i class="chevron-down"></i>',
          '</button></td>',
        '</tr>',
      '</table>'
    ].join("");
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
