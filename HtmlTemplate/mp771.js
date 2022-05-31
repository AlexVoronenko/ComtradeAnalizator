﻿//    Comtrade analizator
//    Module: comtradeRio template MP771 version 0.01
//    Alexander Voronenko
//    796546@gmail.com
//    09.2021

const version = "MP771.v1_0.01";
let textRio = "";
let zoneRioArray = [];


function changeZone(event) {

   let swithPosition = event.id;
   let switchElement = document.getElementById("ZONE" + swithPosition.slice(-1));

   if (event.value === "false") { switchElement.style.display = "none"; }
   else { switchElement.style.display = "block"; }

}

function changeMode(event) {

   let number = event.value.slice(-1);
   let param1 = "QUAD" + number;
   let param2 = "MHO" + number;
   let divQuad = document.getElementById(param1);
   let divMho = document.getElementById(param2);

   if (event.value == param1) { divQuad.style.display = "block"; divMho.style.display = "none"; }
   if (event.value == param2) { divQuad.style.display = "none"; divMho.style.display = "block"; }
}


// структура RIO для BEGIN DEVICE
const deviceRio = {
   "NAME": "MP-741",
   "MANUFACTURER": "BelelElectroMontazhNaladka",
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
   "KL": "",
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

// структура общих уставок (вырез нагрузки, угол наклона линии второго квадранта)
const strucMain = {
   "Y1_LOAD": "",
   "R1_LOAD": "",
   "R2_LOAD": "",
   "Y1_Z": "",
   "Y2_Z": "",
   "R0_1": "",
   "X0_1": "",
   "R1_1": "",
   "X1_1": "",
   "R0_2": "",
   "X0_2": "",
   "R1_2": "",
   "X1_2": "",
   "R0_3": "",
   "X0_3": "",
   "R1_3": "",
   "X1_3": "",
   "R0_4": "",
   "X0_4": "",
   "R1_4": "",
   "X1_4": "",
   "R0_5": "",
   "X0_5": "",
   "R1_5": "",
   "X1_5": ""
};


// структура ДЗ уставок MP
const strucZ = {
   "MODE": "",
   "TYPEZ": "",
   "LOOP": "",
   "DIRECTIONAL": "",
   "RQUAD": "",
   "XQUAD": "",
   "FQUAD": "",
   "RMHO": "",
   "XMHO": "",
   "RADMHO": "",
   "TIME": "",
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
         case "IMPRIM": distanceRio[param[i].name] = param[i].value; break;
         default: break;
      }
      // strucLoad[param[i].name.toUpperCase()] = param[i].value;
   }

   // заполняем общую структуру 
   param = document.getElementsByClassName("common");
   for (let i = 0; i < param.length; i++) {
      strucMain[param[i].name.toUpperCase()] = param[i].value;
   }

   zoneRioArray.length = [];
   // создаем вырез нагрузки
   createStrucLoad(strucMain.R1_LOAD, strucMain.R2_LOAD, strucMain.Y1_LOAD, 0, 11);
   // формируем зоны дистанционной защиты
   createStrucZ("1");
   createStrucZ("2");
   createStrucZ("3");
   createStrucZ("4");
   createStrucZ("5");
   createStrucZ("6");
   createStrucZ("7");
   createStrucZ("8");
   createStrucZ("9");
   createStrucZ("10");
}

