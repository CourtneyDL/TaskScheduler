const TaskScheduler = require('./lib/TaskScheduler');

const tasks = process.argv[2];
const dependencies = process.argv[3];

console.log('tasks: ', tasks || '[]');
console.log('dependencies: ', dependencies || '[]');
const task_scheduler = new TaskScheduler(tasks, dependencies);
console.log('result: ', task_scheduler.getSchedule());