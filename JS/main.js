//    Comtrade analizator
//    Module: manager version 0.1
//    Alexander Voronenko
//    796546@gmail.com
//    02.2022
const file = {
   name: "",
   size: "",
   modified: ""
}

let filesComtradeList = [];

// function readFilesArray(fileName) {
//    // let file = d.files[0];
//    let fr = new FileReader();
//    fr.onload = function () {
//       //use fr result here
//       //  matrixCfg = fr.result;
//       //  document.getElementById("out").innerHTML = "Имя файла: <b>" + d.files[0].name + "</b><hr>" + outText + "<hr>";
//       // etractCfg();
//       // createTableCfg();
//       return fr.result
//    }
//    fr.readAsArrayBuffer(fileName);
// }

function readFiles(d) {
   outText = document.getElementById("outP");
   outText.innerHTML = "№ - Номер аварии<br/>";
   outText.innerHTML += "Имя файла - Имя файла без расширения<br/>";
   outText.innerHTML += "CFG файл - номер версии стандарта Comtrade<br/>";
   outText.innerHTML += "DAT файл - кодировка DAT файла Comtrade<br/>";
   outText.innerHTML += "CFG+DAT файл - дата и время пуска<br/>";
   outText.innerHTML += "RIO файл - количество ступеней защит в устройстве (Z-ступеней ДЗ, I-ступеней МТЗ)<br/>";
   outText.innerHTML += "INF файл, HDR файл - размер файла, кбайт<br/>";
   filesComtradeList = [];
   const fileList = d.files || [];
   //   filesComtradeList = fileList;
   let progress = document.querySelector('.percent');
   let index = 0;
   readNext();

   function readNext() {
      let file = fileList[index];
      let fr = new FileReader();
      fr.onload = function () {
         //use fr result here
         let mD = new Date();
         mD = fileList[index].lastModifiedDate;

         function to2(d) { return (d < 10 ? "0" + d : d); }

         let curTime = to2(mD.getDate()) + "." + to2((mD.getMonth() + 1)) + "." +
            to2(mD.getFullYear()) + " " + to2(mD.getHours()) + ":" + to2(mD.getMinutes());
         let result = fr.result;
         filesComtradeList.push([]);

         let array = new Uint8Array(result);
         let text = "";
         let curExt = fileList[index].name.substring(fileList[index].name.lastIndexOf(".") + 1, fileList[index].name.length).toLowerCase();

         // let curName = curFileName.substring(0, curFileName.lastIndexOf(".")); //обрезаем имя файла от расширения
         // let curExt = curFileName.substring(curFileName.lastIndexOf(".") + 1, curFileName.length).toLowerCase();

         if (curExt !== "dat") {
            for (let i = 0; i < array.length; i++) text += String.fromCharCode(array[i]);
            filesComtradeList[index].file = text;
            filesComtradeList[index].type = curExt;
         } else {
            // function zeroString(n) {
            //    let result = "";
            //    for (let i = 0; i < n; i++)result += "0";
            //    return result;
            // }
            // for (i = 0; i < array.length / 2 - 1; i++) {
            //    let first = array[i * 2 + 1].toString(2);
            //    first = zeroString(8 - first.length) + first;
            //    let second = array[i * 2].toString(2);
            //    second = zeroString(8 - second.length) + second;
            //    let from8to16 = first + second;
            //    array[i] = parseInt(from8to16, 2);
            // }

            // let buffer = message.binarydata;
            // let number = (buffer[1]<<8)+buffer[0];
            function nSymbol(char) {
               let number = 0;
               for (let i = 0; i < array.length; i++) if (String.fromCharCode(array[i]) === char) number++;
               return number;
            }

            let symbolR = nSymbol("\r");
            let symbolN = nSymbol("\n");

            function zFill8(param) {
               let result = "";
               for (let i = 0; i < 8 - param.length; i++)result += "0";
               return result + param;
            }

            if (symbolR === symbolN && symbolR !== 0) {
               filesComtradeList[index].type = "ascii";
               for (let i = 0; i < array.length; i++) text += String.fromCharCode(array[i]);
               filesComtradeList[index].file = text;
            } else {

               let arrayFFFF = [];
               for (let i = 0; i < Math.trunc(array.length / 2); i++) {
                  let first = zFill8(array[i * 2].toString(2));
                  let second = zFill8(array[i * 2 + 1].toString(2));
                  // second = second << 8
                  // let number = first
                  //number += second << 8;
                  // if (second[0] === "1") {
                  //    second[0] = "0";
                  //    // second = second;
                  //    arrayFFFF[i] = -parseInt(second.join("") + first, 2);
                  // } else {
                  //    arrayFFFF[i] = parseInt(second.join("") + first, 2);
                  // }
                  arrayFFFF[i] = parseInt(second + first, 2);
               }
               filesComtradeList[index].type = "ffff";
               filesComtradeList[index].file = arrayFFFF;
            }

            //filesComtradeList[index].
         }
         // let textDat = text.split(/\r\n|\n/);
         // let textMatrix = [];


         filesComtradeList[index].name = fileList[index].name.toLowerCase();
         filesComtradeList[index].size = fileList[index].size;
         filesComtradeList[index].dateModification = curTime;
         filesComtradeList[index].fileName = fileList[index];
         index++;

         if (index < fileList.length) {
            document.getElementById("progress_bar").className = "loading";
            let percentLoaded = Math.round((filesComtradeList.length / fileList.length) * 100);

            progress.style.width = percentLoaded + "%";
            progress.textContent = percentLoaded + "%";

            readNext();
         } else {
            document.getElementById("progress_bar").className = "";
            let percentLoaded = Math.round((filesComtradeList.length / fileList.length) * 100);
            progress.style.width = percentLoaded + "%";
            progress.textContent = percentLoaded + "%";

         }
         createTable();
      }
      fr.readAsArrayBuffer(file);
   }
}

