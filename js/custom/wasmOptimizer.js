/**
 * @class WasmOptimizer
 * @extends Optimizer
 * @description This class models the wasm based optimizer.
 * @author Matias Micheletto
 * @version 1.0
 */

class WasmOptimizer extends Optimizer{
    constructor() {
        super();         
        this.returnResults = console.log;
        this.imports = { // This is the list of imports that the wasm module will use
            env: {
                // This callback will be called from the C++ side when the wasm module returns the results
                onResults: (fOpt, xOpt, yOpt, iters, err) => { 
                    const endTime = Date.now();
                    const elapsed = endTime - this.beginTime;
                    this.returnResults({
                        status: "success",
                        message: "",
                        id: this.id,
                        type: "wasm",
                        fOpt, 
                        xOpt, 
                        yOpt, 
                        iters, 
                        elapsed,
                        err
                    });
                }  
            }
        };

        // Load the wasm module
        fetch('wasm/optimizer.wasm').then(response => {
            response.arrayBuffer().then(bytes => {                   
                WebAssembly.instantiate(bytes, this.imports)
                .then(module => {                    
                    this.wasmInstance = module.instance.exports;
                    this.ready = true;
                    // This callback should be implemented in order to be notified when the optimizer is ready
                    this.onReady(); 
                })
            });
        });
    }

    run(iters) { // Run the optimizer
        return new Promise((resolve, reject) => {
            if(this.ready){
                this.returnResults = resolve;
                this.beginTime = Date.now(); // The elapsed time is measured from the JS side
                this.wasmInstance.run(iters); // Call the wasm method
            }else{
                reject(new Error("Wasm isn't ready."));
            }
        });
    }
}
