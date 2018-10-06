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

        const task_scheduler = new TaskScheduler(tasks_in, dependencies_in);
        expect(task_scheduler.getSchedule()).to.deep.equal(result);
    });

    it('should return a schedule matching the tasks provided if no dependencies are provided', () => {
        const tasks_in = ['a','b'];
        const dependencies_in = [];
        const result = ['a','b'];

        const task_scheduler = new TaskScheduler(tasks_in, dependencies_in);
        expect(task_scheduler.getSchedule()).to.deep.equal(result);
    });

    it('should return the correct schedule for 2 tasks and 1 dependency', () => {
        const tasks_in = ['a','b'];
        const dependencies_in = ['a => b'];
        const result = ['b','a'];

        const task_scheduler = new TaskScheduler(tasks_in, dependencies_in);
        expect(task_scheduler.getSchedule()).to.deep.equal(result);
    });

    it('should return the correct schedule for 4 tasks and 2 dependencies', () => {
        const tasks_in = ['a','b','c','d'];
        const dependencies_in = ['a => b','c => d'];
        const result = ['b','a','d','c'];

        const task_scheduler = new TaskScheduler(tasks_in, dependencies_in);
        expect(task_scheduler.getSchedule()).to.deep.equal(result);
    });

    it('should return the correct schedule for 3 tasks and 2 dependencies', () => {
        const tasks_in = ['a','b','c'];
        const dependencies_in = ['a => b','b => c'];
        const result = ['c','b','a'];

        const task_scheduler = new TaskScheduler(tasks_in, dependencies_in);
        expect(task_scheduler.getSchedule()).to.deep.equal(result);
    });
    
    it('should return an error if a cyclic dependency is found', () => {
        const tasks_in = ['a','b','c','d'];
        const dependencies_in = ['a => b','b => c','c => a'];
        const result = 'Error - this is a cyclic dependency';

        const task_scheduler = new TaskScheduler(tasks_in, dependencies_in);
        expect(task_scheduler.getSchedule()).to.deep.equal(result);
    });
});