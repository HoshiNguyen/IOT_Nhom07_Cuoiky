//existin value var
var R1 = 0;
var R2 = 0;
var Y1 = 0;
var Y2 = 0;
var G1 = 0;
var G2 = 0;
var stop = 0;
var namemode = "normal";

// auto close alert in ms
function tempAlert(msg, duration) {
  var el = document.createElement("div");
  el.setAttribute(
    "style",
    "position:absolute;top:40%;left:20%;background-color:white;"
  );
  el.innerHTML = msg;
  setTimeout(function () {
    el.parentNode.removeChild(el);
  }, duration);
  document.body.appendChild(el);
}

function turnOnByID(id) {
  if (id == "red1" || id == "red2" || id == "red3" || id == "red4") {
    document.getElementById(id).style.backgroundColor = "red";
  } else if (
    id == "yellow1" ||
    id == "yellow2" ||
    id == "yellow3" ||
    id == "yellow4"
  ) {
    document.getElementById(id).style.backgroundColor = "yellow";
  } else {
    document.getElementById(id).style.backgroundColor = "green";
  }
}

// turn off the bulb and stop display it value
function turnOffByID(id) {
  document.getElementById(id).style.backgroundColor = "grey";
  document.getElementById(id).innerHTML = "";
}

// turn on in seconds and display in seconds
function turnOnInSecond(second, id) {
  var i = 0;
  var interval = setInterval(
    function () {
      turnOnByID(id);
      document.getElementById(id).innerHTML = second - i;
      i++;
      if (i > second || stop == 1) {
        // console.log("clear interval in turnOnInsecond");
        turnOffByID(id);
        clearInterval(interval);
      }
    },
    1000,
    second,
    id
  );
}

// control the traffic light with existing data
function trafficLightControl(R1, R2, Y1, Y2, G1, G2) {
  console.log(" light control ------------");
  var timeout1;
  var timeout2;
  var timeout3;
  var timeout4;

  turnOnInSecond(R1, "red1");
  turnOnInSecond(R1, "red3");

  timeout1 = setTimeout(function () {
    turnOnInSecond(G1, "green1");
    turnOnInSecond(G1, "green3");
  }, R1 * 1000);

  timeout2 = setTimeout(function () {
    turnOnInSecond(Y1, "yellow1");
    turnOnInSecond(Y1, "yellow3");
  }, (R1 + G1) * 1000);

  turnOnInSecond(G2, "green2");
  turnOnInSecond(G2, "green4");

  timeout3 = setTimeout(function () {
    turnOnInSecond(Y2, "yellow2");
    turnOnInSecond(Y2, "yellow4");
  }, G2 * 1000);

  timeout4 = setTimeout(function () {
    turnOnInSecond(R2, "red2");
    turnOnInSecond(R2, "red4");
  }, (Y2 + G2) * 1000);

  var interval = setInterval(function () {
    if (stop == 1) {
      clearIntervalMain();
      clearTimeoutControl(timeout1, timeout2, timeout3, timeout4);
      clearInterval(interval);
    }
  }, 1000);
}

function clearTimeoutControl(timeout1, timeout2, timeout3, timeout4) {
  clearTimeout(timeout1);
  clearTimeout(timeout2);
  clearTimeout(timeout3);
  clearTimeout(timeout4);

  var mytimeout = setTimeout(function () {
    stop = 0;
  }, 2500);
  // console.log("clear time out all");
}

// display existing value
function displayLightValue() {
  document.getElementById("current-name").innerHTML =
    "Chế độ hiện tại: " + namemode;
  document.getElementById("read-g1").innerHTML = "G1 = " + G1 + ";";
  document.getElementById("read-g2").innerHTML = "G2 = " + G2 + ";";
  document.getElementById("read-y1").innerHTML = "Y1 = " + Y1 + ";";
  document.getElementById("read-y2").innerHTML = "Y2 = " + Y2 + ";";
  document.getElementById("read-r1").innerHTML = "R1 = " + R1 + ";";
  document.getElementById("read-r2").innerHTML = "R2 = " + R2 + ";";
}
// clear data display by list
function clearData() {
  document.getElementById("list").innerHTML = "";
  stdNo = 0;
}

