const POINT_RADIUS = 10;

/**
 * A panel for drawing splines.
 */
class BezierPanel extends Panel
{
  /**
   * Construct a new spline panel.
   */
  constructor(mock)
  {
    super();
    this._points = [
      {x: 200, y: 200},
      {x: 400, y: 200},
      {x: 200, y: 400},
      {x: 400, y: 400},
    ];
    this._selectedPoint = null;
  }

  /**
   * Handle the mouse down event.
   */
  onMouseDown(mouse)
  {
    console.log("Mouse down");
    console.log(mouse);
    this._selectedPoint = this.findPoint(mouse.x, mouse.y);
  }

  /**
  * Handle the mouse move event.
  */
  onMouseMove(mouse)
  {
    console.log("Mouse move");
    console.log(mouse);
    if (this._selectedPoint != null) {
      this._selectedPoint.x = mouse.x;
      this._selectedPoint.y = mouse.y;
    }
    this.requireRedraw();
  }

  /**
   * Handle the mouse up event.
   */
  onMouseUp(mouse)
  {
    console.log("Mouse up");
    console.log(mouse);
    this._selectedPoint = null;
  }

  /**
   * Handle the key down event.
   */
  onKeyDown(key)
  {
    console.log("Key down");
    console.log(key);
  }

  /**
   * Handle the key up event.
   */
  onKeyUp(key)
  {
    console.log("Key up");
    console.log(key);
  }

  /**
   * Find a control point at the given coordinates.
   */
  findPoint(x, y)
  {
    for (var point of this._points) {
      const dx = point.x - x;
      const dy = point.y - y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < POINT_RADIUS) {
        return point;
      }
    }
    return null;
  }

  lineColor = ["#00F", "#0F0", "#F00"]

  /**
   * Draw the content of the panel.
   */
  draw(context)
  {
    context.fillStyle = "#FFF";
    context.fillRect(0, 0, this.width, this.height);
    this.drawPoints(context);
    context.strokeStyle = "#AAA";
    context.beginPath();
    context.moveTo(this._points[0].x, this._points[0].y);
    for (let i = 1; i < this._points.length; i++) {
      context.lineTo(this._points[i].x, this._points[i].y);
    }
    context.stroke();

    let newPoints = this.algorithm(this._points, context, 0);
    for (let i = 1; i < 3; i++) {
        newPoints = this.algorithm(newPoints, context, i);
    }
    this.drawPoint(context, newPoints[2])
  }

  algorithm(points, context, colorIndex) {
    const t = 0.2;
    const b0 = points[0];
    const b1 = points[1];
    const b2 = points[2];

    const b10 = this.vectorSum(this.vectorMultiply(b0, 1 - t), this.vectorMultiply(b1, t));
    const b11 = this.vectorSum(this.vectorMultiply(b1, 1 - t), this.vectorMultiply(b2, t));
    const b20 = this.vectorSum(
        this.vectorMultiply(b10, 1 - t),
        this.vectorMultiply(b11, t)
    )

    let wrongIndex = 0;
    const newPoints = [b10, b11, b20]
    for (const point of newPoints) {
        if (point.x > 80 && point.x < 100) {
            console.log(wrongIndex)
        }
        wrongIndex++
        //this.drawPoint(context, point);
    }

    context.strokeStyle = this.lineColor[colorIndex];
    context.beginPath();
    context.moveTo(b10.x, b10.y);
    for (let i = 1; i < newPoints.length; i++) {
        context.lineTo(newPoints[i].x, newPoints[i].y);
    }
    context.stroke();

    return newPoints;
  }

  vectorMultiply(point, num) {
    return {
        x: point.x * num,
        y: point.y * num
    }
  }

  vectorSum(point1, point2) {
    return {
        x: point1.x + point2.x,
        y: point1.y + point2.y
    }
  }

  /**
   * Draw the control points.
   */
  drawPoints(context)
  {
    for (const point of this._points) {
      this.drawPoint(context, point);
    }
  }

  /**
   * Draw a control point.
   */
  drawPoint(context, point)
  {
    context.strokeStyle = "#00F";
    context.beginPath();
    context.moveTo(point.x - POINT_RADIUS, point.y);
    context.lineTo(point.x + POINT_RADIUS, point.y);
    context.stroke()
    context.beginPath();
    context.moveTo(point.x, point.y - POINT_RADIUS);
    context.lineTo(point.x, point.y + POINT_RADIUS);
    context.stroke()
  }
}

