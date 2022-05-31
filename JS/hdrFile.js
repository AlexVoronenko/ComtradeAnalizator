document.addEventListener("DOMContentLoaded", function () {

   if (localStorage["dataHdr"]) {
      let hdrData = JSON.parse(localStorage["dataHdr"]);
      let fileNameCurrent = localStorage["fileName"];
      localStorage.removeItem("dataHdr");
      localStorage.removeItem("fileName");
      document.getElementById("out").innerHTML = "Имя файла: <b>" + fileNameCurrent + "</b>";
      let textData = document.getElementById("textArea");
      textData.innerHTML = hdrData;

      textData.style.height = textData.scrollHeight + "px";

   }

});