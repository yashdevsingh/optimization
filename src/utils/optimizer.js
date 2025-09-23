// ==============================================================================
// == MULTI-VARIABLE OPTIMIZATION (NEWTON'S METHOD)                            ==
// ==============================================================================

/**
 * Evaluates the objective function for a given multi-variable problem.
 * @param {number} p_no The problem number (1-5).
 * @param {number[]} x The input vector.
 * @returns {number} The value of the function.
 */
export function evaluateFunction(p_no, x) {
  const d = x.length;
  let ans = 0;

  if (p_no === 1) { // Sum Squares Function
    for (let i = 0; i < d; i++) ans += (i + 1) * x[i] * x[i];
  } else if (p_no === 2) { // Rosenbrock Function
    for (let i = 0; i < d - 1; i++) {
      const term1 = x[i + 1] - x[i] * x[i];
      const term2 = x[i] - 1;
      ans += 100 * term1 * term1 + term2 * term2;
    }
  } else if (p_no === 3) { // Dixon-Price Function
    ans = (x[0] - 1) ** 2;
    for (let i = 1; i < d; i++) {
      const term2 = 2 * x[i] * x[i] - x[i - 1];
      ans += (i + 1) * term2 * term2;
    }
  } else if (p_no === 4) { // Trid Function
    let sum1 = 0, sum2 = 0;
    for (let i = 0; i < d; i++) sum1 += (x[i] - 1) ** 2;
    for (let i = 1; i < d; i++) sum2 += x[i] * x[i - 1];
    ans = sum1 - sum2;
  } else if (p_no === 5) { // Zakharov Function
    let sum1 = 0, sum2 = 0;
    for (let i = 0; i < d; i++) {
      sum1 += x[i] ** 2;
      sum2 += 0.5 * (i + 1) * x[i];
    }
    ans = sum1 + sum2 ** 2 + sum2 ** 4;
  }

  return ans;
}

function computeGradient(p_no, x) {
  const h = 1e-5;
  const grad = [];
  const d = x.length;
  for (let i = 0; i < d; i++) {
    const x_plus = [...x];
    const x_minus = [...x];
    x_plus[i] += h;
    x_minus[i] -= h;
    const df = (evaluateFunction(p_no, x_plus) - evaluateFunction(p_no, x_minus)) / (2 * h);
    grad.push(df);
  }
  return grad;
}

function computeHessian(p_no, x) {
    const d = x.length;
    const h = 1e-5;
    const hessian = Array(d).fill(0).map(() => Array(d).fill(0));
    for (let i = 0; i < d; i++) {
        for (let j = 0; j < d; j++) {
            const x_pp = [...x]; x_pp[i] += h; x_pp[j] += h;
            const x_pm = [...x]; x_pm[i] += h; x_pm[j] -= h;
            const x_mp = [...x]; x_mp[i] -= h; x_mp[j] += h;
            const x_mm = [...x]; x_mm[i] -= h; x_mm[j] -= h;
            hessian[i][j] = (evaluateFunction(p_no, x_pp) - evaluateFunction(p_no, x_pm) - evaluateFunction(p_no, x_mp) + evaluateFunction(p_no, x_mm)) / (4 * h * h);
        }
    }
    return hessian;
}

function inverse(H) {
    const d = H.length;
    const augmented = H.map((row, i) => [...row, ...Array(d).fill(0).map((_, j) => i === j ? 1 : 0)]);

    for (let i = 0; i < d; i++) {
        let pivot_row = i;
        for (let k = i + 1; k < d; k++) {
            if (Math.abs(augmented[k][i]) > Math.abs(augmented[pivot_row][i])) pivot_row = k;
        }
        [augmented[i], augmented[pivot_row]] = [augmented[pivot_row], augmented[i]];
        const pivot = augmented[i][i];
        if (Math.abs(pivot) < 1e-10) return null;
        for (let j = i; j < 2 * d; j++) augmented[i][j] /= pivot;
        for (let k = 0; k < d; k++) {
            if (k !== i) {
                const factor = augmented[k][i];
                for (let j = i; j < 2 * d; j++) augmented[k][j] -= factor * augmented[i][j];
            }
        }
    }
    return augmented.map(row => row.slice(d));
}

function lineSearchBoundingPhase(phi, initialGuess, initialStep) {
    let x0 = initialGuess, delta = Math.abs(initialStep);
    const f0 = phi(x0), f_minus = phi(x0 - delta), f_plus = phi(x0 + delta);

    if (f_minus >= f0 && f0 >= f_plus) { /* Positive step OK */ } 
    else if (f_minus <= f0 && f0 <= f_plus) { delta = -delta; } 
    else { return [x0 - delta, x0 + delta]; }

    let k = 1, x_prev = x0, x_curr = x0 + delta, f_curr = phi(x_curr);
    while (f_curr < phi(x_prev)) {
        const step = Math.pow(2, k) * delta;
        x_prev = x_curr;
        x_curr += step;
        f_curr = phi(x_curr);
        k++;
    }
    return delta > 0 ? [x_prev, x_curr] : [x_curr, x_prev];
}

