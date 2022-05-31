//    Comtrade analizator
//    Module: comtradeRio template REL650_ZQPDIS version 0.01
//    Alexander Voronenko
//    796546@gmail.com
//    09.2021

const version = "REL650.vZQPDIS_v0.01";
let textRio = "";
let zoneRioArray = [];

window.addEventListener("message", receiveMessage, false);
function receiveMessage(event) {
   if (event.data === "validate") formValidation();
   if (event.data === "saveRio") saveFile();
   if (event.data === "saveSettings") alert("В процессе разработки");
   if (event.data === "loadSettings") alert("В процессе разработки");

}


// структура RIO для BEGIN DEVICE
const deviceRio = {
   "NAME": "REL650_ZQPDIS",
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
   "IMPPRIM": "YES",
   "ARCRES": "",
   "TTOLPLUS": "0.03",
   "TTOLMINUS": "0.03",
   "TTOLREL": "5",
   "ZTOLREL": "5",
   "ZTOLABS": "0.05",
   "KL": "",
   "RERL_XEXL": "",
   "Z0Z1": "1, 0",
   "KM": "0, 0",
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
// структура выреза нагрузки REL
const strucOkp = {
   "RLDFW": "",
   "RLDRV": "",
   "ARGLD": "",
   "X1": "",
   "X0": "",
   "RFFWPP": "",
   "RFRVPP": "",
   "RFFWPE": "",
   "RFRVPE": "",
   "ARGNEGRES": "",
   "ARGDIR": "",
};

// структура ДЗ уставок REL
const strucZ = {
   "ACTIVE": "",
   "RFPE": "",
   "RFPP": "",
   "Z": "",
   "KNMAG": "",
   "KNANG": "",
   "DIR": "",
   "TPE": "",
   "TPP": "",
   "OPERATIONPP": "",
   "OPERATIONPE": ""
}

// function changeSelect(event) {
//    let swithPosition = event.name;
//    // alert("change");

//    if (swithPosition == "selectDz1" || swithPosition == "selectDz2" || swithPosition == "selectDz3"
//       || swithPosition == "selectDz4" || swithPosition == "selectDz5" || swithPosition == "selectDz6") {
//       if (event.value == "off") {
//          document.getElementById(swithPosition).style.display = "none";
//       } else {
//          document.getElementById(swithPosition).style.display = "block";
//       }
//    }
// }

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
   //let nZ = 0; // текущая строка при заполнеии структуры для рисования зоны ДЗ
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
      //   strucLoad[param[i].name.toUpperCase()] = param[i].value;
   }

   // заполняем структуру для выреза нагрузки
   param = document.getElementsByClassName("okp");
   for (let i = 0; i < param.length; i++) {
      strucOkp[param[i].name.toUpperCase()] = param[i].value;
   }

   zoneRioArray = []; // очистили массив перед заполнением

   createStrucLoad(strucOkp.RLDFW, strucOkp.RLDRV, strucOkp.ARGLD, 0, 11);
   createStrucLoad(strucOkp.RLDFW, strucOkp.RLDRV, strucOkp.ARGLD, 30, 12);

   createStrucZ("1");
   createStrucZ("2");
   createStrucZ("3");
   createStrucZ("4");
   createStrucZ("5");

   createFDPSPDIS("6");

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
      zoneRioArray[nZone][nZ] = "LINE,0,0," + curCalulate.toFixed(3) + ",LEFT"; nZ++;
      zoneRioArray[nZone][nZ] = "LINE," + fw + ",0,270,LEFT"; nZ++;
      curCalulate = 360 - Number(angle);
      zoneRioArray[nZone][nZ] = "LINE,0,0," + curCalulate.toFixed(3) + ",LEFT"; nZ++;
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
      curCalulate = Number(angle);
      zoneRioArray[nZone][nZ] = "LINE,0,0," + curCalulate.toFixed(3) + ",LEFT"; nZ++;
      zoneRioArray[nZone][nZ] = "LINE,-" + rv + ",0,90,LEFT"; nZ++;
      curCalulate = 180 - Number(angle);
      zoneRioArray[nZone][nZ] = "LINE,0,0," + curCalulate.toFixed(3) + ",LEFT"; nZ++;
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
   // заполняем структуру для Z
   param = document.getElementsByClassName("Z" + numZ);
   param2 = document.getElementsByClassName("Z2");

   for (let i = 0; i < param.length; i++) {
      switch (param[i].name) {
         case "DIR" + numZ:
            //      if (param[i].value == "OFF") { strucZ.ACTIVE = false; } else { strucZ.ACTIVE = true; };
            if (param[i].value == "NONDIRECTIONAL") { strucZ.DIR = "NONDIRECTIONAL"; };
            if (param[i].value == "FORWARD") { strucZ.DIR = "FORWARD"; };
            if (param[i].value == "REVERSE") { strucZ.DIR = "REVERSE"; };
            break;
         case "OPERATIONPP":
            if (!param[i].checked) { strucZ.OPERATIONPP = false; } else { strucZ.OPERATIONPP = true; } break;
         case "OPERATIONPE":
            if (!param[i].checked) { strucZ.OPERATIONPE = false; } else { strucZ.OPERATIONPE = true; } break;
         default: strucZ[param[i].name.toUpperCase()] = param[i].value; break;
      }
   }
   if (numZ > 2) {
      for (let i = 0; i < param2.length; i++) {
         if (param2[i].mame == "KNMAG") { strucZ.KNMAG = param2[i].value }
         if (param2[i].mame == "KNMAG") { strucZ.KNANG = param2[i].value }
      }
   }


   // создаем массив с параметрами зон ДЗ zoneRioArray

   let nZone = zoneRioArray.length;
   // if (strucZ.ACTIVE) {
   if (strucZ.OPERATIONPP) {
      zoneRioArray.push([]); // 
      zoneRioArray[nZone].TYPE = "TRIPPING";
      zoneRioArray[nZone].FAULTLOOP = "LL";
      zoneRioArray[nZone].TRIPTIME = strucZ.TPP;
      zoneRioArray[nZone].ACTIVE = "YES";
      zoneRioArray[nZone].INDEX = numZ;
      zoneRioArray[nZone].SHAPE = "SHAPE";
      createZonePP(nZone);
      ++nZone;
   }
   if (strucZ.OPERATIONPE) {
      zoneRioArray.push([]); // 
      zoneRioArray[nZone].TYPE = "TRIPPING";
      zoneRioArray[nZone].FAULTLOOP = "LN";
      zoneRioArray[nZone].TRIPTIME = strucZ.TPE;
      zoneRioArray[nZone].ACTIVE = "YES";
      zoneRioArray[nZone].INDEX = numZ;
      zoneRioArray[nZone].SHAPE = "SHAPE";
      createZonePE(nZone);
      ++nZone;
   }
   // }

}

