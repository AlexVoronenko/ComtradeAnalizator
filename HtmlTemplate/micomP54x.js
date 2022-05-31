//    Comtrade analizator
//    Module: comtradeRio template MICOM P54x QUADR version 0.01
//    Alexander Voronenko
//    796546@gmail.com
//    09.2021

// 0.02 - проверка введенных данных для построения характеристик ДЗ
// 0.03 - проверка на корректность формирования RIO файла
// 0.04 - проверка информации для построения характеристик ДЗ
// 0.05 - сохранение введенных данных и загрузка из файла 
// 0.06 - импорт уставок из экспорта файла уставок реле
// 0.07 - 
// 0.08 - 
// 0.09 -
// 0.10 - проведена оптимизация модуля формирования RIO файла  

const version = "P54x.v1_v0.01";

let textRio = "";
let zoneRioArray = [];

// структура RIO для BEGIN DEVICE
const deviceRio = {
   "NAME": "MICOM P54x",
   "MANUFACTURER": "Schnider Electric",
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
   "ARCRES": "NO",
   "TTOLPLUS": "0.05",
   "TTOLMINUS": "0.05",
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

// структура общих уставок "common"
const strucMain = {
   "LINELEIMP": "",
   "KZRESCOMP": "",
   "KZRESANGLE": "",
   "MODE": "",
   "LOAD_EN": "",
   "Z_LOAD": "",
   "ANG_LOAD": "",
   "DIR_DZ_EN": "",
   "DIR_CHAR_ANGLE": "",
   "SIMPLEPHASE": "",
   "SIMPLEGROUND": "",
   "ADVANCEDPHASE": "",
   "ZPH1": "",
   "ZPH2": "",
   "ZPH3": "",
   "OFFSETPH3": "",
   "ZPHP": "",
   "ZPHDIRP": "",
   "ZPH4": "",
   "ZPHQ": "",
   "ZPHDIRQ": "",
   "ADVANCEDGROUND": "",
   "ZGNDTILT": "",
   "ZGND1": "",
   "ZGND2": "",
   "ZGND3": "",
   "OFFSETGND3": "",
   "ZGNDP": "",
   "ZGNDDIRP": "",
   "ZGND4": "",
   "ZGNDQ": "",
   "ZGNDDIRQ": ""
};

const strucTimers = {
   "TIMER1": "",
   "TPHD1": "",
   "TGNDD1": "",
   "TIMER2": "",
   "TPHD2": "",
   "TGNDD2": "",
   "TIMER3": "",
   "TPHD3": "",
   "TGNDD3": "",
   "TIMER4": "",
   "TPHD4": "",
   "TGNDD4": "",
   "TIMERP": "",
   "TPHDP": "",
   "TGNDDP": "",
   "TIMERQ": "",
   "TPHDQ": "",
   "TGNDDQ": ""
}

//структура для уставок SIMPLE PHASE MHO
const strucZSPhaseMho = {
   "ZSPHM1": "",
   "Z1": "",
   "ZSPHM2": "",
   "Z2": "",
   "ZSPHM3": "",
   "Z3": "",
   "ZSPHOFFSETENM3": "",
   "ZOFFSET3": "",
   "ZSPHMP": "",
   "DIRP": "",
   "ZP": "",
   "ZSPHM4": "",
   "Z4": "",
   "ZSPHMQ": "",
   "DIRQ": "",
   "ZQ": ""
}

//структура для уставок SIMPLE PHASE QUAD
const strucZSPhaseQuad = {
   "ZSPHRTYPE": "",
   "ZFAULT": "",
   "ZSPHQ1": "",
   "Z1": "",
   "ZSPHQ2": "",
   "Z2": "",
   "ZSPHQ3": "",
   "Z3": "",
   "ZSPHOFFSETENQ3": "",
   "ZOFFSET3": "",
   "ZSPHQP": "",
   "DIRP": "",
   "ZP": "",
   "ZSPHQ4": "",
   "Z4": "",
   "ZSPHQQ": "",
   "DIRQ": "",
   "ZQ": ""
}

//структура для уставок SIMPLE GROUND MHO
const strucZSGroundMho = {
   "ZSGNDM1": "",
   "Z1": "",
   "ZSGNDM2": "",
   "Z2": "",
   "ZSGNDM3": "",
   "Z3": "",
   "ZSGNDOFFSETENM3": "",
   "ZOFFSET3": "",
   "ZSGNDMP": "",
   "DIRP": "",
   "ZP": "",
   "ZSGNDM4": "",
   "Z4": "",
   "ZSGNDMQ": "",
   "DIRQ": "",
   "ZQ": ""
}

//структура для уставок SIMPLE GROUND QUAD
const strucZSGroundQuad = {
   "ZSGNDRTYPE": "",
   "ZFAULT": "",
   "ZSGNDQ1": "",
   "Z1": "",
   "ZSGNDQ2": "",
   "Z2": "",
   "ZSGNDQ3": "",
   "Z3": "",
   "ZGNDHOFFSETENQ3": "",
   "ZOFFSET3": "",
   "ZSGNDQP": "",
   "DIRP": "",
   "ZP": "",
   "ZSGNDQ4": "",
   "Z4": "",
   "ZSGNDQQ": "",
   "DIRQ": "",
   "ZQ": ""
}

const strucZAPhaseMho = {
   "ZPHR1": "",
   "ZPHANGLE1": "",
   "ZPHR2": "",
   "ZPHANGLE2": "",
   "ZPHR3": "",
   "ZPHANGLE3": "",
   "RPHOFFSET3": "",
   "ZPHRP": "",
   "ZPHANGLEP": "",
   "ZPHR4": "",
   "ZPHANGLE4": "",
   "ZPHRQ": "",
   "ZPHANGLEQ": ""
}
const strucZAPhaseQuad = {
   "ZPHR1": "",
   "ZPHANGLE1": "",
   "RPHRES1": "",
   "ZPHTILT1": "",
   "ZPHR2": "",
   "ZPHANGLE2": "",
   "RPHRES2": "",
   "ZPHTILT2": "",
   "ZPHR3": "",
   "ZPHANGLE3": "",
   "RPHOFFSET3": "",
   "RPHRESFW3": "",
   "RPHRESRV3": "",
   "ZPHTILT3": "",
   "ZPHRP": "",
   "ZPHANGLEP": "",
   "RPHRESP": "",
   "ZPHTILTP": "",
   "ZPHR4": "",
   "ZPHANGLE4": "",
   "RPHRES4": "",
   "ZPHTILT4": "",
   "ZPHRQ": "",
   "ZPHANGLEQ": "",
   "RPHRESQ": "",
   "ZPHTILTQ": ""
}

const strucZAGroundMho = {
   "ZGNDR1": "",
   "ZGNDANGLE1": "",
   "ZGNDKZCOMP1": "",
   "ZGNDKZANGLE1": "",
   "ZGNDR2": "",
   "ZGNDANGLE2": "",
   "ZGNDKZCOMP2": "",
   "ZGNDKZANGLE2": "",
   "ZGNDR3": "",
   "ZGNDANGLE3": "",
   "RGNDOFFSET3": "",
   "ZGNDKZCOMP3": "",
   "ZGNDKZANGLE3": "",
   "ZGNDRP": "",
   "ZGNDANGLEP": "",
   "ZGNDKZCOMPP": "",
   "ZGNDKZANGLEP": "",
   "ZGNDR4": "",
   "ZGNDANGLE4": "",
   "ZGNDKZCOMP4": "",
   "ZGNDKZANGLE4": "",
   "ZGNDRQ": "",
   "ZGNDANGLEQ": "",
   "ZGNDKZCOMPQ": "",
   "ZGNDKZANGLEQ": ""
}
const strucZAGroundQuad = {
   "ZGNDR1": "",
   "ZGNDANGLE1": "",
   "ZGNDTILT1": "",
   "KZN1": "",
   "KZNANG1": "",
   "RGNDRES1": "",
   "ZGNDR2": "",
   "ZGNDANGLE2": "",
   "ZGNDTILT2": "",
   "KZN2": "",
   "KZNANG2": "",
   "RGNDRES2": "",
   "ZGNDR3": "",
   "ZGNDANGLE3": "",
   "ZGNDTILT3": "",
   "ZGNDOFFSET3": "",
   "KZN3": "",
   "KZNANG3": "",
   "RGNDRESFWD3": "",
   "RGNDRESREV3": "",
   "ZGNDRP": "",
   "ZGNDANGLEP": "",
   "ZGNDTILTP": "",
   "KZNP": "",
   "KZNANGP": "",
   "RGNDRESP": "",
   "ZGNDR4": "",
   "ZGNDANGLE4": "",
   "ZGNDTILT4": "",
   "KZN4": "",
   "KZNANG4": "",
   "RGNDRES4": "",
   "ZGNDRQ": "",
   "ZGNDANGLEQ": "",
   "ZGNDTILTQ": "",
   "KZNQ": "",
   "KZNANGQ": "",
   'RGNDRESQ': ""
}

// структура ДЗ уставок Px4x
const strucZ = {
   "DIRECTIONAL": "",
   "ZPHR1": "",
   "ZPHANGLE": "",
   "RPHRES": "",
   "ZPHTILT": "",
   "TPHD": "",
   "ZGNDR": "",
   "ZGNDANGLE": "",
   "ZGNDTILTEN": "",
   "ZGNDTILT": "",
   "TGNDD": "",
   "KZN1": "",
   "KZNANG": "",
   "RGNDRES": "",
   "ZPHSTATUS": "",
   "ZGNDSTATUS": ""
}

function changeTime(event) {
   let num = event.name.slice(-1);
   let phase = document.getElementById("TP" + num);
   let ground = document.getElementById("TG" + num);

   phase.style.display = "block";
   ground.style.display = "block";

   if (event.value == "DISABLED") {
      phase.style.display = "none";
      ground.style.display = "none";
   }

   if (event.value == "PHASE") {
      ground.style.display = "none";
   }

   if (event.value == "GROUND") {
      phase.style.display = "none";
   }
}


function changeMode(event) {
   let advancedDiv = document.getElementById("anvanced");
   let simpleDiv = document.getElementById("simple");

   if (event.value === "SIMPLE") {
      advancedDiv.style.display = "none";
      simpleDiv.style.display = "block";
   }
   else {
      advancedDiv.style.display = "block";
      simpleDiv.style.display = "none";
   }
}

function changeChars(event) {
   let swithPosition = event.name;
   let switchElement = document.getElementsByName(swithPosition);

   if (swithPosition == "SIMPLEPHASE") {
      let simpleMho = document.getElementById("SIMPLEPHASEMHO");
      let simpleQuad = document.getElementById("SIMPLEPHASEQUAD");
      switch (switchElement[0].value) {
         case "SIMPLEPHASEMHO": simpleMho.style.display = "block"; simpleQuad.style.display = "none"; break;
         case "SIMPLEPHASEQUAD": simpleQuad.style.display = "block"; simpleMho.style.display = "none"; break;
         default: simpleQuad.style.display = "none"; simpleMho.style.display = "none"; break;
      }
   }
   if (swithPosition == "SIMPLEGROUND") {
      let simpleMho = document.getElementById("SIMPLEGROUNDMHO");
      let simpleQuad = document.getElementById("SIMPLEGROUNDQUAD");
      switch (switchElement[0].value) {
         case "SIMPLEGROUNDMHO": simpleMho.style.display = "block"; simpleQuad.style.display = "none"; break;
         case "SIMPLEGROUNDQUAD": simpleQuad.style.display = "block"; simpleMho.style.display = "none"; break;
         default: simpleQuad.style.display = "none"; simpleMho.style.display = "none"; break;
      }
   }
   if (swithPosition == "ADVANCEDPHASE") {
      let simpleMho = document.getElementById("ADVANCEDPHASEMHO");
      let simpleQuad = document.getElementById("ADVANCEDPHASEQUAD");
      let menuQuad = document.getElementById("ADVANCEDPHASE");
      if (event.value == "DISABLED") { menuQuad.style.display = "none"; } else { menuQuad.style.display = "block"; }
      switch (switchElement[0].value) {
         case "ADVANCEDPHASEMHO": simpleMho.style.display = "block"; simpleQuad.style.display = "none"; break;
         case "ADVANCEDPHASEQUAD": simpleQuad.style.display = "block"; simpleMho.style.display = "none"; break;
         default: simpleQuad.style.display = "none"; simpleMho.style.display = "none"; break;
      }
   }
   if (swithPosition == "ADVANCEDGROUND") {
      let simpleMho = document.getElementById("ADVANCEDGROUNDMHO");
      let simpleQuad = document.getElementById("ADVANCEDGROUNDQUAD");
      let simpleQuadMenu = document.getElementById("ADVANCEDQUAD");
      let menuQuad = document.getElementById("ADVANCEDGROUND");
      if (event.value == "DISABLED") { menuQuad.style.display = "none"; } else { menuQuad.style.display = "block"; }
      switch (switchElement[0].value) {
         case "ADVANCEDGROUNDMHO": simpleMho.style.display = "block"; simpleQuad.style.display = "none"; simpleQuadMenu.style.display = "none"; break;
         case "ADVANCEDGROUNDQUAD": simpleQuad.style.display = "block"; simpleQuadMenu.style.display = "block"; simpleMho.style.display = "none"; break;
         default: simpleQuad.style.display = "none"; simpleMho.style.display = "none"; break;
      }
   }
}

function changeZone(event) {

   let swithPosition = event.name;
   let switchElement = document.getElementById(swithPosition);

   if (event.value === "false") { switchElement.style.display = "none"; }
   else { switchElement.style.display = "block"; }

   if (swithPosition == "ZPHP" || swithPosition == "ZPHQ" || swithPosition == "ZGNDP"
      || swithPosition == "ZGNDQ" || swithPosition == "ZGND3" || swithPosition == "ZPH3") {
      let switchElementMenu = document.getElementById(swithPosition + "_");
      if (event.value === "false") { switchElementMenu.style.display = "none"; }
      else { switchElementMenu.style.display = "block"; }
   }

   //уберем ступень для advanced MHO
   let sp = swithPosition;
   if (sp == "ZPH1" || sp == "ZPH2" || sp == "ZPH3" || sp == "ZPHP" || sp == "ZPH4" || sp == "ZPHQ"
      || sp == "ZGND1" || sp == "ZGND2" || sp == "ZGND3" || sp == "ZGNDP" || sp == "ZGND4" || sp == "ZGNDQ") {
      let switchElementMenu = document.getElementById(swithPosition + "MHO");
      if (event.value === "false") { switchElementMenu.style.display = "none"; }
      else { switchElementMenu.style.display = "block"; }
   }
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
   result += "," + rotatedX.toFixed(3); //X
   result += "," + rotatedY.toFixed(3); //Y
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

   //////////// !!!!!!!!!!!!!!!!!!! не заполнили kzn или еще чего...

   // заполняем общую структуру 
   param = document.getElementsByClassName("common");
   for (let i = 0; i < param.length; i++) { strucMain[param[i].name.toUpperCase()] = param[i].value; }

   // заполняем структуру таймеров отключения 
   param = document.getElementsByClassName("TIMERS");
   for (let i = 0; i < param.length; i++) { strucTimers[param[i].name.toUpperCase()] = param[i].value; }

   zoneRioArray.length = [];
   // создаем вырез нагрузки
   if (strucMain.LOAD_EN) {
      createStrucLoad(strucMain.Z_LOAD, strucMain.Z_LOAD, strucMain.ANG_LOAD, 0, 11); // вырез нагрузки пересечение прямой к дугой!!!!!!!!!!!!!
   }

   //Для P54x если направление выведено, то по умолчанию принимается угол макс.чувствительности = 60 градусов.
   if (strucMain.DIR_DZ_EN == "false") {
      strucMain.DIR_CHAR_ANGLE = "60";
   }

   if (strucMain.MODE === "SIMPLE") {
      if (strucMain.SIMPLEPHASE == "SIMPLEPHASEMHO") { simplePhaseMho(); }
      if (strucMain.SIMPLEPHASE == "SIMPLEPHASEQUAD") { simplePhaseQuad(); }
      if (strucMain.SIMPLEGROUND == "SIMPLEGROUNDMHO") { simpleGroundMho(); }
      if (strucMain.SIMPLEGROUND == "SIMPLEGROUNDQUAD") { simpleGroundQuad(); }
   }
   if (strucMain.MODE === "ADVANCED") {
      if (strucMain.ADVANCEDPHASE == "ADVANCEDPHASEMHO") { advancedPhaseMho(); }
      if (strucMain.ADVANCEDPHASE == "ADVANCEDPHASEQUAD") { advancedPhaseQuad(); }
      if (strucMain.ADVANCEDGROUND == "ADVANCEDGROUNDMHO") { advancedGroundMho(); }
      if (strucMain.ADVANCEDGROUND == "ADVANCEDGROUNDQUAD") { advancedGroundQuad(); }
   }

   // формируем зоны дистанционной защиты
   //  createStrucZ("1");
   // createStrucZ("2");
   // createStrucZ("3");
   // createStrucZ("4");

}

// Рисование зоны круговой характеристики
// fault "ground", "phase"
// timerType GROUND PHASE PHASEGROUND
// tripTime - время откл ступени
// index - номер зоны
//  ANGLE, REACH, OFFSET - для рисования зоны RIO
// !!!!!!!!!!! рисуем без учета реле направления!!!!!!!!!!!!!!!!!!!!!
function createZoneMho(fault, timerType, tripTime, index, ANGLE, REACH, OFFSET) {
   //let calculate = 0;
   let nZ = 0;
   let nZone = zoneRioArray.length;

   zoneRioArray.push([]);
   if (timerType.indexOf(fault) != "-1") {
      zoneRioArray[nZone].TYPE = "TRIPPING";
      zoneRioArray[nZone].ACTIVE = "YES";
   } else {
      zoneRioArray[nZone].TYPE = "NONTRIPPING";
      zoneRioArray[nZone].ACTIVE = "NO";
   }

   if (fault == "GROUND") { zoneRioArray[nZone].FAULTLOOP = "LN"; }
   if (fault == "PHASE") { zoneRioArray[nZone].FAULTLOOP = "LL"; }
   zoneRioArray[nZone].TRIPTIME = tripTime;
   zoneRioArray[nZone].INDEX = index;
   zoneRioArray[nZone].SHAPE = "MHOSHAPE";
   zoneRioArray[nZone].push([]);

   zoneRioArray[nZone][nZ] = "ANGLE," + ANGLE.toFixed(3); nZ++;
   zoneRioArray[nZone][nZ] = "REACH," + REACH.toFixed(3); nZ++;
   zoneRioArray[nZone][nZ] = "OFFSET," + OFFSET.toFixed(3); nZ++;
   zoneRioArray[nZone][nZ] = "INVERT,NO";
}

function simplePhaseMho() {
   // alert("SIMPLEPHASEMHO");
   let param = document.getElementsByClassName("ZSPHASEMHO");
   let calculate = 0;
   let angle, reach, offset = 0;

   for (let i = 0; i < param.length; i++) { strucZSPhaseMho[param[i].name.toUpperCase()] = param[i].value; }

   if (strucZSPhaseMho.ZSPHM1) {
      angle = Number(distanceRio.LINEANGLE);
      reach = Number(strucZSPhaseMho.Z1) * Number(strucMain.LINELEIMP) / 100;
      offset = 0;
      calculate = Number(strucMain.LINELEIMP) * Number(strucZSPhaseMho.Z1) / 100;// расчет сопротивления Z зоны
      createZoneMho("PHASE", strucTimers.TIMER1, strucTimers.TPHD1, 1, angle, calculate, offset);
   }
   if (strucZSPhaseMho.ZSPHM2) {
      angle = Number(distanceRio.LINEANGLE);
      reach = Number(strucZSPhaseMho.Z2) * Number(strucMain.LINELEIMP) / 100;
      offset = 0;
      calculate = Number(strucMain.LINELEIMP) * Number(strucZSPhaseMho.Z2) / 100;// расчет сопротивления Z зоны
      createZoneMho("PHASE", strucTimers.TIMER2, strucTimers.TPHD2, 2, angle, calculate, offset);
   }

   if (strucZSPhaseMho.ZSPHM3) {
      angle = Number(distanceRio.LINEANGLE);
      reach = Number(strucZSPhaseMho.Z3) * Number(strucMain.LINELEIMP) / 100;
      offset = 0;
      if (strucZSPhaseMho.ZSPHOFFSETENM3) { offset = Number(strucMain.LINELEIMP) * Number(strucZSPhaseMho.ZOFFSET3) / 100; }
      calculate = Number(strucMain.LINELEIMP) * Number(strucZSPhaseMho.Z3) / 100;// расчет сопротивления Z зоны
      createZoneMho("PHASE", strucTimers.TIMER3, strucTimers.TPHD3, 3, angle, calculate, offset);
   }

   if (strucZSPhaseMho.ZSPHM4) {
      angle = Number(distanceRio.LINEANGLE) + 180;
      reach = Number(strucZSPhaseMho.Z4) * Number(strucMain.LINELEIMP) / 100;
      offset = 0;
      calculate = Number(strucMain.LINELEIMP) * Number(strucZSPhaseMho.Z4) / 100;// расчет сопротивления Z зоны
      createZoneMho("PHASE", strucTimers.TIMER4, strucTimers.TPHD4, 4, angle, calculate, offset);
   }

   if (strucZSPhaseMho.ZSPHMP) {
      angle = Number(distanceRio.LINEANGLE);
      reach = Number(strucZSPhaseMho.ZP) * Number(strucMain.LINELEIMP) / 100;
      offset = 0;
      if (strucZSPhaseMho.DIRP == "REVERSE") { angle += 180; }
      calculate = Number(strucMain.LINELEIMP) * Number(strucZSPhaseMho.ZP) / 100;// расчет сопротивления Z зоны
      createZoneMho("PHASE", strucTimers.TIMERP, strucTimers.TPHDP, 5, angle, calculate, offset);
   }

   if (strucZSPhaseMho.ZSPHMQ) {
      angle = Number(distanceRio.LINEANGLE);
      reach = Number(strucZSPhaseMho.ZQ) * Number(strucMain.LINELEIMP) / 100;
      offset = 0;
      if (strucZSPhaseMho.DIRQ == "REVERSE") { angle += 180; }
      calculate = Number(strucMain.LINELEIMP) * Number(strucZSPhaseMho.ZQ) / 100;// расчет сопротивления Z зоны
      createZoneMho("PHASE", strucTimers.TIMERQ, strucTimers.TPHDQ, 6, angle, calculate, offset);
   }
}


function simplePhaseQuad() {
   //  alert("SIMPLEPHASEQUAD");
   let param = document.getElementsByClassName("ZSPHASEQUAD");
   for (let i = 0; i < param.length; i++) { strucZSPhaseQuad[param[i].name.toUpperCase()] = param[i].value; }
   // const strucZSPhaseQuad = {
   //    "ZSPHRTYPE": "",
   //    "ZFAULT": "",
   //    "ZSPHQ1": "",
   //    "Z1": "",
   //    "ZSPHQ2": "",
   //    "Z2": "",
   //    "ZSPHQ3": "",
   //    "Z3": "",
   //    "ZSPHOFFSETENQ3": "",
   //    "ZOFFSET3": "",
   //    "ZSPHQP": "",
   //    "DIRP": "",
   //    "ZP": "",
   //    "ZSPHQ4": "",
   //    "Z4": "",
   //    "ZSPHQQ": "",
   //    "DIRQ": "",
   //    "ZQ": ""
   // }
   let calcZ, calcAngle, calcR, offset;

   if (strucZSPhaseQuad.ZSPHQ1 != "false") {
      calcZ = Number(strucZSPhaseQuad.Z1) * Number(strucMain.LINELEIMP) / 100;
      calcAngle = Number(distanceRio.LINEANGLE);
      offset = 0;
      if (strucZSPhaseQuad.ZSPHRTYPE == "COMMON") { calcR = Number(strucZSPhaseQuad.ZFAULT); }
      else { calcR = Number(strucZSPhaseQuad.ZFAULT) * Number(strucZSPhaseQuad.Z1) / 100; }

      calculate = Number(strucMain.LINELEIMP) * Number(strucZSPhaseMho.Z1) / 100;// расчет сопротивления Z зоны
      createZoneQuad("PHASE", strucTimers.TIMER1, strucTimers.TPHD1, 1, calcZ, calcAngle, calcR, strucMain.DIR_CHAR_ANGLE, offset, 0, false);
   }
   if (strucZSPhaseQuad.ZSPHQ2 != "false") {
      calcZ = Number(strucZSPhaseQuad.Z2) * Number(strucMain.LINELEIMP) / 100;
      calcAngle = Number(distanceRio.LINEANGLE);
      offset = 0;
      if (strucZSPhaseQuad.ZSPHRTYPE == "COMMON") { calcR = Number(strucZSPhaseQuad.ZFAULT); }
      else { calcR = Number(strucZSPhaseQuad.ZFAULT) * Number(strucZSPhaseQuad.Z2) / 100; }

      calculate = Number(strucMain.LINELEIMP) * Number(strucZSPhaseMho.Z2) / 100;// расчет сопротивления Z зоны
      createZoneQuad("PHASE", strucTimers.TIMER2, strucTimers.TPHD2, 2, calcZ, calcAngle, calcR, strucMain.DIR_CHAR_ANGLE, offset, 0, false);
   }
   if (strucZSPhaseQuad.ZSPHQ3 != "false") {
      calcZ = Number(strucZSPhaseQuad.Z3) * Number(strucMain.LINELEIMP) / 100;
      calcAngle = Number(distanceRio.LINEANGLE);
      if (strucZSPhaseQuad.ZSPHOFFSETENQ3 == "false") { offset = 0; }
      else { offset = Number(strucZSPhaseQuad.ZOFFSET3) * Number(strucMain.LINELEIMP) / 100; }

      if (strucZSPhaseQuad.ZSPHRTYPE == "COMMON") { calcR = Number(strucZSPhaseQuad.ZFAULT); }
      else { calcR = Number(strucZSPhaseQuad.ZFAULT) * Number(strucZSPhaseQuad.Z3) / 100; }

      calculate = Number(strucMain.LINELEIMP) * Number(strucZSPhaseMho.Z3) / 100;// расчет сопротивления Z зоны
      createZoneQuad("PHASE", strucTimers.TIMER3, strucTimers.TPHD3, 3, calcZ, calcAngle, calcR, strucMain.DIR_CHAR_ANGLE, offset, 0, false);
   }
   if (strucZSPhaseQuad.ZSPHQ4 != "false") {
      calcZ = Number(strucZSPhaseQuad.Z4) * Number(strucMain.LINELEIMP) / 100;
      calcAngle = Number(distanceRio.LINEANGLE);
      offset = 0;
      if (strucZSPhaseQuad.ZSPHRTYPE == "COMMON") { calcR = Number(strucZSPhaseQuad.ZFAULT); }
      else { calcR = Number(strucZSPhaseQuad.ZFAULT) * Number(strucZSPhaseQuad.Z4) / 100; }

      calculate = Number(strucMain.LINELEIMP) * Number(strucZSPhaseMho.Z4) / 100;// расчет сопротивления Z зоны
      createZoneQuad("PHASE", strucTimers.TIMER3, strucTimers.TPHD3, 4, calcZ, calcAngle, calcR, strucMain.DIR_CHAR_ANGLE, offset, 0, true);
   }
   if (strucZSPhaseQuad.ZSPHQP != "false") {
      calcZ = Number(strucZSPhaseQuad.ZP) * Number(strucMain.LINELEIMP) / 100;
      calcAngle = Number(distanceRio.LINEANGLE);
      offset = 0;
      if (strucZSPhaseQuad.ZSPHRTYPE == "COMMON") { calcR = Number(strucZSPhaseQuad.ZFAULT); }
      else { calcR = Number(strucZSPhaseQuad.ZFAULT) * Number(strucZSPhaseQuad.ZP) / 100; }

      calculate = Number(strucMain.LINELEIMP) * Number(strucZSPhaseMho.ZP) / 100;// расчет сопротивления Z зоны
      //   createZoneQuad("PHASE", strucTimers.TIMERP, strucTimers.TPHDP, 5, calcZ, calcAngle, calcR, strucMain.DIR_CHAR_ANGLE, offset, 0, true);
      if (strucZSPhaseQuad.DIRP == "REVERSE") {
         createZoneQuad("PHASE", strucTimers.TIMERP, strucTimers.TPHDP, 5, calcZ, calcAngle, calcR, strucMain.DIR_CHAR_ANGLE, offset, 0, true);
      } else {
         createZoneQuad("PHASE", strucTimers.TIMERP, strucTimers.TPHDP, 5, calcZ, calcAngle, calcR, strucMain.DIR_CHAR_ANGLE, offset, 0, false);
      }
   }
   if (strucZSPhaseQuad.ZSPHQQ != "false") {
      calcZ = Number(strucZSPhaseQuad.ZQ) * Number(strucMain.LINELEIMP) / 100;
      calcAngle = Number(distanceRio.LINEANGLE);
      offset = 0;
      if (strucZSPhaseQuad.ZSPHRTYPE == "COMMON") { calcR = Number(strucZSPhaseQuad.ZFAULT); }
      else { calcR = Number(strucZSPhaseQuad.ZFAULT) * Number(strucZSPhaseQuad.ZQ) / 100; }

      calculate = Number(strucMain.LINELEIMP) * Number(strucZSPhaseMho.ZQ) / 100;// расчет сопротивления Z зоны
      //  createZoneQuad("PHASE", strucTimers.TIMERQ, strucTimers.TPHDQ, 4, calcZ, calcAngle, calcR, strucMain.DIR_CHAR_ANGLE, offset, 0, true);
      if (strucZSPhaseQuad.DIRQ == "REVERSE") {
         createZoneQuad("PHASE", strucTimers.TIMERQ, strucTimers.TPHDQ, 6, calcZ, calcAngle, calcR, strucMain.DIR_CHAR_ANGLE, offset, 0, true);
      } else {
         createZoneQuad("PHASE", strucTimers.TIMERQ, strucTimers.TPHDQ, 6, calcZ, calcAngle, calcR, strucMain.DIR_CHAR_ANGLE, offset, 0, false);
      }

   }
}

// Рисование зоны круговой характеристики
// fault "ground", "phase"
// timerType GROUND PHASE PHASEGROUND
// tripTime - время откл ступени
// index - номер зоны
//  ANGLE, REACH, OFFSET - для рисования зоны RIO
// !!!!!!!!!!! пока не учтен OFFSET !!!!!!!!!!!!!!!!11


function createLine(x, y, angle, rotate) {
   // angle = +(Math.round(angle + "e+3") + "e-3");
   return "LINE," + Number(x).toFixed(3) + "," + Number(y).toFixed(3) + "," + Number(angle).toFixed(3) + "," + rotate;
}

//createZoneQuad("PHASE", strucTimers.TIMER1, strucTimers.TPHD1, 1, calcZ, calcAngle, calcR, strucMain.DIR_CHAR_ANGLE, offsetZ, offsetR, tilt, false);
function createZoneQuad(fault, timerType, tripTime, index, Z, ANGLE, R, PHI_MCH, OFFSETZ, OFFSETR, TILT, REVERSE) {
   //let calculate = 0;
   let nZ = 0;
   let nZone = zoneRioArray.length;
   let calcR, calcX, calcAngle = 0;

   zoneRioArray.push([]);
   if (timerType.indexOf(fault) != "-1") {
      zoneRioArray[nZone].TYPE = "TRIPPING";
      zoneRioArray[nZone].ACTIVE = "YES";
   } else {
      zoneRioArray[nZone].TYPE = "NONTRIPPING";
      zoneRioArray[nZone].ACTIVE = "NO";
   }

   if (fault == "GROUND") { zoneRioArray[nZone].FAULTLOOP = "LN"; }
   if (fault == "PHASE") { zoneRioArray[nZone].FAULTLOOP = "LL"; }
   zoneRioArray[nZone].TRIPTIME = tripTime;
   zoneRioArray[nZone].INDEX = index;
   zoneRioArray[nZone].SHAPE = "SHAPE";
   zoneRioArray[nZone].push([]);
   //ok
   calcR = Number(Z) * Math.cos(degToRad(ANGLE)); calcX = Number(Z) * Math.sin(degToRad(ANGLE)); calcAngle = Number(TILT);
   zoneRioArray[nZone][nZ] = createLine(calcR, calcX, calcAngle, "RIGHT"); nZ++;

   //ok
   calcR = Number(R); calcX = 0; calcAngle = Number(ANGLE) - 180;
   zoneRioArray[nZone][nZ] = createLine(calcR, calcX, calcAngle, "RIGHT"); nZ++;

   let c;
   let b = R / 2;
   let alfa = Number(ANGLE);
   let a, betta, param1, param2 = 0;

   if (OFFSETZ == "0" && OFFSETR == "0") {
      a = Z / 4;
      c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(degToRad(alfa)));
      betta = radToDeg(Math.acos((a * a - (b * b + c * c)) / (-2 * b * c)));
      // сравниваем угол 90-PHI_мч направления ДЗ и угол образованный характеристикой
      param1 = betta;
      param2 = 90 - Number(PHI_MCH);

      if (param1 < param2) {
         // ok
         calcR = -Number(Z) * Math.cos(degToRad(ANGLE)) / 4; calcX = -Number(Z) * Math.sin(degToRad(ANGLE)) / 4; calcAngle = 180 + Number(TILT);
         zoneRioArray[nZone][nZ] = createLine(calcR, calcX, calcAngle, "RIGHT"); nZ++;
      }

   } else {
      a = OFFSETZ;
      c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(degToRad(alfa)));
      betta = radToDeg(Math.acos((a * a - (b * b + c * c)) / (-2 * b * c)));
      // сравниваем угол 90-PHI_мч направления ДЗ и угол образованный характеристикой
      param1 = betta;
      param2 = 90 - Number(PHI_MCH);

      // не работает проверка этого условия !!!!!!!!!!!!!!!!!!!!!!!!!! разобраться и исправить.......

      if (param1 < param2) {
         calcR = -Number(OFFSETZ) * Math.cos(degToRad(ANGLE)); calcX = -Number(OFFSETZ) * Math.sin(degToRad(ANGLE)); calcAngle = 180 + Number(TILT);
         zoneRioArray[nZone][nZ] = createLine(calcR, calcX, calcAngle, "RIGHT"); nZ++;
      }

   }

   zoneRioArray[nZone][nZ] = createLine(0, 0, Number(PHI_MCH) + 90, "RIGHT"); nZ++;

   if (OFFSETZ == "0" && OFFSETR == "0") {
      //  calcR = -Number(R) / 4; calcX = 0; calcAngle = Number(ANGLE);
      zoneRioArray[nZone][nZ] = createLine(-Number(R) / 4, 0, ANGLE, "RIGHT"); nZ++;

   } else {
      calcR = -OFFSETR / 2; calcX = 0; calcAngle = Number(ANGLE);
      zoneRioArray[nZone][nZ] = createLine(calcR, calcX, calcAngle, "RIGHT"); nZ++;
   }

   if (REVERSE) {
      for (let i = 0; i < zoneRioArray[nZone].length; i++) {
         zoneRioArray[nZone][i] = rotateLINE(zoneRioArray[nZone][i], 180);
      }
   }

   zoneRioArray[nZone][nZ] = "AUTOCLOSE,YES"; nZ++;
   zoneRioArray[nZone][nZ] = "INVERT,NO";
}

