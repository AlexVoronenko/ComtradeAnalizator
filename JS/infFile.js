document.addEventListener("DOMContentLoaded", function () {

   if (localStorage["dataInf"]) {
      let hdrData = JSON.parse(localStorage["dataInf"]);
      let fileNameCurrent = localStorage["fileName"];
      localStorage.removeItem("dataInf");
      localStorage.removeItem("fileName");
      document.getElementById("out").innerHTML = "Имя файла: <b>" + fileNameCurrent + "</b>";
      let textData = document.getElementById("textArea");
      textData.innerHTML = hdrData;
      textData.style.height = textData.scrollHeight + "px";
   }

});