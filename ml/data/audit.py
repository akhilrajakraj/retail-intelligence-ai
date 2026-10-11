
from pathlib import Path

import pandas as pd

DATA_PATH = Path("data/raw/online_retail_II.xlsx")

EXPECTED_COLUMNS = [
    "Invoice",
    "StockCode",
    "Description",
    "Quantity",
    "InvoiceDate",
    "Price",
    "Customer ID",
    "Country",
]


def main():
    if not DATA_PATH.exists():
        raise FileNotFoundError(
            f"Dataset not found: {DATA_PATH.resolve()}"
        )

    sheets = pd.read_excel(
        DATA_PATH,
        sheet_name=None,
        engine="openpyxl",
    )

    for sheet_name, df in sheets.items():
        print(f"\n{'=' * 55}")
        print(f"SHEET: {sheet_name}")
        print(f"{'=' * 55}")

        print("Shape:", df.shape)
        print("\nColumns:")
        print(df.columns.tolist())

        missing = df.isnull().sum().sort_values(
            ascending=False
        )

        print("\nMissing values:")
        print(missing[missing > 0])

        print("\nDuplicate rows:", df.duplicated().sum())

        print("\nData types:")
        print(df.dtypes)

        print("\nFirst five rows:")
        print(df.head())

        print("\nDate range:")
        dates = pd.to_datetime(
            df["InvoiceDate"], errors="coerce"
        )
        print("Earliest:", dates.min())
        print("Latest:", dates.max())

        print("\nQuantity and price summary:")
        print(df[["Quantity", "Price"]].describe())

        if list(df.columns) != EXPECTED_COLUMNS:
            print(
                "\nNote: column names/order differ from "
                "the expected schema. Inspect before processing."
            )


if __name__ == "__main__":
    main()
