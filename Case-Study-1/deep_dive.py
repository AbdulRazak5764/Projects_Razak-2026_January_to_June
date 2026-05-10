import pandas as pd
import json

def deep_dive():
    df1 = pd.read_csv('Customers_Transactions(Year 2019-2020).csv')
    df2 = pd.read_csv('Customers_Transactions(Year 2020-2021).csv')
    
    df1['EventDateTime'] = pd.to_datetime(df1['EventDateTime'])
    df2['EventDateTime'] = pd.to_datetime(df2['EventDateTime'], format='%d-%m-%Y %H:%M')
    
    df1['Revenue'] = df1['Quantity'] * df1['UnitPrice']
    df2['Revenue'] = df2['Quantity'] * df2['UnitPrice']
    
    # Monthly Trends
    mon1 = df1[df1['EventType']=='Purchased'].groupby(df1['EventDateTime'].dt.to_period('M'))['Revenue'].sum()
    mon2 = df2[df2['EventType']=='Purchased'].groupby(df2['EventDateTime'].dt.to_period('M'))['Revenue'].sum()
    
    monthly_trends = {
        "2019-20": {str(k): v for k, v in mon1.to_dict().items()},
        "2020-21": {str(k): v for k, v in mon2.to_dict().items()}
    }
    
    # Top Products by Revenue
    top1 = df1[df1['EventType']=='Purchased'].groupby('ProductName')['Revenue'].sum().sort_values(ascending=False).head(10)
    top2 = df2[df2['EventType']=='Purchased'].groupby('ProductName')['Revenue'].sum().sort_values(ascending=False).head(10)
    
    products = {
        "2019-20": top1.to_dict(),
        "2020-21": top2.to_dict()
    }
    
    # Customer Concentration (Pareto Principle)
    cust1 = df1[df1['EventType']=='Purchased'].groupby('UserID')['Revenue'].sum().sort_values(ascending=False)
    cust2 = df2[df2['EventType']=='Purchased'].groupby('UserID')['Revenue'].sum().sort_values(ascending=False)
    
    top20_perc_count1 = int(len(cust1) * 0.2)
    top20_rev1 = cust1.head(top20_perc_count1).sum()
    
    top20_perc_count2 = int(len(cust2) * 0.2)
    top20_rev2 = cust2.head(top20_perc_count2).sum()
    
    concentration = {
        "2019-20": {"top20_percent_revenue": top20_rev1 / cust1.sum()},
        "2020-21": {"top20_percent_revenue": top20_rev2 / cust2.sum()}
    }
    
    results = {
        "monthly_trends": monthly_trends,
        "top_products": products,
        "concentration": concentration
    }
    
    with open('deep_dive_results.json', 'w') as f:
        json.dump(results, f, indent=4)
    print("Deep dive complete.")

if __name__ == "__main__":
    deep_dive()
