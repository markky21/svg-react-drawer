export function svgDraw(SVG) {
  // Our Object which manages drawing

  function PaintHandler(el, event, options) {
    this.el = el;
    el.remember('_paintHandler', this);

    var _this = this,
      plugin = this.getPlugin();

    this.parent = el.parent(SVG.Nested) || el.parent(SVG.Doc);
    this.p = this.parent.node.createSVGPoint(); // Helping point for coord transformation
    this.m = null; // transformation matrix. We get it when drawing starts
    this.startPoint = null;
    this.lastUpdateCall = null;
    this.options = {};
    this.set = new SVG.Set();

    // Merge options and defaults
    for (let i in this.el.draw.defaults) {
      this.options[i] = this.el.draw.defaults[i];
      if (typeof options[i] !== 'undefined') {
        this.options[i] = options[i];
      }
    }

    if (plugin.point) {
      plugin['pointPlugin'] = plugin.point;
      delete plugin.point;
    }

    // Import all methods from plugin into object
    for (let i in plugin) {
      this[i] = plugin[i];
    }

    // When we got an event, we use this for start, otherwise we use the click-event as default
    if (!event) {
      this.parent.on('click.draw', function(e) {
        _this.start(e);
      });
    }
  }

  PaintHandler.prototype.transformPoint = function(x, y) {
    this.p.x = x - (this.offset.x - window.pageXOffset);
    this.p.y = y - (this.offset.y - window.pageYOffset);

    return this.p.matrixTransform(this.m);
  };

  PaintHandler.prototype.start = function(event) {
    var _this = this;

    // get the current transform matrix from screen to element (offset corrected)
    this.m = this.el.node.getScreenCTM().inverse();

    // we save the current scrolling-offset here
    this.offset = { x: window.pageXOffset, y: window.pageYOffset };

    // we want to snap in screen-coords, so we have to scale the snapToGrid accordingly
    this.options.snapToGrid *= Math.sqrt(this.m.a * this.m.a + this.m.b * this.m.b);

    // save the startpoint
    this.startPoint = this.snapToGrid(this.transformPoint(event.clientX, event.clientY));

    // the plugin may do some initial work
    if (this.init) {
      this.init(event);
    }

    // Fire our `drawstart`-event. We send the offset-corrected cursor-position along
    this.el.fire('drawstart', { event: event, p: this.p, m: this.m });

    // We need to bind the update-function to the mousemove event to keep track of the cursor
    SVG.on(window, 'mousemove.draw', function(e) {
      _this.update(e);
    });

    // Every consecutive call to start should map to point now
    this.start = this.point;
  };

  // This function draws a point if the element is a polyline or polygon
  // Otherwise it will just stop drawing the shape cause we are done
  PaintHandler.prototype.point = function(event) {
    if (this.point !== this.start) return this.start(event);

    if (this.pointPlugin) {
      return this.pointPlugin(event);
    }

    // If this function is not overwritten we just call stop
    this.stop(event);
  };

  // The stop-function does the cleanup work
  PaintHandler.prototype.stop = function(event) {
    if (event) {
      this.update(event);
    }

    // Plugin may want to clean something
    if (this.clean) {
      this.clean();
    }

    // Unbind from all events
    SVG.off(window, 'mousemove.draw');
    this.parent.off('click.draw');

    // remove Refernce to PaintHandler
    this.el.forget('_paintHandler');

    // overwrite draw-function since we never need it again for this element
    this.el.draw = function() {};

    // Fire the `drawstop`-event
    this.el.fire('drawstop');
  };

  // Updates the element while moving the cursor
  PaintHandler.prototype.update = function(event) {
    if (!event && this.lastUpdateCall) {
      event = this.lastUpdateCall;
    }

    this.lastUpdateCall = event;

    // Get the current transform matrix
    // it could have been changed since the start or the last update call
    this.m = this.el.node.getScreenCTM().inverse();

    // Call the calc-function which calculates the new position and size
    this.calc(event);

    // Fire the `drawupdate`-event
    this.el.fire('drawupdate', { event: event, p: this.p, m: this.m });
  };

  // Called from outside. Finishs a poly-element
  PaintHandler.prototype.done = function() {
    this.calc();
    this.stop();

    this.el.fire('drawdone');
  };

  // Called from outside. Cancels a poly-element
  PaintHandler.prototype.cancel = function() {
    // stop drawing and remove the element
    this.stop();
    this.el.remove();

    this.el.fire('drawcancel');
  };

  // Calculate the corrected position when using `snapToGrid`
  PaintHandler.prototype.snapToGrid = function(draw) {
    var temp = null;

    // An array was given. Loop through every element
    if (draw.length) {
      temp = [draw[0] % this.options.snapToGrid, draw[1] % this.options.snapToGrid];
      draw[0] -= temp[0] < this.options.snapToGrid / 2 ? temp[0] : temp[0] - this.options.snapToGrid;
      draw[1] -= temp[1] < this.options.snapToGrid / 2 ? temp[1] : temp[1] - this.options.snapToGrid;
      return draw;
    }

    // Properties of element were given. Snap them all
    for (var i in draw) {
      temp = draw[i] % this.options.snapToGrid;
      draw[i] -=
        (temp < this.options.snapToGrid / 2 ? temp : temp - this.options.snapToGrid) +
        (temp < 0 ? this.options.snapToGrid : 0);
    }

    return draw;
  };

  PaintHandler.prototype.param = function(key, value) {
    this.options[key] = value === null ? this.el.draw.defaults[key] : value;
    this.update();
  };

  // Returns the plugin
  PaintHandler.prototype.getPlugin = function() {
    return this.el.draw.plugins[this.el.type];
  };

  SVG.extend(SVG.Element, {
    // Draw element with mouse
    draw: function(event, options?, value?) {
      // sort the parameters
      if (!(event instanceof Event || typeof event === 'string')) {
        options = event;
        event = null;
      }

      // get the old Handler or create a new one from event and options
      var paintHandler = this.remember('_paintHandler') || new PaintHandler(this, event, options || {});

      // When we got an event we have to start/continue drawing
      if (event instanceof Event) {
        paintHandler['start'](event);
      }

      // if event is located in our PaintHandler we handle it as method
      if (paintHandler[event]) {
        paintHandler[event](options, value);
      }

      return this;
    },
  });

  // Default values. Can be changed for the whole project if needed
  SVG.Element.prototype.draw.defaults = {
    snapToGrid: 1, // Snaps to a grid of `snapToGrid` px
  };

  SVG.Element.prototype.draw.extend = function(name, obj) {
    var plugins = {};
    if (typeof name === 'string') {
      plugins[name] = obj;
    } else {
      plugins = name;
    }

    for (var shapes in plugins) {
      var shapesArr = shapes.trim().split(/\s+/);

      for (var i in shapesArr) {
        SVG.Element.prototype.draw.plugins[shapesArr[i]] = plugins[shapes];
      }
    }
  };

  // Container for all types not specified here
  SVG.Element.prototype.draw.plugins = {};
}
