import numpy as np

def optimize():
    # Parameters from Analysis
    base_users = 4068
    champions = 1235
    at_risk = 1422
    loyal = 1344
    
    avg_spend_champ = 2221006
    avg_spend_loyal = 597164
    avg_spend_at_risk = 261195
    
    # Optimization Model: Maximize Expected Revenue
    # Constraints: Budget = 50M
    budget = 50_000_000
    
    cost_per_champ_retain = 10000 # Loyalty perks
    cost_per_at_risk_reactivate = 20000 # Vouchers
    cost_per_acquisition = 50000 # Ad spend
    
    # Baseline (No spend)
    # Retention rates: Champ 90%, Loyal 70%, At-Risk 40% (Estimates)
    base_rev = (champions * 0.9 * avg_spend_champ) + (loyal * 0.7 * avg_spend_loyal) + (at_risk * 0.2 * avg_spend_at_risk)
    
    print(f"Baseline Revenue Forecast: {base_rev:,.2f}")
    
    # Scenario A: All-in on Champions
    champ_rev = (champions * 0.98 * avg_spend_champ) + (loyal * 0.7 * avg_spend_loyal) + (at_risk * 0.2 * avg_spend_at_risk)
    print(f"Champ-First Revenue Forecast: {champ_rev:,.2f} (ROI: {(champ_rev-base_rev)/budget:.2f})")
    
    # Scenario B: Reactivate At-Risk
    # 50M / 20k = 2500 users can be targeted. We only have 1422.
    # Spend 1422 * 20000 = 28.4M. Remaining 21.6M on Acquisition.
    at_risk_rev = (champions * 0.9 * avg_spend_champ) + (loyal * 0.7 * avg_spend_loyal) + (at_risk * 0.6 * avg_spend_at_risk)
    print(f"At-Risk-First Revenue Forecast: {at_risk_rev:,.2f}")
    
    # Recommendation
    print("\n--- Strategy Recommendation ---")
    print("1. Defend the Champions: High-value retention is the most stable path.")
    print("2. Tactical Re-activation: Re-target At-Risk segments with high historical monetary value.")

if __name__ == "__main__":
    optimize()