function simpleGroundMho() { // !!!!!!!!!! надо учесть kZn?????????????????????
   // alert("SIMPLEGROUNDMHO");
   let param = document.getElementsByClassName("ZSGROUNDMHO");
   for (let i = 0; i < param.length; i++) { strucZSGroundMho[param[i].name.toUpperCase()] = param[i].value; }
   // const strucZSGroundMho = {
   //    "ZSGNDM1": "",
   //    "Z1": "",
   //    "ZSGNDM2": "",
   //    "Z2": "",
   //    "ZSGNDM3": "",
   //    "Z3": "",
   //    "ZSGNDOFFSETENM3": "",
   //    "ZOFFSET3": "",
   //    "ZSGNDMP": "",
   //    "ZSGNDMDIRP": "",
   //    "ZP": "",
   //    "ZSGNDM4": "",
   //    "Z4": "",
   //    "ZSGNDMQ": "",
   //    "ZSGNDMDIRQ": "",
   //    "ZQ": "",
   // }

   // влияние kZN на характеристику
   let a = +1 + Math.cos(degToRad(Number(strucMain.KZRESANGLE))) * Number(strucMain.KZRESCOMP);
   let b = Math.sin(degToRad(Number(strucMain.KZRESANGLE))) * Number(strucMain.KZRESCOMP);
   let r = Math.sqrt(a * a + b * b);
   let alfa = Math.atan(b / a);
   let zCalc, zAlfa = 0;
   zAlfa = radToDeg(alfa) + Number(distanceRio.LINEANGLE);

   if (strucZSGroundMho.ZSGNDM1 != "false") {
      // angle = Number(distanceRio.LINEANGLE);
      // reach = Number(strucZSGroundMho.Z1) * Number(strucMain.LINELEIMP) / 100;
      zCalc = r * Number(strucZSGroundMho.Z1) * Number(strucMain.LINELEIMP) / 100;
      angle = zAlfa;
      reach = zCalc;
      offset = 0;
      //  calculate = Number(strucMain.LINELEIMP) * Number(strucZSGroundMho.Z1) / 100;// расчет сопротивления Z зоны

      createZoneMho("GROUND", strucTimers.TIMER1, strucTimers.TPHD1, 1, zAlfa, zCalc, offset);
   }


   if (strucZSGroundMho.ZSGNDM2 != "false") {
      // angle = Number(distanceRio.LINEANGLE);
      // reach = Number(strucZSGroundMho.Z2) * Number(strucMain.LINELEIMP) / 100;
      zCalc = r * Number(strucZSGroundMho.Z2) * Number(strucMain.LINELEIMP) / 100;
      angle = zAlfa;
      reach = zCalc;
      offset = 0;
      //   calculate = Number(strucMain.LINELEIMP) * Number(strucZSGroundMho.Z2) / 100;// расчет сопротивления Z зоны
      createZoneMho("GROUND", strucTimers.TIMER2, strucTimers.TPHD2, 2, angle, zCalc, offset);
   }

   if (strucZSGroundMho.ZSGNDM3 != "false") {
      // angle = Number(distanceRio.LINEANGLE);
      // reach = Number(strucZSGroundMho.Z3) * Number(strucMain.LINELEIMP) / 100;
      zCalc = r * Number(strucZSGroundMho.Z3) * Number(strucMain.LINELEIMP) / 100;
      angle = zAlfa;
      reach = zCalc;
      offset = 0;
      if (strucZSGroundMho.ZSGNDOFFSETENM3) { offset = Number(strucMain.LINELEIMP) * Number(strucZSGroundMho.ZOFFSET3) / 100; }
      // calculate = Number(strucMain.LINELEIMP) * Number(strucZSGroundMho.Z3) / 100;// расчет сопротивления Z зоны
      createZoneMho("GROUND", strucTimers.TIMER3, strucTimers.TPHD3, 3, angle, zCalc, offset);
   }

   if (strucZSGroundMho.ZSGNDM4 != "false") {
      // angle = Number(distanceRio.LINEANGLE) + 180;
      // reach = Number(strucZSGroundMho.Z4) * Number(strucMain.LINELEIMP) / 100;
      zCalc = r * Number(strucZSGroundMho.Z4) * Number(strucMain.LINELEIMP) / 100;
      angle = zAlfa + 180;
      reach = zCalc;
      offset = 0;
      //   calculate = Number(strucMain.LINELEIMP) * Number(strucZSGroundMho.Z4) / 100;// расчет сопротивления Z зоны
      createZoneMho("GROUND", strucTimers.TIMER4, strucTimers.TPHD4, 4, angle, zCalc, offset);
   }

   if (strucZSGroundMho.ZSGNDMP != "false") {
      // angle = Number(distanceRio.LINEANGLE);
      // reach = Number(strucZSGroundMho.ZP) * Number(strucMain.LINELEIMP) / 100;
      zCalc = r * Number(strucZSGroundMho.ZP) * Number(strucMain.LINELEIMP) / 100;
      angle = zAlfa;
      reach = zCalc;
      offset = 0;
      if (strucZSGroundMho.DIRP == "REVERSE") { angle += 180; }
      //   calculate = Number(strucMain.LINELEIMP) * Number(strucZSGroundMho.ZP) / 100;// расчет сопротивления Z зоны
      createZoneMho("GROUND", strucTimers.TIMERP, strucTimers.TPHDP, 5, angle, zCalc, offset);
   }

   if (strucZSGroundMho.ZSGNDMQ != "false") {
      // angle = Number(distanceRio.LINEANGLE);
      // reach = Number(strucZSGroundMho.ZQ) * Number(strucMain.LINELEIMP) / 100;
      zCalc = r * Number(strucZSGroundMho.ZP) * Number(strucMain.LINELEIMQ) / 100;
      angle = zAlfa;
      reach = zCalc;
      offset = 0;
      if (strucZSGroundMho.DIRQ == "REVERSE") { angle += 180; }
      calculate = Number(strucMain.LINELEIMP) * Number(strucZSGroundMho.ZQ) / 100;// расчет сопротивления Z зоны
      createZoneMho("GROUND", strucTimers.TIMERQ, strucTimers.TPHDQ, 6, angle, zCalc, offset);
   }

}

