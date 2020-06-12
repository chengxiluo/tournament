// add 2 tasks for training // the number of tasks is actually + 1, it's a 0-based index
const NUMBER_OF_TASKS_IN_EXPERIMENT = 5 + 2;

const reorder =  (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const randomString = (length) => {
  return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
};

const randomAlphanumericString = (length, chars) => {
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

const getNextPage = (conditionOrder, conditionNum) => {
  var condition = conditionOrder[conditionNum];
  switch (condition){
    case "t":
      return "PickTwoTextResults_new";
    case "a":
      return "PickTwoAudioResults_new";
    case "i":
      return "PickTwoImageResults_new";
  }
  return null;
}

const shuffle = (array) => {
  var m = array.length, t, i;
  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

const dictToURLParams = (parameters) => {
  var keys = Object.keys(parameters);
  var paramString = "?";
  keys.forEach((k) => {
    paramString += k + "=" + parameters[k] + "&";
  });

  // console.log("calling dicToURLparams");
  // console.log(paramString);
  return paramString;
}

export { randomAlphanumericString };
export { dictToURLParams };
export { shuffle };
export { getNextPage };
export { reorder };
export { randomString };
export { NUMBER_OF_TASKS_IN_EXPERIMENT };
