//    Comtrade analizator
//    Module: comtradeRio template Ekra version 0.01
//    Alexander Voronenko
//    796546@gmail.com
//    09.2021

const version = "EKRA2704.v016_v0.01";
let textRio = "";
let zoneRioArray = [];


// function changeZone(event) {

//    let switchElement = document.getElementById(event.name);

//    switch (event.name) {
//       case "ZONEMHOPHASE": disabledElement(event.name, event.value); break;
//       case "ZONEQUADPHASE": disabledElement(event.name, event.value); break;
//       case "ZONEMHOGROUND": disabledElement(event.name, event.value); break;
//       case "ZONEQUADGROUND": disabledElement(event.name, event.value); break;
//       case "ELOAD": if (event.value == "true") { switchElement.style.display = "block"; } else { switchElement.style.display = "none"; } break;
//       default: break;
//    }
// }

// function disabledElement(switchElement, nZone) {

//    let dan = document.getElementById(switchElement);
//    if (nZone == "0") {
//       dan.style.display = "none";
//    } else {
//       //  let number = Number(dan.value);
//       let inputs = dan.getElementsByTagName("input");
//       dan.style.display = "block";

//       if (switchElement == "ZONEMHOPHASE" || switchElement == "ZONEMHOGROUND") {
//          for (i = 0; i < inputs.length; i++) {
//             // elem = 
//             if (i < nZone) {
//                inputs[i].disabled = false;
//             } else {
//                inputs[i].disabled = true;
//             }
//          }
//       } else {
//          for (i = 0; i < inputs.length; i++) {
//             // elem = 
//             if (i < nZone * 2) {
//                inputs[i].disabled = false;
//             } else {
//                inputs[i].disabled = true;
//             }
//          }
//       }

//    }
// }


// структура RIO для BEGIN DEVICE
const deviceRio = {
   "NAME": "EKRA2704_016_305",
   "MANUFACTURER": "EKRA",
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

// структура общих уставок main
const strucMain = {
   "ZONEMHOPHASE": "",
   "ZONEQUADPHASE": "",
   "ZONEMHOGROUND": "",
   "ZONEQUADGROUND": "",
   "ELOAD": "",
   "DIR3": "",
   "DIR4": "",
   "DIR5": "",
   "KM0": "",
   "K0M1": "",
   "K0A1": "",
   "Z1MAG": "",
   "Z1ANG": "",
   "Z0MAG": "",
   "Z0ANG": "",
   "ZLF_LOAD": "",
   "ZLR_LOAD": "",
   "PLAF_LOAD": "",
   "PLAR_LOAD": "",
   "TANGP": "",
   "TANGG": ""
};

// структура ДЗ 
const dz = {
   "X1G": "",
   "R1G": "",
   "PHI11G": "",
   "KKR": "",
   "KKX": "",
   "X1P": "",
   "R1P": "",
   "PHI11P": "",
   "TILT1P": "",
   "X2": "",
   "R2": "",
   "PHI12": "",
   "X3": "",
   "R3": "",
   "PHI13": "",
   "X4": "",
   "R4": "",
   "PHI14": "",
   "DIR4": "",
   "X5": "",
   "R5": "",
   "PHI15": "",
   "DIR5": "",
   "PHI3": "",
   "PHI2": "",
   "RLOAD": "",
   "PHILOAD": ""
}

const timers = {
   "T1P": "",
   "T2": "",
   "T3": "",
   "T4": "",
   "T5": "",
   "T1G": ""
}

const logic = {
   "DZ1G": "",
   "DZ4": "",
   "DZ5": ""
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
         //        case "LINELENGTH": distanceRio[param[i].name] = param[i].value; break;
         case "IMPPRIM": distanceRio[param[i].name] = param[i].value; break;
         default: break;
      }
      // strucLoad[param[i].name.toUpperCase()] = param[i].value;
   }

   // заполняем общую структуру 
   param = document.getElementsByClassName("DZ");
   for (let i = 0; i < param.length; i++) {
      dz[param[i].name.toUpperCase()] = param[i].value;
   }

   zoneRioArray.length = [];


   // формируем зоны дистанционной защиты
   // заполняем структуру для PHASE


   param = document.getElementsByClassName("TIMERS");
   for (let i = 0; i < param.length; i++) {
      timers[param[i].name.toUpperCase()] = param[i].value;
   }

   param = document.getElementsByClassName("LOGIC");
   for (let i = 0; i < param.length; i++) {
      logic[param[i].name.toUpperCase()] = param[i].value;
   }

   // создаем вырез нагрузки
   createStrucLoad(dz.RLOAD, dz.RLOAD, dz.PHILOAD, 0, 11);

   // createZoneMho();
   // createZoneQuad();

   createStrucZ(1);
   createStrucZ(2);
   createStrucZ(3);
   createStrucZ(4);
   createStrucZ(5);
   // createStrucZ("1");
   // createStrucZ("2");
   // createStrucZ("3");
   // createStrucZ("4");
   // createStrucZ("5");
   // createStrucZ("6");
   // createStrucZ("7");
   // createStrucZ("8");
   // createStrucZ("9");
   // createStrucZ("10");
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

//создает в zoneRioArray массив строк для RIO из strucZ (уставок защиты) для элемента массива 
function createLine(x, y, angle, rotate) {
   angle = +(Math.round(angle + "e+3") + "e-3");
   return "LINE," + x + "," + y + "," + angle + "," + rotate;
}