function simpleGroundQuad() {
   // alert("SIMPLEGROUNDQUAD");
   let param = document.getElementsByClassName("ZSGROUNDQUAD");
   for (let i = 0; i < param.length; i++) { strucZSGroundQuad[param[i].name.toUpperCase()] = param[i].value; }
   // const strucZSGroundQuad = {
   //    "ZSGNDRTYPE": "",
   //    "ZFAULT": "",
   //    "ZSGNDQ1": "",
   //    "Z1": "",
   //    "ZSGNDQ2": "",
   //    "Z2": "",
   //    "ZSGNDQ3": "",
   //    "Z3": "",
   //    "ZGNDHOFFSETENQ3": "",
   //    "ZOFFSET3": "",
   //    "ZSGNDQP": "",
   //    "DIRP": "",
   //    "ZP": "",
   //    "ZSGNDQ4": "",
   //    "Z4": "",
   //    "ZSGNDQQ": "",
   //    "DIRQ": "",
   //    "ZQ": ""
   // }
   let calcZ, calcAngle, calcR, offset;
   offset = 0;

   // влияние kZN на характеристику
   let a = +1 + Math.cos(degToRad(Number(strucMain.KZRESANGLE))) * Number(strucMain.KZRESCOMP);
   let b = Math.sin(degToRad(Number(strucMain.KZRESANGLE))) * Number(strucMain.KZRESCOMP);
   let r = Math.sqrt(a * a + b * b);
   let alfa = Math.atan(b / a);
   let zCalc, zAlfa = 0;
   //  zAlfa = radToDeg(alfa) + Number(distanceRio.LINEANGLE);

   if (strucZSGroundQuad.ZSGNDQ1 != "false") {
      calcZ = r * Number(strucZSGroundQuad.Z1) * Number(strucMain.LINELEIMP) / 100;
      calcAngle = radToDeg(alfa) + Number(distanceRio.LINEANGLE);

      if (strucZSGroundQuad.ZSGNDRTYPE == "COMMON") { calcR = Number(strucZSGroundQuad.ZFAULT); }
      else { calcR = Number(strucZSGroundQuad.ZFAULT) * Number(strucZSGroundQuad.Z1) / 100; }

      calculate = Number(strucMain.LINELEIMP) * Number(strucZSPhaseMho.Z1) / 100;// расчет сопротивления Z зоны
      createZoneQuad("GROUND", strucTimers.TIMER1, strucTimers.TPHD1, 1, calcZ, calcAngle, calcR, strucMain.DIR_CHAR_ANGLE, offset, 0, 0, false);
   }
   if (strucZSGroundQuad.ZSGNDQ2 != "false") {
      calcZ = r * Number(strucZSGroundQuad.Z2) * Number(strucMain.LINELEIMP) / 100;
      calcAngle = radToDeg(alfa) + Number(distanceRio.LINEANGLE);

      if (strucZSGroundQuad.ZSGNDRTYPE == "COMMON") { calcR = Number(strucZSGroundQuad.ZFAULT); }
      else { calcR = Number(strucZSGroundQuad.ZFAULT) * Number(strucZSGroundQuad.Z2) / 100; }

      calculate = Number(strucMain.LINELEIMP) * Number(strucZSPhaseMho.Z2) / 100;// расчет сопротивления Z зоны
      createZoneQuad("GROUND", strucTimers.TIMER2, strucTimers.TPHD2, 2, calcZ, calcAngle, calcR, strucMain.DIR_CHAR_ANGLE, offset, 0, 0, false);
   }
   if (strucZSGroundQuad.ZSGNDQ3 != "false") {
      calcZ = r * Number(strucZSGroundQuad.Z3) * Number(strucMain.LINELEIMP) / 100;
      calcAngle = radToDeg(alfa) + Number(distanceRio.LINEANGLE);

      if (strucZSGroundQuad.ZSGNDRTYPE == "COMMON") { calcR = Number(strucZSGroundQuad.ZFAULT); }
      else { calcR = Number(strucZSGroundQuad.ZFAULT) * Number(strucZSGroundQuad.Z3) / 100; }

      calculate = Number(strucMain.LINELEIMP) * Number(strucZSPhaseMho.Z3) / 100;// расчет сопротивления Z зоны

      if (strucZSGroundQuad.ZGNDHOFFSETENQ3 == "false") { offset = 0; }
      else { offset = Number(strucZSGroundQuad.ZOFFSET3) * Number(strucMain.LINELEIMP) / 100; }

      createZoneQuad("GROUND", strucTimers.TIMER3, strucTimers.TPHD3, 3, calcZ, calcAngle, calcR, strucMain.DIR_CHAR_ANGLE, offset, 0, 0, false);
   }

   offset = 0;
   if (strucZSGroundQuad.ZSGNDQ4 != "false") {
      calcZ = r * Number(strucZSGroundQuad.Z4) * Number(strucMain.LINELEIMP) / 100;
      calcAngle = radToDeg(alfa) + Number(distanceRio.LINEANGLE);

      if (strucZSGroundQuad.ZSGNDRTYPE == "COMMON") { calcR = Number(strucZSGroundQuad.ZFAULT); }
      else { calcR = Number(strucZSGroundQuad.ZFAULT) * Number(strucZSGroundQuad.Z4) / 100; }

      calculate = Number(strucMain.LINELEIMP) * Number(strucZSPhaseMho.Z4) / 100;// расчет сопротивления Z зоны
      createZoneQuad("GROUND", strucTimers.TIMER3, strucTimers.TPHD3, 4, calcZ, calcAngle, calcR, strucMain.DIR_CHAR_ANGLE, offset, 0, 0, true);
   }
   if (strucZSGroundQuad.ZSGNDQP != "false") {
      calcZ = r * Number(strucZSPhaseQuad.ZP) * Number(strucMain.LINELEIMP) / 100;
      calcAngle = radToDeg(alfa) + Number(distanceRio.LINEANGLE);

      if (strucZSGroundQuad.ZSGNDRTYPE == "COMMON") { calcR = Number(strucZSGroundQuad.ZFAULT); }
      else { calcR = Number(strucZSGroundQuad.ZFAULT) * Number(strucZSGroundQuad.ZP) / 100; }

      calculate = Number(strucMain.LINELEIMP) * Number(strucZSPhaseMho.ZP) / 100;// расчет сопротивления Z зоны
      //   createZoneQuad("PHASE", strucTimers.TIMERP, strucTimers.TPHDP, 5, calcZ, calcAngle, calcR, strucMain.DIR_CHAR_ANGLE, offset, 0, true);
      if (strucZSGroundQuad.DIRP == "REVERSE") {
         createZoneQuad("GROUND", strucTimers.TIMERP, strucTimers.TPHDP, 5, calcZ, calcAngle, calcR, strucMain.DIR_CHAR_ANGLE, offset, 0, 0, true);
      } else {
         createZoneQuad("GROUND", strucTimers.TIMERP, strucTimers.TPHDP, 5, calcZ, calcAngle, calcR, strucMain.DIR_CHAR_ANGLE, offset, 0, 0, false);
      }
   }
   if (strucZSGroundQuad.ZSGNDQQ != "false") {
      calcZ = r * Number(strucZSGroundQuad.ZQ) * Number(strucMain.LINELEIMP) / 100;
      calcAngle = radToDeg(alfa) + Number(distanceRio.LINEANGLE);

      if (strucZSGroundQuad.ZSGNDRTYPE == "COMMON") { calcR = Number(strucZSGroundQuad.ZFAULT); }
      else { calcR = Number(strucZSGroundQuad.ZFAULT) * Number(strucZSGroundQuad.ZQ) / 100; }

      calculate = Number(strucMain.LINELEIMP) * Number(strucZSPhaseMho.ZQ) / 100;// расчет сопротивления Z зоны
      //  createZoneQuad("PHASE", strucTimers.TIMERQ, strucTimers.TPHDQ, 4, calcZ, calcAngle, calcR, strucMain.DIR_CHAR_ANGLE, offset, 0, true);
      if (strucZSGroundQuad.DIRQ == "REVERSE") {
         createZoneQuad("GROUND", strucTimers.TIMERQ, strucTimers.TPHDQ, 6, calcZ, calcAngle, calcR, strucMain.DIR_CHAR_ANGLE, offset, 0, 0, true);
      } else {
         createZoneQuad("GROUND", strucTimers.TIMERQ, strucTimers.TPHDQ, 6, calcZ, calcAngle, calcR, strucMain.DIR_CHAR_ANGLE, offset, 0, 0, false);
      }

   }

}


