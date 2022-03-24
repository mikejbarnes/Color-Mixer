/* 
This is the Least Hyperbolic Tangent Slope Squared (LHTSS) algorithm for
generating a "reasonable" reflectance curve from a given sRGB color triplet.
The reflectance spans the wavelength range 380-730 nm in 10 nm increments.

Solves min sum(z_i+1 - z_i)^2 s.t. T ((tanh(z)+1)/2) = rgb,
using Lagrangian formulation and Newton's method.
Reflectance will always be in the open interval (0->1).

T is 3x36 matrix converting reflectance to D65-weighted linear rgb,
sRGB is a 3 element vector of target D65 referenced sRGB values in 0-255 range,
rho is a 36x1 vector of reconstructed reflectance values, all (0->1),

Written by Scott Allen Burns, May 2019.
Licensed under a Creative Commons Attribution-ShareAlike 4.0 International
License (http://creativecommons.org/licenses/by-sa/4.0/).
For more information, see http://scottburns.us/reflectance-curves-from-srgb/

Original MATLAB code converted to JavaScript by Mike Barnes, March 2022
*/

class LHTSS {
    static M_inverse_array = [[ 3.243063328, -1.538376194, -0.49893282 ],
                              [-0.968963091,  1.875424508,  0.041543029],
                              [ 0.055683923, -0.204174384,  1.057994536]];

    static A_prime_array = [[0.001368, 0.004243,  0.01431, 0.04351, 0.13438, 0.2839, 0.34828, 0.3362,  0.2908, 0.19536, 0.09564, 0.03201, 0.0049, 0.0093, 0.06327, 0.1655,  0.2904, 0.43345, 0.5945,	0.7621,	0.9163,	 1.0263, 1.0622, 1.0026,  0.85445, 0.6424,  0.4479,  0.2835, 0.1649, 0.0874, 0.04677, 0.0227,  0.011359, 0.00579,  0.002899, 0.00144],
                            [0.000039,  0.00012, 0.000396, 0.00121,   0.004, 0.0116,   0.023,	 0.038,	  0.06,	  0.09098, 0.13902,	0.20802, 0.323,	 0.503,	 0.71,	  0.862,   0.954,  0.99495, 0.995,	0.952,	0.87,	 0.757,	 0.631,	 0.503,	  0.381,   0.265,   0.175,	 0.107,	 0.061,	 0.032,	 0.017,	  0.00821, 0.004102, 0.002091, 0.001047, 0.00052],
                            [ 0.00645,  0.02005,  0.06785,  0.2074,  0.6456, 1.3856, 1.74706, 1.77211, 1.6692, 1.28764, 0.81295,	0.46518, 0.272,	 0.1582, 0.07825, 0.04216, 0.0203, 0.00875, 0.0039,	0.0021,	0.00165, 0.0011, 0.0008, 0.00034, 0.00019, 0.00005, 0.00002, 0,	     0,	     0,	     0,	      0,	   0,	     0,	       0,	     0]];

    static W_array = [0.499755, 0.546482, 0.827549, 0.91486, 0.934318, 0.866823, 1.04865, 1.17008, 1.17812, 1.14861, 1.15923, 1.08811, 1.09354, 1.07802, 1.0479, 1.07689, 1.04405, 1.04046, 1, 0.963342, 0.95788, 0.886856, 0.900062, 0.895991, 0.876987, 0.832886, 0.836992, 0.800268, 0.802146, 0.822778, 0.782842, 0.697213, 0.716091, 0.74349, 0.61604, 0.698856];

    static M_inverse = new Matrix(this.M_inverse_array, 3, 3, "values");
    static A_prime = new Matrix(this.A_prime_array, 3, 36, "values");
    static W = new Matrix(this.W_array, 1, 36, "value");

    static omega = this.A_prime.dotProduct(this.A_prime_array[1], this.W_array);

    static T = new Matrix(this.M_inverse.multiply(this.A_prime).outputArray(), this.M_inverse.rows, this.A_prime.columns, "values").multiply(new Matrix(this.W_array, 36, 36, "diag")).multiply(1/this.omega);

