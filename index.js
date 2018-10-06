const TaskScheduler = require('./lib/TaskScheduler');

const tasks_array = ['a','b','c','d'];
const dependencies_array = ['a => b', 'b => c', 'c => a'];
const task_scheduler = new TaskScheduler(tasks_array, dependencies_array);

console.dir(task_scheduler.tasks);
console.dir(task_scheduler.dependencies);