// !!!!!!!!!!!!!!!!! не учитывает смещение зоны 3 в 3 квадрант!!!!!!!!!!!!!!!!!!!!!!
function advancedPhaseMho() {
   //   alert("ADVANCEDPHASEMHO");
   let param = document.getElementsByClassName("ZAPHASEMHO");
   for (let i = 0; i < param.length; i++) { strucZAPhaseMho[param[i].name.toUpperCase()] = param[i].value; }


   if (strucMain.ZPH1 != "false") {
      angle = Number(strucZAPhaseMho.ZPHANGLE1);
      reach = Number(strucZAPhaseMho.ZPHR1);
      offset = 0;
      // calculate = Number(strucMain.LINELEIMP) * Number(strucZAPhaseMho.Z1) / 100;// расчет сопротивления Z зоны
      createZoneMho("PHASE", strucTimers.TIMER1, strucTimers.TPHD1, 1, angle, reach, offset);
   }
   if (strucMain.ZPH2 != "false") {
      angle = Number(strucZAPhaseMho.ZPHANGLE2);
      reach = Number(strucZAPhaseMho.ZPHR2);
      offset = 0;
      // calculate = Number(strucMain.LINELEIMP) * Number(strucZAPhaseMho.Z2) / 100;// расчет сопротивления Z зоны
      createZoneMho("PHASE", strucTimers.TIMER2, strucTimers.TPHD2, 2, angle, reach, offset);
   }

   if (strucMain.ZPH3 != "false") {
      angle = Number(strucZAPhaseMho.ZPHANGLE3);
      reach = Number(strucZAPhaseMho.ZPHR3);
      offset = 0;

      if (strucMain.OFFSETPH3 == "true") {
         offset = Number(strucZAPhaseMho.RPHOFFSET3);
      }
      //  if (strucZAPhaseMho.ZSPHOFFSETENM3) { offset = Number(strucMain.LINELEIMP) * Number(strucZAPhaseMho.ZOFFSET3) / 100; }
      // calculate = Number(strucMain.LINELEIMP) * Number(strucZAPhaseMho.Z3) / 100;// расчет сопротивления Z зоны
      createZoneMho("PHASE", strucTimers.TIMER3, strucTimers.TPHD3, 3, angle, reach, offset);
   }

   if (strucMain.ZPH4 != "false") {
      angle = Number(strucZAPhaseMho.ZPHANGLE4) + 180;
      reach = Number(strucZAPhaseMho.ZPHR4);
      offset = 0;
      // calculate = Number(strucMain.LINELEIMP) * Number(strucZAPhaseMho.Z4) / 100;// расчет сопротивления Z зоны
      createZoneMho("PHASE", strucTimers.TIMER4, strucTimers.TPHD4, 4, angle, reach, offset);
   }

   if (strucMain.ZPHP != "false") {
      angle = Number(strucZAPhaseMho.ZPHANGLEP);
      reach = Number(strucZAPhaseMho.ZPHRP);
      offset = 0;
      if (strucMain.ZPHDIRP == "REVERSE") { angle += 180; }
      // calculate = Number(strucMain.LINELEIMP) * Number(strucZAPhaseMho.ZP) / 100;// расчет сопротивления Z зоны
      createZoneMho("PHASE", strucTimers.TIMERP, strucTimers.TPHDP, 5, angle, reach, offset);
   }

   if (strucMain.ZPHQ != "false") {
      angle = Number(strucZAPhaseMho.ZPHANGLEQ);
      reach = Number(strucZAPhaseMho.ZPHRQ);
      offset = 0;
      if (strucMain.ZPHDIRQ == "REVERSE") { angle += 180; }
      // calculate = Number(strucMain.LINELEIMP) * Number(strucZAPhaseMho.ZQ) / 100;// расчет сопротивления Z зоны
      createZoneMho("PHASE", strucTimers.TIMERQ, strucTimers.TPHDQ, 6, angle, reach, offset);
   }
}