function createTable() {
   filesComtradeList.sort(function (o1, o2) {
      return o1.name < o2.name ? -1 : (o1.name > o2.name ? 1 : 0);
   });

   tbody = document.getElementById("table");
   tbody.innerHTML = "";
   tbody.innerHTML = `<thead>
      <tr>
      <th>№</th>
      <th>Имя файла</th>
      <th>CFG файл</th>
      <th>DAT файл</th>
      <th>CFG+DAT файл</th>
      <th>RIO файл</th>
      <th>INF файл</th>
      <th>HDR файл</th>
      <th>Дата создания</th>
      <th>Размер файла, кбайт</th>
      <th>О событии</th>
      </tr >
   </thead>`;
   tbody.innerHTML += "<tbody></tbody>";
   tbody = document.querySelector("tbody");

   const strTr = {
      "number": "",
      "name": "",
      "cfg": "",
      "titleCfg": "",
      "dat": "",
      "titleDat": "",
      "cfgDat": "",
      "titleCfgDat": "",
      "rio": "",
      "titleRio": "",
      "inf": "",
      "titleInf": "",
      "hdr": "",
      "titleHdr": "",
      "time": "",
      "size": "",
      "about": ""
   }

   function insertTr(tr) {
      function stringBox(title, d) {
         if (title !== "") return `<td class="box" title= "${title}">${d}</td>`;
         else return `<td>${d}</td>`;
      }
      tbody.innerHTML += `<tr>
      <th>${tr.number}</th>
      <th>${tr.name}</th>
      ${stringBox(tr.titleCfg, tr.cfg)}
      ${stringBox(tr.titleDat, tr.dat)}
      ${stringBox(tr.titleCfgDat, tr.cfgDat)}
      ${stringBox(tr.titleRio, tr.rio)}
      ${stringBox(tr.titleInf, tr.inf)}
      ${stringBox(tr.titleHdr, tr.hdr)}
      <th>${tr.time}</th>
      <td>${tr.size}</td>
      <td>${tr.about}</td>
   </tr>`;
   }

   function getComtradeInfo(text) {
      let matrixCfg = text.replace("\r\n", "\n").split(/\r\n|\n/);
      for (let i = 0; i < matrixCfg.length; i++) { matrixCfg[i] = matrixCfg[i].split(","); }
      if (matrixCfg[0].length === 2) strTr.cfg = "1991"; else strTr.cfg = matrixCfg[0][2];
      strTr.titleCfg += "\r\nОбщее число каналов: " + matrixCfg[1][0];
      strTr.titleCfg += "\r\nКоличество аналоговых каналов: " + matrixCfg[1][1];
      strTr.titleCfg += "\r\nКоличество дискретных каналов: " + matrixCfg[1][2];
      let nString = Number(matrixCfg[1][0]);
      strTr.titleCfg += "\r\nЧастота сети: " + Number(matrixCfg[nString + 2][0]) + "Гц";
      let nfreq = Number(matrixCfg[nString + 3][0]); if (nfreq == 0) nfreq = 1;
      nString += nfreq + 3;
      strTr.titleCfg += "\r\nЧастота дескритизации: " + Number(matrixCfg[nString][0]) + "Гц";
      strTr.titleCfg += "\r\nДата/время начала регистрации: " + matrixCfg[nString + 1][0] + "; " + matrixCfg[nString + 1][1];
      strTr.titleCfg += "\r\nДата/время момента пуска: " + matrixCfg[nString + 2][0] + "; " + matrixCfg[nString + 2][1];
      strTr.cfgDat = matrixCfg[nString + 2][0] + "; " + matrixCfg[nString + 2][1]
      strTr.titleCfg += "\r\nКодировка DAT файла: " + matrixCfg[nString + 3][0];
      strTr.dat = matrixCfg[nString + 3][0];

      if (matrixCfg[0][2] === "1999" || matrixCfg[0][2] === "2001") { strTr.titleCfg += "\r\nTimeMult: " + Number(matrixCfg[nString + 4][0]); }
      if (matrixCfg[0][2] === "2013") {
         strTr.titleCfg += "\r\nTimeMult: " + Number(matrixCfg[nString + 4][0]);
         strTr.titleCfg += "\r\nTimeCode, LocalCode: " + matrixCfg[nString + 5][0] + ", " + matrixCfg[nString + 5][1];
         strTr.titleCfg += "\r\nTimeQuality indicator, leap second: " + matrixCfg[nString + 6][0] + ", " + matrixCfg[nString + 6][1];
      }
   }
   function getRioInfo(text) {
      let rio = text.split(/\r\n|\n|\r/);
      let commentBlock = false;
      let zone = 0;
      let unit = 0;
      // если найдем name, равный элементу массива paramForArray, то вернем TRUE, иначе FALSE 
      let parentsArray = ["TRIPCHAR", "TRIPCHAR-EARTH", "SHAPE", "MHOSHAPE", "LENSTOMATOSHAPE"];
      function parentForArray(name) {
         for (let i = 0; i < parentsArray.length; i++) { if (parentsArray[i] === name) return true; }
         return false;
      }

      for (let i = 0; i < rio.length; i++) {
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

         if (keyWorld === "BEGIN") {
            if (parentForArray(rio[i])) ++zone;
            if (rio[i] === "UNIT") ++unit;

         }
      }
      strTr.rio = "Z=" + zone;
      if (unit !== 0) strTr.rio += " I=" + unit;
   }

   //добавление строки в таблицу 
   function addTableString(curName, curExt, num) {
      switch (curExt) {
         case "cfg":
            strTr.titleCfg = curName + "." + curExt;
            getComtradeInfo(filesComtradeList[num].file);
            break;
         case "dat":
            // strTr.dat = "ASCII";
            strTr.titleDat = curName + "." + curExt;
            if (strTr.cfg !== "") {
               // strTr.cfgDat = "24.12.1997 14:56";
               strTr.titleCfgDat = curName;
            }
            break;
         case "rio":
            strTr.titleRio = curName + "." + curExt;
            getRioInfo(filesComtradeList[num].file);
            //strTr.rio = "Z";
            break;
         case "inf":
            strTr.inf = (filesComtradeList[num].size / 1000).toFixed(2);
            strTr.titleInf = curName + "." + curExt;
            break;
         case "hdr":
            strTr.hdr = (filesComtradeList[num].size / 1000).toFixed(2);
            strTr.titleHdr = curName + "." + curExt;
            break;
         default:
      }
   }

   let currentStringName = "";
   let index = 0;
   let curFileName = filesComtradeList[0].name;
   // let trSize = "";

   // let curFileName = filesComtradeList[0].name
   let curName = curFileName.substring(0, curFileName.lastIndexOf(".")); //обрезаем имя файла от расширения
   let curExt = curFileName.substring(curFileName.lastIndexOf(".") + 1, curFileName.length).toLowerCase(); //обрезаем расширение файла от расширения

   index++;
   strTr.number = index;
   strTr.name = curName;
   strTr.time = filesComtradeList[0].dateModification;
   if (curExt === "cfg" || curExt === "dat" || curExt === "rio") strTr.size = curExt + ":" + (filesComtradeList[0].size / 1000).toFixed(2);
   currentStringName = curName;
   addTableString(curName, curExt, 0);

   for (let i = 1; i < filesComtradeList.length; i++) {
      curFileName = filesComtradeList[i].name;
      curName = curFileName.substring(0, curFileName.lastIndexOf(".")); //обрезаем имя файла от расширения
      curExt = curFileName.substring(curFileName.lastIndexOf(".") + 1, curFileName.length).toLowerCase(); //обрезаем расширение файла от расширения

      if (curName === currentStringName) {
         if (curExt === "cfg" || curExt === "dat" || curExt === "rio") strTr.size += " " + curExt + ":" + (filesComtradeList[i].size / 1000).toFixed(2);
         addTableString(curName, curExt, i);
      } else {
         insertTr(strTr);
         for (key in strTr) strTr[key] = "";
         index++;
         strTr.number = index;
         strTr.name = curName;
         strTr.time = filesComtradeList[i].dateModification;
         if (curExt === "cfg" || curExt === "dat" || curExt === "rio") strTr.size = curExt + ":" + (filesComtradeList[i].size / 1000).toFixed(2);

         currentStringName = curName;
         addTableString(curName, curExt, i);
      }
   }

   insertTr(strTr);

   document.querySelectorAll('td').forEach(cell => {
      cell.addEventListener('click', evt => {
         //   console.log(evt.target);
         clickTable(evt.target);
      })
   })
}

