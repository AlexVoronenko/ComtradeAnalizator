// Конструктор точки на плоскости
class Point2D {
   constructor(x, y) {
      this[2];
      this[0] = Number(x);
      this[1] = Number(y);
      // return [x, y];
   }
   // Функция возвращает значение расстояния между
   // точками this и point
   Distance(point) {
      var d0 = this[0] - point[0];
      var d1 = this[1] - point[1];
      return Math.sqrt(d0 * d0 + d1 * d1);
   }
}

// const Point2D = (x, y) => [x, y];

//перевод радиан в градусы
//radToDeg = (rad) => rad * 180 / Math.PI;

//перевод градусов в радианы
//degToRad = (deg) => deg / 180 * Math.PI;

//перевод радиан в градусы
// radToDeg = (rad) => rad * 180 / Math.PI;
function radToDeg(rad) {
   return rad * 180 / Math.PI;
}
//перевод градусов в радианы
//  degToRad = (deg) => deg / 180 * Math.PI;
function degToRad(deg) {
   return deg / 180 * Math.PI;
}

//функция-конструктор прямой на плоскости
//задаемся двумя точками point1, point2
class Line2D {
   constructor(point1, point2) {
      if (point1 === undefined) {
         this.directCos = [undefined, undefined];
         this.distOXY = undefined;
         return;
      }
      if (point2 === undefined) {
         this.directCos = [undefined, undefined];
         this.distOXY = undefined;
         return;
      }

      let dx = point2[0] - point1[0];
      let dy = point2[1] - point1[1];
      let kon = -point1[1] * dx + point1[0] * dy;
      let norm = Math.hypot(dx, dy);

      let cosx = dy / norm;
      let cosy = -dx / norm;
      let dist = kon / norm;
      this.directCos = [cosx, cosy];
      this.distOXY = dist;
      this.point1 = point1;
      this.point2 = point2;

   }
   // функция возвращает точку лежащую на пересечении прямых this и line
   IntersectionTwoLines(line) {
      let det, xp, yp;

      det = this.directCos[0] * line.directCos[1] - this.directCos[1] * line.directCos[0];

      if (det == 0.0) { return null; }

      xp = this.distOXY * line.directCos[1] - line.distOXY * this.directCos[1];
      yp = line.distOXY * this.directCos[0] - this.distOXY * line.directCos[0];

      let pt = new Point2D();
      pt[0] = xp / det;
      pt[1] = yp / det;

      return [pt];

   }
   // Функция возвращает значение расстояния прямой от заданной точки.
   Distance(point) {
      return (this.directCos[0] * point[0] + this.directCos[1] * point[1] - this.distOXY);
   }
}

class Circle2D {
   constructor(point, radius, start, end, clock) {
      if ((point == undefined) || (radius == undefined)) {
         this.center = [undefined, undefined];
         this.radius = undefined;
         return;
      }
      this.center = [point[0], point[1]];
      this.radius = radius;
      this.start = start;
      this.end = end;
      this.clock = clock;
   }
   // Функция определяет точки пересечения point1 и point2 двух окружностей.
   // Одна окружность задается this, а вторая - circle2.
   IntersectionTwoCircles(circle2) {
      // point1, point2 - out cross points
      var point1 = new Point2D();
      var point2 = new Point2D();

      var midPt = new Point2D();
      var r1 = this.radius;
      var r2 = circle2.radius;

      var ptCenter1 = new Point2D(this.center[0], this.center[1]);
      var ptCenter2 = new Point2D(circle2.center[0], circle2.center[1]);

      // Distance between centers of circles
      var d = ptCenter1.Distance(ptCenter2);

      if (d > (r1 + r2)) {
         return null;
      }

      if ((d < r1) && ((d + r2) < (r1 - 0.00001))) // 0.00001 - очень маленькое значение ( ε )
      {
         return null;
      }

      if ((d < r2) && ((d + r1) < (r2 - 0.00001))) // 0.00001 - очень маленькое значение ( ε )
      {
         return null;
      }

      var a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);