function advancedPhaseQuad() {
   let param = document.getElementsByClassName("ZAPHASEQUAD");
   for (let i = 0; i < param.length; i++) { strucZAPhaseQuad[param[i].name.toUpperCase()] = param[i].value; }
   //  alert("ADVANCEDPHASEQUAD");
   // const strucZAPhaseQuad = {
   //    "ZPHR1": "",
   //    "ZPHANGLE1": "",
   //    "RPHRES1": "",
   //    "ZPHTILT1": "",
   //    "ZPHR2": "",
   //    "ZPHANGLE2": "",
   //    "RPHRES2": "",
   //    "ZPHTILT2": "",
   //    "ZPHR3": "",
   //    "ZPHANGLE3": "",
   //    "RPHOFFSET3": "",
   //    "RPHRESFW3": "",
   //    "RPHRESRV3": "",
   //    "ZPHTILT3": "",
   //    "ZPHRP": "",
   //    "ZPHANGLEP": "",
   //    "RPHRESP": "",
   //    "ZPHTILTP": "",
   //    "ZPHR4": "",
   //    "ZPHANGLE4": "",
   //    "RPHRES4": "",
   //    "ZPHTILT4": "",
   //    "ZPHRQ": "",
   //    "ZPHANGLEQ": "",
   //    "RPHRESQ": "",
   //    "ZPHTILTQ": ""
   // }
   let calcZ, calcAngle, calcR, offsetZ, offsetR, tilt;

   if (strucMain.ZPH1 != "false") {
      calcZ = Number(strucZAPhaseQuad.ZPHR1);
      calcAngle = Number(strucZAPhaseQuad.ZPHANGLE1);
      offsetZ = 0;
      offsetR = 0;
      calcR = Number(strucZAPhaseQuad.RPHRES1);
      tilt = Number(strucZAPhaseQuad.ZPHTILT1);

      createZoneQuad("PHASE", strucTimers.TIMER1, strucTimers.TPHD1, 1, calcZ, calcAngle, calcR / 2, strucMain.DIR_CHAR_ANGLE, offsetZ, offsetR, tilt, false);
   }

   if (strucMain.ZPH2 != "false") {
      calcZ = Number(strucZAPhaseQuad.ZPHR2);
      calcAngle = Number(strucZAPhaseQuad.ZPHANGLE2);
      offsetZ = 0;
      offsetR = 0;
      calcR = Number(strucZAPhaseQuad.RPHRES2);
      tilt = Number(strucZAPhaseQuad.ZPHTILT2);
      createZoneQuad("PHASE", strucTimers.TIMER2, strucTimers.TPHD2, 2, calcZ, calcAngle, calcR / 2, strucMain.DIR_CHAR_ANGLE, offsetZ, offsetR, tilt, false);
   }
   if (strucMain.ZPH3 != "false") {
      calcZ = Number(strucZAPhaseQuad.ZPHR3);
      calcAngle = Number(strucZAPhaseQuad.ZPHANGLE3);

      if (strucMain.OFFSETPH3 == "false") {
         offsetZ = 0; offsetR = 0;
      }
      else {
         offsetZ = strucZAPhaseQuad.RPHOFFSET3; offsetR = strucZAPhaseQuad.RPHRESRV3;
      }
      calcR = Number(strucZAPhaseQuad.RPHRESFW3);
      tilt = Number(strucZAPhaseQuad.ZPHTILT3);

      createZoneQuad("PHASE", strucTimers.TIMER3, strucTimers.TPHD3, 3, calcZ, calcAngle, calcR / 2, strucMain.DIR_CHAR_ANGLE, offsetZ, offsetR, tilt, false);
   }
   if (strucMain.ZPH4 != "false") {
      calcZ = Number(strucZAPhaseQuad.ZPHR4);
      calcAngle = Number(strucZAPhaseQuad.ZPHANGLE4);
      offsetZ = 0;
      offsetR = 0;
      calcR = Number(strucZAPhaseQuad.RPHRES4);
      tilt = Number(strucZAPhaseQuad.ZPHTILT4);

      createZoneQuad("PHASE", strucTimers.TIMER4, strucTimers.TPHD4, 4, calcZ, calcAngle, calcR / 2, strucMain.DIR_CHAR_ANGLE, offsetZ, offsetR, tilt, true);
   }
   if (strucMain.ZPHP != "false") {
      calcZ = Number(strucZAPhaseQuad.ZPHRP);
      calcAngle = Number(strucZAPhaseQuad.ZPHANGLEP);
      offsetZ = 0;
      offsetR = 0;
      calcR = Number(strucZAPhaseQuad.RPHRESP);
      tilt = Number(strucZAPhaseQuad.ZPHTILTP);

      if (strucMain.ZPHDIRP == "REVERSE") {
         createZoneQuad("PHASE", strucTimers.TIMERP, strucTimers.TPHDP, 5, calcZ, calcAngle, calcR / 2, strucMain.DIR_CHAR_ANGLE, offsetZ, offsetR, tilt, true);
      } else {
         createZoneQuad("PHASE", strucTimers.TIMERP, strucTimers.TPHDP, 5, calcZ, calcAngle, calcR / 2, strucMain.DIR_CHAR_ANGLE, offsetZ, offsetR, tilt, false);
      }
   }
   if (strucMain.ZPHQ != "false") {
      calcZ = Number(strucZAPhaseQuad.ZPHRQ);
      calcAngle = Number(strucZAPhaseQuad.ZPHANGLEQ);
      offsetZ = 0;
      offsetR = 0;
      calcR = Number(strucZAPhaseQuad.RPHRESQ);
      tilt = Number(strucZAPhaseQuad.ZPHTILTQ);

      if (strucMain.ZPHDIRQ == "REVERSE") {
         createZoneQuad("PHASE", strucTimers.TIMERQ, strucTimers.TPHDQ, 6, calcZ, calcAngle, calcR / 2, strucMain.DIR_CHAR_ANGLE, offsetZ, offsetR, tilt, true);
      } else {
         createZoneQuad("PHASE", strucTimers.TIMERQ, strucTimers.TPHDQ, 6, calcZ, calcAngle, calcR / 2, strucMain.DIR_CHAR_ANGLE, offsetZ, offsetR, tilt, false);
      }

   }
}

