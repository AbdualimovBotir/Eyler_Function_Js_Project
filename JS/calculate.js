var step;
var derivEquation;
var x;
var y;
var finalX;
var nextY;
var slope;
var parenthesis = 'keep';
var implicit = 'hide';
var points = [];
var yPoints = [];
var xPoints = [];
var fractions = true;
var precision = 14;

function setVars(e) {
    if (e.keyCode == 13) {
        preload();
    }
}

function preload(){
    reset();
    step = math.eval(document.getElementById("step").value);
    derivEquation = document.getElementById("diff-eq").value;
    x = math.eval(document.getElementById("x").value);
    y = math.eval(document.getElementById("y").value);
    finalX = math.eval(document.getElementById("finalX").value);
    nextY = y;
        
    if (step == 0){
        document.getElementById("err-msg").innerHTML = "Xato: Haqiqatan ham qadam o'lchamingizni 0 ga o'rnatmoqchimisiz? Bu sahifani yopishda omad tilaymiz... keyinroq yana urunishingiz mumkin.";
        return;
    }    
    calculateLite(); 
    calculate();
    calculateError();
}
function reset(){
    points = []; 
    betterPoints = []; 
    yPoints = [];
    yPointsLite = [];
    errorData = [];
    xPoints = [];

    var canvas = document.getElementById("eulerChart");
    canvas.remove(0);
    var canvasContainer = document.getElementById("chart-container");
    canvasContainer.innerHTML = "<canvas id='eulerChart' width='250px' height='200px'> </canvas>";
    ctx = document.getElementById("eulerChart");
    
    var errorCanvas = document.getElementById("errorChart");
    errorCanvas.remove(0);
    var errorCanvasContainer = document.getElementById("error-chart-container");
    errorCanvasContainer.innerHTML = "<canvas id='errorChart' width='250px' height='200px'> </canvas>";
    errorCtx = document.getElementById("errorChart");
    
    document.getElementById("err-msg").innerHTML = "";
    document.getElementById("notif-msg").innerHTML = "";
    
    var outputTable = document.getElementById('output');
    var rowCount = outputTable.rows.length;
    while (--rowCount) outputTable.deleteRow(rowCount); 
}

function calculate() {
    var start = x;
    for (var i = start; x < finalX; i++) {
        yPoints.push(y);
        xPoints.push(x);
        try {
            slope = math.eval(derivEquation,
            scope = {
                x: x,
                y: y
            });
        }
        catch(err){
            document.getElementById("err-msg").innerHTML = "Xato: qaysidir nuqtada funksiyangiz aniqlanmagan qiymatga baholandi. Ehtimol, 0 ga bo'linish xatosi, lekin siz ko'proq etiborli bo'lishingiz kerak.";
            makeChart();
            calculateError();
            makeErrorChart;
            return;
        }
        nextY = math.add(nextY, math.multiply(slope, step));
        addNewRow(i);
        points.push(new point(x, y));
        x = math.add(x, step);
        y = nextY;
    }
    yPoints.push(y);
    xPoints.push(x);
    points.push(new point(x, y));
    makeChart();
}

function addNewRow(iter) {
    var table = document.getElementById("output");
    var row = table.insertRow();
    var derivEq = row.insertCell(0);
    var nextYEq = row.insertCell(1);

    prettyPrintEverything(derivEq, nextYEq, iter);
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
}

function latexify(s, b) {
    if (b === true) s = printRatio(s);

    var node = math.parse(s);
    return node ? node.toTex({
        parenthesis: parenthesis,
        implicit: implicit
    }) : '';
}

function prettyPrintEverything(derivCell, nextYCell, iterNum) {
    var derivReplace = derivEquation.replace("x", " " + printRatio(x) + " ").replace("y", " " + printRatio(y) + " ");
    while (derivReplace.includes("x")){
        derivReplace = derivReplace.replace("x", " " + printRatio(x) + " ");
    }
    
    while (derivReplace.includes("y")){
        derivReplace = derivReplace.replace("y", " " + printRatio(y) + " ");
    }
    
    derivCell.innerHTML = '<p1>$$' + "y'(" + latexify(x, true) + "," + latexify(y, true) + ") = " + latexify(derivReplace, false) + " = " + latexify(slope, true) + '$$</p1>';

    var subNum = (iterNum+1);
    nextYCell.innerHTML = '<p1>$$' + "y_{"+ (subNum) + "}=" + latexify(y, true) + " + (" + latexify(slope, true) + ")" + latexify(step, true) + " = " + latexify(nextY, true) + '$$</p1>';
}

function printRatio(value) {
    if (fractions == true){
        var valFraction;

        try {
            if (value == "Infinity") throw "Xato: funktsiyangiz cheksizlikka juda tez yaqinlashdi! Sizning kompyuteringiz bunday miqyosdagi raqamlar bilan ishlash uchun yetarli darajada rivojlangan emas.";
            if (math.isNaN(value)) throw "Xato: qaysidir nuqtada funksiyangiz aniqlanmagan qiymatga baholandi. Ehtimol, 0 ga bo'lish xatosi, lekin etiborli bo'lishingiz kerak.";
            valFraction = math.fraction(value);
        }
        catch(err){
            document.getElementById("err-msg").innerHTML = err;
            makeChart();
            calculateError();
            makeErrorChart;
        }

        if (value != 0){
            if (valFraction.d === 1){
                return math.format(value, {precision: precision}); 
            }

            return math.format(valFraction, {
                fraction: 'ratio'
            });
        }

        return 0;
    }
    else if (fractions==false){
        return math.format(value, {precision: precision});
    }
}

function getPrecision(e){
    if (e.keyCode == 13) {
        document.getElementById("err-msg").innerHTML = "";
        precision = document.getElementById("prec").value;
        if (precision > 14){ 
            document.getElementById("err-msg").innerHTML = "Xato: Nima uchun sizga shunchalik aniqlik kerak? O'zingizga superkompyuter sotib oling.";
            precision = 14;
        }
        else if (precision < 1){
            document.getElementById("err-msg").innerHTML = "Xato: Qanday qilib siz 0 yoki salbiy aniqlikka ega bo'lishingiz mumkin?";
            precision = 1;
        }
        document.getElementById("notif-msg").innerHTML = "Aniqlik belgilangan " + precision;
        
        preload();
    }
}