//создание структуры уставок зоны numZ
function createStrucZ(numZ) {
   // for (key in strucZ) strucZ[key] = ""; //очистили структуру перед заполнением
   // заполняем структуру для Z с номером numZ

   //  создаем массив с параметрами зон ДЗ zoneRioArray
   let nZone = zoneRioArray.length;
   // петля фаза-земля

   zoneRioArray.push([]);
   zoneRioArray[nZone].TYPE = "TRIPPING";
   zoneRioArray[nZone].FAULTLOOP = "LL";
   zoneRioArray[nZone].ACTIVE = "YES";
   zoneRioArray[nZone].SHAPE = "SHAPE";
   zoneRioArray[nZone].INDEX = numZ;

   switch (numZ) {
      case 1:
         zoneRioArray[nZone].TRIPTIME = timers.T1P;
         createZonePP(Number(dz.X1P), Number(dz.R1P), Number(dz.PHI11P), Number(dz.TILT1P), "FORWARD");
         break;
      case 2:
         zoneRioArray[nZone].TRIPTIME = timers.T2;
         createZonePP(Number(dz.X2), Number(dz.R2), Number(dz.PHI12), 0, "FORWARD");

         break;
      case 3:
         zoneRioArray[nZone].TRIPTIME = timers.T3;
         createZonePP(Number(dz.X3), Number(dz.R3), Number(dz.PHI13), 0, "REVERSE");
         break;
      case 4:
         zoneRioArray[nZone].TRIPTIME = timers.T4;

         if (dz.DIR4 == "FORWARD") {
            createZonePP(Number(dz.X4), Number(dz.R4), Number(dz.PHI14), 0, "FORWARD");
         } else {
            createZonePP(Number(dz.X4), Number(dz.R4), Number(dz.PHI14), 0, "REVERSE");
         }
         break;
      case 5:
         zoneRioArray[nZone].TRIPTIME = timers.T5;
         if (dz.DIR5 == "FORWARD") {
            createZonePP(Number(dz.X5), Number(dz.R5), Number(dz.PHI15), 0, "FORWARD");
         } else {
            createZonePP(Number(dz.X5), Number(dz.R5), Number(dz.PHI15), 0, "REVERSE");
         }
         break;
      default: break;
   }

   nZone++;

   zoneRioArray.push([]);
   zoneRioArray[nZone].TYPE = "TRIPPING";
   zoneRioArray[nZone].FAULTLOOP = "LN";
   zoneRioArray[nZone].ACTIVE = "YES";
   zoneRioArray[nZone].SHAPE = "SHAPE";
   zoneRioArray[nZone].INDEX = numZ;

   switch (numZ) {
      case 1:
         zoneRioArray[nZone].TRIPTIME = timers.T1G;
         createZonePE(Number(dz.X1G), Number(dz.R1G), Number(dz.PHI11G), "FORWARD");
         break;
      case 2:
         zoneRioArray[nZone].TRIPTIME = timers.T2;
         createZonePE(Number(dz.X2), Number(dz.R2), Number(dz.PHI12), "FORWARD");

         break;
      case 3:
         zoneRioArray[nZone].TRIPTIME = timers.T3;
         createZonePE(Number(dz.X3), Number(dz.R3), Number(dz.PHI13), "FORWARD");

         break;
      case 4:
         zoneRioArray[nZone].TRIPTIME = timers.T4;
         createZonePE(Number(dz.X4), Number(dz.R4), Number(dz.PHI14), "FORWARD");

         break;
      case 5:
         zoneRioArray[nZone].TRIPTIME = timers.T5;
         createZonePE(Number(dz.X5), Number(dz.R5), Number(dz.PHI15), "FORWARD");

         break;
      default: break;
   }
   nZone++;
}

function createZonePP(X, R, phi, tilt, directional) {
   let nZ = 0;
   // let calculate;
   // let lineR, lineZ, angle = 0;
   let curZone = zoneRioArray.length - 1;
   zoneRioArray[curZone].push([]);

   // lineR = Number(strucZ.RFPP) / 2;
   // angle = Number(distanceRio.LINEANGLE);
   // lineX = Number(strucZ.Z) * Math.sin(degToRad(angle));
   //radToDeg(Math.atan(lineX / lineR1));

   // calculate = radToDeg(Math.atan(lineX / lineR1));

   zoneRioArray[curZone][nZ] = createLine(R, 0, phi, "LEFT"); nZ++;
   if (tilt != 0) { zoneRioArray[curZone][nZ] = createLine(R, X, 180 + tilt, "LEFT"); nZ++; }
   zoneRioArray[curZone][nZ] = createLine(0, X, 180, "LEFT"); nZ++;

   if (X * Math.tan(degToRad(Number(dz.PHI3) - 90)) > R) {
      zoneRioArray[curZone][nZ] = createLine(-R, 0, phi + 180, "LEFT"); nZ++;
   }

   // if (directional == "FORWARD") {
   zoneRioArray[curZone][nZ] = createLine(0, 0, -(180 - dz.PHI3), "LEFT"); nZ++;
   zoneRioArray[curZone][nZ] = createLine(0, 0, dz.PHI2, "LEFT"); nZ++;
   //  }

   if (directional == "REVERSE") {
      for (let i = 0; i < zoneRioArray[curZone].length; i++) {
         zoneRioArray[curZone][i] = rotateLINE(zoneRioArray[curZone][i], 180);
      }
   }

   zoneRioArray[curZone][nZ] = "AUTOCLOSE,YES"; nZ++;
   zoneRioArray[curZone][nZ] = "INVERT,NO";
}


function createZonePE(X, R, phi, directional) {


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
   let filename = "sel421.rio";
   let type = 'text/plain';

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
}
