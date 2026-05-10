# CASE STABILIS | Stage 3 Technical Appendix
**Team: Antigravity | Case 01**

## 1. Model Specifications

### 1.1 The Behavioral ERPU Framework
ERPU (Expected Revenue Per User) is defined as the product of three independent behavioral probability functions:

**`ERPU = P(Purchase) × E(Basket) × (1 - Return Rate)`**

*   **P(Purchase):** Modeled using **Laplace-smoothed Transaction Frequency** (Stage 2 Calibrated).
*   **E(Basket):** Modeled using **Historical Average Transaction Value (HATV)**, clipped at the **95th percentile (₹ 825k)** to control for heavy-tail outliers and overfitting.
*   **Net Revenue:** Defined as Gross Total minus Return Value (currently ~200M/72M in training).

### 1.2 Constraint Integration (Stage 3)
The Stage 3 optimization problem was solved using a **Greedy-Priority Algorithm** for a binary (retain/reject) decision under budget constraints:

*   **Objective:** `Maximize Σ Net Margin_i * d_i`
*   **Subject to:** `Σ (Cost_i * d_i) ≤ ₹ 25M`
*   **Subject to:** `Net Margin / Revenue ≥ 0.15`

## 2. Key Assumptions & Methods

### 2.1 Assumptions
1.  **Stationarity:** Behavioral drivers (Purchase frequency, Basket size) from the 2019-20 "Growth" period are ordinal predictors of behavior in the 2020-21 "Contraction" period (Validated by Stage 2).
2.  **Retention Impact:** Targeted interventions on "Champions" increase retention probability from **~85% (baseline) to 98% (active)**.
3.  **Return Risk:** Return rates for users with zero historical returns are anchored at the **global mean of 2.2%** (Laplace-smoothed).

### 2.2 Validation Approach
The model was validated using the **Customers_Validation_set(2020-2021)**.
*   **Train Lift:** 2.1x
*   **Validation Lift:** **2.64x** (Confirming robustness against market shocks).
*   **R2 Metric:** While raw revenue MAE was high due to deflation, the **Ranking Precision (Top Decile)** was the key deployment metric.

## 3. Sensitivity Analysis

| Shift Parameter | Change | Impact on Net Revenue | Risk Rating |
| :--- | :--- | :--- | :--- |
| Champion Retention | -5% | ₹ 138M decline | **CRITICAL** |
| Basket Clipping Cap | +20% | ₹ 412M (Theoretical) | **OVERFIT RISK** |
| Return Rate Expansion | +1% | ₹ 18M decline | **MEDIUM** |

## 4. Analytical Discipline
All code used for final optimization is included in `stage3_optimization.py`. The model maintains a strict separation between **Likelihood Modeling** and **Value Modeling** to avoid "Large-Basket Noise" from influencing "Consistency Clusters".

---
*Verified via `behavioral_model.py` and `stage3_results.json`*