function createFDPSPDIS(numZ) {
   let nZone = zoneRioArray.length;

   //  if (strucZ.OPERATIONPP) {
   zoneRioArray.push([]); // 
   zoneRioArray[nZone].TYPE = "STARTING";
   zoneRioArray[nZone].FAULTLOOP = "LL";
   //      zoneRioArray[nZone].TRIPTIME = strucZ.TPP;
   zoneRioArray[nZone].ACTIVE = "YES";
   zoneRioArray[nZone].INDEX = numZ;
   zoneRioArray[nZone].SHAPE = "SHAPE";
   createZoneFDPSPDIS(Number(strucOkp.RFFWPP) / 2, Number(strucOkp.RFRVPP) / 2, Number(strucOkp.X1), 60, false);
   ++nZone;
   zoneRioArray.push([]); // 
   zoneRioArray[nZone].TYPE = "STARTING";
   zoneRioArray[nZone].FAULTLOOP = "L1L2L3";
   //      zoneRioArray[nZone].TRIPTIME = strucZ.TPP;
   zoneRioArray[nZone].ACTIVE = "YES";
   zoneRioArray[nZone].INDEX = numZ;
   zoneRioArray[nZone].SHAPE = "SHAPE";
   createZoneFDPSPDIS(Number(strucOkp.RFFWPP) / 2, Number(strucOkp.RFRVPP) / 2, Number(strucOkp.X1), 60, true);
   ++nZone;
   //  }
   //  if (strucZ.OPERATIONPE) {
   zoneRioArray.push([]); // 
   zoneRioArray[nZone].TYPE = "STARTING";
   zoneRioArray[nZone].FAULTLOOP = "LN";
   //     zoneRioArray[nZone].TRIPTIME = strucZ.TPE;
   zoneRioArray[nZone].ACTIVE = "YES";
   zoneRioArray[nZone].INDEX = numZ;
   zoneRioArray[nZone].SHAPE = "SHAPE";
   let XN = (Number(strucOkp.X0) - Number(strucOkp.X1)) / 3;
   createZoneFDPSPDIS(Number(strucOkp.RFFWPE), Number(strucOkp.RFRVPE), Number(strucOkp.X1) + XN, 60, false);
   ++nZone;
   //  }
}

