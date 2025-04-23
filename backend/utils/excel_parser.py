import pandas as pd

def extraer_tablas_relevantes(ruta_archivo, nombre_hoja="Hoja1", filtro_dependencia=None):
    wb = pd.ExcelFile(ruta_archivo)
    df = wb.parse(nombre_hoja, header=None)

    tablas = {}
    encabezados_referencia = {
        "cdps": ["CDP", "Dependencia", "Valor"],
        "rps": ["RP", "Dependencia", "Valor"],
        "obligaciones": ["Obligación", "Valor"],
        "pagos": ["Pago", "Fecha", "Valor"],
        "contratos": ["Contrato", "Objeto", "Valor"],
        "presupuesto": ["Rubro", "Inicial", "Definitivo"],
        "reservas": ["Reserva", "Valor"],
        "disponibilidades": ["Disponibilidad", "Valor"]
    }

    i = 0
    while i < len(df):
        fila = df.iloc[i].fillna("").astype(str).str.strip().tolist()
        for nombre_tabla, posibles_columnas in encabezados_referencia.items():
            if any(col in fila for col in posibles_columnas):
                columnas_detectadas = fila
                datos = []
                i += 1
                while i < len(df) and df.iloc[i].notna().sum() > 1:
                    datos.append(df.iloc[i])
                    i += 1
                if datos:
                    bloque_df = pd.DataFrame(datos)
                    bloque_df.columns = columnas_detectadas
                    bloque_df = bloque_df.dropna(how="all")
                    if filtro_dependencia and "Dependencia" in bloque_df.columns:
                        bloque_df = bloque_df[bloque_df["Dependencia"] == filtro_dependencia]
                    tablas[nombre_tabla] = bloque_df.to_dict(orient="records")
                break
        i += 1

    return tablas