//создание структуры выреза нагрузки
// rw - активное сопротивление прямо; rw - активное сопротивление назад
//angle - улол выреза (от оси x); rotate - поворот выреза нагрузки
//number - номер ступени (вырез назад - ступень+1)
//если fw или rv равны нулю, то не рисуется соответствеющая зона.
function createStrucLoad(fw, rv, angle, rotate, number) {
   let nZone = zoneRioArray.length;
   let curCalulate = 0;   // переменная для временных расчетов

   // вырез нагрузки прямо
   if (fw != "0") {
      nZ = 0;
      zoneRioArray.push([]); //
      zoneRioArray[nZone].TYPE = "NONTRIPPING";
      zoneRioArray[nZone].FAULTLOOP = "LL";
      zoneRioArray[nZone].TRIPTIME = "0";
      zoneRioArray[nZone].ACTIVE = "YES";
      zoneRioArray[nZone].INDEX = number;
      zoneRioArray[nZone].SHAPE = "SHAPE";
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
      zoneRioArray[nZone].TYPE = "NONTRIPPING";
      zoneRioArray[nZone].FAULTLOOP = "LL";
      zoneRioArray[nZone].TRIPTIME = "0";
      zoneRioArray[nZone].ACTIVE = "YES";
      zoneRioArray[nZone].INDEX = number + 1;
      zoneRioArray[nZone].SHAPE = "SHAPE";
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

// создание структуры уставок зоны numZ
function createStrucZ(numZ) {
   for (key in strucZ) strucZ[key] = ""; //очистили структуру перед заполнением
   // заполняем структуру для Z с номером numZ

   param = document.getElementsByClassName("ZONE" + numZ);
   if (numZ == "10") { param = document.getElementsByClassName("ZONEX"); }
   else { param = document.getElementsByClassName("ZONE" + numZ); }

   for (let i = 0; i < param.length; i++) { strucZ[param[i].name] = param[i].value; }

   //  создаем массив с параметрами зон ДЗ zoneRioArray
   let nZone = zoneRioArray.length;
   // петля фаза-земля

   // zoneRioArray.push([]); // 
   // zoneRioArray[nZone].TYPE = "NONTRIPPING";
   // zoneRioArray[nZone].FAULTLOOP = "LL";
   // zoneRioArray[nZone].TRIPTIME = "0";
   // zoneRioArray[nZone].ACTIVE = "YES";
   // zoneRioArray[nZone].INDEX = number + 1;
   // zoneRioArray[nZone].SHAPE = "SHAPE";
   // zoneRioArray[nZone].push([]);




   if (strucZ.MODE != "false") {

      zoneRioArray.push([]); //
      if (strucZ.MODE == "trip" || strucZ.MODE == "true") {
         zoneRioArray[nZone].TYPE = "TRIPPING";
      }
      else {
         if (strucZ.MODE == "alarm") { zoneRioArray[nZone].TYPE = "NONTRIPPING"; } else { zoneRioArray[nZone].TYPE = "STARTING"; }
      }


      if (strucZ.LOOP == "PHASE") { zoneRioArray[nZone].FAULTLOOP = "LL"; }
      if (strucZ.LOOP.slice(0, -1) == "GROUND") { zoneRioArray[nZone].FAULTLOOP = "LN"; }

      zoneRioArray[nZone].TRIPTIME = strucZ.TIME;
      zoneRioArray[nZone].ACTIVE = "YES";
      zoneRioArray[nZone].INDEX = numZ;

      //   if (strucZ.TYPEZ.slice(0, -1) == "MHO") { }
      if (strucZ.TYPEZ.slice(0, -1) == "QUAD") { zoneRioArray[nZone].SHAPE = "SHAPE"; }
      else { zoneRioArray[nZone].SHAPE = "MHOSHAPE"; }

      createZone(nZone);
   }
}

//создает в zoneRioArray массив строк для RIO из strucZ (уставок защиты) для элемента массива 
function createLine(x, y, angle, rotate) {
   angle = +(Math.round(angle + "e+3") + "e-3");
   return "LINE," + x + "," + y + "," + angle + "," + rotate;
}

function createZone(curZone) {
   let nZ = 0;
   let _R = Number(strucZ.RQUAD);
   let _X = Number(strucZ.XQUAD);
   let _Phi = Number(strucZ.FQUAD);

   let _Y1 = Number(strucMain.Y1_Z);
   let _Y2 = Number(strucMain.Y2_Z);

   let _rMHO = Number(strucZ.RMHO);
   let _xMHO = Number(strucZ.XMHO);
   let _radMHO = Number(strucZ.RADMHO);

   if (strucZ.LOOP.slice(0, -1) == "GROUND") {
      let R1, X1, R0, X0 = 0;
      let numKN0 = strucZ.LOOP.slice(-1);
      switch (numKN0) {
         case "1": R1 = strucMain.R1_1; X1 = strucMain.X1_1; R0 = strucMain.R0_1; X0 = strucMain.X0_1; break;
         case "2": R1 = strucMain.R1_2; X1 = strucMain.X1_2; R0 = strucMain.R0_2; X0 = strucMain.X0_2; break;
         case "3": R1 = strucMain.R1_3; X1 = strucMain.X1_3; R0 = strucMain.R0_3; X0 = strucMain.X0_3; break;
         case "4": R1 = strucMain.R1_4; X1 = strucMain.X1_4; R0 = strucMain.R0_4; X0 = strucMain.X0_4; break;
         case "5": R1 = strucMain.R1_5; X1 = strucMain.X1_5; R0 = strucMain.R0_5; X0 = strucMain.X0_5; break;
         default: break;
      }

      let A = 2 * R1 * R1 + 2 * X1 * X1 + R0 * R1 + X0 * X1;
      let B = 3 * (R1 * R1 + X1 * X1);
      let alfaKN0 = radToDeg(Math.atan(R1 * X0 - R0 * X1 / (2 * R1 * R1 + 2 * X1 * X1 + R0 * R1 + X0 * X1)));
      let rKNO = A / B;

      // прописать новые размеры _R, X с учетом KN0
   }


   zoneRioArray[curZone].push([]);

   if (strucZ.TYPEZ.slice(0, -1) == "QUAD") {
      // alert("QUAD");      
      // рассчитаем угол наклона правой линии характеристики
      //    let angle = radToDeg(Math.atan(_X / _R));


      if (_Y2 != 0) zoneRioArray[curZone][nZ] = createLine(_R, 0, 90, "LEFT"); nZ++;
      zoneRioArray[curZone][nZ] = createLine(_R, 0, _Phi, "LEFT"); nZ++;
      zoneRioArray[curZone][nZ] = createLine(0, _X, 180, "LEFT"); nZ++;

      if (strucZ.DIRECTIONAL == "NONDIRECTIONAL") {

         zoneRioArray[curZone][nZ] = createLine(-_R, 0, 270, "LEFT"); nZ++;
         zoneRioArray[curZone][nZ] = createLine(-_R, 0, 180 + _Phi, "LEFT"); nZ++;
         zoneRioArray[curZone][nZ] = createLine(0, - _X, 0, "LEFT"); nZ++;

      } else {
         let rReverse = _X * Math.tan(degToRad(_Y1));
         if (rReverse > _R) { zoneRioArray[curZone][nZ] = createLine(-_R, 0, 270, "LEFT"); nZ++; }
         zoneRioArray[curZone][nZ] = createLine(0, 0, 270 + _Y1, "LEFT"); nZ++;
         zoneRioArray[curZone][nZ] = createLine(0, 0, 360 - _Y2, "LEFT"); nZ++;
         if (strucZ.DIRECTIONAL == "REVERSE") {
            for (let i = 0; i < zoneRioArray[curZone].length; i++) { zoneRioArray[curZone][i] = rotateLINE(zoneRioArray[curZone][i], 180); }
         }

      }

      // проверяем рисовать ли вертикальную прямую в третьем квадранте

      zoneRioArray[curZone][nZ] = "AUTOCLOSE,YES"; nZ++;
      zoneRioArray[curZone][nZ] = "INVERT,NO";

   } else {
      // aletr("MHO");
      // рассчитаем угол максимальной чувствительности
      let phiMCH = radToDeg(Math.atan(_rMHO / _xMHO));
      let zCenter = Math.sqrt(_rMHO * _rMHO + _xMHO * _xMHO);

      let offset = -(zCenter - _radMHO);
      let reach = (_radMHO * 2) - offset;

      zoneRioArray[curZone][nZ] = "ANGLE," + phiMCH.toFixed(2); nZ++;
      zoneRioArray[curZone][nZ] = "REACH," + reach.toFixed(2); nZ++;
      zoneRioArray[curZone][nZ] = "OFFSET," + offset.toFixed(2); nZ++;
      zoneRioArray[curZone][nZ] = "INVERT,NO";
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