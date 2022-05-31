//    Comtrade analizator
//    Module: comtradeRio template REL511 version 0.01
//    Alexander Voronenko
//    796546@gmail.com
//    09.2021

const version = "REL511.v1_v0.01";
let textRio = "";
let zoneRioArray = [];


function changeZone(event) {

   let swithPosition = event.id;
   let switchElement = document.getElementById("ZONE" + swithPosition.slice(-1));

   if (event.value === "FALSE") { switchElement.style.display = "none"; }
   else { switchElement.style.display = "block"; }

}

// function changeMode(event) {

//    let number = event.value.slice(-1);
//    let param1 = "QUAD" + number;
//    let param2 = "MHO" + number;
//    let divQuad = document.getElementById(param1);
//    let divMho = document.getElementById(param2);

//    if (event.value == param1) { divQuad.style.display = "block"; divMho.style.display = "none"; }
//    if (event.value == param2) { divQuad.style.display = "none"; divMho.style.display = "block"; }
// }


// структура RIO для BEGIN DEVICE
const deviceRio = {
   "NAME": "REL-511",
   "MANUFACTURER": "ABB",
   "SERIALNO": "",
   "DEVICE-TYPE": "Line Protection",
   "SUBSTATION": "Analizator Comtrade",
   "BAY": "",
   "BAY-ADDRESS": "",
   "PROTECTED-OBJECT-NAME": "",
   "ADDITIONAL-INFO2": "",
   "PHASES": "3",
   "VNOM": "100",
   "VMAX-LL": "200",
   "VPRIM-LL": "110000",
   "INOM": "5",
   "IMAX": "20",
   "IPRIM": "600",
   "FNOM": "50",
   "DEGLITCHTIME": "0",
   "DEBOUNCETIME": "0.003",
   "ININOM": "1",
   "VLNVN": "1.732"
};

// структура RIO для BEGIN DISTANCE
const distanceRio = {
   "ACTIVE": "YES",
   "LINEANGLE": "",
   "PTCONN": "BUS",
   "CTSTARPOINT": "LINE",
   "IMPCORR": "NO",
   "IMPPRIM": "NO",
   "ARCRES": "",
   "TTOLPLUS": "0.03",
   "TTOLMINUS": "0.03",
   "TTOLREL": "5",
   "ZTOLREL": "5",
   "ZTOLABS": "0.05",
   "KL": "0,0",
   "RERL_XEXL": "",
   "Z0Z1": "", // !!!!!!!!!!!!!!!!!!!!!!!!!!! посмотреть внимательно!!!!!!!!!!!!!!!!!!
   "KM": "",
   "RMRL_XMXL": "",
   "Z0MZ1": "",
   "TCBTRIP": "",
   "TCBCLOSE": "",
   "PERC52A": "",
   "PERC52B": "",
   "LINELENGTH": ""
};

// структура RIO для BEGIN ZONE
const zoneRio = {
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

   "SHAPE": ""
};

// структура общих уставок (ОКП)
const strucCommon = {
   "ARGLD": "",
   "RLD": "",
   "X1RVPP": "",
   "X1FWPP": "",
   "RFPP": "",
   "X1RVPE": "",
   "X1FWPE": "",
   "X0FWPE": "",
   "X0RVPE": "",
   "RFPE": ""
};


// структура ДЗ уставок REL
const strucZ = {
   "MODE": "",
   "OPERATIONPP": "",
   "X1PP": "",
   "R1PP": "",
   "RFPP": "",
   "TIMEPP": "",
   "TPP_EN": "",
   "OPERATIONPE": "",
   "X1PE": "",
   "R1PE": "",
   "X0PE": "",
   "R0PE": "",
   "RFPE": "",
   "TIMEPE": "",
   "TPE_EN": ""
}

function radToDeg(rad) { return (rad * 180) / Math.PI; }
function degToRad(deg) { return (Math.PI * deg) / 180; }

