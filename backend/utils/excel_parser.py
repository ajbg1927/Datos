import pandas as pd

def extraer_tablas_relevantes(ruta_archivo, nombre_hoja="Hoja1", filtro_dependencia=None):
    wb = pd.ExcelFile(ruta_archivo)
    df = wb.parse(nombre_hoja, header=None).fillna("")

    tablas_detectadas = []
    start_row = 0
    while start_row < len(df):
        while start_row < len(df) and df.iloc[start_row].astype(str).str.strip().isnull().all():
            start_row += 1

        if start_row >= len(df):
            break

        header_row = start_row
        encabezados = df.iloc[header_row].astype(str).str.strip().tolist()
        start_row += 1

        data_rows = []
        while start_row < len(df) and not df.iloc[start_row].astype(str).str.strip().isnull().all():
            data_rows.append(df.iloc[start_row].tolist())
            start_row += 1

        if data_rows:
            tabla_df = pd.DataFrame(data_rows, columns=encabezados)
            tabla_df = tabla_df.dropna(how="all")

            if filtro_dependencia and "Dependencia" in tabla_df.columns:
                tabla_df_filtrado = tabla_df[tabla_df["Dependencia"].astype(str).str.strip() == filtro_dependencia]
                if not tabla_df_filtrado.empty:
                    tablas_detectadas.append({
                        "nombre": f"Tabla desde fila {header_row + 1}",
                        "headers": encabezados,
                        "data": tabla_df_filtrado.to_dict(orient="records")
                    })
            elif filtro_dependencia is None:
                tablas_detectadas.append({
                    "nombre": f"Tabla desde fila {header_row + 1}",
                    "headers": encabezados,
                    "data": tabla_df.to_dict(orient="records")
                })

        while start_row < len(df) and df.iloc[start_row].astype(str).str.strip().isnull().all():
            start_row += 1

    return {"tablas": tablas_detectadas}