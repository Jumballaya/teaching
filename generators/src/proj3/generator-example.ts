
//
// INFINITE GENERATOR
//
function* infiniteSequence() {
  let i = 0;
  while (true) {
    yield i++;
  }
}

// 1. Create the Infinite Generator and log the next function
const iteratorI = infiniteSequence();
console.log(iteratorI.next);

// 2. Save value of the next function call and log it
const nextI = iteratorI.next();
console.log(nextI);

// 3. Save the value of the next function again and log it
const nextNextI = iteratorI.next();
console.log(nextNextI);

// 4. Log out 10 calls to next()
for (let i = 0; i < 10; i++) {
  console.log(iteratorI.next());
}
console.log('\n\n');

//
// FINITE GENERATOR
//

function* finiteResponse() {
  let i = 0;
  while (i < 10) {
    yield i++;
  }
}

// 1. Create Finite Generator and log the next function
const iteratorF = finiteResponse();
console.log(iteratorF.next);

// 2. Save value of the next function call and log it
const nextF = iteratorF.next();
console.log(nextF);

// 3. Save the value of the next function again and log it
const nextNextF = iteratorF.next();
console.log(nextNextF);

// 4. Log out 10 calls to next()
for (let i = 0; i < 10; i++) {
  console.log(iteratorF.next());
}


//
// Manually Yielding Values
//

function* yieldingResponse() {
  console.log('Function Invoked');
  yield { phase: 1 };
  console.log('Second Phase');
  yield { phase: 2 };
  console.log('Final Phase');
  yield { phase: 3 };
  console.log('Completed');
}

// 1. Create Generator
const iterator = yieldingResponse();

// 2. Log out a message before we start calling the next() function
console.log('Before we start the generator');

// 3. Call for each of the 3 yields
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());

// 4. Last call has 'done' set to 'true' and no value
console.log(iterator.next());