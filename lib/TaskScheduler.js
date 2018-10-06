class TaskScheduler {
    constructor (tasks, dependencies) {
        this.tasks = [];
        this.dependencies = {};

        this.parseTasks(tasks);
        this.parseDependencies(dependencies);
    }

    parseTasks (tasks) {
        if (typeof tasks === 'string') {
            tasks = tasks.replace(/^\[/,'').replace(/\]$/,'');
            this.tasks = tasks.split(',').map(t => t.trim());
        } else if (tasks && Array.isArray(tasks)) {
            this.tasks = tasks;
        }
    }

    parseDependencies (dependencies) {
        this.dependencies = this.tasks.reduce((out, task) => ({ ...out, [task]: [] }), {});
        
        if (typeof dependencies === 'string') {
            dependencies = dependencies.replace(/^\[/,'').replace(/\]$/,'');
            dependencies = dependencies.split(',').map(d => d.trim());
        } else if (!(dependencies && Array.isArray(dependencies))) {
            return;
        }

        dependencies.forEach(dependency => {
            const dependency_parts = dependency.split('=>').map(d_part => d_part.trim());
            if (this.dependencies[dependency_parts[0]]) {
                this.dependencies[dependency_parts[0]].push(dependency_parts[1]);
            }
        });
    }

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

    validateDependency (orig_task, task) {
        if (orig_task === task) {
            return false;
        } else if (this.dependencies[task] && this.dependencies[task].length > 0) {
            return this.dependencies[task].every(dependency => this.validateDependency(orig_task, dependency))
        }
        return true;
    }

    getSchedule () {
        if (!this.validateDependencies()) {
            return 'Error - this is a cyclic dependency';
        }
        return this.tasks.reduce((schedule,task) => {
            const inserted = schedule.some((sch_task,index) => {
                if (this.dependencies[sch_task].includes(task)) {
                    schedule.splice(index, 0, task);
                    return true;
                }
            });

            if (!inserted) {
                schedule.push(task);
            }

            return schedule;
        }, []);
    }
}

module.exports = TaskScheduler;