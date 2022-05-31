let matrixDat;
let matrixType;
let matrixCfg = "";
let nDiskr;
let textDatFFFF;
let fileNameCurrent;
//let totalRows;

//let currentCfg = {};
let criticalCfg, warningCfg;

document.addEventListener("DOMContentLoaded", function () {
   debugger;
   if (localStorage["dataDat"]) {
      matrixDat = JSON.parse(localStorage["dataDat"]);
      matrixType = JSON.parse(localStorage["dataType"]);
      matrixCfg = JSON.parse(localStorage["dataCfgForDat"]);
      fileNameCurrent = localStorage["fileName"];

      localStorage.removeItem("dataDat");
      localStorage.removeItem("dataType");
      localStorage.removeItem("dataCfgForDat");
      localStorage.removeItem("fileName");
      document.getElementById("out").innerHTML = "Имя файла: <b>" + fileNameCurrent + "</b><hr>";
      alert("stop");
      //  + outText + "<hr>";
      // etractCfg();
      // createTableCfg();
      // detectAsciiBinary();
   }
})

// let textCfg = text.replace("\r\n", "\n").split(/\r\n|\n/);
// let nAnal = parseInt(textCfg[1][1]);
// nDiskr = parseInt(textCfg[1][2]);
// let nFreq = parseInt(textCfg[nAnal + nDiskr + 3]);
// if (nFreq === 0) nFreq = 1;

// //тип файла BINARI or ASCII
// let datType = textCfg[nAnal + nDiskr + nFreq + 6];

function readFiles(d) {
   let file = d.files[0];
   let fr = new FileReader();
   fr.onload = function () {
      //use fr result here
      matrixDat = fr.result;
      document.getElementById("out").innerHTML = "Имя файла: <b>" + d.files[0].name + "</b><hr>"
      convertArrayBuffer(matrixDat);
      detectAsciiBinary();
      //+ outText + "<hr>";
      // etractCfg();
      // createTableCfg();
   }
   fr.readAsArrayBuffer(file);
   // fr.readAsBinaryString(file);
}

function convertArrayBuffer(data) {

   let array = new Uint8Array(data);
   let text = "";

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
      matrixType = "ascii";
      for (let i = 0; i < array.length; i++) text += String.fromCharCode(array[i]);
      matrixDat = text;
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
      matrixType = "ffff";
      matrixDat = arrayFFFF;
   }

}

function detectAsciiBinary() {
   if (matrixType === "ascii") convertASCII();
   if (matrixType === "ffff") convertBinary();
}





function convertASCII() {
   // let array = new Uint8Array(matrixDat);
   let text = matrixDat;
   // for (let i = 0; i < array.length; i++)text += String.fromCharCode(array[i]);
   let textDat = text.split(/\r\n|\n/);
   let textMatrix = [];

   // if (confirm("Открыть данные для дальнейшей обработки? " +
   //    "\r\nДанные должны представлять значения, разделенные запятой:\r\n" + text)) {

   //делаем двухмерную матрицу textDat с данными
   if (!textDat[textDat.length - 1][textDat[0].length]) textDat.length = textDat.length - 1;
   for (i = 0; i < textDat.length; i++) textMatrix[i] = textDat[i].split(",");

   createTableHead(textMatrix);
   createTableDat(textMatrix);
   // }
}


function findStep(array) {
   let ind = 0;
   let n = 1;
   let firstElement, nextElement, testElement;
   let step;
   let test = false;


   firstElement = array[ind];
   if (array[ind] !== 0 && array[ind] !== 1) return -1;
   if (array[ind + 1] !== 0) return -1;

   do {
      step = array.indexOf(firstElement + 1, ind + 1);
      ind += step;
      if (ind > array.length || step === -1) return -1;

      nextElement = array[step];
      testElement = array[step * 2];

      test = testElement - nextElement !== 1;
      test = test || array[step + 1] !== 0;
      test = test || array[step * 2 + 1] !== 0;

   } while (test)
   return step;
}
function zeroString(n) {
   let result = "";
   for (let i = 0; i < n; i++)result += "0";
   return result;
}

