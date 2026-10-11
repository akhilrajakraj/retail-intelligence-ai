# Retail Intelligence AI — Model Card

## 1. Project Overview

Retail Intelligence AI analyzes historical online retail transactions to
support customer retention and customer segmentation.

Dataset: UCI Online Retail II (2009–2011)
Dataset DOI: https://doi.org/10.24432/C5CG6D

## 2. Customer Inactivity Prediction

### Objective
Predict whether an identifiable customer will make no qualifying purchase
during the 90 days following a snapshot cutoff.

This is a time-bounded inactivity label, not proof of permanent churn.

### Model
- Algorithm: Logistic Regression
- Preprocessing: Median imputation and StandardScaler
- Class handling: class_weight="balanced"
- Random state: 42
- Observation window: 180 days
- Prediction horizon: 90 days

### Validation Results
- Average Precision: 0.7493
- ROC-AUC: 0.7430
- Selected threshold: approximately 0.4130
- Precision at selected threshold: 0.6709
- Recall at selected threshold: 0.9050
- F1 at selected threshold: 0.7706

### Test Results
- Average Precision: 0.5999
- ROC-AUC: 0.7335
- Precision: 0.4862
- Recall: 0.9229
- F1: 0.6369

The test results use the threshold selected on validation data.

### Limitations
- Test precision is relatively low, so many flagged customers may still
  make a purchase within the following 90 days.
- The test average precision is lower than validation average precision.
- The inactivity rate differs across chronological splits.
- Predicted probabilities have not been evaluated for calibration.
- Predictions are based on historical transaction behavior and do not
  establish why a customer may stop purchasing.

## 3. Customer Segmentation

### Objective
Group customers according to historical purchase recency, frequency,
and monetary value (RFM).

### Model and preprocessing
- Algorithm: K-Means
- Number of clusters: 4
- Random state: 42
- Features: recency_days, frequency, monetary
- Transformation: log1p followed by StandardScaler
- Reference date: 2011-12-01
- Observation window: 180 days

### Segment Labels
- Cluster 0: Regular Mid-Value Customers
- Cluster 1: Less-Recent Low-Frequency Customers
- Cluster 2: Recent Occasional Customers
- Cluster 3: Recent High-Value Loyalists

These labels are descriptive interpretations of historical RFM profiles.
They are not permanent customer attributes.

### Model Selection Note
K-Means with two clusters achieved a higher silhouette score than the
four-cluster solution. Four clusters were retained as a pragmatic choice
to provide more differentiated business segments. This is a tradeoff,
not evidence that four clusters are statistically optimal.

## 4. Intended Uses

- Demonstration of customer analytics in a portfolio project
- Exploratory retention prioritization
- Historical customer segmentation
- Educational demonstrations and dashboard visualizations

## 5. Uses Requiring Caution

- Do not treat inactivity predictions as certainty.
- Do not automatically exclude customers from offers or services.
- Validate performance on newer data before operational deployment.
- Monitor performance and segment distributions as customer behavior changes.

## 6. Reproducibility

Saved artifacts include the fitted inactivity model, segmentation model,
RFM scaler, and associated metadata. Segmentation assignments were
reproduced successfully after reloading the saved model and scaler.
