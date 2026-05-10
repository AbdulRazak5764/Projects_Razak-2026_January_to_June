import pandas as pd
import numpy as np
import datetime as dt

def rfm():
    # Merge datasets for a full view
    df1 = pd.read_csv('Customers_Transactions(Year 2019-2020).csv')
    df2 = pd.read_csv('Customers_Transactions(Year 2020-2021).csv')
    
    df1['EventDateTime'] = pd.to_datetime(df1['EventDateTime'])
    df2['EventDateTime'] = pd.to_datetime(df2['EventDateTime'], format='%d-%m-%Y %H:%M')
    
    df = pd.concat([df1, df2])
    df = df[df['EventType'] == 'Purchased']
    df['Revenue'] = df['Quantity'] * df['UnitPrice']
    
    # Latest date for recency calculation
    now = df['EventDateTime'].max() + dt.timedelta(days=1)
    
    # RFM Table
    rfm_df = df.groupby('UserID').agg({
        'EventDateTime': lambda x: (now - x.max()).days, # Recency
        'EventID': 'nunique',                           # Frequency
        'Revenue': 'sum'                                # Monetary
    })
    
    rfm_df.columns = ['Recency', 'Frequency', 'Monetary']
    
    # Scores (1-5)
    rfm_df['R_Score'] = pd.qcut(rfm_df['Recency'], 5, labels=[5, 4, 3, 2, 1])
    rfm_df['F_Score'] = pd.qcut(rfm_df['Frequency'].rank(method='first'), 5, labels=[1, 2, 3, 4, 5])
    rfm_df['M_Score'] = pd.qcut(rfm_df['Monetary'], 5, labels=[1, 2, 3, 4, 5])
    
    rfm_df['RFM_Score'] = rfm_df['R_Score'].astype(str) + rfm_df['F_Score'].astype(str) + rfm_df['M_Score'].astype(str)
    
    # Segments
    def segment(row):
        score = int(row['R_Score']) + int(row['F_Score']) + int(row['M_Score'])
        if score >= 13: return 'Champions'
        if score >= 10: return 'Loyal Customers'
        if score >= 7: return 'At Risk'
        if score >= 4: return 'Hibernating'
        return 'Lost'
        
    rfm_df['Segment'] = rfm_df.apply(segment, axis=1)
    
    seg_summary = rfm_df.groupby('Segment').agg({
        'Monetary': ['mean', 'sum', 'count']
    }).reset_index()
    
    seg_summary.to_json('rfm_summary.json', orient='records')
    print("RFM Analysis complete.")

if __name__ == "__main__":
    rfm()