function addItemsToList(name, G1, Y1, R1, G2, Y2, R2) {
  var ul = document.getElementById("list");

  var nametmp = document.createElement("li");
  var G1tmp = document.createElement("li");
  var Y1tmp = document.createElement("li");
  var R1tmp = document.createElement("li");
  var G2tmp = document.createElement("li");
  var Y2tmp = document.createElement("li");
  var R2tmp = document.createElement("li");

  nametmp.innerHTML = "Name: " + name;
  G1tmp.innerHTML = "Green1 = " + G1;
  Y1tmp.innerHTML = "Yellow1 = " + Y1;
  R1tmp.innerHTML = "Red1 = " + R1;
  G2tmp.innerHTML = "Green2 = " + G2;
  Y2tmp.innerHTML = "Yellow2 = " + Y2;
  R2tmp.innerHTML = "Red2 = " + R2 + "<br><br>";

  ul.appendChild(nametmp);
  ul.appendChild(G1tmp);
  ul.appendChild(Y1tmp);
  ul.appendChild(R1tmp);
  ul.appendChild(G2tmp);
  ul.appendChild(Y2tmp);
  ul.appendChild(R2tmp);
}

function FetchAllData() {
  firebase
    .database()
    .ref("mode")
    .once("value", function (snapshot) {
      snapshot.forEach(function (ChildSnapshot) {
        let name = ChildSnapshot.val().name;
        let G1 = ChildSnapshot.val().G1;
        let Y1 = ChildSnapshot.val().Y1;
        let R1 = ChildSnapshot.val().R1;
        let G2 = ChildSnapshot.val().G2;
        let Y2 = ChildSnapshot.val().Y2;
        let R2 = ChildSnapshot.val().R2;
        addItemsToList(name, G1, Y1, R1, G2, Y2, R2);
      });
    });
}

//update value by name
function getDataByName(checkname) {
  firebase
    .database()
    .ref("mode")
    .once("value", function (snapshot) {
      snapshot.forEach(function (ChildSnapshot) {
        if (checkname == ChildSnapshot.val().name) {
          G1 = ChildSnapshot.val().G1;
          Y1 = ChildSnapshot.val().Y1;
          R1 = ChildSnapshot.val().R1;
          G2 = ChildSnapshot.val().G2;
          Y2 = ChildSnapshot.val().Y2;
          R2 = ChildSnapshot.val().R2;
        }
      });
    });
}

var check = 0;
function checkInvalidName(checkname) {
  firebase
    .database()
    .ref("mode")
    .once("value", function (snapshot) {
      snapshot.forEach(function (ChildSnapshot) {
        if (checkname == ChildSnapshot.val().name) {
          check = 1;
          // namemode = checkname;
        }
      });
    });
  return check;
}

// write data to firebase
function addDataToFirebase(name, G1new, Y1new, R1new, G2new, Y2new, R2new) {
  firebase.database().ref("mode").push({
    name: name,
    G1: G1new,
    Y1: Y1new,
    R1: R1new,
    G2: G2new,
    Y2: Y2new,
    R2: R2new,
  });
}

// write data form to firebase
function addFormDataToFirebase() {
  var nameform = document.getElementById("name-inp").value;
  var R1form = document.getElementById("Red1-inp").value;
  var R2form = document.getElementById("Red2-inp").value;
  var Y1form = document.getElementById("Yellow1-inp").value;
  var Y2form = document.getElementById("Yellow2-inp").value;
  var G1form = document.getElementById("Green1-inp").value;
  var G2form = document.getElementById("Green2-inp").value;

  if (
    isEmptyValue(nameform) ||
    isEmptyValue(R1form) ||
    isEmptyValue(Y1form) ||
    isEmptyValue(G1form) ||
    isEmptyValue(R2form) ||
    isEmptyValue(Y2form) ||
    isEmptyValue(G2form)
  ) {
    alert("Can't add empty value to database!");
  } else if (
    isLessThan0(nameform) ||
    isLessThan0(R1form) ||
    isLessThan0(Y1form) ||
    isLessThan0(G1form) ||
    isLessThan0(R2form) ||
    isLessThan0(Y2form) ||
    isLessThan0(G2form)
  ) {
    alert("Can't add negative value to database!");
  } else {
    R1form = parseInt(R1form);
    Y1form = parseInt(Y1form);
    G1form = parseInt(G1form);
    R2form = parseInt(R2form);
    Y2form = parseInt(Y2form);
    G2form = parseInt(G2form);
    addMode(nameform, R1form, Y1form, G1form, R2form, Y2form, G2form);
  }
}

// add new mode
function addMode(name, G1new, Y1new, R1new, G2new, Y2new, R2new) {
  checkInvalidName(name);
  const mytimeout = setTimeout(function () {
    createModeIfInvalid(name, G1new, Y1new, R1new, G2new, Y2new, R2new);
  }, 2000);
}

// check invalid name before create new mode
function createModeIfInvalid(name, G1new, Y1new, R1new, G2new, Y2new, R2new) {
  if (check == 1) {
    alert("This name is already used by an existing mode!");
    check = 0;
  } else {
    addDataToFirebase(name, G1new, Y1new, R1new, G2new, Y2new, R2new);
    alert("Add data to database successful!");
    clearForm();
  }
}

