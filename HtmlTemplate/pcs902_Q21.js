//    Comtrade analizator
//    Module: comtradeRio template PCS902_Q21 version 0.01
//    Alexander Voronenko
//    796546@gmail.com
//    08.2021

const version = "PCS902.v1_v0.01";
let textRio = "";
let zoneRioArray = [];

// структура RIO для BEGIN DEVICE
const deviceRio = {
   "NAME": "PCS902_Q21",
   "MANUFACTURER": "NR Electric Co.",
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
   "Z_SET": "",
   "PHI": "",
   "ANG_ALPHA": ""
};


// структура ДЗ уставок REL
const strucZ = {
   "DIRECTIONAL": "",
   "REAL_K0": "",
   "IMAG_K0": "",
   "PHI1_REACH": "",
   "ZG_RCA": "",
   "ZG_Z_SET": "",
   "ZG_R_SET": "",
   "ZG_T_OP": "",
   "ZP_RCA": "",
   "ZP_Z_SET": "",
   "ZP_R_SET": "",
   "ZP_T_OP": "",
   "ZG_EN": "",
   "ZP_EN": "",
   "KZO_EN": ""
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
      strucMain[param[i].name.toUpperCase()] = param[i].value;
   }

   zoneRioArray.length = [];
   // создаем вырез нагрузки
   createStrucLoad(strucMain.Z_SET, strucMain.Z_SET, strucMain.PHI, 0, 1);
   // формируем зоны дистанционной защиты
   createStrucZ("1");
   createStrucZ("2");
   createStrucZ("3");
   createStrucZ("4");

}

//создание структуры выреза нагрузки
// rw - активное сопротивление прямо; rw - активное сопротивление назад
//angle - улол выреза (от оси x); rotate - поворот выреза нагрузки
//number - номер ступени (вырез назад - ступень+1)
//если fw или rv равны нулю, то не рисуется соответствеющая зона.
function createStrucLoad(fw, rv, angle, rotate, number) { // !!!!!!!!!!!!!!!!!! пока не поворачивается !!!!!!!!!!!!!!!!
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
   param = document.getElementsByClassName("Z" + numZ);
   for (let i = 0; i < param.length; i++) {
      switch (param[i].name) {
         case "ZG_EN" + numZ:
            if (!param[i].checked) { strucZ.ZG_EN = false; } else { strucZ.ZG_EN = true; } break;
         case "ZP_EN" + numZ:
            if (!param[i].checked) { strucZ.ZP_EN = false; } else { strucZ.ZP_EN = true; } break;
         default:
            strucZ[param[i].name.toUpperCase().slice(0, -1)] = param[i].value;
            break;
      }
   }
   //  создаем массив с параметрами зон ДЗ zoneRioArray

   let nZone = zoneRioArray.length;
   // петля фаза-земля
   if (strucZ.ZG_EN) {
      zoneRioArray.push([]); //
      zoneRioArray[nZone].TYPE = "TRIPPING";
      zoneRioArray[nZone].FAULTLOOP = "LL";
      zoneRioArray[nZone].TRIPTIME = strucZ.ZG_T_OP;
      zoneRioArray[nZone].ACTIVE = "YES";
      zoneRioArray[nZone].INDEX = numZ;
      zoneRioArray[nZone].SHAPE = "SHAPE";
      createZonePP(nZone);
      ++nZone;
   }
   //петля фаза-фаза
   if (strucZ.ZP_EN) {
      zoneRioArray.push([]); //
      zoneRioArray[nZone].TYPE = "TRIPPING";
      zoneRioArray[nZone].FAULTLOOP = "LN";
      zoneRioArray[nZone].TRIPTIME = strucZ.ZP_T_OP;
      zoneRioArray[nZone].ACTIVE = "YES";
      zoneRioArray[nZone].INDEX = numZ;
      zoneRioArray[nZone].SHAPE = "SHAPE";
      createZonePE(nZone);
      ++nZone;
   }
}