function advancedGroundMho() {
   //  alert("ADVANCEDGROUNDMHO");
   let param = document.getElementsByClassName("ZAGROUNDMHO");
   for (let i = 0; i < param.length; i++) { strucZAGroundMho[param[i].name.toUpperCase()] = param[i].value; }
   // const strucZAGroundMho = {
   //    "ZGNDR1": "",
   //    "ZGNDANGLE1": "",
   //    "ZGNDKZCOMP1": "",
   //    "ZGNDKZANGLE1": "",
   //    "ZGNDR2": "",
   //    "ZGNDANGLE2": "",
   //    "ZGNDKZCOMP2": "",
   //    "ZGNDKZANGLE2": "",
   //    "ZGNDR3": "",
   //    "ZGNDANGLE3": "",
   //    "RGNDOFFSET3": "",
   //    "ZGNDKZCOMP3": "",
   //    "ZGNDKZANGLE3": "",
   //    "ZGNDRP": "",
   //    "ZGNDANGLEP": "",
   //    "ZGNDKZCOMPP": "",
   //    "ZGNDKZANGLEP": "",
   //    "ZGNDR4": "",
   //    "ZGNDANGLE4": "",
   //    "ZGNDKZCOMP4": "",
   //    "ZGNDKZANGLE4": "",
   //    "ZGNDRQ": "",
   //    "ZGNDANGLEQ": "",
   //    "ZGNDKZCOMPQ": "",
   //    "ZGNDKZANGLEQ": ""
   // }
   // const strucMain = {
   //    "LINELEIMP": "",
   //    "KZRESCOMP": "",
   //    "KZRESANGLE": "",
   //    "MODE": "",
   //    "LOAD_EN": "",
   //    "Z_LOAD": "",
   //    "ANG_LOAD": "",
   //    "DIR_DZ_EN": "",
   //    "DIR_CHAR_ANGLE": "",
   //    "SIMPLEPHASE": "",
   //    "SIMPLEGROUND": "",
   //    "ADVANCEDPHASE": "",
   //    "ZPH1": "",
   //    "ZPH2": "",
   //    "ZPH3": "",
   //    "OFFSETPH3": "",
   //    "ZPHP": "",
   //    "ZPHDIRP": "",
   //    "ZPH4": "",
   //    "ZPHQ": "",
   //    "ZPHDIRQ": "",
   //    "ADVANCEDGROUND": "",
   //    "ZGNDTILT": "",
   //    "ZGND1": "",
   //    "ZGND2": "",
   //    "ZGND3": "",
   //    "OFFSETGND3": "",
   //    "ZGNDP": "",
   //    "ZGNDDIRP": "",
   //    "ZGND4": "",
   //    "ZGNDQ": "",
   //    "ZGNDDIRQ": ""
   // };

   // влияние kZN на характеристику
   let a, b, r, alfa = 0;
   if (strucMain.ZGND1 != "false") {
      a = +1 + Math.cos(degToRad(Number(strucZAGroundMho.ZGNDKZANGLE1))) * Number(strucZAGroundMho.ZGNDKZCOMP1);
      b = Math.sin(degToRad(Number(strucZAGroundMho.ZGNDKZANGLE1))) * Number(strucZAGroundMho.ZGNDKZCOMP1);
      r = Math.sqrt(a * a + b * b);
      alfa = Math.atan(b / a);

      angle = Number(strucZAGroundMho.ZGNDANGLE1) + radToDeg(alfa);
      reach = Number(strucZAGroundMho.ZGNDR1) * r;
      offset = 0;
      createZoneMho("GROUND", strucTimers.TIMER1, strucTimers.TGNDD1, 1, angle, reach, offset);
   }
   if (strucMain.ZGND2 != "false") {
      a = +1 + Math.cos(degToRad(Number(strucZAGroundMho.ZGNDKZANGLE2))) * Number(strucZAGroundMho.ZGNDKZCOMP2);
      b = Math.sin(degToRad(Number(strucZAGroundMho.ZGNDKZANGLE2))) * Number(strucZAGroundMho.ZGNDKZCOMP2);
      r = Math.sqrt(a * a + b * b);
      alfa = Math.atan(b / a);

      angle = Number(strucZAGroundMho.ZGNDANGLE2) + radToDeg(alfa);
      reach = Number(strucZAGroundMho.ZGNDR2) * r;
      offset = 0;
      createZoneMho("GROUND", strucTimers.TIMER2, strucTimers.TGNDD2, 2, angle, reach, offset);
   }

   if (strucMain.ZGND3 != "false") {
      a = +1 + Math.cos(degToRad(Number(strucZAGroundMho.ZGNDKZANGLE3))) * Number(strucZAGroundMho.ZGNDKZCOMP3);
      b = Math.sin(degToRad(Number(strucZAGroundMho.ZGNDKZANGLE3))) * Number(strucZAGroundMho.ZGNDKZCOMP3);
      r = Math.sqrt(a * a + b * b);
      alfa = Math.atan(b / a);

      angle = Number(strucZAGroundMho.ZGNDANGLE3) + radToDeg(alfa);
      reach = Number(strucZAGroundMho.ZGNDR3) * r;
      offset = 0;

      if (strucMain.OFFSETGND3 == "true") { offset = Number(strucZAGroundMho.RGNDOFFSET3); }

      createZoneMho("GROUND", strucTimers.TIMER3, strucTimers.TGNDD3, 3, angle, reach, offset);
   }

   if (strucMain.ZGND4 != "false") {
      a = +1 + Math.cos(degToRad(Number(strucZAGroundMho.ZGNDKZANGLE4))) * Number(strucZAGroundMho.ZGNDKZCOMP4);
      b = Math.sin(degToRad(Number(strucZAGroundMho.ZGNDKZANGLE4))) * Number(strucZAGroundMho.ZGNDKZCOMP4);
      r = Math.sqrt(a * a + b * b);
      alfa = Math.atan(b / a);

      angle = Number(strucZAGroundMho.ZGNDANGLE4) + 180 + radToDeg(alfa);
      reach = Number(strucZAGroundMho.ZGNDR4) * r;
      offset = 0;
      createZoneMho("GROUND", strucTimers.TIMER4, strucTimers.TGNDD4, 4, angle, reach, offset);
   }

   if (strucMain.ZGNDP != "false") {
      a = +1 + Math.cos(degToRad(Number(strucZAGroundMho.ZGNDKZANGLEP))) * Number(strucZAGroundMho.ZGNDKZCOMPP);
      b = Math.sin(degToRad(Number(strucZAGroundMho.ZGNDKZANGLEP))) * Number(strucZAGroundMho.ZGNDKZCOMPP);
      r = Math.sqrt(a * a + b * b);
      alfa = Math.atan(b / a);

      angle = Number(strucZAGroundMho.ZGNDANGLEP) + radToDeg(alfa);
      reach = Number(strucZAGroundMho.ZGNDRP) * r;
      offset = 0;
      if (strucMain.ZGNDDIRP == "REVERSE") { angle += 180; }
      createZoneMho("GROUND", strucTimers.TIMERP, strucTimers.TGNDDP, 5, angle, reach, offset);
   }

   if (strucMain.ZGNDQ != "false") {
      a = +1 + Math.cos(degToRad(Number(strucZAGroundMho.ZGNDKZANGLEQ))) * Number(strucZAGroundMho.ZGNDKZCOMPQ);
      b = Math.sin(degToRad(Number(strucZAGroundMho.ZGNDKZANGLEQ))) * Number(strucZAGroundMho.ZGNDKZCOMPQ);
      r = Math.sqrt(a * a + b * b);
      alfa = Math.atan(b / a);

      angle = Number(strucZAGroundMho.ZGNDANGLEQ) + radToDeg(alfa);
      reach = Number(strucZAGroundMho.ZGNDRQ) * r;
      offset = 0;
      if (strucMain.ZGNDDIRQ == "REVERSE") { angle += 180; }
      createZoneMho("GROUNT", strucTimers.TIMERQ, strucTimers.TGNDDQ, 6, angle, reach, offset);
   }

}


