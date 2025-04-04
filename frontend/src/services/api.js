const API_URL = "https://backend-flask-0rnq.onrender.com"; 

export const subirArchivo = async (archivo) => {
    const formData = new FormData();
    formData.append("archivo", archivo);

    try {
        const response = await fetch(`${API_URL}/subir`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
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