function rotateLINE(line, angle) {
   let param = "";
   let result = "";
   let x, y, alfa;
   let rotatedX, rotatedY, rotatedAngle = 0;

   param = line.split(",");
   x = Number(param[1]);
   y = Number(param[2]);
   alfa = Number(param[3]);

   rotatedX = x * Math.cos(degToRad(angle)) - y * Math.sin(degToRad(angle));
   rotatedY = x * Math.sin(degToRad(angle)) + y * Math.cos(degToRad(angle));
   rotatedAngle = alfa + angle;
   if (rotatedAngle > 360) { rotatedAngle -= 360; }

   result = param[0]; //LINE
   result += "," + rotatedX.toFixed(2); //X
   result += "," + rotatedY.toFixed(2); //Y
   result += "," + rotatedAngle.toFixed(3); //Угол
   result += "," + param[4]; //LEFT or RIGHT
   return result;
}

function createZoneRioArray() {
   //   let nZ = 0; // текущая строка при заполнеии структуры для рисования зоны ДЗ
   let param = document.getElementsByClassName("main");
   // заполняем структуры deviceRio и distanceRio
   for (let i = 0; i < param.length; i++) {
      switch (param[i].name) {
         case "VNOM": deviceRio[param[i].name] = param[i].value; break;
         case "VPRIM-LL": deviceRio[param[i].name] = param[i].value; break;
         case "INOM": deviceRio[param[i].name] = param[i].value; break;
         case "IPRIM": deviceRio[param[i].name] = param[i].value; break;
         case "FNOM": deviceRio[param[i].name] = param[i].value; break;
         case "ININOM": deviceRio[param[i].name] = param[i].value; break;
         case "VLNVN": deviceRio[param[i].name] = param[i].value; break;
         case "LINEANGLE": distanceRio[param[i].name] = param[i].value; break;
         case "PTCONN": distanceRio[param[i].name] = param[i].value; break;
         case "CTSTARPOINT": distanceRio[param[i].name] = param[i].value; break;
         case "LINELENGTH": distanceRio[param[i].name] = param[i].value; break;
         case "IMPPRIM": distanceRio[param[i].name] = param[i].value; break;
         default: break;
      }
      // strucLoad[param[i].name.toUpperCase()] = param[i].value;
   }

   // заполняем общую структуру 
   param = document.getElementsByClassName("common");
   for (let i = 0; i < param.length; i++) {
      strucCommon[param[i].name.toUpperCase()] = param[i].value;
   }

   zoneRioArray.length = [];

   // создаем вырез нагрузки
   createZoneLoad(strucCommon.RLD, strucCommon.RLD, strucCommon.ARGLD, 0, 11);
   // формируем зоны дистанционной защиты
   createZoneCFG();

   createStrucZ("1");
   createStrucZ("2");
   createStrucZ("3");
   createStrucZ("4");
   createStrucZ("5");
}

