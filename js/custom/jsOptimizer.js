/**
 * @class JsOptimizer
 * @extends Optimizer
 * @description This class models a simple Monte Carlo based optimizer.
 * @author Matias Micheletto
 * @version 1.0
 */

class JsOptimizer extends Optimizer {
    constructor() {
        super();        
        setTimeout(()=>{ // The initialization should be async
            this.ready = true;
            this.onReady(); // This callback should be defined before initialization
        }, 100);
    }

    run(iters) {
        return new Promise((resolve, reject) => {
            setTimeout(()=>{ // This is forced to be async to match the wasm implementation
                const begin = Date.now();
                // This is the evaluated point coordinates
                let bestX = 0;
                let bestY = 0;
                // This is the best evaluated point
                let best = Infinity;
                // This is the position of the global optima
                const xOpt = Math.random() * 1000;
                const yOpt = Math.random() * 1000;
                // This is the value of the objective function at the global optima position
                const fOpt = Math.random() * 100 + 1; // The +1 is to avoid the division by zero
                for(let i = 0; i < iters; i++){ // Run iterations
                    // This is the tested point coordinates
                    const x = Math.random() * 1000;
                    const y = Math.random() * 1000;
                    // This is the objective function being minimized
                    const f = Math.pow(x - xOpt, 2) + Math.pow(y - yOpt, 2) + fOpt;
                    // Check if the tested point is best
                    if(f < best){
                        best = f;
                        bestX = x;
                        bestY = y;
                    }
                }
                const end = Date.now();
                const elapsed = end - begin; // This is the algorithm total elapsed time       
                const err = (best - fOpt)/fOpt*100; // This is the relative error of result
                resolve({ 
                    status: "success",
                    message: "",
                    id: this.id,
                    type: "js",
                    fOpt: best,
                    xOpt: bestX,
                    yOpt: bestY,
                    iters: iters,
                    elapsed: elapsed,                    
                    err: err
                });
            }, 100);
        });
    }
}