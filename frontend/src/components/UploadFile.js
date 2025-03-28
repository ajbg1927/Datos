import React, { useState } from "react";
import { subirArchivo } from "../services/api";

const UploadFile = () => {
    const [archivo, setArchivo] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        console.log("Archivo seleccionado:", file);  
        setArchivo(file);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Selecciona un archivo antes de subirlo.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("file", file);

        try {
            const response = await axios.post("http://localhost:5000/api/upload", formData);

            if (response.status === 200) {
                alert("Archivo subido correctamente");
                fetchData();
            }
        } catch (error) {
            console.error("Error al subir el archivo:", error);
        }
       
    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Subir Archivo</button>
        </div>
    );
};

export default UploadFile;