// let nAnal = parseInt(textCfg[1][1]);
// nDiskr = parseInt(textCfg[1][2]);
// let textCfg = text.replace("\r\n", "\n").split(/\r\n|\n/);
// let nFreq = parseInt(textCfg[nAnal + nDiskr + 3]);
// if (nFreq === 0) nFreq = 1;

// //тип файла BINARI or ASCII
// let datType = textCfg[nAnal + nDiskr + nFreq + 6];
function decodeCfg() {
   let result = {
      nAnal: 0,
      nDiskr: 0,
      nFreq: 0,
      dataType: ""
   }
   if (matrixCfg !== "") {
      let textCfg = matrixCfg.replace("\r\n", "\n").split(/\r\n|\n/);
      for (let i = 0; i < textCfg.length; i++) { textCfg[i] = textCfg[i].split(","); }
      result.nAnal = parseInt(textCfg[1][1]);
      result.nDiskr = parseInt(textCfg[1][2]);
      result.nFreq = parseInt(textCfg[result.nAnal + result.nDiskr + 3]);
      if (result.nFreq === 0) result.nFreq = 1;
      result.dataType = textCfg[result.nAnal + result.nDiskr + result.nFreq + 6][0];
   }
   return result;
}



function convertBinary(dataType) {

   // let matrixDatLength = matrixDat.length;
   // if (matrixDatLength % 2 === 0) {
   //    let UintArray = new Uint8Array(matrixDat);

   let array = matrixDat;
   // for (i = 0; i < UintArray.length / 2; i++) {
   //    let first = UintArray[i * 2 + 1].toString(2);
   //    first = zeroString(8 - first.length) + first;
   //    let second = UintArray[i * 2].toString(2);
   //    second = zeroString(8 - second.length) + second;
   //    let from8to16 = first + second;
   //    array[i] = parseInt(from8to16, 2);
   // }
   let cfgParam = decodeCfg();


   let step = findStep(array);
   if (step === -1) {
      alert("Невозможно найти выборки в файле");
   } else {
      let totalRows = matrixDat.length / step / 2;
      //преобразуем в массив строк textDat по 2 бита (FF FF)
      // let textDat = [];
      // for (let row = 0; row < totalRows; row++) {
      //    textDat.push([]);
      //    for (let col = 0; col < step; col++) {
      //       let indexDat = row * step + col;
      //       textDat[row][col] = array[indexDat];
      //    }
      // }

      // textDatFFFF = textDat;

      //преобразуем в массив строк textMatrix с реальными значениями

      let textMatrix = [];
      for (let row = 0; row < totalRows; row++) {

         function to16Binary(num) {
            let result = "";

            if (num < 0) {
               alert("Откуда отрицательное число? Работаем с Uint");
               result = (-num - 1).toString(2);
               result = result.split("");
               for (let i = 0; i < result.length; i++) if (result[i] === "1") result[i] = "0"; else result[i] = "1";
               result[0] = "1";
               //  result = "1" + result.join("");
            } else {
               result = num.toString(2);
               result = zeroString(16 - result.length) + result;
            }

            return result;
         }


         textMatrix.push([]);
         let firstByte, secondByte;
         let number, timeStamp, sign;


         // function from16to32(first, second) {


         // }

         firstByte = to16Binary(array[row * step + 0]);
         if (array[row * step + 1] < 0) {
            sign = true;
            alert("Откуда -?");
         }
         else sign = false;
         secondByte = to16Binary(array[row * step + 1]);

         number = secondByte + firstByte;
         number = parseInt(number, 2);
         textMatrix[row].push(number);

         firstByte = to16Binary(array[row * step + 2]);
         secondByte = to16Binary(array[row * step + 3]);
         if (array[row * step + 3] < 0) {
            alert("Откуда -?");
            sign = true;
         } else sign = false;
         secondByte = to16Binary(array[row * step + 3]);

         timeStamp = [secondByte, firstByte].join("");
         timeStamp = parseInt(timeStamp, 2);

         textMatrix[row].push(timeStamp);

         let left = step - 4;

         for (let col = 0; col < left; col++) textMatrix[row].push(array[row * step + col + 4]);
      }

      // Нахождение аналоговых и дискретных сигналов
      let textMatrixSign = [];

      //номер выборки и время
      for (let row = 0; row < textMatrix.length; row++) {
         function addSign(param) {
            let result;

            if (param > 32767) {
               result = (param - 1).toString(2).split("");
               //result[0] = "1";
               for (let i = 0; i < result.length; i++) if (result[i] === "1") result[i] = "0"; else result[i] = "1";

               // if (result.length === 16 && result[0] === "0") {
               //    result[0] = "1";
               // }
               result = result.join("");
               return -parseInt(result, 2);
            }
            return param;
         }

         textMatrixSign.push([]);
         textMatrixSign[row][0] = textMatrix[row][0];
         textMatrixSign[row][1] = textMatrix[row][1];

         for (let index = 2; index < textMatrix[0].length; index++) {
            textMatrixSign[row][index] = addSign(textMatrix[row][index]);
         }
         // textMatrixSign[row][3] = addSign(textMatrix[row][3]);
      }



      //  `<td class="box" title= "${title}">${d}</td>`

      if (confirm("Открыть данные для дальнейшей обработки: " +
         "\r\nДанные должны представлять значения, разделенные запятой:\r\n" + array)) {
         createTableDatBin(textMatrixSign);
      }

   }
   // } else {
   //    alert("Невозможно преобразовать файл");
   // }
}

