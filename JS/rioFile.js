let matrixRio;
let rioStructure;
let fileNameCurrent;

document.addEventListener("DOMContentLoaded", function () {
   debugger;
   if (localStorage["dataRio"]) {
      matrixRio = JSON.parse(localStorage["dataRio"]);
      fileNameCurrent = localStorage["fileName"];

      localStorage.removeItem("dataRio");
      localStorage.removeItem("fileName");

      document.getElementById("out").innerHTML = "Имя файла: <b>" + fileNameCurrent + "</b><hr>";
      alert("stop");
      //  + outText + "<hr>";
      // etractCfg();
      // createTableCfg();
      // detectAsciiBinary();
      rioStructure = createRioStruc(matrixRio);

   }
})


function showDiv(divName) {
   let idDiv = document.getElementById(divName);
   if (idDiv.style.display === "none") {
      idDiv.style.display = "block";
   }
   else { idDiv.style.display = "none"; }
}
function callButtonInsideFrame(nameFunction) {
   let iFrame = document.getElementById("iframeRIO");
   iFrame.contentWindow.postMessage(nameFunction, "*");
}

function ChangeRza() {
   //???????????????????????????????????? 
   //  rioStructure = createRioStruc(matrixRio);
   //  addSvgData(rioStructure);
   //  createSvgD3(rioStructure);
   let customers = {
      "rel650_ZQDPDIS.html": "REL650_ZQDPDIS (ABB)",
      "rel670_ZMFPDIS.html": "REL670_ZMFPDIS (ABB)",
      "rel670_ZMQPDIS.html": "REL670_ZMQPDIS (ABB)",
      "micomP54x.html": "MICOM P54x (Schider Electric)",
      "d60.html": "UR D60 (GE)",
      "mp771.html": "MP771(БЭМН)",
      "sel421.html": "SEL-421 (SEL)",
      "pcs902_Q21.html": "PCS-902_21Q (NR)",
      "rel511.html": "REL-511 (ABB)",
      "ekra2704_016.html": "2704_016 305 ('ЭКРА')"
      // "7sa522.html": "7SA522 (Siemens)" 
      // "p443.html":"MICOM P443 (MICOM)" 
   }
   let rza = document.getElementById("customerSelect").options;
   let iframeRIO = document.getElementById("iframeRIO");
   iframeRIO.src = "./htmlTemplate/" + rza[rza.selectedIndex].value;
   //  document.getElementById("outRio").innerHTML = "Идет редактирование уставок ...\nДля генерации файла нажми кнопку СОЗДАТЬ RIO ИЗ УСТАВОК";
   // alert("change: " + rza[rza.selectedIndex].value);
}

function createSvgD3(zoneRioArray) {




}
