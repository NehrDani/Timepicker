## Javascript Timepicker
**- lightweight, customizable, no dependencies -**

[Examples](https://nehrdani.github.io/Timepicker/)

### Getting Started

This is the minimum markup and it renders the Timepicker as a static element on the page. If you want it dynamically hidden or shown on an event you have to do this by yourself.  
I'm sure you can do it :wink:.

#### HTML

```html
<input id="input" type="text" name="date">
<div id="container">
<!-- the Timepicker will be rendered here -->
</div>
```

#### Javascript

```js
// best wait for DOM ready
document.addEventListener("DOMContentLoaded", function () {

  // constructor
  var timepicker = new Timepicker({
    container: document.querySelector("#container"), // container
    onChange: onChange // callback
  });

  // get a Date object as parameter to work with
  function onChange (date) {
    document.querySelector("#input").value = date.toDateString();
  }
}
```

### Properties
- time [Date, null] - The current time of the Timepicker, if set.

### Methods
- setTime (time) - Sets the value of the Timepicker, it must be a Date object or parsable through 'new Date()', returns the new time as Date object.
- clearTime () - Clears the timepickers value.
- destroy - destroys the Timepicker. Returns null.

### Options
- container - The container where the Timepicker will be rendered into.
- clock *(Default: 12)* . The clock to be used *(12 | 24)* 12-hour clock or 24-hour clock.
- onChange (date) - Callback that returns the selected time.
- hourStep *(Default: 1)* - Sets the step for incrementing / decrementing the hours.
- minuteStep *(Default: 1)* - Sets the step for incrementing / decrementing the minutes.

### NPM
- npm install - Installs dependencies.
- npm run uglify - Minifies the source for production use.

### About
*Since I build already an Datepicker, it was only one step more to build a Timepicker too.*  
*This is __not__ meant to be an all in one solution. This is from a developer for developers.*

**Feel free to try, fork and share. I appreciate every feedback.**