// check empty value form
function isEmptyValue(checkvar) {
  if (checkvar == "") {
    return 1;
  }
  return 0;
}

//check value less than 0
function isLessThan0(checkvar) {
  if (checkvar < 0) {
    return 1;
  }
  return 0;
}

function showForm(cls) {
  document.getElementsByClassName(cls)[0].style.display = "block";
}

function hideForm(cls) {
  document.getElementsByClassName(cls)[0].style.display = "";
}

//show 1 form only
function show1Form(cls) {
  if (document.getElementsByClassName(cls)[0].style.display == "block") {
    hideForm("form-select");
    hideForm("form-create");
    hideForm("form-delete");
    return;
  }

  if (cls == "form-select") {
    showForm("form-select");
    hideForm("form-create");
    hideForm("form-delete");
  } else if (cls == "form-create") {
    hideForm("form-select");
    showForm("form-create");
    hideForm("form-delete");
  } else {
    hideForm("form-select");
    hideForm("form-create");
    showForm("form-delete");
  }
}

// hide and clear all form if it not empty
function hideAndClearForm() {
  
  const mytimeout = setTimeout(function () {
    if (
      document.getElementById("name-select").value == "" &&
      document.getElementById("name-delete").value == "" &&
      ((document.getElementById("name-inp").value == "" ||
      document.getElementById("Red1-inp").value == "" ||
      document.getElementById("Red2-inp").value == "" ||
      document.getElementById("Yellow1-inp").value == "" ||
      document.getElementById("Yellow2-inp").value == "" ||
      document.getElementById("Green1-inp").value == "" ||
      document.getElementById("Green2-inp").value == "") || (
      document.getElementById("Red1-inp").value < 0 ||
      document.getElementById("Red2-inp").value < 0 ||
      document.getElementById("Yellow1-inp").value < 0 ||
      document.getElementById("Yellow2-inp").value < 0 ||
      document.getElementById("Green1-inp").value < 0 ||
      document.getElementById("Green2-inp").value < 0)) || check == 1
    ) {
      console.log('da return');
      return;
    }
    else {
      clearForm();
      document.getElementById("name-select").value = "";
      document.getElementById("name-delete").value = "";
      hideForm("form-select");
      hideForm("form-create");
      hideForm("form-delete");
    }
  }, 1500);
  
}

// clearForm
function clearForm() {
  document.getElementById("name-inp").value = "";
  document.getElementById("Red1-inp").value = "";
  document.getElementById("Red2-inp").value = "";
  document.getElementById("Yellow1-inp").value = "";
  document.getElementById("Yellow2-inp").value = "";
  document.getElementById("Green1-inp").value = "";
  document.getElementById("Green2-inp").value = "";
}

function deleteModeByName(name) {
  if (name == "") {
    alert("Can't delete empty mode!");
    return;
  }
  var deleted = 0;
  firebase
    .database()
    .ref("mode")
    .once("value", function (snapshot) {
      snapshot.forEach(function (ChildSnapshot) {
        if (name == ChildSnapshot.val().name) {
          firebase.database().ref("mode").child(ChildSnapshot.key).remove();
          alert('Mode with name "' + name + '" is deleted!');
          deleted = 1;
          return;
        }
      });
    });
  const mytimeout = setTimeout(function () {
    if (deleted == 0) {
      alert("Can't delete mode because '" + name + "' does not exist!");
    }
  }, 1000);
}

function deleteModeByNameUserInp() {
  var nameDel = document.getElementById("name-delete").value;
  deleteModeByName(nameDel);
}

function selectMode() {
  var name = document.getElementById("name-select").value;

  if (name == "") {
    alert("Can't seclect empty mode!");
    return;
  }
  checkInvalidName(name);
  const mytimeout = setTimeout(function () {
    if (check == 0) {
      alert("Name not Found!");
    } else {
      check = 0;
      namemode = name;
      alert("Select mode is successful!");
      // console.log("name truoc main " + namemode);
      main();
    }
  }, 1000);
  stop = 1;
}

// main--------------------------------------------------------------------
var intervalMain;

function clearIntervalMain() {
  clearInterval(intervalMain);
  // console.log("clear interval main");
}

function main() {
  getDataByName(namemode);
  const mytimeout = setTimeout(function () {
    displayLightValue();
    var sumTimeOfMode = R1 + Y1 + G1;
    trafficLightControl(R1, R2, Y1, Y2, G1, G2);
    intervalMain = setInterval(function () {
      trafficLightControl(R1, R2, Y1, Y2, G1, G2);
    }, sumTimeOfMode * 1000);
  }, 3000);
}
