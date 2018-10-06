const { expect } = require('chai');

const TaskScheduler = require('../../lib/TaskScheduler');

describe('TaskScheduler instantiation', () => {
    const tasks_out = ['a','b','c','d'];
    const dependencies_out = {
        'a': ['b'],
        'b': ['c'],
        'c': ['a'],
        'd': [] 
    };

    it('processes tasks and dependencies from an array', () => {
        const tasks_in = ['a','b','c','d'];
        const dependencies_in = ['a => b', 'b => c', 'c => a'];

        const task_scheduler = new TaskScheduler(tasks_in, dependencies_in);
        
        expect(task_scheduler.tasks).to.deep.equal(tasks_out, 'Tasks processed incorrectly');
        expect(task_scheduler.dependencies).to.deep.equal(dependencies_out, 'Dependencies processed incorrectly');
    });

    it('processes tasks and dependencies from a string', () => {
        const tasks_in = `a,b,c,d`;
        const dependencies_in = `a => b, b => c, c => a`;

        const task_scheduler = new TaskScheduler(tasks_in, dependencies_in);
        
        expect(task_scheduler.tasks).to.deep.equal(tasks_out, 'Tasks processed incorrectly');
        expect(task_scheduler.dependencies).to.deep.equal(dependencies_out, 'Dependencies processed incorrectly');
    });

    it('processes tasks and dependencies from a string representing an array', () => {
        const tasks_in = `[a,b,c,d]`;
        const dependencies_in = `[a => b, b => c, c => a]`;

        const task_scheduler = new TaskScheduler(tasks_in, dependencies_in);

        expect(task_scheduler.tasks).to.deep.equal(tasks_out, 'Tasks processed incorrectly');
        expect(task_scheduler.dependencies).to.deep.equal(dependencies_out, 'Dependencies processed incorrectly');
    });
});

describe('TaskScheduler.getSchedule', () => {
    it('should return a empty set of tasks', () => {
        const tasks_in = [];
        const dependencies_in = [];
        const result = [];

        const task_scheduler = new TaskScheduler();
        expect(task_scheduler.getSchedule()).to.deep.equal([]);
    });
});