const { variableNames, dataTypes, randomStrings } = require("./main-object");
const _ = require("lodash");

function inlineSyntax(str) {
  let variableNamesLocal = _.cloneDeep(variableNames);
  let index = _.random(0, variableNamesLocal.length - 1);
  let randomStringNames = _.cloneDeep(randomStrings);

  let randomizeKeys = arr => {
    let vals = _.shuffle(arr);
    let keys = Object.keys(arr);
    let tmpObj = {};
    for (let i = 0; i < vals.length; i++) {
      tmpObj[keys[i]] = vals[i];
    };
    return tmpObj;
  };

  // Shuffled object with variable names
  let variableNamesForTask = randomizeKeys(variableNamesLocal[index]);
  /////////////// constructor //////////////////////////

  let Challenge = function (varNames) {
    this.varNames = varNames;
    this.usedVarNames = [];
  };

  Challenge.prototype.getKeyNames = function (keysArr) {
    let keyNames = Object.keys(keysArr);
    return getObjKeyValuesInArray(keysArr, keyNames);
  };

  function getObjKeyValuesInArray(obj, keys) {
    let arr = [];
    for (let i = 0; i < keys.length; i++) {
      arr.push(obj[keys[i]]);
    };
    return arr;
  };

  let task = new Challenge(variableNamesForTask);
  task.usableVarNames = task.getKeyNames(task.varNames);

  ///////////////// methods ///////////////////////////////

  function insertRandomStrings(match, p1, p2, p3, offset, string) {
    if (randomStringNames.length === 0) {
      randomStringNames = _.cloneDeep(randomStrings);
    };

    let randomString = randomStringNames.splice(_.random(0, randomStringNames.length - 1), 1);
    return `"${randomString}"`;
  };

  function insertRandomNumbers(match, p1, p2, p3, offset, string) {
    if (!p2) {
      return _.random(0, p1);
    } else {
      p2 = parseInt(p2.replace(/_/g, ''));
      return _.random(p1, p2);
    };
  };

  function replaceVarNames(match, p1, p2, p3, offset, string) {
    let key, type, nameVar, infoVar, member;
    key = p1;
    type = p2;
    group = p3;
    nameVar = task.varNames[key];
    if (group.length > 0) {
      if (type === "O") {
        infoVar = storeVarInfo(offset, nameVar, type, key, undefined, group);
      } else {
        infoVar = storeVarInfo(offset, nameVar, type, key, group, undefined);
      };
    } else {
      infoVar = storeVarInfo(offset, nameVar, type, key);
    };
    checkAndAddToUsedKeys(infoVar);
    return nameVar;
  };

  function declareRandomVars(match, p1, p2, offset, string) {
    let nameVar,
      rnd = _.random(0, task.usableVarNames.length - 1),
      infoVar,
      type,
      member;
    type = p1;
    member = p2;
    nameVar = task.usableVarNames[rnd];

    if (p2.length > 0 && p1.indexOf("K") !== -1) {
      infoVar = storeVarInfo(offset, nameVar, type, undefined, member, undefined);
    } else if (p2.length > 0 && p1.indexOf("O") !== -1) {
      infoVar = storeVarInfo(offset, nameVar, type, undefined, undefined, member);
    } else {
      infoVar = storeVarInfo(offset, nameVar, type);
    };
    checkAndAddToUsedKeys(infoVar);
    return nameVar;
  };

  //////////////////////// Storing variable info inside an global object ///////////////////////////

  function storeVarInfo(
    offset,
    name,
    type,
    key = undefined,
    member = null,
    group = null
  ) {
    let typeArray = [];
    if (key === undefined) {
      let keys = Object.keys(task.varNames);
      for (let i = 0; i < keys.length; i++) {
        if (task.varNames[keys[i]] === name) {
          key = keys[i][0];
        };
      };
    };
    if (type !== undefined && type.length > 1) {
      let tmpArr = type.split("");
      for (let i = 0; i < tmpArr.length; i++) {
        typeArray.push(dataTypes[tmpArr[i]]);
      };
    } else if (type !== undefined && type.length === 1) {
      typeArray = dataTypes[type];
    } else {
      typeArray = "random";
    };

    return {
      startingIndex: offset,
      key,
      name,
      type: typeArray,
      member,
      group
    };
  };

  function checkAndAddToUsedKeys(obj) {
    let isFound = task.usedVarNames.some(function (el) {
      if (el.key === obj.key && el.member === obj.member)
        return true;
    });
    if (!isFound) {
      task.usedVarNames.push(obj);
      task.usableVarNames.splice(task.usableVarNames.indexOf(obj["name"]), 1);
    };
  };
  function isMemberOfArray(checker, container) {
    for (var i = 0; i < checker.length; i++) {
      if (container.indexOf(checker[i]) === -1) return false;
    };
    return true;
  };

  function getSpecificVarTypes(arr, type, beginFrom) {
    let names = {
      O: "object",
      N: "number",
      S: "string",
      A: "array",
      F: "function",
      B: "boolean",
      K: "object_key",
      P: "parametar"
    };

    let tmpObjKeys = [];
    for (let i = 0; i < type.length; i++) {
      tmpObjKeys.push(names[type[i]]);
    };

    let tmp = [];

    arr.forEach(entry => {
      let isMember = isMemberOfArray(tmpObjKeys, entry.type);
      if (isMember && entry.startingIndex < beginFrom && entry.member === null) {
        tmp.push(entry);
      };
    });

    return tmp;
  };
  function getObjectKeyValues(arr, type, beginFrom) {
    let names = {
      O: "object",
      N: "number",
      S: "string",
      A: "array",
      F: "function",
      B: "boolean",
      K: "object_key",
      P: "parametar"
    };

    let tmpObjKeys = [];
    for (let i = 0; i < type.length; i++) {
      tmpObjKeys.push(names[type[i]]);
    };

    let tmp = [];
    arr.forEach(entry => {
      let isMember = isMemberOfArray(tmpObjKeys, entry.type);
      if (isMember && entry.startingIndex < beginFrom) {
        tmp.push(entry);
      };
    });

    return tmp;
  };
  /////////////////////////////  assigment  /////////////////////////

  let jScript = str;

  jScript = jScript.replace(/\$(-?\d+)(_-?\d+)?/g, insertRandomNumbers);

  jScript = jScript.replace(/\$\b(\w)\b/g, replaceVarNames);

  jScript = jScript.replace(
    /\$\b([a-zA-Z]{1})_º([a-zA-Z]+)([0-9]*?)\b/g,
    replaceVarNames
  );

  jScript = jScript.replace(/\$str/g, insertRandomStrings);

  jScript = jScript.replace(/\$rnd_º([a-zA-Z]+)([0-9]*)/g, declareRandomVars);

  jScript = jScript.replace(
    /\$used_º([a-zA-Z]{1})([0-9]).([a-zA-Z])/g,
    (match, p1, p2, p3, offset) => {
      let type, group, indexFrom;
      if (p1 === "O") {
        group = p2;
        type = p3;
        indexFrom = offset;
        let mainObjectName = _.find(task.usedVarNames, ["group", group]);
        let allPosibleMembers = getObjectKeyValues(task.usedVarNames, type, indexFrom);
        let filteredMemberList = _.filter(allPosibleMembers, (el) => {
          if (el.type.indexOf("object_key") != -1 && el.member === group) {
            return el;
          };
        });
        let rnd = _.random(0, filteredMemberList.length - 1);
        return `${mainObjectName.name}.${filteredMemberList[rnd].name}`;
      };
    });

  jScript = jScript.replace(
    /\$used_º([a-zA-Z])x*([0-9])*/g,
    (match, p1, p2, offset, string) => {
      let nameVar, tmpArr, type, indexFrom;
      type = p1;
      indexFrom = offset;
      tmpArr = getSpecificVarTypes(task.usedVarNames, type, indexFrom);
      rnd = _.random(0, tmpArr.length - 1);
      if (p2 === undefined) {
        nameVar = tmpArr[rnd]["name"];
        return nameVar;
      } else {
        nameVar = [];
        for (let i = 0; i < p2; i++) {
          rnd = _.random(0, tmpArr.length - 1);
          nameVar.push(tmpArr[rnd]["name"]);
          tmpArr.splice(rnd, 1);
        };
        return nameVar.join(",");
      };
    });

  jScript = jScript.replace(/\$(var )/g, (match, p1, p2, offset, string) => {
    let chance = _.random(0, 1);
    return chance === 1 ? "var " : "";
  });

  jScript = jScript.replace(
    /\$(num+)([0-9])*/g,
    (match, p1, p2, offset, string) => {
      let nameVar;
      if (p2 === undefined) {
        return _.random(0, 10);
      } else {
        nameVar = [];
        for (var i = 0; i < p2; i++) {
          nameVar.push(_.random(0, 10));
        };
        return nameVar.join(",");
      };
    }
  );

  jScript = jScript.replace(
    /\$(str+)([0-9])*/g,
    (match, p1, p2, offset, string) => {
      let strings = ["foo", "bar", "kme", "lala", "blah", "src"];
      let nameVar;
      if (p2 === undefined) {
        return '"' + strings[_.random(0, strings.length - 1)] + '"';
      } else {
        nameVar = [];
        for (var i = 0; i < p2; i++) {
          let rnd = _.random(0, strings.length - 1);
          let rndStr = strings[rnd];
          nameVar.push(rndStr);
          strings.splice(rnd, 1);
        };
        return '"' + nameVar.join(",") + '"';
      };
    }
  );

  let jScriptOriginal = jScript;
  jScript = 'let result = "";\n' + jScript;
  jScript = jScript.replace(/console.log/g, "result = ");
  jScript += '\n return result;'

  console.log(jScript);
  let finalFunction = new Function(jScript);
    console.log(finalFunction)
  let result = `${finalFunction()}`;

  console.log('final function:', finalFunction);
  console.log('result', result);

  return {
    function: jScriptOriginal,
    result
  };
};

module.exports = {
  inlineSyntax
};
