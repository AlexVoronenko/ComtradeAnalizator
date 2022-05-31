function typeVerification(str, stringValues) {
   let result = "";

   for (let indexL = 0; indexL < str.length; indexL++) {
      let warning = 0;
      let critical = 0;
      let string = "";
      let params = str[indexL].split(",");
      for (i = 1; i < params.length; i++) {
         let keyW = params[i].trim();

         function rebBluestring(expr) {
            // let result = "";
            // if (expr) {
            //    critical++; return " <span class='redtext'>" + keyW + "</span>, ";
            // } else {
            //    warning++; return " <span class='bluetext'>" + keyW + "</span>, ";
            // }
            // return result;
            if (expr) {
               return keyW + ", ";
            } else {
               //  result += rebBluestring(params[0] === "crit");
               if (params[0] === "crit") {
                  critical++; return " <span class='redtext'>" + keyW + "</span>, ";
               } else {
                  warning++; return " <span class='bluetext'>" + keyW + "</span>, ";
               }
            }
         }

         function correctType(regex) {
            //  let result = "";
            let regExp = new RegExp(regex, "i");
            // if (regExp.test(stringValues[index])) {
            //    result += keyW + ", ";
            // } else {
            //    result += rebBluestring(params[0] === "crit");
            //    if (params[0] === "crit") {
            //       critical++; result += " <span class='redtext'>" + keyW + "</span>, ";
            //    } else {
            //       warning++; result += " <span class='bluetext'>" + keyW + "</span>, ";
            //    }
            // }
            return rebBluestring(regExp.test(stringValues[indexL]));
         }


         switch (keyW) {
            case "char":
               string += correctType("^[a-zA-Z]*$");
               break;
            case "float":
               string += correctType("[+-]?([0-9]*[,.])?[0-9]+([eE][+-]?[0-9]+)?");
               break;
            case "int":
               string += correctType("^[+-]?[0-9]*$");
               //string += keyW + ", ";
               break;
            case "alNum":
               // string += keyW + ", ";
               string += correctType("^[А-ЯЁа-яё\u0020-\u007e]*$");
               break;
            case "num":
               string += correctType("^(?:0|[1-9][0-9]*)$");
               // string += keyW + ", ";
               break;
            default:
               if (keyW.includes("minL=")) {
                  string += rebBluestring(stringValues[indexL].length >= parseInt(keyW.replace(/[^\d]/g, '')));
                  break;
               }
               if (keyW.includes("maxL=")) {
                  string += rebBluestring(stringValues[indexL].length <= parseInt(keyW.replace(/[^\d]/g, '')));
                  break;
               }
               if (keyW.includes("[")) {
                  // string += rebBluestring(stringValues[index].length <= parseInt(keyW.replace(/[^\d]/g, '')));
                  let range = /\[.+\]/.exec(keyW)[0].slice(1, -1);
                  let min = /^[0-9]*/.exec(range)[0];
                  let max = /\.\.\.[0-9]*/.exec(range)[0].substr(3);
                  let appendix = /].*/.exec(keyW)[0].substr(1);

                  if (appendix === "" || appendix === "A" || appendix === "D") {
                     let numberAD;
                     if (appendix === "") string += rebBluestring(stringValues[indexL] >= min && stringValues[indexL] <= max);
                     if (appendix === "A") {
                        let _A = matrixCfg[1][1].slice(-1);
                        numberAD = stringValues[indexL].slice(0, -1);
                        string += rebBluestring(numberAD >= min && numberAD <= max && _A == appendix);
                     }
                     if (appendix === "D") {
                        let _D = matrixCfg[1][2].slice(-1);
                        numberAD = stringValues[indexL].slice(0, -1);
                        string += rebBluestring(numberAD >= min && numberAD <= max && _D == appendix);
                     }
                  } else {
                     string += rebBluestring(0);
                  }
                  break;
               }
               if (keyW.includes("{")) {
                  // string += rebBluestring(stringValues[index].length <= parseInt(keyW.replace(/[^\d]/g, '')));
                  let range = keyW.trim();
                  range = range.slice(1, -1);
                  range = range.split(";");
                  let ok = false;
                  for (let i = 0; i < range.length; i++) {
                     if (range[i].toUpperCase() === stringValues[indexL].toUpperCase()) ok = true;
                  }
                  string += rebBluestring(ok);
                  break;
               }
               if (keyW.includes("(")) {
                  let range = keyW.trim();
                  range = range.slice(1, -1);

                  let date = /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(stringValues[indexL]);
                  let time = /^\d{1,2}:\d{1,2}:\d{2}\.\d{6}$/.test(stringValues[indexL]);

                  string += rebBluestring(date || time);
                  break;
               }
               string += keyW + ", ";
               break;
         }

      }
      string = string.substring(0, string.length - 2);
      if (warning === 0 && critical == 0) {
         string = params[0] + ", " + string + "<br>";
      } else {
         if (params[0] === "crit") {
            criticalCfg += critical;
            string = "<span class='redtext'>crit</span>, " + string + "<br>";
         } else {
            warningCfg += warning;
            string = "<span class='bluetext'>nCrit</span>, " + string + "<br>";
         }
      }
      result += string;
   }
   return result;
}