function createZoneFDPSPDIS(Rfw, Rrv, X, angle, rotate) {
   let nZ = 0;
   let curZone = zoneRioArray.length - 1;
   zoneRioArray[curZone].push([]);

   zoneRioArray[curZone][nZ] = createLine(Rfw, 0, angle, "LEFT"); nZ++;
   zoneRioArray[curZone][nZ] = createLine(0, X, 180, "LEFT"); nZ++;
   zoneRioArray[curZone][nZ] = createLine(-Rrv, 0, 270, "LEFT"); nZ++;
   zoneRioArray[curZone][nZ] = createLine(-Rrv, 0, 180 + angle, "LEFT"); nZ++;
   zoneRioArray[curZone][nZ] = createLine(0, -X, 0, "LEFT"); nZ++;
   zoneRioArray[curZone][nZ] = createLine(Rfw, 0, 90, "LEFT"); nZ++;
   if (rotate) {
      for (let i = 0; i < zoneRioArray[curZone].length; i++) {
         zoneRioArray[curZone][i] = rotateLINE(zoneRioArray[curZone][i], 30);
      }
   }

}



//создает в zoneRioArray массив строк для RIO из strucZ (уставок защиты) для элемента массива 
function createLine(x, y, angle, rotate) {
   angle = +(Math.round(angle + "e+3") + "e-3");
   return "LINE," + x + "," + y + "," + angle.toFixed(2) + "," + rotate;
}

function createZonePP(curZone) {
   let nZ = 0;
   let calculate;
   let lineR, lineZ, angle = 0;

   zoneRioArray[curZone].push([]);

   lineR = Number(strucZ.RFPP) / 2;
   angle = Number(distanceRio.LINEANGLE);
   lineX = Number(strucZ.Z) * Math.sin(degToRad(angle));
   //radToDeg(Math.atan(lineX / lineR1));

   // calculate = radToDeg(Math.atan(lineX / lineR1));

   zoneRioArray[curZone][nZ] = createLine(lineR, 0, angle, "LEFT"); nZ++;
   zoneRioArray[curZone][nZ] = createLine(0, lineX, 180, "LEFT"); nZ++;
   if (strucZ.DIR == "NONDIRECTIONAL") {
      zoneRioArray[curZone][nZ] = createLine(-lineR, 0, 270, "LEFT"); nZ++;
      // calculate = radToDeg(Math.atan(lineX / lineR1));
      zoneRioArray[curZone][nZ] = createLine(-lineR, 0, angle + 180, "LEFT"); nZ++;
      zoneRioArray[curZone][nZ] = createLine(0, -lineX, 0, "LEFT"); nZ++;
      zoneRioArray[curZone][nZ] = createLine(lineR, 0, 90, "LEFT"); nZ++;
   } else {
      // проверка на рисование линни при угле 90-60 = 30

      if (lineX * Math.tan(degToRad(30)) > lineR) {
         zoneRioArray[curZone][nZ] = createLine(-lineR, 0, 270, "LEFT"); nZ++;
      }
      zoneRioArray[curZone][nZ] = createLine(0, 0, 180 + Number(strucOkp.ARGNEGRES), "LEFT"); nZ++;
      zoneRioArray[curZone][nZ] = createLine(0, 0, 360 - Number(strucOkp.ARGDIR), "LEFT"); nZ++;
      zoneRioArray[curZone][nZ] = createLine(lineR, 0, 90, "LEFT"); nZ++;
      if (strucZ.DIR == "REVERSE") {
         for (let i = 0; i < zoneRioArray[curZone].length; i++) {
            zoneRioArray[curZone][i] = rotateLINE(zoneRioArray[curZone][i], 180);
         }
      }
   }

   zoneRioArray[curZone][nZ] = "AUTOCLOSE,YES"; nZ++;
   zoneRioArray[curZone][nZ] = "INVERT,NO";
}

