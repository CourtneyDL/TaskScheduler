# TaskScheduler
A Node.js command line utility for scheduling tasks by determining their execution order in relation to a set of dependencies.

The tool can be run from its root directory as follows:
```
node . <tasks> <dependencies>
node . "a,b,c" "a => b, b => c"
```

## Prerequisites
- Node.js 8.12.0+ *(It may run on earlier versions of Node.js 8 but has only been tested on 8.12.0)*

## Installation
Run the command below from the root directory of the project:
```
npm install
```

## Test Script
This repository includes a unit testing suite implemented in Mocha and Chai. It contains tests for the acceptance criteria listed in this readme. There are also tests to verify that the TaskScheduler class constructor parses task and dependency parameters correctly.

It can be executed by calling:
```
npm test
```
There is also watch variant of this script for test driven development use:
```
npm run test:watch
```

## Acceptance Criteria
The utility was designed to meet the following set of criteria. Commands are included to check the output independent of the test script outlined above.

### No Tasks
tasks : []

dependencies: []

result: []
```
node .
```

### 2 Tasks, No Dependencies
tasks: [a,b]

dependencies: []

result: [a,b]

```
node . "a,b"
node . "[a,b]"
```
### 2 Tasks, 1 Dependency
tasks: [a,b]

dependencies: [a => b]

result: [b,a]
```
node . "a,b" "a => b"
node . "[a,b]" "[a => b]"
```

### 4 Tasks, 2 Dependencies
tasks: [a,b,c,d]

dependencies: [a => b,c => d]

result: [b,a,d,c]
```
node . "a,b,c,d" "a => b,c => d"
node . "[a,b,c,d]" "[a => b,c => d]"
```

### 3 Tasks, 2 Dependencies
tasks: [a,b,c]

dependencies: [a => b,b => c]

result: [c,b,a]
```
node . "a,b,c" "a => b,b => c"
node . "[a,b,c]" "[a => b,b => c]"
```

### Cyclic Dependency
tasks: [a,b,c,d]

dependencies: [a => b,b => c,c => a]

result: Error - this is a cyclic dependency

```
node . "a,b,c,d" "a => b,b => c,c => a"
node . "[a,b,c,d]" "[a => b,b => c,c => a]"
```
