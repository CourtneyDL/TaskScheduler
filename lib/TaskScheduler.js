/**
 * Class to schedule a set of tasks in relation to a set of dependencies
 */
class TaskScheduler {
    /**
     * Create a scheduler instance
     * @param {(string[]|string)} tasks 
     * @param {(string[]|string)} dependencies 
     */
    constructor (tasks, dependencies) {
        this.tasks = [];
        this.dependencies = {};

        this.parseTasks(tasks);
        this.parseDependencies(dependencies);
    }

    /**
     * Populate the tasks array
     * @param {(string[]|string)} tasks 
     */
    parseTasks (tasks) {
        if (typeof tasks === 'string') {
            tasks = tasks.replace(/^\[/,'').replace(/\]$/,'');
            this.tasks = tasks.split(',').map(t => t.trim());
        } else if (tasks && Array.isArray(tasks)) {
            this.tasks = tasks;
        }
    }

    /**
     * Convert an array of dependencies into a object used by this class
     * Incorrectly formatted dependencies will be skipped
     * @param {(string[]|string)} dependencies 
     */
    parseDependencies (dependencies) {
        this.dependencies = this.tasks.reduce((out, task) => ({ ...out, [task]: [] }), {});
        
        if (typeof dependencies === 'string') {
            dependencies = dependencies.replace(/^\[/,'').replace(/\]$/,'');
            dependencies = dependencies.split(',').map(d => d.trim());
        } else if (!(dependencies && Array.isArray(dependencies))) {
            return;
        }

        dependencies.forEach(dependency => {
            if (/^[^=>]+=>[^=>]+$/.test(dependency)) {
                const dependency_parts = dependency.split('=>').map(d_part => d_part.trim());
                if (this.dependencies[dependency_parts[0]]) {
                    this.dependencies[dependency_parts[0]].push(dependency_parts[1]);
                }
            }
        });
    }

    /**
     * Checks the dependency set for cyclical dependencies
     * @returns {boolean} Validity of dependency set
     */
    validateDependencies () {
        let valid = true;
        
        for (let task in this.dependencies) {
            if (this.dependencies.hasOwnProperty(task)) {
                valid = this.dependencies[task].every(dependency => this.validateDependency(task, dependency));
                if (!valid) {
                    break;
                }
            }
        }

        return valid;
    }

    /**
     * Checks if the task at the start of dependency chain reoccurs indicating a cyclical dependency
     * @param {string} orig_task Task at the start of the dependency chain 
     * @param {string} task Current task in the chain
     * 
     * @return {boolean} 
     */
    validateDependency (orig_task, task) {
        if (orig_task === task) {
            return false;
        } else if (this.dependencies[task] && this.dependencies[task].length > 0) {
            return this.dependencies[task].every(dependency => this.validateDependency(orig_task, dependency))
        }
        return true;
    }

    /**
     * Returns a set of scheduled tasks
     * @returns {string[]}
     */
    getSchedule () {
        if (!this.validateDependencies()) {
            return 'Error - this is a cyclic dependency';
        }
        return this.tasks.reduce((schedule,task) => {
            //Compare task to the existing schedule
            const inserted = schedule.some((sch_task,index) => {
                //Insert task ahead of the scheduled task (sch_task) if task is a dependency of sch_task
                if (this.dependencies[sch_task].includes(task)) {
                    schedule.splice(index, 0, task);
                    return true;
                }
            });

            //Append task to the end of the schedule if it wasn't inserted above
            if (!inserted) {
                schedule.push(task);
            }

            return schedule;
        }, []);
    }
}

module.exports = TaskScheduler;