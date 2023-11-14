const video = document.getElementById("video");
const isScreenSmall = window.matchMedia("(max-width: 700px)");
let predictedAges = [];

var expresArray = []; // arreglo de emociones detectadas


Promise.all([
  //cambia la url de archivo
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("/models"),
  faceapi.nets.ageGenderNet.loadFromUri("/models")
]).then(startVideo);

function startVideo() {
  navigator.getUserMedia( //llama la camara web
    { video: { width: { exact: 1280 }, height: { exact: 720 } } },
    stream => (video.srcObject = stream),
    err => console.error(err)
  );
}

function screenResize(isScreenSmall) {
  if (isScreenSmall.matches) {
    
    video.style.width = "320px";
  } else {
    video.style.width = "780px";
  }
}

screenResize(isScreenSmall); 
isScreenSmall.addListener(screenResize);

video.addEventListener("playing", () => {
  //console.log("playing called");
  const canvas = faceapi.createCanvasFromMedia(video);
  let container = document.querySelector(".container-cam");
  container.append(canvas);

  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi
      .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions()
      .withAgeAndGender();

    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    //console.log(resizedDetections);

    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    if (resizedDetections && Object.keys(resizedDetections).length > 0) {
      const age = resizedDetections.age;
      const interpolatedAge = interpolateAgePredictions(age);
      const gender = resizedDetections.gender;
      const expressions = resizedDetections.expressions;
      const maxValue = Math.max(...Object.values(expressions));
      const emotion = Object.keys(expressions).filter(
        item => expressions[item] === maxValue
      );
    
      // actualiza tiempo real
      document.getElementById("age").innerText = ` ${interpolatedAge.toFixed(2)}`;
      document.getElementById("gender").innerText = `${gender}`;
      document.getElementById("emotion").innerText = `${emotion[0]}`;

      expresArray.push(emotion[0]);
    }
  }, 10); //time refresh
});

// mostrar año
function interpolateAgePredictions(age) {
  predictedAges = [age].concat(predictedAges).slice(0, 30);
  const avgPredictedAge =
    predictedAges.reduce((total, a) => total + a) / predictedAges.length;
  return avgPredictedAge;
}

//proceso

var app = angular.module('myApp', ['zingchart-angularjs']);
app.controller('ListController', function ($scope, $window) {

  $scope.ItemsDetails = [];  //inicializan las matrices de resultados
  $scope.itemsDetails = [];
  $scope.totalf = 0;

  $scope.verEmociones= function(){
    $scope.keys = ['',];
    $scope.values = [0,];
    var ascval = [0,];
    //console.log($window.expresArray)
    $scope.reset();
    $scope.expresArray = $window.expresArray; //trae los resultados y lo carga en scope
    var total = 0;
    const counts = {};

    expresArray.forEach((x) => { counts[x] = (counts[x] || 0) + 1; });
    
    var keys = Object.keys(counts);
    var values = Object.values(counts);

    //calcula total
    for (let e = 0; e < values.length; e++) {
      total = total + values[e]
    }

    // (cantidad/total)*100 porcentaje
    for (let i = 0; i < keys.length; i++) {

      let rs = (values[i] / total) * 100
      $scope.itemsDetails.push({
        name:keys[i],
        value:values[i],
        porcent:rs.toFixed(3)
      });
      if (keys[i] == 'neutral') {
        // $scope.keys.push(keys[i]);
        // $scope.values.push(0);
      } else if (keys[i] == 'happy') {
        // $scope.keys.push(keys[i]);
        // $scope.values.push(0);
      } else {
        $scope.keys.push(keys[i]);
        $scope.values.push(parseInt(rs));
        let nps = (85 / 100) * parseInt(rs);
        ascval.push(parseInt(nps));
      }
    }
    ascval = ascval.sort((a, b)=>{ return a - b;});
    $scope.keys.push('');
    $scope.values.push(0);
    let lsc = ascval.pop();
    ascval.push(lsc);
    ascval.push(lsc);
    $scope.totalf=total;

    //result
    $scope.acumulado = ascval.slice(-1);
    /////chart................
    $scope.myJson = {
      title: {
        text: "ESTRES DETECTADO",
        fontSize: 16,
        fontColor: "#fff"
      },
      backgroundColor: "#2bbb9a",
      globals: {
        shadow: false,
        fontFamily: "Arial"
      },
      type: "mixed",
      scaleX: {
        maxItems: 8,
        lineColor: "white",
        lineWidth: "1px",
        label: {
          text: "EMOTIONS", //Titulo de eje x
          fontSize: 12,
        },
        tick: {
          lineColor: "white",
          lineWidth: "1px"
        },
        item: {
          fontColor: "white",
          fontSize: 12,
        },
        guide: {
          visible: false
        },
        labels: $scope.keys
      },
      scaleY: {
        lineColor: "white",
        lineWidth: "1px",
        values: "0:100:5",
        format: "%v%",
        label: {
          text: "STRESS", // Titulo de eje y
          fontSize: 10,
        },
        tick: {
          lineColor: "white",
          lineWidth: "1px"
        },
        guide: {
          lineStyle: "solid",
          lineColor: "#249178",
          'line-style': "dotted"
        },
        item: {
          fontColor: "white",
          fontSize: 10
        },
      },
      tooltip: {
        visible: false
      },
      crosshairX: {
        lineColor: "#fff",
        scaleLabel: {
          backgroundColor: "#fff",
          fontColor: "#323232"
        },
        plotLabel: {
          backgroundColor: "#fff",
          fontColor: "#323232",
          text: "%v",
          borderColor: "transparent"
        }
      },
      legend: {

      },
      plot: {
        lineWidth: "2px",
        lineColor: "#FFF",
        aspect: "spline",
        marker: {
          visible: false
        },
        tooltip: {
          text: "%t<br>%v"
        }
      },
      series: [
        { type: 'bar', 'bar-width': "40%", values: $scope.values, text: "Emotion lvl", },
        {
          type: 'line', values: ascval, 'line-color': "#eb042b", text: "Stress %", marker: {
            'background-color': "purple",
            size: 5
          } },
      ]
    }
  }
  $scope.reset = function () {
    $scope.itemsDetails = angular.copy($scope.ItemsDetails);
  };
});
