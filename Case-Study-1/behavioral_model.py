import pandas as pd
import numpy as np
import json
from sklearn.metrics import mean_absolute_error, r2_score

def build_model():
    # Load Training Data (Year 1)
    df_train = pd.read_csv('Customers_Transactions(Year 2019-2020).csv')
    df_train['EventDateTime'] = pd.to_datetime(df_train['EventDateTime'])
    df_train['Revenue'] = df_train['Quantity'] * df_train['UnitPrice']
    
    # User-level Features (Aggregated on Training)
    def aggregate_behavior(df):
        # Separate purchase and returns
        purch = df[df['EventType'] == 'Purchased']
        ret = df[df['EventType'] == 'Returned']
        
        user_agg = purch.groupby('UserID').agg({
            'EventID': 'nunique',
            'Revenue': ['sum', 'mean'],
            'Quantity': 'sum'
        })
        user_agg.columns = ['Freq', 'GrossRev', 'AvgBasket', 'TotalQty']
        
        # Return Risk
        ret_val = ret.groupby('UserID')['Revenue'].sum().abs()
        user_agg['ReturnVal'] = ret_val
        user_agg['ReturnVal'] = user_agg['ReturnVal'].fillna(0)
        user_agg['ReturnProb'] = user_agg['ReturnVal'] / user_agg['GrossRev']
        user_agg['ReturnProb'] = user_agg['ReturnProb'].replace([np.inf, -np.inf], 0).fillna(0)
        
        # P(Repeat) - for training this is historical, we'll model it as "active vs dormant"
        # For simplicity in this diagnostic stage: P = frequency / max_observed_frequency (normalized activity)
        user_agg['PurchaseLikelihood'] = user_agg['Freq'] / user_agg['Freq'].max()
        
        # Expected Revenue Per User (ERPU)
        user_agg['ERPU'] = user_agg['PurchaseLikelihood'] * user_agg['AvgBasket'] * (1 - user_agg['ReturnProb'])
        
        return user_agg

    train_results = aggregate_behavior(df_train)
    
    # Save Model Parameters (as averages per segment or global stats for Stage 1 Baseline)
    model_metadata = {
        "avg_purchase_likelihood": float(train_results['PurchaseLikelihood'].mean()),
        "avg_basket_value": float(train_results['AvgBasket'].mean()),
        "avg_return_rate": float(train_results['ReturnProb'].mean()),
        "baseline_erpu": float(train_results['ERPU'].mean())
    }
    
    with open('model_stage1_baseline.json', 'w') as f:
        json.dump(model_metadata, f, indent=4)
        
    print("Stage 1 Model Built & Baseline Saved.")
    return train_results, model_metadata

def validate_model(train_results):
    # Load Validation Data
    df_val = pd.read_csv('Customers_Validation_set(Year 2020-2021).csv')
    df_val['EventDateTime'] = pd.to_datetime(df_val['EventDateTime'], errors='coerce')
    df_val['Revenue'] = df_val['Quantity'] * df_val['UnitPrice']
    
    # Calculate Ground Truth for Validation period
    val_purch = df_val[df_val['EventType'] == 'Purchased']
    val_ret = df_val[df_val['EventType'] == 'Returned']
    
    actual_val = val_purch.groupby('UserID').agg({
        'Revenue': 'sum'
    }).rename(columns={'Revenue': 'ActualRevenue'})
    
    # Score Validation Users using Train logic
    # Join Predicted ERPU from training to Validation ground truth
    combined = actual_val.join(train_results[['ERPU', 'PurchaseLikelihood', 'AvgBasket']], how='inner')
    
    # Evaluation Metrics
    # Since ERPU is a "per-user potential", we compare it with actual realized revenue in the next period
    mae = mean_absolute_error(combined['ActualRevenue'], combined['ERPU'])
    r2 = r2_score(combined['ActualRevenue'], combined['ERPU'])
    
    # Ranking Quality (Lift)
    combined['Pred_Decile'] = pd.qcut(combined['ERPU'], 10, labels=False, duplicates='drop')
    lift = combined.groupby('Pred_Decile')['ActualRevenue'].mean()
    
    val_stats = {
        "mae": float(mae),
        "r2": float(r2),
        "lift_top_decile": float(lift.iloc[-1] / combined['ActualRevenue'].mean()),
        "n_validation_users": len(combined)
    }
    
    with open('validation_performance.json', 'w') as f:
        json.dump(val_stats, f, indent=4)
        
    print("Validation Complete. Performance data saved.")

if __name__ == "__main__":
    train_results, metadata = build_model()
    validate_model(train_results)
