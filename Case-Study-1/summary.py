import pandas as pd
import json

def analyze():
    # Load
    df1 = pd.read_csv('Customers_Transactions(Year 2019-2020).csv')
    df2 = pd.read_csv('Customers_Transactions(Year 2020-2021).csv')
    
    # DateTime
    df1['EventDateTime'] = pd.to_datetime(df1['EventDateTime'])
    df2['EventDateTime'] = pd.to_datetime(df2['EventDateTime'], format='%d-%m-%Y %H:%M')
    
    # Revenue
    df1['Revenue'] = df1['Quantity'] * df1['UnitPrice']
    df2['Revenue'] = df2['Quantity'] * df2['UnitPrice']
    
    # Metrics
    def get_stats(df):
        purch = df[df['EventType'] == 'Purchased']
        ret = df[df['EventType'] == 'Returned']
        return {
            "total_transactions": len(df),
            "revenue": float(purch['Revenue'].sum()),
            "quantity": int(purch['Quantity'].sum()),
            "unique_users": int(df['UserID'].nunique()),
            "unique_products": int(df['ProductID'].nunique()),
            "return_val": float(abs(ret['Revenue'].sum())),
            "return_count": len(ret)
        }
    
    stats1 = get_stats(df1)
    stats2 = get_stats(df2)
    
    # Customer Delta
    u1 = set(df1['UserID'].unique())
    u2 = set(df2['UserID'].unique())
    retained = u1.intersection(u2)
    
    results = {
        "2019-20": stats1,
        "2020-21": stats2,
        "retention": {
            "u1_count": len(u1),
            "u2_count": len(u2),
            "retained_count": len(retained),
            "retention_rate": len(retained)/len(u1) if u1 else 0
        }
    }
    
    with open('analysis_results.json', 'w') as f:
        json.dump(results, f, indent=4)
    
    print("Analysis complete. Results in analysis_results.json")

if __name__ == "__main__":
    analyze()