//создание структуры выреза нагрузки
// rw - активное сопротивление прямо; rw - активное сопротивление назад
//angle - улол выреза (от оси x); rotate - поворот выреза нагрузки
//number - номер ступени (вырез назад - ступень+1)
//если fw или rv равны нулю, то не рисуется соответствеющая зона.
function createZoneLoad(fw, rv, angle, rotate, number) {
   let nZone = zoneRioArray.length;
   let curCalulate = 0;   // переменная для временных расчетов

   // вырез нагрузки прямо
   if (fw != "0") {
      nZ = 0;
      zoneRioArray.push([]); //
      zoneRioArray[nZone].TYPE = "NONTRIPPING"; zoneRioArray[nZone].FAULTLOOP = "LL"; zoneRioArray[nZone].TRIPTIME = "0";
      zoneRioArray[nZone].ACTIVE = "YES"; zoneRioArray[nZone].INDEX = number; zoneRioArray[nZone].SHAPE = "SHAPE";
      zoneRioArray[nZone].push([]);
      curCalulate = 180 + Number(angle);
      // curCalulate = +curCalulate.toFixed(3);
      zoneRioArray[nZone][nZ] = "LINE,0,0," + curCalulate + ",LEFT"; nZ++;
      zoneRioArray[nZone][nZ] = "LINE," + fw + ",0,270,LEFT"; nZ++;
      curCalulate = 360 - Number(angle);
      zoneRioArray[nZone][nZ] = "LINE,0,0," + curCalulate + ",LEFT"; nZ++;
      if (rotate != 0) {
         for (let i = 0; i < zoneRioArray[nZone].length; i++) {
            zoneRioArray[nZone][i] = rotateLINE(zoneRioArray[nZone][i], rotate);
         }
      }
      zoneRioArray[nZone][nZ] = "AUTOCLOSE,NO"; nZ++;
      zoneRioArray[nZone][nZ] = "INVERT,NO";
      ++nZone;
   }

   if (rv != "0") {
      // вырез нагрузки назад
      nZ = 0;
      zoneRioArray.push([]); // 
      zoneRioArray[nZone].TYPE = "NONTRIPPING"; zoneRioArray[nZone].FAULTLOOP = "LL"; zoneRioArray[nZone].TRIPTIME = "0";
      zoneRioArray[nZone].ACTIVE = "YES"; zoneRioArray[nZone].INDEX = number + 1; zoneRioArray[nZone].SHAPE = "SHAPE";
      zoneRioArray[nZone].push([]);
      zoneRioArray[nZone][nZ] = "LINE,0,0," + angle + ",LEFT"; nZ++;
      zoneRioArray[nZone][nZ] = "LINE,-" + rv + ",0,90,LEFT"; nZ++;
      curCalulate = 180 - Number(angle);
      zoneRioArray[nZone][nZ] = "LINE,0,0," + curCalulate + ",LEFT"; nZ++;
      if (rotate != 0) {
         for (let i = 0; i < zoneRioArray[nZone].length; i++) {
            zoneRioArray[nZone][i] = rotateLINE(zoneRioArray[nZone][i], rotate);
         }
      }
      zoneRioArray[nZone][nZ] = "AUTOCLOSE,NO"; nZ++;
      zoneRioArray[nZone][nZ] = "INVERT,NO";
      ++nZone;
   }
}

function createZoneCFG() {
   // const strucCommon = {
   //    "ARGLD": "",
   //    "RLD": "",
   //    "X1RVPP": "",
   //    "X1FWPP": "",
   //    "RFPP": "",
   //    "X1RVPE": "",
   //    "X1FWPE": "",
   //    "X0FWPE": "",
   //    "X0RVPE": "",
   //    "RFPE": ""
   // };
   let nZone = zoneRioArray.length; nZ = 0;
   let _R, _XFw, _XRv = 0;

   zoneRioArray.push([]);

   zoneRioArray[nZone].ACTIVE = "YES";
   zoneRioArray[nZone].FAULTLOOP = "LL";
   zoneRioArray[nZone].TRIPTIME = 0;
   zoneRioArray[nZone].INDEX = 10;
   zoneRioArray[nZone].SHAPE = "SHAPE";
   zoneRioArray[nZone].TYPE = "STARTING";
   zoneRioArray[nZone].push([]);

   _R = Number(strucCommon.RFPP); _XFw = Number(strucCommon.X1FWPP); _XRv = Number(strucCommon.X1RVPP);
   // _Phi = radToDeg(Math.atan(_X / _R));

   zoneRioArray[nZone][nZ] = createLine(_R, 0, 90, "LEFT"); nZ++;
   zoneRioArray[nZone][nZ] = createLine(0, _XFw, 180, "LEFT"); nZ++;
   zoneRioArray[nZone][nZ] = createLine(-_R, 0, 270, "LEFT"); nZ++;
   zoneRioArray[nZone][nZ] = createLine(0, -_XRv, 0, "LEFT"); nZ++;

   zoneRioArray[nZone][nZ] = "AUTOCLOSE,YES"; nZ++;
   zoneRioArray[nZone][nZ] = "INVERT,NO";


   nZone = zoneRioArray.length; nZ = 0;
   zoneRioArray.push([]);
   zoneRioArray[nZone].ACTIVE = "YES";
   zoneRioArray[nZone].FAULTLOOP = "LN";
   zoneRioArray[nZone].TRIPTIME = 0;
   zoneRioArray[nZone].INDEX = 10;
   zoneRioArray[nZone].SHAPE = "SHAPE";
   zoneRioArray[nZone].TYPE = "STARTING";
   zoneRioArray[nZone].push([]);

   let XnFw = (Number(strucCommon.X0FWPE) - Number(strucCommon.X1FWPE)) / 3;
   let XnRv = (Number(strucCommon.X0RVPE) - Number(strucCommon.X1RVPE)) / 3;
   //let Rn = (Number(strucCommon.R0PE) - Number(strucCommon.R1PE)) / 3;

   _R = Number(strucCommon.RFPE); _XFw = Number(strucCommon.X1FWPP) + XnFw; _XRv = Number(strucCommon.X1RVPP) + XnRv;
   // _Phi = radToDeg(Math.atan(_X / _R));

   zoneRioArray[nZone][nZ] = createLine(_R, 0, 90, "LEFT"); nZ++;
   zoneRioArray[nZone][nZ] = createLine(0, _XFw, 180, "LEFT"); nZ++;
   zoneRioArray[nZone][nZ] = createLine(-_R, 0, 270, "LEFT"); nZ++;
   zoneRioArray[nZone][nZ] = createLine(0, -_XRv, 0, "LEFT"); nZ++;

   zoneRioArray[nZone][nZ] = "AUTOCLOSE,YES"; nZ++;
   zoneRioArray[nZone][nZ] = "INVERT,NO";
}

