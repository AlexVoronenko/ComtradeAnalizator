const structDevice = {
   "NAME": "Анализатор COMTRADE",
   "MANUFACTURER": "",
   "SERIALNO": "",
   "DEVICE-TYPE": "",
   "SUBSTATION": "",
   "SUBSTATION_ADRESS": "",
   "BAY": "",
   "BAY-ADDRESS": "",
   "PROTECTED-OBJECT-NAME": "",
   "ADDITIONAL-INFO2": "",
   "PHASES": "",
   "VNOM": "",
   "VMAX-LL": "",
   "VPRIM-LL": "",
   "INOM": "",
   "IMAX": "",
   "IPRIM": "",
   "FNOM": "",
   "DEGLITCHTIME": "",
   "DEBOUNCETIME": "",
   "ININOM": "",
   "VLNVN": ""
};

const structDistance = {
   "ACTIVE": "",
   "LINEANGLE": "",
   "PTCONN": "",
   "CTSTARPOINT": "",
   "IMPCORR": "",
   "IMPPRIM": "",
   "ARCRES": "",
   "TTOLPLUS": "",
   "TTOLMINUS": "",
   "TTOLREL": "",
   "ZTOLREL": "",
   "ZTOLABS": "",
   "KL": "",
   "RERL_XEXL": "",
   "Z0Z1": "",
   "KM": "",
   "RMRL_XMXL": "",
   "Z0MZ1": "",
   "TCBTRIP": "",
   "TCBCLOSE": "",
   "PERC52A": "",
   "PERC52B": "",
   "LINELENGTH": ""
};

const structZone = {
   "TYPE": "",
   "FAULTLOOP": "",
   "LABEL": "",
   "TRIPTIME": "",
   "ACTIVE": "",
   "TTOLPLUS": "",
   "TTOLMINUS": "",
   "TTOLREL": "",
   "INDEX": "",
   "ZTOLABS": "",
   "ZTOLREL": "",

   // "SHAPE": "" // данное поле не присутствует в стандарте
}


