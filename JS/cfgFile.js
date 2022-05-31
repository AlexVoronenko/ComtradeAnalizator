let matrixCfg;
let currentCfg = {};
let fileNameCurrent;
let criticalCfg, warningCfg;

const anChannel = {
   An: "0",
   ch_id: "",
   ph: "",
   ccbm: "",
   uu: "",
   a: "",
   b: "",
   skew: "",
   min: "",
   max: "",
   primary: "",
   secondary: "",
   PS: ""
}
const nSamp = {
   samp: 0.0,
   endsam: 0
}

const digChannel = {
   Dn: "",
   ch_id: "",
   ph: "",
   ccbm: "",
   y: ""
}

const cfgFile = {
   station_name: "",
   rec_dev_id: "",
   rev_year: "",
   TT: 0,
   TTA: 0,
   TTD: 0,
   anCh: [],
   digCh: [],
   lf: 0.1,
   nrates: 0,
   samp: [],
   dateStart: "",
   timeStart: "",
   dateTrip: "",
   timeTrip: "",
   ft: "",
   timemult: "",
   timeCode: "",
   localCode: "",
   tmqCode: "",
   leapsec: ""
}

let outText = `
Тип переменной (возможные значения):<br>
<b>crit</b> - обязательный параметр <b>nCrit</b> - необязательный параметр<br>
<b>char</b>- символ; <b>float</b> - вещественная переменная формата <em>[+-]dd[.]dddd[E[+-]ddd]</em><br>
<b>int</b> - integer (целое число); <b>alNum</b>- буквенно-численное значение; <b>num</b>- числовое
значение<br>
<b>[1...9999999]</b> - диапазон возможных значений; <b>minL/maxL</b>- минимальная/максимальная символов<br>
<b>(XX.XX.XXXX)</b>- формат данных; <b>{P;S}</b>- возможные значения
длина<br>
`;

document.addEventListener("DOMContentLoaded", function () {

   if (localStorage["dataCfg"]) {
      matrixCfg = JSON.parse(localStorage["dataCfg"]);
      fileNameCurrent = localStorage["fileName"];
      localStorage.removeItem("dataCfg");
      localStorage.removeItem("fileName");
      document.getElementById("out").innerHTML = "Имя файла: <b>" + fileNameCurrent + "</b><hr>" + outText + "<hr>";
      etractCfg();
      createTableCfg();
   }

});

function readFiles(d) {

   let file = d.files[0];
   let fr = new FileReader();
   fr.onload = function () {
      //use fr result here
      matrixCfg = fr.result;
      document.getElementById("out").innerHTML = "Имя файла: <b>" + d.files[0].name + "</b><hr>" + outText + "<hr>";
      etractCfg();
      createTableCfg();
   }
   fr.readAsText(file);
}

function validateCfg() {
   alert("Валидация в процессе разработки...")
}

function createCfg() {
   alert("Создание CFG из DAT в процессе разработки...")
}

function dos_UTF() {
   alert("Создание CFG из DAT в процессе разработки...")
}

function saveComtrade2013() {
   alert("Создание CFG из DAT в процессе разработки...")
}

