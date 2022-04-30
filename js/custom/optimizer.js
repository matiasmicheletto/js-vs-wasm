const generateId = () => { // Generate a random ID of length 5
    return Math.random().toString(36).substr(2, 5);
};

/**
 * @class Optimizer
 * @description This class models a generic optimizer and is a base class for all the optimizers.
 * @author Matias Micheletto
 * @version 1.0
 */

class Optimizer {
    constructor() {
        this.id = generateId(); // Each optimizer has an unique identifier
        this.ready = false; // As the initialization is async, this flag is used to check if the optimizer is ready
    }

    run(iters) {
        /* Format of the optimization result:
        const result = { 
            status: "error", // Result status
            message: "Not implemented", // Error message if status==="error"
            id: this.id, // Optimizer identifier
            fOpt: 0, // Objective function optimal value
            xOpt: 0, // Optimal x position
            yOpt: 0, // Optimal y position
            iters: 0, // Iterations performed
            elapsed: 0, // Optimization total elapsed time
            ems: 0 // Error mean sware of result
        };
        */
        // This class is meant to be extended
        return Promise.reject(new Error('Not implemented'));
    }
}