    static calculateLHTSS(sRGB) {
        
        // Initialize outputs to zeros
        let rho = new Matrix(0, 36, 1, "fill");
        
        // Handle special case of (0,0,0)
        if (sRGB.checkAll(0, "==")) {
            return new Matrix(0.0001, 36, 1, "fill");
        }

        //Handle special case of (255,255,255)
        if (sRGB.checkAll(255, "==")) {
            return new Matrix(1, 36, 1, "fill");
        }

        // 36x36 difference maxtrix for Jacobian
        // having 4 on main diagonal and -2 on off diagonals,
        // except first and last main diagonal are 2
        let D = new Matrix([-2,4,-2], 36, 36, "tridiag");
        D.setTridiagCorners(2);
    
        // Compute target linear rgb values
        let rgb = this.convert_sRGB_to_RGB(sRGB);

        // Initialize
        let z = new Matrix(0, 36, 1, "fill"); // Starting point all rho=1/2
        let lambda = new Matrix(0, 3, 1, "fill"); // Starting Lagrange mult
        let maxit = 100; // Max number of iterations
        let ftol = 1.0e-8; // Function solution tolerance
        let count = 0; // Iteration counter
        
        // Newton's method iteration
        while(count < maxit) {
            let d0 = z.trig("tanh").add(new Matrix(1, 36, 1, "fill")).multiply(1/2);       
            let d1 = new Matrix(z.trig("sech").pow(2).multiply(1/2).transpose().outputArray(), 36, 36, "diag");
            let d2 = new Matrix(z.trig("sech").pow(2).multiply(-1).hadamardProduct(z.trig("tanh")).transpose().outputArray(), 36, 36, "diag");
            
            let F_a = D.multiply(z);
            let F_b = d1.multiply(this.T.transpose()).multiply(lambda);
            let F_c = this.T.multiply(d0);
            let F = F_a.add(F_b).appendBottom(F_c.subtract(rgb));     // 39x1 F vector

            let J_a = new Matrix(d2.multiply(this.T.transpose()).multiply(lambda).transpose().outputArray(), 36, 36, "diag");
            let J_b = d1.multiply(this.T.transpose());
            let J_c = this.T.multiply(d1).appendRight(new Matrix(0, 3, 3, "fill"));
            let J = D.add(J_a).appendRight(J_b).appendBottom(J_c);     // 39x39 J matrix
            let delta = this.systemSolver(J, F.multiply(-1)); // Solve Newton system of equations J*delta = -F
            z = z.add(delta.slice(0,36,0,1));        // Update z
            lambda = lambda.add(delta.slice(36, 3, 0, 1)); // Update lambda
            if(F.abs().checkAll(ftol, "<")) {
                // Solution found
                rho = z.trig("tanh").add(new Matrix(1, 36, 1, "fill")).multiply(1/2);
                return rho;
            }
            count++;
        }

        console.log("No solution found in " + maxit.toString() + " iterations.");

    }

    static convert_sRGB_to_RGB(sRGB) {
        sRGB = sRGB.multiply(1/255);
        let rgb = new Matrix(0, 3, 1, "fill");
        
        // Remove gamma correction to get linear rgb
        for(let i = 0; i < sRGB.matrix.length; i++) {
            if(sRGB.matrix[i].values[0] < 0.04045) {
                rgb.matrix[i].values[0] = sRGB.matrix[i].values[0]/12.92;
            } else {
                rgb.matrix[i].values[0] = Math.pow((sRGB.matrix[i].values[0] + 0.055)/1.055, 2.4);
            }
        }
        return rgb;
    }

    static convert_RGB_to_sRGB(rgb) {
        let sRGB = new Matrix(0, 3, 1, "fill");

        for(let i = 0; i < rgb.matrix.length; i++) {
            if(rgb.matrix[i].values[0] <= 0.0031308) {
                sRGB.matrix[i].values[0] = rgb.matrix[i].values[0]*12.92;
            } else {
                sRGB.matrix[i].values[0] = 1.055 * Math.pow(rgb.matrix[i].values[0], 1/2.4) - 0.055;
            }
        }
        return sRGB.multiply(255);
    }

    static systemSolver(matrixA, matrixB) {
        let augmented = matrixA.appendRight(matrixB);
        
        //Check that no value is 0 on the diagonal and swap rows to prevent it
        for(let i = 0; i < augmented.rows; i++) {
            if(augmented.matrix[i].values[i] == 0) {
                for(let j = 0; j < augmented.rows; j++) {
                    if(i == j) continue;
                    if(augmented.matrix[i].values[j] != 0 && augmented.matrix[j].values[i] != 0) {
                        let temp = augmented.matrix[i];
                        augmented.matrix[i] = augmented.matrix[j];
                        augmented.matrix[j] = temp;
                        break;
                    }
                }
            }
        }
    
        //Gaussian elimination
        for(let i = 0; i < augmented.rows - 1; i++) {
            for(let j = i+1; j < augmented.rows; j++) {
                let negMult = -augmented.matrix[j].values[i]/augmented.matrix[i].values[i];
                for(let k = 0; k < augmented.columns; k++) {
                    augmented.matrix[j].values[k] += negMult*augmented.matrix[i].values[k];
                }
            }
        }
    
        //Back substitution
        for(let i = augmented.rows-1; i >= 0; i--) {
            augmented.matrix[i].values = augmented.matrix[i].values.map(x => x/augmented.matrix[i].values[i]);
            if(i == 0) break;
            for(let j = i-1; j >= 0; j--) {
                let negMult = -augmented.matrix[j].values[i]/augmented.matrix[i].values[i];
                for(let k = 0; k < augmented.columns; k++) {
                    augmented.matrix[j].values[k] += negMult*augmented.matrix[i].values[k];
                }
            }
        }
        
        let solution = new Matrix(0, augmented.rows, 1, "fill");
        for(var i = 0; i < solution.rows; i++) {
            solution.matrix[i].values[0] = augmented.matrix[i].values[augmented.matrix[i].values.length - 1];
        }
    
        return solution;
    }
}