//заполняем структуру cfgFile из matrixCfg
function etractCfg() {
   criticalCfg = 0;
   warningCfg = 0;
   // for (let i = 0; i < cfgFile.anCh.length; i++) { for (key in cfgFile.anCh[i]) cfgFile.anCh[key] = ""; }
   // for (let i = 0; i < cfgFile.digCh.length; i++) { for (key in cfgFile.digCh[i]) cfgFile.digCh[key] = ""; }
   // for (let i = 0; i < cfgFile.samp.length; i++) { for (key in cfgFile.samp[i]) cfgFile.samp[key] = ""; }
   for (key in cfgFile) cfgFile[key] = "";

   matrixCfg = matrixCfg.replace("\r\n", "\n").split(/\r\n|\n/);
   Object.assign(currentCfg, matrixCfg);
   for (let i = 0; i < matrixCfg.length; i++) { matrixCfg[i] = matrixCfg[i].split(","); }
   if (matrixCfg[0].length === 2) cfgFile.rev_year = "1991"; else cfgFile.rev_year = matrixCfg[0][2];
   cfgFile.station_name = matrixCfg[0][0];
   cfgFile.rec_dev_id = matrixCfg[0][1];
   cfgFile.TT = matrixCfg[1][0]; cfgFile.TTA = matrixCfg[1][1]; cfgFile.TTD = matrixCfg[1][2];

   let nAnalog = parseInt(cfgFile.TTA);
   cfgFile.anCh = new Array();
   for (let i = 0; i < nAnalog; i++) {
      let aChannel = {};
      Object.assign(aChannel, anChannel);
      aChannel.An = matrixCfg[i + 2][0];
      aChannel.ch_id = matrixCfg[i + 2][1];
      aChannel.ph = matrixCfg[i + 2][2];
      aChannel.ccbm = matrixCfg[i + 2][3];
      aChannel.uu = matrixCfg[i + 2][4];
      aChannel.a = matrixCfg[i + 2][5];
      aChannel.b = matrixCfg[i + 2][6];
      aChannel.skew = matrixCfg[i + 2][7];
      aChannel.min = matrixCfg[i + 2][8];
      aChannel.max = matrixCfg[i + 2][9];
      if (cfgFile.rev_year !== "1991") {
         aChannel.primary = matrixCfg[i + 2][10];
         aChannel.secondary = matrixCfg[i + 2][11];
         aChannel.PS = matrixCfg[i + 2][12];
      }
      cfgFile.anCh.push(aChannel);
   }

   let nDiskret = parseInt(cfgFile.TTD);
   cfgFile.digCh = new Array();
   for (let i = 0; i < nDiskret; i++) {
      let dChannel = {};
      Object.assign(dChannel, digChannel);
      dChannel.Dn = matrixCfg[i + 2 + nAnalog][0].trim();
      dChannel.ch_id = matrixCfg[i + 2 + nAnalog][1].trim();
      dChannel.ph = matrixCfg[i + 2 + nAnalog][2].trim();
      if (cfgFile.rev_year !== "1991") {
         dChannel.ccbm = matrixCfg[i + 2 + nAnalog][3].trim();
         dChannel.y = matrixCfg[i + 2 + nAnalog][4].trim();
      }
      cfgFile.digCh.push(dChannel);
   }

   cfgFile.lf = matrixCfg[2 + nAnalog + nDiskret][0];
   cfgFile.nrates = matrixCfg[3 + nAnalog + nDiskret][0];
   if (cfgFile.nrates === "0") cfgFile.nrates = "1";
   let nRates = Number(cfgFile.nrates);
   cfgFile.samp = new Array();
   for (let i = 0; i < nRates; i++) {
      let rates = {};
      Object.assign(rates, nSamp);
      rates.samp = matrixCfg[i + 4 + nAnalog + nDiskret][0].trim();
      rates.endsam = matrixCfg[i + 4 + nAnalog + nDiskret][1].trim();
      cfgFile.samp.push(rates);
   }

   cfgFile.dateStart = matrixCfg[4 + nAnalog + nDiskret + nRates][0];
   cfgFile.timeStart = matrixCfg[4 + nAnalog + nDiskret + nRates][1];
   cfgFile.dateTrip = matrixCfg[5 + nAnalog + nDiskret + nRates][0];
   cfgFile.timeTrip = matrixCfg[5 + nAnalog + nDiskret + nRates][1];

   cfgFile.ft = matrixCfg[6 + nAnalog + nDiskret + nRates][0];

   if (cfgFile.rev_year !== "1991") {
      cfgFile.timemult = matrixCfg[7 + nAnalog + nDiskret + nRates][0];
      if (cfgFile.rev_year >= "2013") {
         cfgFile.timeCode = matrixCfg[8 + nAnalog + nDiskret + nRates][0].trim();
         cfgFile.localCode = matrixCfg[8 + nAnalog + nDiskret + nRates][1].trim();
         cfgFile.tmqCode = matrixCfg[9 + nAnalog + nDiskret + nRates][0].trim();
         cfgFile.leapsec = matrixCfg[9 + nAnalog + nDiskret + nRates][1].trim();
      }
   }
}

