#include <stdlib.h> // for rand(), srand() and RAND_MAX
#include <float.h> // for DBL_MAX
#include <math.h> // for pow()
#include <emscripten.h> // for EM_JS and EMSCRIPTEN_KEEPALIVE

// This is the callback to be defined in the JavaScript code.
EM_JS(void, onResults, (double fOpt, double xOpt, double yOpt, int iters, double err));

// This is the method that is called from JavaScript.
EMSCRIPTEN_KEEPALIVE
void run(int iters) {    
    // This is the evaluated point coordinates
    double bestX = 0.0;
    double bestY = 0.0;
    // This is the best evaluated point (initially the worst possible value)
    double best = DBL_MAX;
    // This is the position of the global optima
    const double xOpt = rand() / (double)RAND_MAX * 1000.0;
    const double yOpt = rand() / (double)RAND_MAX * 1000.0;
    // This is the value of the objective function at the global optima position
    const double fOpt = rand() / (double)RAND_MAX * 100.0 + 1; // The +1 is to avoid fOpt=0
    for(int i = 0; i < iters; i++) { // Run iterations
        // This is the tested point coordinates
        const double x = rand() / (double)RAND_MAX * 1000.0;
        const double y = rand() / (double)RAND_MAX * 1000.0;
        // This is the objective function being minimized
        const double f = pow(x - xOpt, 2) + pow(y - yOpt, 2) + fOpt;
        // Check if the tested point is best
        if(f < best) {
            best = f;
            bestX = x;
            bestY = y;
        }
    }
    const double err = (best - fOpt)/fOpt*100.0; // This is the relative error of result
    onResults(best, bestX, bestY, iters, err);
}