// создание структуры уставок зоны numZ
function createStrucZ(numZ) {
   for (key in strucZ) strucZ[key] = ""; //очистили структуру перед заполнением
   // заполняем структуру для Z с номером numZ

   param = document.getElementsByClassName("ZONE" + numZ);
   for (let i = 0; i < param.length; i++) {
      if (param[i].name == "TPP_EN" || param[i].name == "TPE_EN") {
         if (param[i].checked) { strucZ[param[i].name] = "TRUE" } else { strucZ[param[i].name] = "FALSE" }
      } else {
         strucZ[param[i].name] = param[i].value;
      }
   }

   if (strucZ.MODE != "FALSE") {
      createZone(numZ);
   }
}

//создает в zoneRioArray массив строк для RIO из strucZ (уставок защиты) для элемента массива 
function createLine(x, y, angle, rotate) {
   angle = +(Math.round(angle + "e+3") + "e-3");
   return "LINE," + x + "," + y + "," + angle + "," + rotate;
}

// const strucZ = {
//    "MODE": "",
//    "OPERATIONPP": "",
//    "X1PP": "",
//    "R1PP": "",
//    "RFPP": "",
//    "TIMEPP": "",
//    "TPP_EN": "",
//    "OPERATIONPE": "",
//    "X1PE": "",
//    "R1PE": "",
//    "X0PE": "",
//    "R0PE": "",
//    "RFPE": "",
//    "TIMEPE": "",
//    "TPE_EN": ""
// }
function createZone(numZ) {
   let nZone, nZ;
   let _R, _X, _Phi, _Rf = 0;

   if (strucZ.OPERATIONPP == "TRUE") {
      nZone = zoneRioArray.length; nZ = 0;
      zoneRioArray.push([]);

      zoneRioArray[nZone].ACTIVE = "YES";
      zoneRioArray[nZone].FAULTLOOP = "LL";
      zoneRioArray[nZone].TRIPTIME = strucZ.TIMEPP;
      zoneRioArray[nZone].INDEX = numZ;
      zoneRioArray[nZone].SHAPE = "SHAPE";
      if (strucZ.TPP_EN == "FALSE") { zoneRioArray[nZone].TYPE = "NONTRIPPING"; } else { zoneRioArray[nZone].TYPE = "TRIPPING"; }
      zoneRioArray[nZone].push([]);


      // calculate = radToDeg(Math.atan(lineX / lineR1));
      // zoneRioArray[curZone][nZ] = createLine(lineR, 0, calculate, "LEFT"); nZ++;
      // zoneRioArray[curZone][nZ] = createLine(0, lineX, 180, "LEFT"); nZ++;
      // if (strucZ.DIRECTIONAL == "NONDIRECTIONAL") {
      //    zoneRioArray[curZone][nZ] = createLine(-lineR, 0, 270, "LEFT"); nZ++;
      //    calculate = radToDeg(Math.atan(lineX / lineR1));
      //    zoneRioArray[curZone][nZ] = createLine(-lineR, 0, +calculate + 180, "LEFT"); nZ++;
      //    zoneRioArray[curZone][nZ] = createLine(0, -lineX, 0, "LEFT"); nZ++;
      //    zoneRioArray[curZone][nZ] = createLine(lineR, 0, 90, "LEFT"); nZ++;
      // } else {
      //    if (lineX * Math.tan(degToRad(30)) > lineR) {
      //       zoneRioArray[curZone][nZ] = createLine(-lineR, 0, 270, "LEFT"); nZ++;
      //    }
      //    zoneRioArray[curZone][nZ] = createLine(0, 0, 300, "LEFT"); nZ++;
      //    zoneRioArray[curZone][nZ] = createLine(0, 0, 345, "LEFT"); nZ++;
      //    zoneRioArray[curZone][nZ] = createLine(lineR, 0, 90, "LEFT"); nZ++;
      //    if (strucZ.DIRECTIONAL == "REVERSE") {
      //       for (let i = 0; i < zoneRioArray[curZone].length; i++) {
      //          zoneRioArray[curZone][i] = rotateLINE(zoneRioArray[curZone][i], 180);
      //       }
      //    }
      // }

      _R = strucZ.R1PP; _X = strucZ.X1PP; _Rf = strucZ.RFPP;
      _Phi = radToDeg(Math.atan(_X / _R));

      zoneRioArray[nZone][nZ] = createLine(_Rf / 2, 0, _Phi, "LEFT"); nZ++;
      zoneRioArray[nZone][nZ] = createLine(0, _X, 180, "LEFT"); nZ++;
      if (strucZ.MODE == "NONDIRECTIONAL") {
         //   zoneRioArray[nZone][nZ] = createLine(-_Rf / 2, 0, 270, "LEFT"); nZ++;
         zoneRioArray[nZone][nZ] = createLine(-_Rf / 2, 0, 180 + _Phi, "LEFT"); nZ++;
         zoneRioArray[nZone][nZ] = createLine(0, -_X, 0, "LEFT"); nZ++;
         //  zoneRioArray[nZone][nZ] = createLine(_Rf / 2, 0, 90, "LEFT"); nZ++;
      } else {
         let dR = _X * Math.tan(degToRad(25 + (90 - _Phi)));
         if (dR > _Rf / 2) {
            zoneRioArray[nZone][nZ] = createLine(-_Rf / 2, 0, _Phi + 180, "LEFT"); nZ++;
         }
         zoneRioArray[nZone][nZ] = createLine(0, 0, 270 + 25, "LEFT"); nZ++;
         zoneRioArray[nZone][nZ] = createLine(0, 0, -15, "LEFT"); nZ++;
         if (strucZ.MODE == "REVERSE") {
            for (let i = 0; i < zoneRioArray[nZone].length; i++) { zoneRioArray[nZone][i] = rotateLINE(zoneRioArray[nZone][i], 180); }
         }
      }
      zoneRioArray[nZone][nZ] = "AUTOCLOSE,YES"; nZ++;
      zoneRioArray[nZone][nZ] = "INVERT,NO";
   }

   if (strucZ.OPERATIONPE == "TRUE") {
      nZone = zoneRioArray.length; nZ = 0;
      zoneRioArray.push([]);

      zoneRioArray[nZone].ACTIVE = "YES";
      zoneRioArray[nZone].FAULTLOOP = "LN";
      zoneRioArray[nZone].TRIPTIME = strucZ.TIMEPE;
      zoneRioArray[nZone].INDEX = numZ;
      zoneRioArray[nZone].SHAPE = "SHAPE";
      if (strucZ.TPE_EN == "FALSE") { zoneRioArray[nZone].TYPE = "NONTRIPPING"; } else { zoneRioArray[nZone].TYPE = "TRIPPING"; }
      zoneRioArray[nZone].push([]);

      let _Xn = (Number(strucZ.X0PE) - Number(strucZ.X1PE)) / 3;
      let _Rn = (Number(strucZ.R0PE) - Number(strucZ.R1PE)) / 3;

      _Rf = Number(strucZ.RFPE);
      _R = Number(strucZ.R1PE); _X = Number(strucZ.X1PE);

      _R = _R + _Rn; _X = _X + _Xn;
      _Phi = radToDeg(Math.atan(_X / _R));

      zoneRioArray[nZone][nZ] = createLine(_Rf, 0, _Phi, "LEFT"); nZ++;
      zoneRioArray[nZone][nZ] = createLine(0, _X, 180, "LEFT"); nZ++;

      if (strucZ.MODE == "NONDIRECTIONAL") {
         //     zoneRioArray[nZone][nZ] = createLine(-_Rf, 0, 270, "LEFT"); nZ++;
         zoneRioArray[nZone][nZ] = createLine(-(_Rf), 0, 180 + _Phi, "LEFT"); nZ++;
         zoneRioArray[nZone][nZ] = createLine(0, -_X, 0, "LEFT"); nZ++;
         //      zoneRioArray[nZone][nZ] = createLine(_Rf, 0, 90, "LEFT"); nZ++;
      } else {
         if (_X * (Math.tan(degToRad(90 - _Phi)) + Math.tan(degToRad(26))) > (_R + _Rf)) {
            zoneRioArray[nZone][nZ] = createLine(- (_Rf), 0, _Phi + 180, "LEFT"); nZ++;
         }
         zoneRioArray[nZone][nZ] = createLine(0, 0, 270 + 25, "LEFT"); nZ++;
         zoneRioArray[nZone][nZ] = createLine(0, 0, -15, "LEFT"); nZ++;
         if (strucZ.MODE == "REVERSE") {
            for (let i = 0; i < zoneRioArray[nZone].length; i++) { zoneRioArray[nZone][i] = rotateLINE(zoneRioArray[nZone][i], 180); }
         }
      }

      zoneRioArray[nZone][nZ] = "AUTOCLOSE,YES"; nZ++;
      zoneRioArray[nZone][nZ] = "INVERT,NO";
   }

}