function lineSearchBisection(phi_prime, a, b, tolerance) {
    if (phi_prime(a) * phi_prime(b) >= 0) return Math.abs(phi_prime(a)) < Math.abs(phi_prime(b)) ? a : b;
    let mid = a;
    while ((b - a) >= tolerance) {
        mid = (a + b) / 2;
        if (Math.abs(phi_prime(mid)) < 1e-9) break;
        if (phi_prime(mid) * phi_prime(a) < 0) b = mid;
        else a = mid;
    }
    return mid;
}

export function runOptimization(p_no, dimension, startPoint, maxIter = 100) {
    let x = [...startPoint];
    const history = [];
    const tolerance = 1e-6;

    for (let iter = 0; iter < maxIter; iter++) {
        const grad = computeGradient(p_no, x);
        if (Math.sqrt(grad.reduce((s, g) => s + g * g, 0)) < tolerance) break;

        const hessian = computeHessian(p_no, x);
        const hessian_inv = inverse(hessian);
        if (!hessian_inv) break;

        const search_direction = Array(dimension).fill(0).map((_, i) => -hessian_inv[i].reduce((s, hij, j) => s + hij * grad[j], 0));
        const phi = (alpha) => evaluateFunction(p_no, x.map((xi, i) => xi + alpha * search_direction[i]));
        
        let coeff_B = grad.reduce((s, gi, i) => s + gi * search_direction[i], 0);
        const H_times_s = hessian.map(row => row.reduce((s, hij, j) => s + hij * search_direction[j], 0));
        let s_T_H_s = search_direction.reduce((s, si, i) => s + si * H_times_s[i], 0);
        const coeff_A = 0.5 * s_T_H_s;
        
        const phi_prime = (alpha) => 2 * coeff_A * alpha + coeff_B;
        const [a, b] = lineSearchBoundingPhase(phi, 0.0, 0.1);
        const optimal_alpha = lineSearchBisection(phi_prime, a, b, tolerance);
        
        x = x.map((xi, i) => xi + optimal_alpha * search_direction[i]);
        history.push({ iter, x: [...x], fx: evaluateFunction(p_no, x) });
    }
    return { finalPoint: x, finalValue: evaluateFunction(p_no, x), history };
}

// ==============================================================================
// == SINGLE-VARIABLE OPTIMIZATION                                             ==
// ==============================================================================

const singleVariableProblems = {
  1: { type: 'max', f: (x) => (2 * x - 5)**4 - (x**2 - 1)**3, d: (x) => 8 * (2 * x - 5)**3 - 6 * x * (x**2 - 1)**2 },
  2: { type: 'max', f: (x) => 8 + x**3 - 2 * x - 2 * Math.exp(x), d: (x) => 3 * x**2 - 2 - 2 * Math.exp(x) },
  3: { type: 'max', f: (x) => 4 * x * Math.sin(x), d: (x) => 4 * Math.sin(x) + 4 * x * Math.cos(x) },
  4: { type: 'min', f: (x) => 2 * (x - 3)**2 + Math.exp(0.5 * x**2), d: (x) => 4 * (x - 3) + x * Math.exp(0.5 * x**2) },
  5: { type: 'min', f: (x) => x**2 - 10 * Math.exp(0.1 * x), d: (x) => 2 * x - Math.exp(0.1 * x) },
  6: { type: 'max', f: (x) => 20 * Math.sin(x) - 15 * x**2, d: (x) => 20 * Math.cos(x) - 30 * x },
};

function sv_boundingPhase(p_no, x, del) {
    const { type, f } = singleVariableProblems[p_no];
    let k = 0, current_del = del;
    
    const f_prev = f(x - current_del), f_curr = f(x), f_next = f(x + current_del);
    const isMax = type === 'max';

    if ((isMax && f_prev >= f_curr && f_curr >= f_next) || (!isMax && f_prev <= f_curr && f_curr <= f_next)) {
        current_del *= -1;
    }

    let x_prev = x, x0 = x + current_del, x1 = x0 + Math.pow(2, k) * current_del;
    k++;

    const shouldContinue = (val1, val2) => (isMax ? val1 > val2 : val1 < val2);

    while (shouldContinue(f(x1), f(x0))) {
        x_prev = x0;
        x0 = x1;
        x1 = x0 + Math.pow(2, k) * current_del;
        k++;
    }
    
    const interval = [x_prev, x1];
    interval.sort((a,b) => a-b);
    return interval;
}

function sv_bisection(p_no, left, right, epsilon) {
    const { type, d } = singleVariableProblems[p_no];
    let mid, md;
    const isMax = type === 'max';

    do {
        mid = (left + right) / 2;
        md = d(mid);
        if ((isMax && md > 0) || (!isMax && md < 0)) left = mid;
        else right = mid;
    } while (Math.abs(md) > epsilon);
    
    return [left, right];
}

export function runSingleVariableOptimization(p_no, startPoint, delta, epsilon) {
    const bounded_interval = sv_boundingPhase(p_no, startPoint, delta);
    const finalInterval = sv_bisection(p_no, bounded_interval[0], bounded_interval[1], epsilon);
    
    const optimalX = (finalInterval[0] + finalInterval[1]) / 2;
    const optimalValue = singleVariableProblems[p_no].f(optimalX);

    return { finalInterval, optimalX, optimalValue };
}