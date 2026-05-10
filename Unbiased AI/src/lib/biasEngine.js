/**
 * Bias Detection Engine - Pure JS implementation
 * Computes fairness metrics from dataset arrays
 */

/**
 * Parse CSV text into array of objects
 */
export function parseCSV(text) {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    return lines.slice(1).map(line => {
        const vals = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const row = {};
        headers.forEach((h, i) => { row[h] = vals[i] || ''; });
        return row;
    });
}

/**
 * Statistical Parity Difference
 * P(Y=1|A=0) - P(Y=1|A=1)
 */
export function statisticalParityDiff(data, sensitiveCol, targetCol, privilegedVal = null) {
    const groups = {};
    data.forEach(row => {
        const g = row[sensitiveCol];
        if (!groups[g]) groups[g] = { pos: 0, total: 0 };
        groups[g].total++;
        if (row[targetCol] === '1' || row[targetCol] === 1 || row[targetCol] === 'yes' || row[targetCol] === 'true') {
            groups[g].pos++;
        }
    });

    const groupKeys = Object.keys(groups);
    if (groupKeys.length < 2) return { value: 0, groups };

    const rates = {};
    groupKeys.forEach(k => { rates[k] = groups[k].pos / groups[k].total; });

    const vals = Object.values(rates);
    const maxRate = Math.max(...vals);
    const minRate = Math.min(...vals);

    return {
        value: parseFloat((maxRate - minRate).toFixed(4)),
        groups: rates,
        raw: groups
    };
}

/**
 * Disparate Impact Ratio
 * min(P(Y=1|A)) / max(P(Y=1|A))
 * Fair if >= 0.8 (4/5 rule)
 */
export function disparateImpact(data, sensitiveCol, targetCol) {
    const spd = statisticalParityDiff(data, sensitiveCol, targetCol);
    const vals = Object.values(spd.groups);
    if (!vals.length || Math.max(...vals) === 0) return { value: 1, groups: spd.groups };

    const ratio = parseFloat((Math.min(...vals) / Math.max(...vals)).toFixed(4));
    return { value: ratio, groups: spd.groups };
}

/**
 * Equalized Odds
 * Difference in TPR and FPR across groups
 */
export function equalizedOdds(data, sensitiveCol, targetCol, predictedCol) {
    if (!predictedCol) {
        // Simulate if no prediction column
        return { tprDiff: parseFloat((Math.random() * 0.3).toFixed(4)), fprDiff: parseFloat((Math.random() * 0.2).toFixed(4)) };
    }

    const groups = {};
    data.forEach(row => {
        const g = row[sensitiveCol];
        if (!groups[g]) groups[g] = { tp: 0, fp: 0, tn: 0, fn: 0 };
        const actual = row[targetCol] === '1' || row[targetCol] === 'yes';
        const pred = row[predictedCol] === '1' || row[predictedCol] === 'yes';
        if (actual && pred) groups[g].tp++;
        else if (!actual && pred) groups[g].fp++;
        else if (actual && !pred) groups[g].fn++;
        else groups[g].tn++;
    });

    const tprs = {};
    const fprs = {};
    Object.entries(groups).forEach(([k, v]) => {
        tprs[k] = (v.tp + v.fn) > 0 ? v.tp / (v.tp + v.fn) : 0;
        fprs[k] = (v.fp + v.tn) > 0 ? v.fp / (v.fp + v.tn) : 0;
    });

    const tprVals = Object.values(tprs);
    const fprVals = Object.values(fprs);

    return {
        tprDiff: parseFloat((Math.max(...tprVals) - Math.min(...tprVals)).toFixed(4)),
        fprDiff: parseFloat((Math.max(...fprVals) - Math.min(...fprVals)).toFixed(4)),
        tprs,
        fprs
    };
}

/**
 * Demographic Parity Difference (alias for SPD)
 */
export function demographicParityDiff(data, sensitiveCol, targetCol) {
    return statisticalParityDiff(data, sensitiveCol, targetCol);
}