//создает в zoneRioArray массив строк для RIO из strucZ (уставок защиты) для элемента массива 
function createLine(x, y, angle, rotate) {
   angle = +(Math.round(angle + "e+3") + "e-3");
   return "LINE," + x + "," + y + "," + angle + "," + rotate;
}

function createZonePP(curZone) {
   let nZ = 0;
   let calculate1, calculate2 = 0;
   let lineR, lineZ, linePhi, lineRCA, lineAlfa = 0;

   zoneRioArray[curZone].push([]);

   lineR = Number(strucZ.ZP_R_SET);
   lineZ = Number(strucZ.ZP_Z_SET);
   linePhi = Number(strucZ.PHI1_REACH);
   lineRCA = Number(strucZ.ZP_RCA);
   lineAlfa = Number(strucMain.ANG_ALPHA);


   zoneRioArray[curZone][nZ] = createLine(lineR, 0, linePhi, "LEFT"); nZ++;
   calculate1 = lineZ * Math.cos(degToRad(linePhi));
   calculate2 = lineZ * Math.sin(degToRad(linePhi));
   zoneRioArray[curZone][nZ] = createLine(calculate1.toFixed(2), calculate2.toFixed(2), - lineRCA + 180, "LEFT"); nZ++;
   zoneRioArray[curZone][nZ] = createLine(0, 0, +270 + lineAlfa, "LEFT"); nZ++;
   zoneRioArray[curZone][nZ] = createLine(0, 0, 345, "LEFT"); nZ++;
   if (strucZ.DIRECTIONAL == "REVERSE") {
      for (let i = 0; i < zoneRioArray[curZone].length; i++) {
         zoneRioArray[curZone][i] = rotateLINE(zoneRioArray[curZone][i], 180);
      }
   }
   zoneRioArray[curZone][nZ] = "AUTOCLOSE,YES"; nZ++;
   zoneRioArray[curZone][nZ] = "INVERT,NO";
}

function createZonePE(curZone) {
   let nZ = 0;
   let calculate1, calculate2 = 0;
   let lineR, lineZ, linePhi, lineRCA, lineAlfa = 0;

   zoneRioArray[curZone].push([]);

   let x0 = Number(strucZ.IMAG_K0);
   let r0 = Number(strucZ.REAL_K0);
   lineR = Number(strucZ.ZG_R_SET) + r0;

   calculate1 = Math.sqrt(x0 * x0 + r0 * r0);

   lineZ = Number(strucZ.ZG_Z_SET) + calculate1;
   linePhi = Number(strucZ.PHI1_REACH);
   lineRCA = Number(strucZ.ZG_RCA);
   lineAlfa = Number(strucMain.ANG_ALPHA);

   zoneRioArray[curZone][nZ] = createLine(lineR, 0, linePhi, "LEFT"); nZ++;
   calculate1 = lineZ * Math.cos(degToRad(linePhi));
   calculate2 = lineZ * Math.sin(degToRad(linePhi));
   zoneRioArray[curZone][nZ] = createLine(calculate1.toFixed(2), calculate2.toFixed(2), - lineRCA + 180, "LEFT"); nZ++;
   zoneRioArray[curZone][nZ] = createLine(0, 0, +270 + lineAlfa, "LEFT"); nZ++;
   zoneRioArray[curZone][nZ] = createLine(0, 0, 345, "LEFT"); nZ++;
   if (strucZ.DIRECTIONAL == "REVERSE") {
      for (let i = 0; i < zoneRioArray[curZone].length; i++) {
         zoneRioArray[curZone][i] = rotateLINE(zoneRioArray[curZone][i], 180);
      }
   }
   zoneRioArray[curZone][nZ] = "AUTOCLOSE,YES"; nZ++;
   zoneRioArray[curZone][nZ] = "INVERT,NO";
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