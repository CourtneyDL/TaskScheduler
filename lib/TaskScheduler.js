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
        } else if (Array.isArray(tasks)) {
            this.tasks = tasks;
        }
    }

    parseDependencies (dependencies) {
        this.dependencies = this.tasks.reduce((out, task) => ({ ...out, [task]: [] }), {});
        
        if (typeof dependencies === 'string') {
            dependencies = dependencies.replace(/^\[/,'').replace(/\]$/,'');
            dependencies = dependencies.split(',').map(d => d.trim());
        } else if (!Array.isArray(dependencies)) {
            return;
        }

        dependencies.forEach(dependency => {
            const dependency_parts = dependency.split('=>').map(d_part => d_part.trim());
            if (this.dependencies[dependency_parts[0]]) {
                this.dependencies[dependency_parts[0]].push(dependency_parts[1]);
            }
        });
    }

    processDependencies () {
        return [];
    }
}

module.exports = TaskScheduler;