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

    getSchedule () {
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