      midPt[0] = ptCenter1[0] + a * (ptCenter2[0] - ptCenter1[0]) / d;
      midPt[1] = ptCenter1[1] + a * (ptCenter2[1] - ptCenter1[1]) / d;

      var t10 = ptCenter1[0];
      var t20 = ptCenter2[0];
      var tt = t10 + a * (t20 - t10) / d;

      if (Math.abs(r1) < Math.abs(a)) {
         return null;
      }

      var h = Math.sqrt(r1 * r1 - a * a);

      // Cross TwoLines 1
      point1[0] = midPt[0] - h * (ptCenter2[1] - ptCenter1[1]) / d;
      point1[1] = midPt[1] + h * (ptCenter2[0] - ptCenter1[0]) / d;

      // Cross TwoLines 2
      point2[0] = midPt[0] + h * (ptCenter2[1] - ptCenter1[1]) / d;
      point2[1] = midPt[1] - h * (ptCenter2[0] - ptCenter1[0]) / d;

      return [point1, point2];
   }
   //  Функция определяет точки пересечения point1 и point2 
   // окружности this и прямой line.
   IntersectionLineCircle(line) {

      var point1 = new Point2D();
      var point2 = new Point2D();


      var pt1 = [];
      var pt2 = [];
      var tt = new Point2D(this.center[0], this.center[1]);
      if (line.Distance(tt) > this.radius) {
         return null;
      }

      var x0 = this.center[0];
      var y0 = this.center[1];
      var r = this.radius;

      var dist = line.distOXY; // !!!!!
      var norm = [line.directCos[0], line.directCos[1]];
      var x1 = dist * norm[0];
      var y1 = dist * norm[1];
      var pts = []; // Две точки пересечения

      if (Math.abs(norm[1]) > 0.00001) // 0.00001 - очень маленькое значение ( ε )
      {
         var m = -norm[0] / norm[1];
         var a = 1 + m * m;
         var b = 2 * (y1 - y0 - m * x1) * m - 2 * x0;
         var c = x0 * x0 + (y1 - y0 - m * x1) * (y1 - y0 - m * x1) - r * r;

         if (!QuadraticEquation(a, b, c, pts)) {
            return null;
         }

         // Точка пересечения 1
         pt1[0] = pts[0];
         pt1[1] = y1 + m * (pts[0] - x1);
         point1[0] = pt1[0];
         point1[1] = pt1[1];

         // Точка пересечения 2
         pt2[0] = pts[1];
         pt2[1] = y1 + m * (pts[1] - x1);
         point2[0] = pt2[0];
         point2[1] = pt2[1];

         return [point1, point2];
      }
      else if (Math.abs(norm[0]) > 0.00001) // 0.00001 - очень маленькое значение ( ε )
      {
         var m = -norm[1] / norm[0];
         var a = 1 + m * m;
         var b = 2 * (x1 - x0 - m * y1) * m - 2 * y0;
         var c = y0 * y0 + (x1 - x0 - m * y1) * (x1 - x0 - m * y1) - r * r;

         if (!QuadraticEquation(a, b, c, pts)) {
            return null;
         }

         // The point of intersection 1
         pt1[0] = x1 + m * (pts[0] - y1);
         pt1[1] = pts[0];
         point1[0] = pt1[0];
         point1[1] = pt1[1];

         // The point of intersection 2
         pt2[0] = x1 + m * (pts[1] - y1);
         pt2[1] = pts[1];
         point2[0] = pt2[0];
         point2[1] = pt2[1];

         return [point1, point2];
      }
      return [point1, point2];
   }
}

// Решение квадратного уравнения.
// aa, bb, cc - коэффициенты и свободный член уравнения.
// rez - результат решения (массив из двух значений).
function QuadraticEquation(a, b, c, rez) {
   var discr;
   discr = b * b - 4 * a * c;

   if (discr < 0.0) {
      rez[0] = 0.0;
      rez[1] = 0.0;
      return null;
   }
   discr = Math.sqrt(discr);
   rez[0] = (-b + discr) / (2 * a);
   rez[1] = (-b - discr) / (2 * a);
   return 1;
}


