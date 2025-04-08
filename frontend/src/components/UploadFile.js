import React, { useState } from "react";
import { subirArchivo, getHojas, getDatosHoja } from "../services/api";

const UploadFile = () => {
    const [archivo, setArchivo] = useState(null);
    const [nombreArchivo, setNombreArchivo] = useState("");
    const [hojas, setHojas] = useState([]);
    const [hojaSeleccionada, setHojaSeleccionada] = useState("");

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setArchivo(file);
        setNombreArchivo(file.name);
    };

    const handleUpload = async () => {
        if (!archivo) {
            alert("Selecciona un archivo antes de subirlo.");
            return;
        }

        try {
            await subirArchivo(archivo);
            alert("Archivo subido correctamente");
            const hojasResponse = await getHojas(nombreArchivo);
            setHojas(hojasResponse.hojas || []);
        } catch (error) {
            console.error("Error al subir el archivo o al obtener las hojas:", error);
            alert("Error al subir el archivo o al obtener las hojas.");
        }
    };

    const handleSeleccionHoja = async (event) => {
        const hoja = event.target.value;
        setHojaSeleccionada(hoja);

        try {
            const datos = await getDatosHoja(nombreArchivo, hoja);
            console.log("Datos recibidos:", datos);
        } catch (error) {
            console.error("Error al obtener los datos de la hoja:", error);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Subir Archivo</button>

            {hojas.length > 0 && (
                <div>
                    <label>Selecciona una hoja:</label>
                    <select onChange={handleSeleccionHoja} value={hojaSeleccionada}>
                        <option value="">-- Selecciona una hoja --</option>
                        {hojas.map((hoja, index) => (
                            <option key={index} value={hoja}>{hoja}</option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
};

export default UploadFile;