function createZonePE(curZone) {
   let nZ = 0;
   let calculate;
   let lineR, lineR1, lineX, angle = 0;

   zoneRioArray[curZone].push([]);
   // let XN = (strucZ.X0 - strucZ.X1PE) / 3;
   // let RN = (strucZ.R0 - strucZ.R1PE) / 3;

   lineR = Number(strucZ.RFPE);
   angle = Number(distanceRio.LINEANGLE);
   lineX = Number(strucZ.Z) * Math.sin(degToRad(angle));

   let X = lineX;
   let R = Number(strucZ.Z) * Math.cos(degToRad(angle));
   let Xn = Number(strucZ.Z) * Math.sin(degToRad(angle - Number(strucZ.KNANG))) * Number(strucZ.KNMAG);
   let Rn = Number(strucZ.Z) * Math.cos(degToRad(angle - Number(strucZ.KNANG))) * Number(strucZ.KNMAG);
   let Xsum = X + Xn;
   let Rsum = R + Rn;
   calculate = radToDeg(Math.atan(Rsum / Xsum));

   //  lineR1 = Number(strucZ.R1PE) + RN;
   //  lineX = Number(strucZ.X1PE) + XN;

   lineX = Xsum;

   //  calculate = radToDeg(Math.atan(lineX / lineR1));
   zoneRioArray[curZone][nZ] = createLine(lineR, 0, calculate, "LEFT"); nZ++;
   zoneRioArray[curZone][nZ] = createLine(0, lineX, 180, "LEFT"); nZ++;
   if (strucZ.DIR == "NONDIRECTIONAL") {
      zoneRioArray[curZone][nZ] = createLine(-lineR, 0, 270, "LEFT"); nZ++;
      // calculate = radToDeg(Math.atan(lineX / lineR1));
      zoneRioArray[curZone][nZ] = createLine(-lineR, 0, +calculate + 180, "LEFT"); nZ++;
      zoneRioArray[curZone][nZ] = createLine(0, -lineX, 0, "LEFT"); nZ++;
      zoneRioArray[curZone][nZ] = createLine(lineR, 0, 90, "LEFT"); nZ++;
   } else {
      if (lineX * Math.tan(degToRad(30)) > lineR) {
         zoneRioArray[curZone][nZ] = createLine(-lineR, 0, 270, "LEFT"); nZ++;
      }
      zoneRioArray[curZone][nZ] = createLine(0, 0, 300, "LEFT"); nZ++;
      zoneRioArray[curZone][nZ] = createLine(0, 0, 345, "LEFT"); nZ++;
      zoneRioArray[curZone][nZ] = createLine(lineR, 0, 90, "LEFT"); nZ++;
      if (strucZ.DIR == "REVERSE") {
         for (let i = 0; i < zoneRioArray[curZone].length; i++) {
            zoneRioArray[curZone][i] = rotateLINE(zoneRioArray[curZone][i], 180);
         }
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

function saveFile() {
   let data = document.getElementById('outRioData').value;
   let filename = "rel650_ZQDPDIS.rio";
   let type = 'text/plain';

   if (data.length > 100) {
      var file = new Blob([data], { type: type });
      if (window.navigator.msSaveOrOpenBlob) // IE10+
         window.navigator.msSaveOrOpenBlob(file, filename);
      else { // Others
         var a = document.createElement("a"),
            url = URL.createObjectURL(file);
         a.href = url;
         a.download = filename;
         document.body.appendChild(a);
         a.click();
         setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
         }, 0);
      }

   } else {
      alert("Мало данных для формирования файла либо файл RIO не сформирован");
   }

}