// создаем структуру rioObj из загруженного файла rioFile (текстовой файл)
function createRioStruc(rioFile) {
   let zoneRioArray;

   let rioObj = {};

   let rio = rioFile.split(/\r\n|\n/);
   let commentBlock = false;
   let levelPath = [];
   let curParrentName = "";
   let doubleParent = {
      "ZONE": 0,
      "UNIT": 0
   };

   // если найдем name, равный элементу массива paramForArray, то вернем TRUE, иначе FALSE 
   let parentsArray = ["TRIPCHAR", "TRIPCHAR-EARTH", "SHAPE", "MHOSHAPE", "LENSTOMATOSHAPE"];
   function parentForArray(name) {
      for (let i = 0; i < parentsArray.length; i++) { if (parentsArray[i] === name) return true; }
      return false;
   }

   for (let i = 0; i < rio.length; i++) {
      // массим с именами вложенного объекта и ссылками на текущий объект
      // длина массива будет соответствовать глубине вложения

      // пропустить строку, если ее длинна равна 0
      // trim - удаляет пробелы и табуляции с концов строки
      if (rio[i].trim().length === 0) continue;

      //выделили первое слово в строке
      let keyWorld = rio[i].match(/([\w\S]+)/)[0]; // получаем первое слово
      rio[i] = rio[i].replace(/\s/g, ''); // убираем все пробелы и табуляции в строке
      rio[i] = rio[i].replace(keyWorld, '');//оставили строку значений без keyWorld разделенных запятыми

      // пропускаем строки с комментариями...
      if (keyWorld.startsWith("REM") || keyWorld.startsWith("//") || keyWorld.startsWith(";")) continue;
      if (keyWorld.startsWith("/*")) commentBlock = true;
      if (rio[i].includes("*/") && commentBlock) commentBlock = false;
      if (commentBlock) continue;

      let currentObjState = rioObj;
      function addParent(parentName) {
         for (let i = 0; i < levelPath.length; i++) currentObjState = currentObjState[levelPath[i]];
         // if (curParrentName === "TRIPCHAR" || curParrentName === "TRIPCHAR-EARTH" || curParrentName === "SHAPE" || curParrentName === "MHOSHAPE" || curParrentName === "LENSTOMATOSHAPE") {

         //если параметры для зон, то формируем массив
         if (parentForArray(curParrentName)) {
            currentObjState[parentName] = new Array();
         } else {
            currentObjState[parentName] = new Object();
         }
      }

      function addChild(keyWorld, parm) {
         for (let i = 0; i < levelPath.length; i++) currentObjState = currentObjState[levelPath[i]];
         currentObjState[keyWorld] = parm;
      }

      function addParam(keyWorld, parm) {
         for (let i = 0; i < levelPath.length; i++) currentObjState = currentObjState[levelPath[i]];
         currentObjState.push(keyWorld + "," + parm);
      }

      if (keyWorld === "BEGIN") {
         // if (curParrentName === "") curParrentName = rio[i];
         //если есть объект с таким именем, то увеличиваем его на 1
         //.replace(/\d*$/) - вывезаем последние цивры из строки
         //.match(/\d*$/) - последние цифры в конце строки
         curParrentName = rio[i];

         // let param1 = curParrentName.replace(/\d+$/);
         // let param2 = preParrentName.replace(/\d+$/);
         // let number = preParrentName.match(/\d+$/);

         // к следующей зоне добавляем 1...
         if (curParrentName == "ZONE") {
            doubleParent["ZONE"]++;
            if (doubleParent["ZONE"] > 1) { curParrentName += doubleParent["ZONE"] - 1; }
         }

         addParent(curParrentName);
         levelPath.push(curParrentName);

      } else if (keyWorld === "END") {
         levelPath.length--;
      } else {
         // если элемент из parentForArray, то добавляем элемент в массив, а не в объект
         if (parentForArray(curParrentName)) {
            // if (curParrentName == "TRIPCHAR" || curParrentName == "TRIPCHAR-EARTH" || curParrentName == "SHAPE" || curParrentName === "MHOSHAPE" || curParrentName === "LENSTOMATOSHAPE") {
            addParam(keyWorld, rio[i]);
         } else {
            addChild(keyWorld, rio[i]);
         }
      }
   }

   // определим версию файла Comtrade    
   // заполним структуры RIO файла - structDevice, structDistance, zoneRioArray(structZone)

   //поиск родителя по имени свойства
   // возвращает массив:
   // [0] - параметр поиска
   // [1] - имя родителя
   // [2] - объект с параметрами
   function findKey(obj, key, objRootName) {
      let parentName = objRootName || "ROOT", result = [];
      function iterate(obj) {
         let parentPrevName = "";
         for (let property in obj) {
            if (obj.hasOwnProperty(property)) {
               if (obj[property].constructor === Object) {
                  parentPrevName = parentName;
                  parentName = property;
                  iterate(obj[property]);
                  parentName = parentPrevName;
               }
               if (key === property) {
                  result.push(key, parentName, obj[property]);
                  // result.push(key, parentName);
               }
            }
         }
      }
      iterate(obj);
      return result;
   }
   let distance = findKey(rioObj, "ZONE");

   // проверить корневые имена структуры на соответствие key

   function findRoot(obj, key) {
      for (let property in obj) if (property === key) return true;
      return false;
   }

   if (distance[0] === "ZONE" && distance[1] === "DISTANCE") {
      createZoneRioArrayNew();
   } else if (distance[0] === "ZONE" && findRoot(rioObj, distance[1])) { //имя в корне
      createZoneRioArrayOld()
   } else {
      alert("Версия файла RIO для обработки не определена!!!");
   }


   // создание массива zoneRioArray для нового формата файла 
   function createZoneRioArrayNew() {
      //очистим массивы перед следующим заполнением
      for (key in structDevice) structDevice[key] = "";
      for (key in structDistance) structDistance[key] = "";
      zoneRioArray = [];

      // Заполняем структуры RIO файла DEVICE и DISTANCE
      let device = findKey(rioObj, "DEVICE");
      for (key in structDevice) structDevice[key] = device[2][key];
      let distance = findKey(rioObj, "DISTANCE");
      for (key in structDistance) structDistance[key] = distance[2][key];

      let zone = findKey(rioObj, "ZONE");
      let i = 0;

      // заполним массив zoneRioArray
      while (zone.length !== 0) {
         zoneRioArray.push([]);
         for (key in zone[2]) { if (zone[2][key] !== undefined || zone[2][key] !== "") zoneRioArray[i][key] = zone[2][key]; }
         i++;
         zone = findKey(rioObj, "ZONE" + i);
      }
   }

   // создание массива zoneRioArray для старого формата файла (преобразуем в новый)
   function createZoneRioArrayOld() {
      //очистим массивы перед следующим заполнением
      for (key in structDevice) structDevice[key] = "";
      for (key in structDistance) structDistance[key] = "";
      zoneRioArray = [];
      let tempzoneRioArray = [];

      // Заполняем структуры RIO файла DEVICE и DISTANCE
      //   function findKey(obj, key, objRootName) {
      // возвращает массив:
      // [0] - параметр поиска
      // [1] - имя родителя
      // [2] - объект с параметрами
      let prot = "PROTECTIONDEVICE"; // родительская структура с данными
      let dist = "DISTANCE";
      structDevice.NAME = findKey(rioObj, "DEVICE", rioObj[prot])[2];
      structDevice.SUBSTATION = findKey(rioObj, "SUBSTATION", rioObj[prot])[2];
      structDevice.BAY = findKey(rioObj, "FEEDER", rioObj[prot])[2];
      let rating = findKey(rioObj, "RATING", rioObj[prot])[2].split(",");
      structDevice.VNOM = rating[0];
      structDevice.INOM = rating[1];
      structDevice.FNOM = rating[2];
      let max = findKey(rioObj, "MAX", rioObj[prot])[2].split(",");
      structDevice["VMAX-LL"] = max[0];
      structDevice.IMAX = max[1];
      //I>>
      //IE>>
      //TOL-T
      //TOL-Z
      //CURRGROUND
      structDistance.LINEANGLE = findKey(rioObj, "LINEANGLE", rioObj[prot])[2];
      let RERL = findKey(rioObj, "RE/RL", rioObj[prot])[2].split(",");
      let XEXL = findKey(rioObj, "XE/XL", rioObj[prot])[2].split(",");
      structDistance.RERERL_XEXLRL = RERL[0] + ", " + XEXL[0];
      //KS
      //ZS
      //TIME0MAX
      structDistance.NAME = findKey(rioObj, "IMPCORR", rioObj[dist])[2];
      //DIRCHAR

      let zone = findKey(rioObj, "ZONE");
      let i = 0;

      // заполним массив zoneRioArray
      while (zone.length !== 0) {
         tempzoneRioArray.push([]);
         for (key in zone[2]) { if (zone[2][key] !== undefined || zone[2][key] !== "") tempzoneRioArray[i][key] = zone[2][key]; }
         i++;
         zone = findKey(rioObj, "ZONE" + i);
      }
      zone = findKey(rioObj, "ZONE-OVERREACH");
      tempzoneRioArray.push([]);
      for (key in zone[2]) { if (zone[2][key] !== undefined || zone[2][key] !== "") tempzoneRioArray[i][key] = zone[2][key]; }

      for (let i = 0; i < tempzoneRioArray.length; i++) {
         //для ступеней фаза-фаза
         zoneRioArray.push([]);
         zoneRioArray[i * 2].TYPE = (tempzoneRioArray[i].TIMEM > 21474836) ? "NONTRIPPING" : "TRIPPING";
         zoneRioArray[i * 2].FAULTLOOP = "LL";
         // но всегда имя NAME было замечено...
         zoneRioArray[i * 2].LABEL = (tempzoneRioArray[i].NAME) ? tempzoneRioArray[i].NAME : "Z" + (i + 1) + "LL";
         zoneRioArray[i * 2].TRIPTIME = (tempzoneRioArray[i].TIMEM > 21474836) ? "INF" : tempzoneRioArray[i].TIMEM;
         zoneRioArray[i * 2].ACTIVE = "YES";
         zoneRioArray[i * 2].INDEX = i + 1;
         zoneRioArray[i * 2].TRIPCHAR = tempzoneRioArray[i].TRIPCHAR;
         //для ступеней фаза-земля
         zoneRioArray.push([]);
         zoneRioArray[i * 2 + 1].TYPE = (tempzoneRioArray[i].TIME1 > 21474836) ? "NONTRIPPING" : "TRIPPING";
         zoneRioArray[i * 2 + 1].FAULTLOOP = "LN";
         zoneRioArray[i * 2 + 1].LABEL = (tempzoneRioArray[i].NAME) ? tempzoneRioArray[i].NAME : "Z" + (i + 1) + "LN";
         zoneRioArray[i * 2 + 1].TRIPTIME = (tempzoneRioArray[i].TIME1 > 21474836) ? "INF" : tempzoneRioArray[i].TIME1;
         zoneRioArray[i * 2 + 1].ACTIVE = "YES";
         zoneRioArray[i * 2 + 1].INDEX = i + 1;
         zoneRioArray[i * 2 + 1].TRIPCHAR = tempzoneRioArray[i]["TRIPCHAR-EARTH"];
      }
   }

   return zoneRioArray;

}