function clickTable(event) {
   //   alert(event.cellIndex + " " + event.title);
   let param = event.title.split(/\r\n|\n|\r/);
   // alert(param[0]);

   if (param[0] !== "") {
      function validCFG(text) {
         let verComtrade = "1991"; // текущая версия файла
         let result = "ДЛЯ ОТКРЫТИЯ НОВОГО ОКНА- разрешите всплывающие окна\r\n";
         let errorList = "";
         let textCfg = text.replace("\r\n", "\n").split(/\r\n|\n/);
         let nStr;

         if (textCfg.length > 8) {
            for (let i = 0; i < textCfg.length; i++) textCfg[i] = textCfg[i].split(",");
            if (textCfg[0].length === 2) verComtrade = "1991"; else verComtrade = textCfg[0][2];

            nStr = 1; // первая строка в файле
            if (textCfg[nStr - 1].length <= 1) {
               errorList += "Строка 1: Должно быть два или три значения разделенныые символом ','\r\n"
            } else {
               if (textCfg[nStr - 1].length === 3) verComtrade = textCfg[0][2];
               if (textCfg[nStr - 1].length > 3) errorList += `Строка ${nStr}: Должно быть два или три значения разделенныые символом ','\r\n`
            }
            //проверка на количество элементов n (столько должно быть) в строке str. 
            //nStr-номер обрабатываемой строки в cfg
            function validString(str, n, nStr) {
               if (str.length < n) {
                  errorList += "Строка " + nStr + ": Мало элементов в строке. Долно быть (" + n + ")\r\n"; return false;
               } else if (str.length > n) {
                  errorList += "Строка " + nStr + ": Много элементов в строке. Долно быть (" + n + ")\r\n"; return false;
               }
               return true;
            }

            nStr = 2; validString(textCfg[nStr - 1], 3, nStr);
            let nAnal = 0; // количество аналоговых
            let nDiskr = 0; //количество дискретных
            let nAnalog = 0; // число данных для аналоговых каналов 10 или 13
            let nDiskret = 0; // число данных для аналоговых каналов 3 или 5

            if (verComtrade === "1991") { nAnalog = 10; nDiskret = 3; }
            else { nAnalog = 13; nDiskret = 5; }

            let i = 0; nStr++;
            while (textCfg[i + 2].length == nAnalog) { ++i; ++nAnal; }
            if (parseInt(textCfg[1][1]) !== nAnal) errorList += `Строка 2: Неверное количество аналговых каналов xxA\r\n`;
            for (let i = 0; i < parseInt(textCfg[1][1]); i++) { validString(textCfg[i + 2], nAnalog, nStr, errorList); nStr++; }

            i = 0;
            while (textCfg[i + nAnal + 2].length == nDiskret) { ++i; ++nDiskr; }
            if (parseInt(textCfg[1][2]) !== nDiskr) errorList += "Строка 2: Неверное количество дискретных каналов xxD\r\n";
            for (let i = 0; i < parseInt(textCfg[1][2]); i++) { validString(textCfg[i + 2 + nAnal], nDiskret, nStr, errorList); nStr++; }

            //проверка частоты
            validString(textCfg[nAnal + nDiskr + 2], 1, nStr); nStr++;
            //проверка частот дискретизации
            validString(textCfg[nAnal + nDiskr + 3], 1, nStr);
            let nFreq = parseInt(textCfg[nAnal + nDiskr + 3]);// количество разных частот дискретизации
            nStr++;

            if (nFreq === 0) nFreq = 1; //в стандарте написано, что если 0, то одна выботка по частоте
            //Здесь надо проверить на валидность строк т.е. тут две пары цифр (проверим на пару цифр, а потом надо осторожно файл смотреть!!!!!)
            for (let i = 0; i < nFreq; i++) {
               validString(textCfg[i + nAnal + nDiskr + 4], 2, nStr); nStr++;
            }

            //проверка метки времени
            validString(textCfg[nAnal + nDiskr + nFreq + 4], 2, nStr); nStr++;
            validString(textCfg[nAnal + nDiskr + nFreq + 5], 2, nStr); nStr++;

            //тип файла BINARI or ASCII
            validString(textCfg[nAnal + nDiskr + nFreq + 6], 1, nStr); nStr++;

            if (verComtrade !== "1991" && textCfg.length >= nStr - 1) { validString(textCfg[nStr - 1], 1, nStr); nStr++; }//множитель
            if (textCfg.length + 1 - nStr > 2) verComtrade = "2013";

            //часовой пояс
            if (verComtrade === "2013") {
               validString(textCfg[nStr - 1], 2, nStr); nStr++;
               validString(textCfg[nStr - 1], 2, nStr); nStr++; //текущая строка в файле, а в матрице -1
            }
            if (!errorList.length) {
               if (verComtrade === "1997") {
                  result += "Структура файла не соответствует стандартам IEEE Std C37.111-1991, IEEE Std C37.111-1999, IEEE Std C37.111-2013.\r\n";
                  result += "Находится между 1991-1999гг. разработки стандартов.\r\nОшибок в структуре файла не обнаружено.\r\n";
                  result += "Проверено строк: " + Number(nStr - 1) + ".\r\nДлина файла составляет: " + textCfg.length + " строк.\r\n";
               }
               else {
                  result += "Структура файла соответствует стандарту: IEEE Std C37.111-" + verComtrade + ".\r\nОшибок в структуре файла не обнаружено.\r\n";
                  result += "Проверено строк: " + Number(nStr - 1) + ".\r\nДлина файла составляет: " + textCfg.length + " строк.\r\n";
               }
            }
            else {
               result += "Предположительная версия файла Comtrade" + verComtrade + ".\r\n";
               result += "Проверено строк: " + Number(nStr - 1) + ".\r\nДлина файла составляет: " + textCfg.length + " строк.\r\n";
               result += "При открытии файла обнаружены ошибки:\r\n"
               result += errorList;
            }

         } else {
            result += "Файл слишком короткий или не являестя файлом формата Comtrade *.cfg.\r\n";
         }
         return result;
      }

      let text1 = ""; let text2 = ""; let fileAdd = ""; let text3 = "";
      //в переменную text перемещаем обрабатываемую информацию 


      // let curName = curFileName.substring(0, curFileName.lastIndexOf(".")); //обрезаем имя файла от расширения

      if (event.cellIndex === 4 || event.cellIndex === 3) {
         for (let i = 0; i < filesComtradeList.length; i++) { if (filesComtradeList[i].name === param[0].substring(0, param[0].lastIndexOf(".")) + ".cfg") text1 = filesComtradeList[i].file; }
         for (let i = 0; i < filesComtradeList.length; i++) {
            if (filesComtradeList[i].name === param[0].substring(0, param[0].lastIndexOf(".")) + ".dat") {
               text2 = filesComtradeList[i].file;
               fileAdd = filesComtradeList[i].fileName;
               text3 = filesComtradeList[i].type;
            }
         }
      } else for (let i = 0; i < filesComtradeList.length; i++) { if (filesComtradeList[i].name === param[0]) { text1 = filesComtradeList[i].file; fileAdd = filesComtradeList[i].fileName; } }

      switch (event.cellIndex) {
         case 2:
            //cfg
            if (confirm(validCFG(text1) + "Открыть новое окно для обработки файла COMTRADE с именем: " + param[0] +
               "\r\n_________________________\r\nСодержимое файла:\r\n" + text1)) {
               localStorage.setItem("dataCfg", JSON.stringify(text1));
               localStorage.setItem("fileName", param[0]);
               window.open("cfgFile.html");
               // setTimeout(() => window.open("cfgFile.html"), 1000);
            }
            break;
         case 3:
            //dat

            if (confirm("Открыть новое окно для обработки файла COMTRADE с именем: " + param[0])) {
               // text1 = readFilesArray(fileAdd);

               // setTimeout(() => alert(fileAdd), 1000);
               localStorage.setItem("dataType", JSON.stringify(text3));
               localStorage.setItem("dataDat", JSON.stringify(text2));
               localStorage.setItem("dataCfgForDat", JSON.stringify(text1));

               // localStorage.setItem("dataDat", text1);
               localStorage.setItem("fileName", param[0]);
               window.open("datFile.html");
               // setTimeout(() => window.open("cfgFile.html"), 1000);
            }

            break;
         case 4:
            //cfg+dat
            alert(text1);
            alert(text2);
            break;
         case 5:
            //rio
            if (confirm("Открыть новое окно для обработки файла COMTRADE с именем: " + param[0] +
               "\r\n_________________________\r\nСодержимое файла:\r\n" + text1)) {
               localStorage.setItem("dataRio", JSON.stringify(text1));
               localStorage.setItem("fileName", param[0]);
               window.open("rioFile.html");
            }
            //         alert(text1);
            break;
         case 6:
            //inf
            if (confirm("Открыть новое окно для обработки файла COMTRADE с именем: " + param[0] +
               "\r\n_________________________\r\nСодержимое файла:\r\n" + text1)) {
               localStorage.setItem("dataInf", JSON.stringify(text1));
               localStorage.setItem("fileName", param[0]);
               window.open("infFile.html");
            }
            break;
         case 7:
            //hdr
            if (confirm("Открыть новое окно для обработки файла COMTRADE с именем: " + param[0] +
               "\r\n_________________________\r\nСодержимое файла:\r\n" + text1)) {
               localStorage.setItem("dataHdr", JSON.stringify(text1));
               localStorage.setItem("fileName", param[0]);
               window.open("hdrFile.html");
            }
            break;
         default:
            alert("Неверная ссылка");
            break;
      }
   }

}
