
/*

Creates an array of any dimensions:

Examples:
createArray() => []
createArray(2) => new Array(2)
createArray(3, 2) => [new Array(2),
                      new Array(2),
                      new Array(2)]
*/
function createArray(size) {
  const rows = size;
  const array = new Array(rows);

  if (arguments.length > 1) {
    const remainingArgs = Array.prototype.slice.call(arguments, 1);
    for (let i = 0; i < array.length; i++) {
      array[i] = createArray.apply(this, remainingArgs);
    }
  }
  return array;
}

/*
  Checks whether the argument is an array
*/
function isArray(cand) {
  return cand && cand.constructor === Array;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*
  initializes an array of any dimensions, calling the passed in function 'fn' for every element
*/
function initializeArray(arr, fn = v => {
  return v;
}) {
  for (let i = 0; i < arr.length; i++) {
    const el = arr[i];
    if (isArray(el)) {
      initializeArray(el, fn);
    }else {
      arr[i] = fn(i);
    }
  }

  return arr;
}

let trafficMatrix = createArray(10, 10);
trafficMatrix = initializeArray(
  trafficMatrix,
  idx => {
    return getRandomInt(0, 1);
  }
);

console.log('The traffic matrix is....')
console.log(trafficMatrix)
console.log('\n');

console.log('The collision courses of the above traffic matrix is...');
console.log(findCollisionCourses(trafficMatrix));

/*
As an example, look at the matrix

 [0, 0, 0, 0, 0
  0, 0, 0, 0, 0,
  0, 0, 0, 0, 0,
  0, 0, 0, 0, 0,
  0, 0, 0, 0, 0]

Take coordinate (0, 0);
Coordinates in its collision course are (1,1), (2,2), (3,3), (4,4) & (5,5)
Why? Well, since all cars are self driven, they must all be going at the same speed in an intersection
*/
function findCollisionCourses(matrix) {
  const collisionCourses = {};
  matrix.forEach((row, rowIdx) => {
    row.forEach((el, colIdx) => {
      collisionCourses[
        [rowIdx, colIdx]
      ] = findDiagonalsOf(
        matrix,
        [rowIdx, colIdx]
      );
    })
  })

  return collisionCourses;
}

function isUndefined(cand) {
  return typeof cand === 'undefined';
}

//cache ?
function findDiagonalsOf(matrix, [rowIdx, colIdx]) {
  const out = [];
  const [originalRowIdx, originalColIdx] = [rowIdx, colIdx];
  const DIRECTIONS = [
    [1, 1], //bottom right
    [1, -1], //bottom left
    [-1, -1], //top left
    [-1, 1], //top right
  ];

  DIRECTIONS.forEach(direction => {
    while(rowIdx < matrix.length && colIdx < matrix[rowIdx].length) {
      rowIdx += direction[0];
      colIdx += direction[1];

      const collisionCand = matrix[rowIdx] && matrix[rowIdx][colIdx];

      if (isUndefined(collisionCand)) {
        break;
      }

      if (collisionCand === 1) {
        out.push([rowIdx,colIdx]);
      }
    }
    [rowIdx, colIdx] = [originalRowIdx, originalColIdx];
  });

  return out;
}
