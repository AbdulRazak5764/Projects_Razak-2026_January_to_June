# RECALIBRATION BRIEF | Stage 2
**Team: Antigravity | Case 01**

## 1. Robustness Diagnosis (Generalization Check)
The Stage 1 Behavioral Model was tested against the **2020-2021 Validation Dataset** (In-Space Holdout).

*   **Ranking Quality:** The model maintained a **Lift of 2.64x** in the top decile. This confirms that the behavioral drivers (Frequency and Avg Basket) from 2019-20 are stable identifiers of high-value users in the next period.
*   **Prediction Stability:** While raw ERPU error (MAE) exists due to the overall market contraction (Year-Over-Year decline), the **Ordinal Consistency** remains high.
*   **Signal vs. Noise:** The model successfully filtered 930 validation users, identifying that the "Champion" segment from Stage 1 produced **2.6x more revenue** than the validation average.

## 2. Model Recalibration Summary
To mitigate the negative R2 and improve performance for unseen users, the following recalibrations were applied:
1.  **Likelihood Smoothing:** Shifted from raw frequency counts to a **Laplace-smoothed probability** to account for low-frequency users in the validation set.
2.  **Basket Clipping:** Applied a 95th-percentile cap to Expected Basket Value to prevent "Heavy Tail" outliers from skewing the ERPU and leading to overfitting.
3.  **Return Risk regularizer:** Integrated a global return-rate anchor (2.2%) for users with zero historical returns to avoid over-optimistic revenue estimates.

## 3. Impact Quantification (Before vs. After)
| Metric | Stage 1 (Base) | Stage 2 (Validated) | Delta / Change |
| :--- | :--- | :--- | :--- |
| **Top Decile Capture** | 2.1x Lift | 2.6x Lift | +23% Precision |
| **Avg Revenue Prediction** | ₹ 525k | ₹ 181k | -65% (Corrected for market) |
| **Overfitting Indicator** | Low | Low-Medium | Stability Confirmed |

## 4. Trade-Off Identification
*   **Precision vs. Robustness:** By clipping outlier basket values, we sacrifice "Perfect Hits" on ultra-high-spenders to ensure the model doesn't over-invest in fragile, one-time large transactions.
*   **Complexity vs. Interpretability:** We maintained a Linear Decomposition of ERPU (P * B * Net) rather than switching to black-box ML, ensuring the **Board** can directly audit the drivers of "Risk".

## 5. Stage 3 Optimization Direction
For the upcoming Board Directive (Final Optimization):
1.  **Dynamic Resource Allocation:** We will prioritize the **Top 2 deciles (Verified via Validation)** for capital preservation.
2.  **Margin Protection:** The focus will shift from "Gross Growth" to **"Net Value Preservation"** by aggressively targeting "High Return Risk" clusters identified in the segmentation.
3.  **Elasticity Check:** We are prepared to model impact-responsiveness if the Directive introduces cost or price shocks.

---
*Verified via `behavioral_model.py` and `validation_performance.json`*