function addSvgData(zoneRioArray) {
   // если найдем name, равный элементу массива charForArray, то вернем TRUE, иначе FALSE 
   let charArray = ["TRIPCHAR", "SHAPE", "MHOSHAPE", "LENSTOMATOSHAPE"];
   function charForArray(name) {
      for (let i = 0; i < charArray.length; i++) { if (charArray[i] === name) return true; }
      return false;
   }

   for (let i = 0; i < zoneRioArray.length; i++) {
      for (let key in zoneRioArray[i]) {
         if (zoneRioArray[i].hasOwnProperty(key) && charForArray(key)) {
            if (zoneRioArray[i][key].constructor === Array) {
               switch (key) {
                  case "TRIPCHAR": zoneRioArray[i].SVGDATA = createTripcharSVG(zoneRioArray[i].TRIPCHAR); break;
                  case "SHAPE": zoneRioArray[i].SVGDATA = createShapeSVG(zoneRioArray[i].SHAPE); break;
                  case "MHOSHAPE": zoneRioArray[i].SVGDATA = createMhoSVG(zoneRioArray[i].MHOSHAPE); break;
                  case "LENSTOMATOSHAPE": zoneRioArray[i].SVGDATA = createLensSVG(zoneRioArray[i].LENSTOMATOSHAPE); break;
                  default: alert("Не найдено данных для построения зоны для элемента №" + i + " " + key); break;
               }
            }
         }
      }
   }

   function createTripcharSVG(zoneArray) {
      let path = "";
      let points = [];

      for (i = 0; i < zoneArray.length; i++) {
         let param = zoneArray[i].split(",");
         switch (param[0]) {
            case "START": path += `M${param[1]},${param[2]} `; points.push([param[1], param[2]]); break;
            case "LINE": path += `L${param[1]},${param[2]} `; points.push([param[1], param[2]]); break;
            case "CLOSE": path += path += 'Z'; break;
            default: alert("Обнаружены лишние элементы в TRIPCHAR" + i + "при построении " + zoneRioString); break;
         }
      }
      let minMax = pointsMinMax(points);
      return { path, points, minMax };
   }

   //преобразование центра из полярных координат
   function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
      let angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
      return {
         x: centerX + (radius * Math.cos(angleInRadians)),
         y: centerY + (radius * Math.sin(angleInRadians))
      };
   }

   //формирование дуги
   function describeArc(x, y, radius, startAngle, endAngle) {
      let start = polarToCartesian(x, y, radius, endAngle);
      let end = polarToCartesian(x, y, radius, startAngle);
      let largeArcFlag = "0";
      if (endAngle >= startAngle) { largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"; }
      else { largeArcFlag = (endAngle + 360.0) - startAngle <= 180 ? "0" : "1"; }
      let d = ["M", start.x, start.y, "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(" ");
      return d;
   }

   function createMhoSVG(zoneArray) {
      let angle, reach, offset;
      let points = [];

      for (i = 0; i < zoneArray.length; i++) {
         let param = zoneArray[i].split(",");
         switch (param[0]) {
            case "ANGLE": angle = Number(param[1]); break;
            case "REACH": reach = Number(param[1]); break;
            case "OFFSET": offset = Number(param[1]); break;
            case "INVERT": break;
            default: alert("Обнаружены лишние элементы в MHO" + i + "при построении " + zoneArray); break;
         }
      }
      let r = (reach + offset) / 2;
      let x = (reach - offset) / 2 * Math.cos(degToRad(angle));
      let y = (reach - offset) / 2 * Math.sin(degToRad(angle));

      let path = describeArc(x, y, r, 0, 180) + describeArc(x, y, r, 180, 360);

      // верхняя и нижняя точки характеристики
      points.push([(reach * Math.cos(degToRad(angle))).toFixed(2), (reach * Math.sin(degToRad(angle))).toFixed(2)]);
      points.push([(-offset * Math.cos(degToRad(angle))).toFixed(2), (-offset * Math.sin(degToRad(angle))).toFixed(2)]);

      // правая и левая точки характеристики
      points.push([(x + r).toFixed(2), (y).toFixed(2)]);
      points.push([(x - r).toFixed(2), (y).toFixed(2)]);

      let minMax = pointsMinMax(points);
      return { path, points, minMax };
      //  return path;
   }

   function createLensSVG(zoneArray) {
      let reach, offset, angle, width, ab;
      let path = "";
      let points = [];

      for (i = 0; i < zoneArray.length; i++) {
         let param = zoneArray[i].split(",");
         switch (param[0]) {
            case "ANGLE": angle = Number(param[1]); break;
            case "REACH": reach = Number(param[1]); break;
            case "OFFSET": offset = Number(param[1]); break;
            case "WIDTH": width = Number(param[1]); break;
            case "AB": ab = Number(param[1]); break;
            case "INVERT": break;
            default: alert("Обнаружены лишние элементы в LENSTOMATO" + i + "при построении " + zoneArray); break;
         }
      }
      if (width === undefined) width = (reach + offset) * ab;
      if (ab === undefined) ab = width / (reach + offset);

      // let B = reach + offset;
      // let A = B * ab;
      // //радиусы обеих окружностей
      // let r = B * B / (4 * A) + A / 4;
      // //углы для построения характеристик???
      // let alfa = radToDeg(Math.acos(B / (2 * r)));
      // let beta = radToDeg(Math.atan(Math.sin(degToRad(alfa) * r / (B / 2 - offset))));
      // //центры окружностей
      // let polar = Math.sqrt(r * r - (B / 2) * (B / 2) + (B / 2 - offset) * (B / 2 - offset));
      // let angle1 = angle + beta; //центр первой окружности в полярных координатах (polar,angle1) радиус r
      // let angle2 = angle - beta; //центр второй окружности в полярных координатах (polar,angle1) радиус r


      // let centerX1 = polar * Math.cos(degToRad(angle1));
      // let centerY1 = polar * Math.sin(degToRad(angle1));
      // let point1 = new Point2D(centerX1, centerY1);
      // let circle1 = new Circle2D(point1, r);
      // centerX2 = polar * Math.cos(degToRad(angle2));
      // centerY2 = polar * Math.sin(degToRad(angle2));
      // let point2 = new Point2D(centerX2, centerY2);
      // let circle2 = new Circle2D(point2, r);

      // //нашли точки пересечения окружностей
      // let cross = circle1.IntersectionTwoCircles(circle2);
      // let arcAngle1 = radToDeg(Math.atan((cross[0][0] - centerX1) / (cross[0][1] - centerY1)));

      // //  path += describeArc(centerX1, centerY1, r, +90 + arcAngle1 + angle, +270 - arcAngle1 + angle);
      // //  path += describeArc(centerX2, centerY2, r, - arcAngle1 + angle, 180 - arcAngle1 + angle);


      // path = describeArc(centerX1, centerY1, r, 0, 180) + describeArc(centerX2, centerY2, r, 180, 360);


      // // + describeArc(x, y, r, 180, 360);
      // // return path;
      // return { path, points, minMax };


      // в коде выше формулы из документации на OMICRON. можно и доделать!!!


      let r;
      angle = degToRad(angle);
      a = ab * reach / 2;
      //   r = (reach) * (reach) / (8 * a) + a / 2;
      x = reach / 2;
      y = r - a;

      let l = reach + offset;
      r = l * l / (8 * a) + a / 2;

      let v = Math.sqrt((r - a) * (r - a) + (l / 2 - offset) * (l / 2 - offset));
      //  let gamma = Math.asin((r - a) / v);
      gamma = Math.acos((-(r - a) * (r - a) + (l / 2) * (l / 2) + r * r) / (2 * (l / 2) * r));
      let ugol = Math.acos((-(r - a) * (r - a) + (l / 2 - offset) * (l / 2 - offset) + v * v) / (2 * (l / 2 - offset) * v));
      x = v * Math.cos(angle - ugol);
      y = v * Math.sin(angle - ugol);

      let angelDraw = Math.PI - gamma * 2 - (gamma - ugol);
      startAngle = Math.PI + angle - ((Math.PI - gamma * 2 - 2 * (gamma - ugol)) / 2);
      endAngle = startAngle + angelDraw;

      alfa = radToDeg(startAngle);
      beta = radToDeg(endAngle);
      if (ab > 1) {
         path += describeArc(x, y, r, beta, alfa);
         x = v * Math.cos(angle + gamma);
         y = v * Math.sin(angle + gamma);
         alfa += 180; beta += 180;
         path += describeArc(x, y, r, beta, alfa);
      } else {
         path += describeArc(x, y, r, alfa, beta);
         x = v * Math.cos(angle + gamma);
         y = v * Math.sin(angle + gamma);
         alfa += 180; beta += 180;
         path += describeArc(x, y, r, alfa, beta);
      }

      // верхняя и нижняя точки характеристики
      points.push([(reach * Math.cos((angle))).toFixed(2), (reach * Math.sin((angle))).toFixed(2)]);
      points.push([(-offset * Math.cos((angle))).toFixed(2), (-offset * Math.sin((angle))).toFixed(2)]);

      // правая и левая точки характеристики
      // points.push([(reach).toFixed(2), (0).toFixed(2)]);
      // points.push([(-reach).toFixed(2), (0).toFixed(2)]);

      let minMax = pointsMinMax(points);
      return { path, points, minMax };
   }

   function createShapeSVG(zoneArray) {
      let autoclose;
      let point1 = new Point2D(0, 0);
      let point2 = new Point2D(0, 0);
      let radius, start, end, clock;
      let path = "";
      let points = [];

      let lines = [];
      // формируем массив кривых lines[]
      for (let i = 0; i < zoneArray.length; i++) {
         // формируем кривую
         param = zoneArray[i].split(",");
         switch (param[0]) {
            case "LINE":
               point1 = [+param[1], +param[2]];
               point2 = (param[4] === "LEFT")
                  ? [point1[0] + Math.cos(degToRad(+param[3])), point1[1] + Math.sin(degToRad(+param[3]))]
                  : [point1[0] - Math.cos(degToRad(+param[3])), point1[1] - Math.sin(degToRad(+param[3]))];
               lines[i] = new Line2D(point1, point2);
               break;
            case "LINEP":
               point1 = [+param[1] * Math.cos(degToRad(param[2])), +param[1] * Math.sin(degToRad(param[2]))]
               point2 = (param[4] === "LEFT")
                  ? [point1[0] + Math.cos(degToRad(+param[3])), point1[1] + Math.sin(degToRad(+param[3]))]
                  : [point1[0] - Math.cos(degToRad(+param[3])), point1[1] - Math.sin(degToRad(+param[3]))];
               lines[i] = new Line2D(point1, point2);
               break;
            case "ARC":
               point1 = [+param[1], +param[2]];
               radius = +param[3]; start = +param[4]; end = +param[5]; clock = param[6];
               lines[i] = new Circle2D(point1, radius, start, end, clock);
               break;
            case "ARCP":
               point1 = [+param[1] * Math.cos(degToRad(param[2])), +param[1] * Math.sin(degToRad(param[2]))];
               radius = +param[3]; start = +param[4]; end = +param[5]; clock = param[6];
               lines[i] = new Circle2D(point1, radius, start, end, clock);
               break;
            case "INVERT": break;
            case "AUTOCLOSE": autoclose = param[1]; break;
            default: alert("Обнаружены лишние элементы в SHAPE" + i + "при построении " + zoneArray); break;
         }
      }
      //определение типа кривой. Возвращает line или arc
      let curve = (line) => (line.hasOwnProperty("distOXY")) ? "line" : "arc";

      //ищем точки пересечения всех кривых (с окружностью - две точки)
      //если окружность не пересекает, то в массиве пересечений crossCanvas[] будет содержаться null
      let crossCanvas = []; // массив всех точек пересечения.

      for (let i = 0; i < lines.length; i++) {
         let line1, line2;

         if (i !== lines.length - 1) {
            line1 = lines[i]; line2 = lines[i + 1];
         } else { // последняя точка
            line1 = lines[i]; line2 = lines[0];
         }
         line1Type = curve(line1);
         line2Type = curve(line2);

         if (line1Type === line2Type && line1Type === "line") {
            crossCanvas[i] = line1.IntersectionTwoLines(line2);
         } else if (line1Type === line2Type && line1Type === "arc") {
            crossCanvas[i] = line1.IntersectionTwoCircles(line2);
         } else {
            crossCanvas[i] = (line1Type !== "line") ? line1.IntersectionLineCircle(line2) : line2.IntersectionLineCircle(line1);
         }
      }

      if (autoclose === true || autoclose === "YES" || true == true) { //!!!!!!!!!!!!!!!
         for (let i = 0; i < lines.length; i++) {
            let line1, line2;

            if (i !== lines.length - 1) {
               line1 = lines[i]; line2 = lines[i + 1];
            } else {
               line1 = lines[i]; line2 = lines[0]; // последняя точка
            }
            line1Type = curve(line1);
            line2Type = curve(line2);
            // if (i !== lines.length) {
            if (line1Type === line2Type && line1Type === "line") { // пересекаются две прямые
               if (crossCanvas[i] !== null) {
                  points.push([crossCanvas[i][0][0], crossCanvas[i][0][1]]);
                  if (path !== "") {
                     path += `L${crossCanvas[i][0][0]},${crossCanvas[i][0][1]} `;
                  } else {
                     path += `M${crossCanvas[i][0][0]},${crossCanvas[i][0][1]} `;
                  }

               }

            } else if (line1Type === line2Type && line1Type === "arc") { //пересекаются две дуги


               if (path !== "") {

               } else {

               }
            } else {//пересекается дуга и линия
               if (line1Type === "line") { // первая кривая - линия



               } else {// первая кривая - дуга



               }

               if (path !== "") {

               } else {

               }
            }
            if (i == lines.length - 1) path += 'Z';
         }
      } else {
         //определяем замкнутая или нет характеристика и применяем первую часть if
         //или рисуем характеристику без замыкания...
      }
      let minMax = pointsMinMax(points);
      return { path, points, minMax };
   }

   function pointsMinMax(points) {
      let minX = 0, maxX = 0, minY = 0, maxY = 0;
      if (points.length > 0) {

         minX = maxX = points[0][0];
         minY = maxY = points[0][1];
         for (i = 1; i < points.length; ++i) {
            if (points[i][0] > maxX) maxX = points[i][0];
            if (points[i][0] < minX) minX = points[i][0];
            if (points[i][1] > maxY) maxY = points[i][1];
            if (points[i][1] < minY) minY = points[i][1];
         }
      }
      return [maxX, minX, maxY, minY];
   }
}