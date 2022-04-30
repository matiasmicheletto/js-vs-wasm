/**
 * @class Experiment 
 * @description This class is used to manage the set of optimizers and execution of experiment.
 * @author Matias Micheletto
 * @version 1.0
 */

class Experiment {
    
    constructor() {
        this.optimizers = []; // The list of optimizers
        this.ready = false; // As the initialization is async, this flag is used to check if the experiment is ready
    }

    addOptimizer(optimizer) { // Add an optimizer to the experiment
        return new Promise((resolve, reject) => {
            this.ready = false;
            optimizer.onReady = () => { // Wait for the optimizer to be ready
                this.optimizers.push(optimizer);
                this.ready = this.optimizers.every(optimizer => optimizer.ready);
                resolve(optimizer);
            };
        });
    }

    checkConfig(config) { // Simple check of the experiment configuration before running it
        const errors = [];
        const {steps, iterMin, iterMax} = config;
        if(iterMin > iterMax)
            errors.push(new Error('"iterMax" must be greater than "iterMin"'));
        if(steps <= 0)
            errors.push(new Error('"steps" must be greater than 0'));
        return errors;
    }

    run(config) { // Running the experiment means running all the optimizers and returning the compiled results
        return new Promise((resolve, reject) => {
            if(this.ready){
                const errors = this.checkConfig(config);
                if (errors.length > 0) {
                    const message = errors.map(e => e.message).join('\n');
                    reject(message);
                }else{
                    const {steps, iterMin, iterMax} = config;
                    const step = Math.round((iterMax - iterMin) / steps);                        
                    const job = [];
                    this.optimizers.forEach(optimizer => {                        
                        for (let iters = iterMin; iters < iterMax; iters+=step)                            
                            job.push(optimizer.run(iters));
                    });
                    Promise.all(job).then(data => {
                        resolve({step, iterMin, iterMax, data, elapsed: data.reduce((acc, cur) => acc + cur.elapsed, 0)});
                    });
                }
            }else{
                reject(new Error('Experiment not ready'));
            }
        });
    }
}