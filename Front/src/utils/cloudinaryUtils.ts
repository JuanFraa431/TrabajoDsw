import axios from "axios";

// Configuración de Cloudinary
const CLOUDINARY_CLOUD_NAME = "dy8lzfj2h";
const CLOUDINARY_UPLOAD_PRESET = "ml_default";

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
}

/**
 * Sube una imagen a Cloudinary
 * @param file El archivo de imagen a subir
 * @returns La URL segura de la imagen subida
 */
export const uploadImageToCloudinary = async (
  file: File
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;
  
  const response = await axios.post<CloudinaryUploadResult>(cloudinaryUrl, formData);
  return response.data.secure_url;
};

/**
 * Configura el listener para el botón de subir imagen en un modal SweetAlert
 * @param inputId ID del input file
 * @param urlInputId ID del input de texto donde se mostrará la URL
 * @param statusId ID del elemento donde se mostrará el estado de carga
 */
export const setupCloudinaryUpload = (
  inputId: string,
  urlInputId: string,
  statusId: string
): void => {
  const fileInput = document.getElementById(inputId) as HTMLInputElement;
  const urlInput = document.getElementById(urlInputId) as HTMLInputElement;
  const statusElement = document.getElementById(statusId) as HTMLElement;

  if (fileInput && urlInput && statusElement) {
    fileInput.addEventListener("change", async (event) => {
      const target = event.target as HTMLInputElement;
      const files = target.files;
      
      if (!files || files.length === 0) return;

      const file = files[0];
      
      // Validar que sea una imagen
      if (!file.type.startsWith("image/")) {
        statusElement.textContent = "Error: Solo se permiten imágenes";
        statusElement.style.color = "#dc3545";
        return;
      }

      // Mostrar estado de carga
      statusElement.textContent = "Subiendo imagen...";
      statusElement.style.color = "#007bff";
      urlInput.disabled = true;

      try {
        const imageUrl = await uploadImageToCloudinary(file);
        urlInput.value = imageUrl;
        statusElement.textContent = "¡Imagen subida correctamente!";
        statusElement.style.color = "#28a745";
      } catch (error) {
        console.error("Error al subir imagen:", error);
        statusElement.textContent = "Error al subir la imagen";
        statusElement.style.color = "#dc3545";
      } finally {
        urlInput.disabled = false;
      }
    });
  }
};

/**
 * Genera el HTML para el campo de imagen con subida a Cloudinary
 * @param currentValue Valor actual de la URL de imagen
 * @param inputIdPrefix Prefijo para los IDs de los elementos (para evitar conflictos)
 * @returns String HTML para insertar en el modal
 */
export const getCloudinaryImageFieldHTML = (
  currentValue: string = "",
  inputIdPrefix: string = "swal"
): string => {
  return `
    <div class="swal-form-group cloudinary-upload-group">
      <label>Imagen</label>
      <div class="cloudinary-upload-container">
        <input 
          id="${inputIdPrefix}-input-imagen" 
          type="text" 
          value="${currentValue}" 
          placeholder="URL de la imagen o sube una..."
          class="cloudinary-url-input"
        />
        <label for="${inputIdPrefix}-input-file" class="cloudinary-upload-btn">
          Subir
        </label>
        <input 
          id="${inputIdPrefix}-input-file" 
          type="file" 
          accept="image/*"
          style="display: none;"
        />
      </div>
      <div id="${inputIdPrefix}-upload-status" class="cloudinary-upload-status"></div>
    </div>
  `;
};

/**
 * Genera el HTML para el campo de imagen en formato full-width
 */
export const getCloudinaryImageFieldHTMLFullWidth = (
  currentValue: string = "",
  inputIdPrefix: string = "swal"
): string => {
  return `
    <div class="sweet-form-row full-width cloudinary-upload-group">
      <label for="${inputIdPrefix}-input-imagen">Imagen</label>
      <div class="cloudinary-upload-container">
        <input 
          id="${inputIdPrefix}-input-imagen" 
          type="text" 
          value="${currentValue}" 
          placeholder="URL de la imagen o sube una..."
          class="cloudinary-url-input"
        />
        <label for="${inputIdPrefix}-input-file" class="cloudinary-upload-btn">
          Subir
        </label>
        <input 
          id="${inputIdPrefix}-input-file" 
          type="file" 
          accept="image/*"
          style="display: none;"
        />
      </div>
      <div id="${inputIdPrefix}-upload-status" class="cloudinary-upload-status"></div>
    </div>
  `;
};