function createTableCfg() {

   tbody = document.getElementById("table");
   tbody.innerHTML = "";
   tbody.innerHTML = `<thead>
   <tr>
   <th>№</th>
   <th>Содержимое строки</th>
   <th>Значение</th>
   <th>Описание</th>
   <th>Переменная IEC</th>
   <th>Тип переменной</th>
   </tr>
   </thead>`;
   tbody.innerHTML += "<tbody></tbody>";
   tbody = document.querySelector("tbody");

   const strTr = {
      number: "",
      string: "",
      values: "",
      description: "",
      iecVariable: "",
      typeVariable: "",
   }
   // if (span == "(Critical)") strWithSpan += " <span class='redtext'>(Critical)</span> <br>";
   // if (span == "(Non-critical)") strWithSpan += " <span class='bluetext'>(Non-critical)</span> <br>";



   function insertTr(tr) {
      function stringToRows(string) {
         let result = "";
         for (let i = 0; i < string.length - 1; i++) result += string[i] + "<br>";
         return result + string[string.length - 1];
      }

      // function typeVerification(str) {
      //    let result = "";

      //    for (let indexL = 0; indexL < str.length; indexL++) {
      //       let warning = 0;
      //       let critical = 0;
      //       let string = "";
      //       let params = str[indexL].split(",");
      //       for (i = 1; i < params.length; i++) {
      //          let keyW = params[i].trim();

      //          function rebBluestring(expr) {
      //             // let result = "";
      //             // if (expr) {
      //             //    critical++; return " <span class='redtext'>" + keyW + "</span>, ";
      //             // } else {
      //             //    warning++; return " <span class='bluetext'>" + keyW + "</span>, ";
      //             // }
      //             // return result;
      //             if (expr) {
      //                return keyW + ", ";
      //             } else {
      //                //  result += rebBluestring(params[0] === "crit");
      //                if (params[0] === "crit") {
      //                   critical++; return " <span class='redtext'>" + keyW + "</span>, ";
      //                } else {
      //                   warning++; return " <span class='bluetext'>" + keyW + "</span>, ";
      //                }
      //             }
      //          }

      //          function correctType(regex) {
      //             //  let result = "";
      //             let regExp = new RegExp(regex, "i");
      //             // if (regExp.test(tr.values[index])) {
      //             //    result += keyW + ", ";
      //             // } else {
      //             //    result += rebBluestring(params[0] === "crit");
      //             //    if (params[0] === "crit") {
      //             //       critical++; result += " <span class='redtext'>" + keyW + "</span>, ";
      //             //    } else {
      //             //       warning++; result += " <span class='bluetext'>" + keyW + "</span>, ";
      //             //    }
      //             // }
      //             return rebBluestring(regExp.test(tr.values[indexL]));
      //          }


      //          switch (keyW) {
      //             case "char":
      //                string += correctType("^[a-zA-Z]*$");
      //                break;
      //             case "float":
      //                string += correctType("[+-]?([0-9]*[,.])?[0-9]+([eE][+-]?[0-9]+)?");
      //                break;
      //             case "int":
      //                string += correctType("^[+-]?[0-9]*$");
      //                //string += keyW + ", ";
      //                break;
      //             case "alNum":
      //                // string += keyW + ", ";
      //                string += correctType("^[А-ЯЁа-яё\u0020-\u007e]*$");
      //                break;
      //             case "num":
      //                string += correctType("^(?:0|[1-9][0-9]*)$");
      //                // string += keyW + ", ";
      //                break;
      //             default:
      //                if (keyW.includes("minL=")) {
      //                   string += rebBluestring(tr.values[indexL].length >= parseInt(keyW.replace(/[^\d]/g, '')));
      //                   break;
      //                }
      //                if (keyW.includes("maxL=")) {
      //                   string += rebBluestring(tr.values[indexL].length <= parseInt(keyW.replace(/[^\d]/g, '')));
      //                   break;
      //                }
      //                if (keyW.includes("[")) {
      //                   // string += rebBluestring(tr.values[index].length <= parseInt(keyW.replace(/[^\d]/g, '')));
      //                   let range = /\[.+\]/.exec(keyW)[0].slice(1, -1);
      //                   let min = /^[0-9]*/.exec(range)[0];
      //                   let max = /\.\.\.[0-9]*/.exec(range)[0].substr(3);
      //                   let appendix = /].*/.exec(keyW)[0].substr(1);

      //                   if (appendix === "" || appendix === "A" || appendix === "D") {
      //                      let numberAD;
      //                      if (appendix === "") string += rebBluestring(tr.values[indexL] >= min && tr.values[indexL] <= max);
      //                      if (appendix === "A") {
      //                         let _A = matrixCfg[1][1].slice(-1);
      //                         numberAD = tr.values[indexL].slice(0, -1);
      //                         string += rebBluestring(numberAD >= min && numberAD <= max && _A == appendix);
      //                      }
      //                      if (appendix === "D") {
      //                         let _D = matrixCfg[1][2].slice(-1);
      //                         numberAD = tr.values[indexL].slice(0, -1);
      //                         string += rebBluestring(numberAD >= min && numberAD <= max && _D == appendix);
      //                      }
      //                   } else {
      //                      string += rebBluestring(0);
      //                   }
      //                   break;
      //                }
      //                if (keyW.includes("{")) {
      //                   // string += rebBluestring(tr.values[index].length <= parseInt(keyW.replace(/[^\d]/g, '')));
      //                   let range = keyW.trim();
      //                   range = range.slice(1, -1);
      //                   range = range.split(";");
      //                   let ok = false;
      //                   for (let i = 0; i < range.length; i++) {
      //                      if (range[i].toUpperCase() === tr.values[indexL].toUpperCase()) ok = true;
      //                   }
      //                   string += rebBluestring(ok);
      //                   break;
      //                }
      //                if (keyW.includes("(")) {
      //                   let range = keyW.trim();
      //                   range = range.slice(1, -1);

      //                   let date = /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(tr.values[indexL]);
      //                   let time = /^\d{1,2}:\d{1,2}:\d{2}\.\d{6}$/.test(tr.values[indexL]);

      //                   string += rebBluestring(date || time);
      //                   break;
      //                }
      //                string += keyW + ", ";
      //                break;
      //          }

      //       }
      //       string = string.substring(0, string.length - 2);
      //       if (warning === 0 && critical == 0) {
      //          string = params[0] + ", " + string + "<br>";
      //       } else {
      //          if (params[0] === "crit") {
      //             criticalCfg += critical;
      //             string = "<span class='redtext'>crit</span>, " + string + "<br>";
      //          } else {
      //             warningCfg += warning;
      //             string = "<span class='bluetext'>nCrit</span>, " + string + "<br>";
      //          }
      //       }
      //       result += string;
      //    }
      //    return result;
      // }

      tbody.innerHTML += `<tr>
      <th>${tr.number}</th>
      <td>${tr.string}</td>
      <td>${stringToRows(tr.values)}</td>
      <td>${stringToRows(tr.description)}</td>
      <th>${stringToRows(tr.iecVariable)}</th>
      <th>${typeVerification(tr.typeVariable, tr.values)}</th>
   </tr>`;
   }

   let index = 1;
   strTr.number = index;
   strTr.string = currentCfg[index - 1];
   strTr.values = [cfgFile.station_name, cfgFile.rec_dev_id];
   strTr.description = ["Имя регистратора/место установки", "Номер регистратора"];
   strTr.iecVariable = ["station_name", "rec_dev_id"];
   strTr.typeVariable = ["crit, alNum, minL=0, maxL=64", "crit, alNum, minL=0, maxL=64"];

   if (cfgFile.rev_year !== "1991") {
      strTr.values.push(cfgFile.rev_year);
      strTr.description.push("Версия Comtrade");
      strTr.iecVariable.push("rev_year");
      strTr.typeVariable.push("crit, num, minL=4, maxL=4");
   }
   insertTr(strTr); index++;

   strTr.number = index;
   strTr.string = currentCfg[index - 1];
   strTr.values = [cfgFile.TT, cfgFile.TTA, cfgFile.TTD];
   strTr.description = ["Общее число каналов", "Число аналоговых каналов", "Число дискретных каналов"];
   strTr.iecVariable = ["TT", "##A", "##D"];
   strTr.typeVariable = ["crit, num, int, minL=1, maxL=6, [1...999999]",
      "crit, alNum, minL=2, maxL=7, [0...999999]A", "crit, alNum, minL=2, maxL=7, [0...999999]D"];
   insertTr(strTr); index++;

   let nAnalog = parseInt(cfgFile.TTA);
   for (let i = 0; i < nAnalog; i++) {
      strTr.number = index;
      strTr.string = currentCfg[index - 1];
      strTr.values = Object.values(cfgFile.anCh[i]);
      if (cfgFile.rev_year === "1991") strTr.values.length = 10;
      for (let i = 0; i < strTr.values.length; i++)  if (strTr.values[i] !== undefined) {
         if (strTr.values[i].length > 0) strTr.values[i] = strTr.values[i].trim();
      } else {
         strTr.values[i] = "?";
      }

      strTr.description = ["Номер аналогового канала",
         "Идентификатор канала",
         "Идентификатор фазы",
         "Контролируемая цепь/компонент",
         "Единица измерения в канале",
         "Вещественное число a для a*x+b",
         "Вещественное число b для a*x+b",
         "Сдвиг времени с начала отсчета, мкс",
         "Минимальная величина в выборке",
         "Максимальная величина в выборке"];
      strTr.iecVariable = ["nn", "id", "ph", "ccbm", "uu", "a", "b", "skew", "min", "max"];
      strTr.typeVariable = ["crit, num, int, minL=1, maxL=6, [1...999999]",
         "crit, alNum, minL=1, maxL=128",
         "nCrit, alNum, minL=0, maxL=2",
         "nCrit, alNum, minL=0, maxL=64",
         "crit, char, minL=1, maxL=32",
         "crit, float, minL=1, maxL=32",
         "crit, float, minL=1, maxL=32",
         "crit, float, minL=1, maxL=32",
         "crit, float, minL=1, maxL=13",
         "crit, float, minL=1, maxL=13"];

      if (cfgFile.rev_year !== "1991") {
         strTr.description.push("Первичное значение ТТ/ТН");
         strTr.description.push("Вторичное значение ТТ/ТН");
         strTr.description.push("Первичные(P)/вторичные(S) данные в канале");
         strTr.iecVariable.push("primary");
         strTr.iecVariable.push("secondary");
         strTr.iecVariable.push("P или S");
         strTr.typeVariable.push("crit, float, minL=1, maxL=32");
         strTr.typeVariable.push("crit, float, minL=1, maxL=32");
         strTr.typeVariable.push("crit, alNum, minL=1, maxL=1, {p;P;s;S}");
      }

      insertTr(strTr);
      index++;
   }

   let nDiskret = parseInt(cfgFile.TTD);
   for (let i = 0; i < nDiskret; i++) {
      strTr.number = index;
      strTr.string = currentCfg[index - 1];
      strTr.values = Object.values(cfgFile.digCh[i]);
      if (cfgFile.rev_year === "1991") strTr.values.length = 3;
      if (strTr.string.split(",").length < 4) strTr.values.length = 3;
      for (let i = 0; i < strTr.values.length; i++) {
         if (strTr.values[i].length > 0) strTr.values[i] = strTr.values[i].trim();

         // if (strTr.values[i]) {

         // }
         // else strTr.values[i] = "?\u0019";

      }

      strTr.description = ["Номер дискретного канала",
         "Имя канала",
         "Идентификатор фазы"];
      strTr.iecVariable = ["Dn", "ch_id", "ph"];
      strTr.typeVariable = ["crit, num, int, minL=1, maxL=6, [1...999999]",
         "crit, alNum, minL=1, maxL=128",
         "nCrit, alNum, minL=0, maxL=2"];
      if (cfgFile.rev_year !== "1991" && strTr.values.length != 3) {
         strTr.description.push("Контролируемая цепь/компонент");
         strTr.description.push("Нормальное состояние");
         strTr.iecVariable.push("ccbm");
         strTr.iecVariable.push("y");
         strTr.typeVariable.push("nCrit, alNum, minL=0, maxL=64");
         strTr.typeVariable.push("crit, int, num, minL=1, maxL=1, {0;1}");
      }

      insertTr(strTr);
      index++;
   }

   strTr.number = index;
   strTr.string = currentCfg[index - 1];
   strTr.values = [cfgFile.lf];
   strTr.description = ["Частота сети"];
   strTr.iecVariable = ["lf"];
   strTr.typeVariable = ["crit, float, minL=0, maxL=32"];
   insertTr(strTr); index++;

   strTr.number = index;
   strTr.string = currentCfg[index - 1];
   strTr.values = [cfgFile.nrates];
   strTr.description = ["Количество различных частот дискретизации"];
   strTr.iecVariable = ["nrates"];
   strTr.typeVariable = ["crit, int, num, minL=1, maxL=3, [0...999]"];
   insertTr(strTr); index++;

   for (let i = 0; i < cfgFile.nrates; i++) {
      strTr.number = index;
      strTr.string = currentCfg[index - 1];
      strTr.values = Object.values(cfgFile.samp[i]);
      strTr.description = ["Частота дискретизации, Гц", "Номер последней выборки для данной частоты"];
      strTr.iecVariable = ["samp", "endsamp"];
      strTr.typeVariable = ["crit, float, minL=1, maxL=32",
         "crit, int, num, minL=1, maxL=10, [1...9999999999]"];
      insertTr(strTr); index++;
   }

   strTr.number = index;
   strTr.string = currentCfg[index - 1];
   strTr.values = [cfgFile.dateStart, cfgFile.timeStart];
   strTr.description = ["Дата начала регистрации", "Время начала регистрации"];
   strTr.iecVariable = ["dd/mm/yyyy", "mm:ss:ssssss"];
   strTr.typeVariable = ["crit, alNum, (dd/mm/yyyy)", "crit, alNum, (mm:ss:ssssss)"];
   insertTr(strTr); index++;

   strTr.number = index;
   strTr.string = currentCfg[index - 1];
   strTr.values = [cfgFile.dateTrip, cfgFile.timeTrip];
   strTr.description = ["Дата момента пуска", "Время момента пуска"];
   strTr.iecVariable = ["dd/mm/yyyy", "mm:ss:ssssss"];
   strTr.typeVariable = ["crit, alNum, (dd/mm/yyyy)", "crit, alNum, (mm:ss:ssssss)"];
   insertTr(strTr); index++;

   strTr.number = index;
   strTr.string = currentCfg[index - 1];
   strTr.values = [cfgFile.ft];
   strTr.description = ["Тип DAT файла (ASCII, binary, binary32, float)"];
   strTr.iecVariable = ["ft"];
   strTr.typeVariable = ["crit, char, minL=5, maxL=8, {ASCII;binary;binary32;float32}"];
   insertTr(strTr); index++;

   if (cfgFile.rev_year !== "1991") {
      strTr.number = index;
      strTr.string = currentCfg[index - 1];
      strTr.values = [cfgFile.timemult];
      strTr.description = ["Множитель разницы метки времени"];
      strTr.iecVariable = ["timemult"];
      strTr.typeVariable = ["crit, float, minL=1, maxL=32"];
      insertTr(strTr); index++;

      if (cfgFile.rev_year >= "2013") {
         strTr.number = index;
         strTr.string = currentCfg[index - 1];
         strTr.values = [cfgFile.timeCode, cfgFile.localCode];
         strTr.description = ["TimeCode, h", "Разница с UTC, h"];
         strTr.iecVariable = ["time_code", "local_code"];
         strTr.typeVariable = ["crit, alNum, minL=1, maxL=6", "crit, alNum, minL=1, maxL=6"];
         insertTr(strTr); index++;

         strTr.number = index;
         strTr.string = currentCfg[index - 1];
         strTr.values = [cfgFile.tmqCode, cfgFile.leapsec];
         strTr.description = ["Флаг качества часов", "Дополнительная 'високосная' секунда"];
         strTr.iecVariable = ["tmq_code", "leapssec"];
         strTr.typeVariable = ["crit, hex, minL=1, maxL=1, {1;2;3;4;5;6;7;8;9;A;B;F}", "crit, int, num, minL=1, maxL=1"];
         insertTr(strTr); index++;
      }
   }

   if (criticalCfg === 0 && warningCfg === 0)
      document.getElementById("out").innerHTML += "Ошибок в файле не обнаружено";
   else {
      document.getElementById("out").innerHTML += `Обнаружено критических ошибок: <span class='redtext'>${criticalCfg}</span><br>
      Обнаружено предупреждений: <span class='bluetext'>${warningCfg}</span><br>`;
   }

}