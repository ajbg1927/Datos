const API_URL = "http://127.0.0.1:5000";

export const subirArchivo = async (archivo) => {
    const formData = new FormData();
    formData.append("archivo", archivo);

    console.log("Archivo enviado:", archivo);
    console.log("FormData enviado:", formData);

    try {
        const response = await fetch("http://127.0.0.1:5000/subir", {
            method: "POST",  
            body: formData,  
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error en subida:", errorData);
            throw new Error(errorData.error || "Error al subir archivo");
        }

        return response.json();
    } catch (error) {
        console.error("Error en la solicitud:", error);
        throw error;
    }
};
export const getHojas = async (nombreArchivo) => {
    const response = await fetch(`${API_URL}/hojas/${nombreArchivo}`);
    return response.json();
};

export const getDatosHoja = async (nombreArchivo, nombreHoja) => {
    const response = await fetch(`${API_URL}/datos/${nombreArchivo}/${nombreHoja}`);
    return response.json();
};