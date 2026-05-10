# Case STABILIS | Stage 1: Baseline Diagnosis
**Team: Antigravity | Case 01**

## 1. Problem Framing
The business "STABILIS" is a retail organization experiencing a structural contraction. Between 2019-20 and 2020-21, revenue dropped by **23%** while user base contracted by **7%**. This mismatch indicates a significant decline in **Average Order Value (AOV)** and frequency among retained users. The objective of Stage 1 is to diagnose the core drivers of this volatility and establish a stability-first baseline before the anticipated Stage 2 Regime Shift.

## 2. Analytical Diagnosis (2019 - 2021)
### Key Performance Indicators (KPIs)
| Metric | 2019-2020 | 2020-2021 | Change (%) |
| :--- | :--- | :--- | :--- |
| **Total Revenue** | 2.30 B | 1.78 B | -22.7% |
| **Transaction Volume** | 417,534 | 323,055 | -22.6% |
| **Unique Customers** | 4,383 | 4,068 | -7.1% |
| **Retention Rate** | - | 60.5% | - |
| **Return Rate (%)** | 2.36% | 2.25% | -4.6% |

### Monthly Trends
Revenue peaks in **November (Holiday Season)**, but the 2021 peak was significantly lower (246M) compared to 2020 (309M), indicating a structural ceiling in demand or supply chain disruptions affecting top-line growth.

## 3. Key Drivers & Segmentation
Using **RFM (Recency, Frequency, Monetary) Analysis**, we identified five distinct customer segments:

1.  **Champions (1,235 Users)**: Top 28% of users contributing **~68% of total revenue**. Average spend: **2.2M**.
2.  **Loyal Customers (1,344 Users)**: Consistent buyers with average spend of **0.6M**.
3.  **At Risk (1,422 Users)**: High historical value but declining recency.
4.  **Hibernating/Lost**: Low value users.

**The Driver of Decline**: Churn is not the primary issue (7% loss); the **drop in spend per user** is the critical vulnerability. High-value "Champions" are either buying less or moving to competitors.

## 4. Analytical Model: Stability Simulation
We simulated a budget-constrained optimization model for stabilizing revenue:
- **Baseline Forecast**: ~$3.1B (Projected combined next-cycle)
- **High-Touch Retention ROI**: 4.4x (Investing in Champions)
- **At-Risk Recovery ROI**: 1.2x

**Conclusion**: Stability depends on **Champion Deflection**. A 1% increase in Champion churn causes a 10% drop in total net margin.

## 5. Initial Strategy: The "Stabilis" Shield
1.  **Defend the Core**: Implement a VIP priority status for the top 1,235 "Champions" to ensure supply chain stability for high-demand products (e.g., "REGENCY CAKESTAND", "VANITY MIRROR").
2.  **Selective Recovery**: Target "At-Risk" users who have a historical monetary score of 5 with reactivation vouchers.
3.  **Efficiency over Scale**: Focus on reducing the **Returns Value (currently ~72M - 200M)** by improving product descriptions for top items, directly impacting bottom-line stability.

---
*Technical Appendix and Supporting Code: `summary.py`, `deep_dive.py`, `rfm_analysis.py`, `optimization.py`*