function formValidation() {
   createZoneRioArray();
   createRioFile();
   document.getElementById("outRioData").value = textRio;

   alert("данные подготовлены");
   let rioData = JSON.stringify(textRio);
   localStorage.setItem("rioData", rioData);
   return false;
}

// формируем текст textRio RIO файла из массива зон zoneRioArray 
function createRioFile() {
   const sep = "\t";
   let cSep = "";
   let param = ""; // переменная для работы со строкой zoneRioArray;
   let str = "";
   textRio = "BEGIN TESTOBJECT\r\n";

   cSep = sep + sep;
   textRio += sep + "BEGIN DEVICE\r\n";
   for (key in deviceRio) { if (deviceRio[key] != "") { textRio += cSep + key + sep + deviceRio[key] + "\r\n"; } }
   textRio += sep + "END DEVICE \r\n";

   textRio += sep + "BEGIN DISTANCE\r\n";
   for (key in distanceRio) { if (distanceRio[key] != "") { textRio += cSep + key + sep + distanceRio[key] + "\r\n"; } }

   cSep = sep + sep;
   for (i = 0; i < zoneRioArray.length; i++) {
      textRio += cSep + "BEGIN ZONE\r\n";

      cSep = sep + sep + sep;
      for (key in zoneRio) zoneRio[key] = "";  // очистм массив перед заполнением
      for (key in zoneRio) { if (zoneRioArray[i][key]) { zoneRio[key] = zoneRioArray[i][key]; } } // заполнили те переменные, которые есть в zoneRioArray
      for (key in zoneRio) {
         if (zoneRio[key] != "" && key != "SHAPE") { textRio += cSep + key + sep + zoneRio[key] + "\r\n"; }
      }
      textRio += cSep + "BEGIN " + zoneRioArray[i].SHAPE + "\r\n";
      if (zoneRioArray[i].length > 1) {
         for (j = 0; j < zoneRioArray[i].length; j++) {
            param = zoneRioArray[i][j].split(",");
            str = cSep + sep + param[0] + sep;
            for (k = 1; k < param.length; k++) { str += param[k] + ", "; }
            str = str.slice(0, -2); //обрезали у строки хвост из ", "
            textRio += str + "\r\n";
         }
      }
      textRio += cSep + "END " + zoneRioArray[i].SHAPE + "\r\n";

      cSep = sep + sep;
      textRio += cSep + "END ZONE\r\n";
   }
   textRio += sep + "END DISTANCE\r\n";

   textRio += "END TESTOBJECT\r\n";
}