function createTableDatBin(data) {
   //let tableDat = data.split(/\r\n/);

   // nDiskr

   tbody = document.getElementById("tableDat");
   tbody.innerHTML = "";

   let tableText = "<thead><tr>"

   //let len = data[0].length;
   function columnIsConstant(data) {
      let param = data[0];
      for (let i = 1; i < data.length; i++) {
         if (param !== data[i]) return false;
      }
      return true;
   }

   let numberDiskr = data[0].length;
   for (index = 0; index < data[0].length; index++) {
      let dataCollumn = [];
      for (ind = 0; ind < data.length; ind++) {
         dataCollumn[ind] = data[ind][data[0].length - index - 1];
      }
      if (columnIsConstant(dataCollumn)) numberDiskr = data[0].length - index;
   }

   let column = numberDiskr;
   for (i = 0; i < column; i++) tableText += `<th class="box">` + Number(1 + i) + "</th>";
   tableText += "</tr></thead>";
   tableText += "<tbody>"
   for (row = 0; row < data.length; row++) {
      tableText += "<tr>";
      for (i = 0; i < column - 1; i++)tableText += "<td>" + data[row][i] + "</td>";

      let str = "";
      for (i = 0; i < data[0].length - column; i++) {
         //  let dataCollumn =
         let param = textDatFFFF[textDatFFFF[0].length - i][i].toString(2);
         str += zeroString(16 - param.length) + param;
      }
      tableText += "<td>" + str + "</td>"

      tableText += "</tr>";
   }

   tableText += "</tbody>"
   tbody.innerHTML = tableText;

}

