var SVM = require('main.js');

const svm = new cv.SVM({
  kernelType: cv.ml.SVM.RBF,
  c: 12.5,
  gamma: 0.50625
});
/////////////////////////////////////////////// hace comparaciones de las expresiones
const { Image } = require('image-js');
const hog = require('hog-features');

const file = __dirname + '/__test__/defaul.png';

Image.load(file).then(function (image) {
    var descriptor = hog.extractHOG(image);
    console.log(descriptor);
});
//////////////////////////////////////////////////////
var options = {
    C: 0.01,
    tol: 10e-4,
    maxPasses: 10,
    maxIterations: 10000,
    kernel: 'rbf',
    kernelOptions: {
        sigma: 0.5
    }
};

var features = [[0, 0], [0, 1], [1, 1], [1, 0]];
var labels = [1, -1, 1, -1];
svm.train(features, labels);

var margins = svm.margin(features);

svm.predict(features); // [1, -1, 1, -1]

var supportVectors = svm.supportVectors();

var model = svm.toJSON();

var importedSvm = SVM.load(model);
importedSvm.predict(features);

const trainDataPath = '../node_modules/ml-svm/src/traindata';
const testDataPath = '../node_modules/ml-svm/src/testdata';

const lccs = Array(26).fill(97).map((v, i) => v + i).map(ascii => String.fromCharCode(ascii));

const data = lccs.map((letter) => {
  const trainDataDir = `${trainDataPath}/${letter}`;
  const testDataDir = `${testDataPath}/${letter}`;
  const train = fs.readdirSync(trainDataDir).map(file => `${trainDataDir}/${file}`);
  const test = fs.readdirSync(testDataDir).map(file => `${testDataDir}/${file}`);
  return ({ train, test });
});