function advancedGroundQuad() {
   // alert("ADVANCEDGROUNDQUAD");
   let param = document.getElementsByClassName("ZAGROUNDQUAD");
   for (let i = 0; i < param.length; i++) { strucZAGroundQuad[param[i].name.toUpperCase()] = param[i].value; }
   // const strucZAGroundQuad = {
   //    "ZGNDR1": "",
   //    "ZGNDANGLE1": "",
   //    "ZGNDTILT1": "",
   //    "KZN1": "",
   //    "KZNANG1": "",
   //    "RGNDRES1": "",
   //    "ZGNDR2": "",
   //    "ZGNDANGLE2": "",
   //    "ZGNDTILT2": "",
   //    "KZN2": "",
   //    "KZNANG2": "",
   //    "RGNDRES2": "",
   //    "ZGNDR3": "",
   //    "ZGNDANGLE3": "",
   //    "ZGNDTILT3": "",
   //    "ZGNDOFFSET3": "",
   //    "KZN3": "",
   //    "KZNANG3": "",
   //    "RGNDRESFWD3": "",
   //    "RGNDRESREV3": "",
   //    "ZGNDRP": "",
   //    "ZGNDANGLEP": "",
   //    "ZGNDTILTP": "",
   //    "KZNP": "",
   //    "KZNANGP": "",
   //    "RGNDRESP": "",
   //    "ZGNDR4": "",
   //    "ZGNDANGLE4": "",
   //    "ZGNDTILT4": "",
   //    "KZN4": "",
   //    "KZNANG4": "",
   //    "RGNDRES4": "",
   //    "ZGNDRQ": "",
   //    "ZGNDANGLEQ": "",
   //    "ZGNDTILTQ": "",
   //    "KZNQ": "",
   //    "KZNANGQ": "",
   //    'RGNDRESQ': ""
   // }

   let calcZ, calcAngle, calcR, offsetZ, offsetR, tilt;
   let a, b, r, alfa = 0;
   if (strucMain.ZGND1 != "false") {
      calcZ = Number(strucZAGroundQuad.ZGNDR1);
      calcAngle = Number(strucZAGroundQuad.ZGNDANGLE1);
      offsetZ = 0;
      offsetR = 0;
      calcR = Number(strucZAGroundQuad.RGNDRES1);
      tilt = Number(strucZAGroundQuad.ZGNDTILT1);

      a = +1 + Math.cos(degToRad(Number(strucZAGroundQuad.KZNANG1))) * Number(strucZAGroundQuad.KZN1);
      b = Math.sin(degToRad(Number(strucZAGroundQuad.KZNANG1))) * Number(strucZAGroundQuad.KZN1);
      r = Math.sqrt(a * a + b * b);
      alfa = radToDeg(Math.atan(b / a));
      calcAngle += alfa;
      calcZ *= r;
      // calcR *= r;
      //calcR *= 2;


      createZoneQuad("GROUND", strucTimers.TIMER1, strucTimers.TGNDD1, 1, calcZ, calcAngle, calcR, strucMain.DIR_CHAR_ANGLE, offsetZ, offsetR, tilt, false);
   }
   if (strucMain.ZGND2 != "false") {
      calcZ = Number(strucZAGroundQuad.ZGNDR2);
      calcAngle = Number(strucZAGroundQuad.ZGNDANGLE2);
      offsetZ = 0;
      offsetR = 0;
      calcR = Number(strucZAGroundQuad.RGNDRES2);
      tilt = Number(strucZAGroundQuad.ZGNDTILT2);

      a = +1 + Math.cos(degToRad(Number(strucZAGroundQuad.KZNANG1))) * Number(strucZAGroundQuad.KZN1);
      b = Math.sin(degToRad(Number(strucZAGroundQuad.KZNANG1))) * Number(strucZAGroundQuad.KZN1);
      r = Math.sqrt(a * a + b * b);
      alfa = radToDeg(Math.atan(b / a));
      calcAngle += alfa;
      calcZ *= r;
      // calcR *= r;
      // calcR *= 2;

      createZoneQuad("GROUND", strucTimers.TIMER2, strucTimers.TGNDD2, 2, calcZ, calcAngle, calcR, strucMain.DIR_CHAR_ANGLE, offsetZ, offsetR, tilt, false);
   }
   if (strucMain.ZGND3 != "false") {
      calcZ = Number(strucZAGroundQuad.ZGNDR3);
      calcAngle = Number(strucZAGroundQuad.ZGNDANGLE3);
      offsetZ = strucZAGroundQuad.ZGNDOFFSET3;
      offsetR = strucZAGroundQuad.RGNDRESREV3;
      calcR = Number(strucZAGroundQuad.RGNDRESFWD3);
      tilt = Number(strucZAGroundQuad.ZGNDTILT3);

      a = +1 + Math.cos(degToRad(Number(strucZAGroundQuad.KZNANG1))) * Number(strucZAGroundQuad.KZN1);
      b = Math.sin(degToRad(Number(strucZAGroundQuad.KZNANG1))) * Number(strucZAGroundQuad.KZN1);
      r = Math.sqrt(a * a + b * b);
      alfa = radToDeg(Math.atan(b / a));
      calcAngle += alfa;
      calcZ *= r;
      // calcR *= r;
      // calcR *= 2;

      createZoneQuad("GROUND", strucTimers.TIMER3, strucTimers.TGNDD3, 3, calcZ, calcAngle, calcR, strucMain.DIR_CHAR_ANGLE, offsetZ, offsetR, tilt, false);
   }
   if (strucMain.ZGND4 != "false") {
      calcZ = Number(strucZAGroundQuad.ZGNDR4);
      calcAngle = Number(strucZAGroundQuad.ZGNDANGLE4);
      offsetZ = 0;
      offsetR = 0;
      calcR = Number(strucZAGroundQuad.RGNDRES4);
      tilt = Number(strucZAGroundQuad.ZGNDTILT4);

      a = +1 + Math.cos(degToRad(Number(strucZAGroundQuad.KZNANG1))) * Number(strucZAGroundQuad.KZN1);
      b = Math.sin(degToRad(Number(strucZAGroundQuad.KZNANG1))) * Number(strucZAGroundQuad.KZN1);
      r = Math.sqrt(a * a + b * b);
      alfa = radToDeg(Math.atan(b / a));
      calcAngle += alfa;
      calcZ *= r;
      // calcR *= r;
      //calcR *= 2;

      createZoneQuad("GROUND", strucTimers.TIMER4, strucTimers.TGNDD4, 4, calcZ, calcAngle, calcR, strucMain.DIR_CHAR_ANGLE, offsetZ, offsetR, tilt, true);
   }
   if (strucMain.ZGNDP != "false") {
      calcZ = Number(strucZAGroundQuad.ZGNDRP);
      calcAngle = Number(strucZAGroundQuad.ZGNDANGLEP);
      offsetZ = 0;
      offsetR = 0;
      calcR = Number(strucZAGroundQuad.RGNDRESP);
      tilt = Number(strucZAGroundQuad.ZGNDTILTP);

      a = +1 + Math.cos(degToRad(Number(strucZAGroundQuad.KZNANG1))) * Number(strucZAGroundQuad.KZN1);
      b = Math.sin(degToRad(Number(strucZAGroundQuad.KZNANG1))) * Number(strucZAGroundQuad.KZN1);
      r = Math.sqrt(a * a + b * b);
      alfa = radToDeg(Math.atan(b / a));
      calcAngle += alfa;
      calcZ *= r;
      // calcR *= r;
      // calcR *= 2;

      if (strucMain.ZGNDDIRP == "REVERSE") {
         createZoneQuad("GROUND", strucTimers.TIMERP, strucTimers.TGNDDP, 5, calcZ, calcAngle, calcR, strucMain.DIR_CHAR_ANGLE, offsetZ, offsetR, tilt, true);
      } else {
         createZoneQuad("GROUND", strucTimers.TIMERP, strucTimers.TGNDDP, 5, calcZ, calcAngle, calcR, strucMain.DIR_CHAR_ANGLE, offsetZ, offsetR, tilt, false);
      }
   }

   if (strucMain.ZGNDQ != "false") {
      calcZ = Number(strucZAGroundQuad.ZGNDRQ);
      calcAngle = Number(strucZAGroundQuad.ZGNDANGLEQ);
      offsetZ = 0;
      offsetR = 0;
      calcR = Number(strucZAGroundQuad.RGNDRESQ);
      tilt = Number(strucZAGroundQuad.ZGNDTILTQ);

      a = +1 + Math.cos(degToRad(Number(strucZAGroundQuad.KZNANG1))) * Number(strucZAGroundQuad.KZN1);
      b = Math.sin(degToRad(Number(strucZAGroundQuad.KZNANG1))) * Number(strucZAGroundQuad.KZN1);
      r = Math.sqrt(a * a + b * b);
      alfa = radToDeg(Math.atan(b / a));
      calcAngle += alfa;
      calcZ *= r;
      // calcR *= r;
      // calcR *= 2;

      if (strucMain.ZGNDDIRQ == "REVERSE") {
         createZoneQuad("GROUND", strucTimers.TIMERQ, strucTimers.TGNDDQ, 6, calcZ, calcAngle, calcR, strucMain.DIR_CHAR_ANGLE, offsetZ, offsetR, tilt, true);
      } else {
         createZoneQuad("GROUND", strucTimers.TIMERQ, strucTimers.TGNDDQ, 6, calcZ, calcAngle, calcR, strucMain.DIR_CHAR_ANGLE, offsetZ, offsetR, tilt, false);
      }
   }

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
      zoneRioArray[nZone].FAULTLOOP = "ALL";
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
      zoneRioArray[nZone].FAULTLOOP = "ALL";
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
// function createLine(x, y, angle, rotate) {
//    angle = +(Math.round(angle + "e+3") + "e-3");
//    return "LINE," + x + "," + y + "," + angle + "," + rotate;
// }

function formValidation() {
   createZoneRioArray();
   createRioFile();
   document.getElementById("outRioData").value = textRio;
   // alert("данные подготовлены");
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
      for (key in zoneRio) zoneRio[key] = "";  // очистим массив перед заполнением
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