function createTableHead(data) {
   //for (i = 0; i < textDat.length; i++) textDat[i] = textDat[i].split(",");

   let exeptDiskr = data[0].length;

   //для упрощения находим с какого индекса будем искать дискретные значения
   while (isOneOrZero(data[0][exeptDiskr - 1]) && exeptDiskr > 0) {
      exeptDiskr--;
   }
   // нашли номер exeptDiskr-1, где в матрице не 0 или 1. нроверим, что exeptDiskr 0 или 1 по столбцу exeptDiskr.

   let columnData;
   nDiskr = exeptDiskr;
   for (let col = exeptDiskr; col < data[0].length; col++) {
      columnData = "";
      for (let i = 0; i < data.length; i++) {
         columnData += Number(data[i][col]);
      }
      if (!isOneOrZero(columnData)) nDiskr = col + 1;
   }

   // nDiskr - количество столбцов со значениями отличных от 0 или 1

   const strTr = {
      number: "",
      string: "",
      values: "",
      description: "",
      iecVariable: "",
      typeVariable: "",
   }

   //alert("createTableHead");
   tbody = document.getElementById("table");
   tbody.innerHTML = `<thead>
   <tr>
   <th>№</th>
   <th>Содержимое первой строки</th>
   <th>Значение</th>
   <th>Описание</th>
   <th>Переменная IEC</th>
   <th>Тип переменной</th>
   </tr>
   </thead>`;

   function insertTr(tr) {
      function stringToRows(string) {
         let result = "";
         for (let i = 0; i < string.length - 1; i++) result += string[i] + "<br>";
         return result + string[string.length - 1];
      }

      tbody.innerHTML += `<tr>
      <th>${tr.number}</th>
      <td>${tr.string}</td>
      <td>${stringToRows(tr.values)}</td>
      <td>${stringToRows(tr.description)}</td>
      <th>${stringToRows(tr.iecVariable)}</th>
      <th>${typeVerification(tr.typeVariable, tr.string)}</th>
   </tr>`;
   }

   let index = 0;

   strTr.number = index + 1;
   strTr.string = [data[0][index].trim()];
   strTr.values = ["" + (Number(data[0][index]))];
   strTr.description = ["Номер выборки"];
   strTr.iecVariable = ["n"];
   strTr.typeVariable = ["crit, int, minL=1, maxL=10, [1...9999999999]"];
   insertTr(strTr);
   index++;

   strTr.number = index + 1;
   strTr.string = [data[0][index].trim()];
   strTr.values = ["" + Number(data[0][index])];
   strTr.description = ["Метка времени"];
   strTr.iecVariable = ["timestamp"];
   strTr.typeVariable = ["nCrit, int, minL=1, maxL=13"];
   insertTr(strTr);
   index++;

   for (let ind = 2; ind < nDiskr; ind++) {
      strTr.number = ind + 1;
      strTr.string = [data[0][ind].trim()];
      strTr.values = [Number(data[0][ind])];
      strTr.description = ["Аналоговый канал N" + (ind - 1)];
      strTr.iecVariable = ["A<sub>" + (ind - 1) + "</sub>"];
      strTr.typeVariable = ["nCrit, float, minL=1, maxL=13"];
      insertTr(strTr);
      index++;
   }

   if (nDiskr < data[0].length) {
      strTr.number = index + 1;
      strTr.string = ""; strTr.values = ["-"];
      for (let ind = nDiskr; ind < data[0].length; ind++) {
         strTr.string += data[0][ind] + ",";
         // strTr.values += [data[0][ind]];
      }
      strTr.string = strTr.string.slice(0, -1);

      strTr.description = ["Дискретные сигналы"];
      strTr.iecVariable = ["D<sub>1</sub>...D<sub>" + (data[0].length - nDiskr) + "</sub>"];
      strTr.typeVariable = ["nCrit, minL=1, maxL=1"];
      insertTr(strTr);
   }
}

function isSequence(array) {
   let result = true;
   for (i = 1; i <= array.length; i++) if (array[i] !== array[i - 1] + 1) result = false;
   return result;
}

function isOneOrZero(array) {
   let result = true;
   for (i = 0; i < array.length; i++) if (array[i] !== "0" && array[i] !== "1") result = false;
   return result;
}
//нахождение максимального/минимального значения массива Math.max / Math.min

function createTableDat(data) {
   //let tableDat = data.split(/\r\n/);

   // nDiskr
   tbody = document.getElementById("tableDat");
   tbody.innerHTML = "";

   let tableText = "<thead><tr>"

   let len = data[0].length;

   let column = nDiskr + 1;
   for (i = 0; i < column; i++) tableText += "<th>" + Number(1 + i) + "</th>";
   tableText += "</tr></thead>";
   tableText += "<tbody>"


   for (row = 0; row < data.length; row++) {
      tableText += "<tr>";
      for (i = 0; i < column - 1; i++)tableText += "<td>" + data[row][i] + "</td>";
      let str = "";
      for (let i = nDiskr; i < len; i++) str += data[row][i];// + ",";
      // str = str.slice(0, -1);
      tableText += "<td>" + str + "</td>";
      tableText += "</tr>";
   }

   tableText += "</tbody>"
   tbody.innerHTML = tableText;

   // tbody.innerHTML = `<thead>
   // <tr>
   // <th>№</th>
   // <th>Содержимое строки</th>
   // <th>Значение</th>
   // <th>Описание</th>
   // <th>Переменная IEC</th>
   // <th>Тип переменной</th>
   // </tr>
   // </thead>`;
}