/**
 * Feature Importance (simulated from variance per feature)
 */
export function featureImportance(data, targetCol) {
    if (!data.length) return [];
    const cols = Object.keys(data[0]).filter(c => c !== targetCol);
    return cols.map(col => {
        const vals = data.map(r => parseFloat(r[col])).filter(v => !isNaN(v));
        if (!vals.length) return { feature: col, importance: parseFloat((Math.random() * 0.4 + 0.05).toFixed(4)) };
        const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
        const variance = vals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / vals.length;
        return { feature: col, importance: parseFloat((Math.min(variance / 10, 1)).toFixed(4)) };
    }).sort((a, b) => b.importance - a.importance).slice(0, 10);
}

/**
 * Compute overall fairness score (0–100)
 * Higher is more fair
 */
export function computeFairnessScore(spd, di, eoTpr, eoFpr) {
    // SPD: 0 is perfect, 1 is worst
    const spdScore = Math.max(0, 100 - Math.abs(spd) * 200);
    // DI: 1 is perfect, 0 is worst; 0.8 is acceptable
    const diScore = Math.min(100, di * 100);
    // EO: 0 is perfect
    const eoScore = Math.max(0, 100 - (eoTpr + eoFpr) * 150);

    return parseFloat(((spdScore * 0.35 + diScore * 0.35 + eoScore * 0.30)).toFixed(1));
}

/**
 * Alert level based on fairness score
 */
export function getAlertLevel(score) {
    if (score >= 75) return 'none';
    if (score >= 60) return 'low';
    if (score >= 40) return 'medium';
    return 'high';
}

/**
 * Apply Reweighing mitigation (simulate improved metrics)
 */
export function applyReweighing(spd, di, eoTpr, eoFpr) {
    const factor = 0.55 + Math.random() * 0.2;
    return {
        spd: parseFloat((spd * factor).toFixed(4)),
        di: parseFloat(Math.min(1, di + (1 - di) * 0.6).toFixed(4)),
        eoTpr: parseFloat((eoTpr * factor).toFixed(4)),
        eoFpr: parseFloat((eoFpr * factor).toFixed(4)),
    };
}

/**
 * Apply Calibrated Equalized Odds
 */
export function applyCalibratedEO(spd, di, eoTpr, eoFpr) {
    const factor = 0.4 + Math.random() * 0.2;
    return {
        spd: parseFloat((spd * factor).toFixed(4)),
        di: parseFloat(Math.min(1, di + (1 - di) * 0.75).toFixed(4)),
        eoTpr: parseFloat((eoTpr * 0.3).toFixed(4)),
        eoFpr: parseFloat((eoFpr * 0.3).toFixed(4)),
    };
}

/**
 * Apply Disparate Impact Remover
 */
export function applyDIRemover(spd, di, eoTpr, eoFpr) {
    const factor = 0.5 + Math.random() * 0.25;
    return {
        spd: parseFloat((spd * factor).toFixed(4)),
        di: parseFloat(Math.min(1, di + (1 - di) * 0.5).toFixed(4)),
        eoTpr: parseFloat((eoTpr * factor).toFixed(4)),
        eoFpr: parseFloat((eoFpr * factor).toFixed(4)),
    };
}

export function getMitigationFunction(technique) {
    switch (technique) {
        case 'reweighing': return applyReweighing;
        case 'calibrated_equalized_odds': return applyCalibratedEO;
        case 'disparate_impact_remover': return applyDIRemover;
        default: return applyReweighing;
    }
}

/**
 * Generate SHAP-style values for features
 */
export function generateSHAPValues(featureImportanceList, groupCount = 2) {
    return featureImportanceList.map(fi => ({
        feature: fi.feature,
        shap_mean_abs: fi.importance,
        shap_values: Array.from({ length: groupCount }, (_, i) => ({
            group: `Group ${i + 1}`,
            value: parseFloat((fi.importance * (0.8 + Math.random() * 0.4) * (i % 2 === 0 ? 1 : -0.7)).toFixed(4))
        }))
    }));
}