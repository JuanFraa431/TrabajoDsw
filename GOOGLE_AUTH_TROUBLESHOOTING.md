# Solución de problemas - Google Auth

## Errores encontrados y soluciones

### 1. Error: "Could not establish connection. Receiving end does not exist" (polyfill.js)

Este error es causado por **extensiones del navegador** que interfieren con Google Sign-In.

**Solución:**

1. **Deshabilita todas las extensiones del navegador** temporalmente
2. Prueba en modo **Incognito/Privado** (Ctrl+Shift+N en Chrome/Edge)
3. Si funciona en incognito, el problema es una extensión. Reactiva extensiones una por una para encontrar la culpable.

**Extensiones problemáticas comunes:**

- Ad blockers (uBlock Origin, AdBlock, etc.)
- Privacy extensions (Privacy Badger, Ghostery)
- VPNs
- Extensions de desarrollo/testing

---

### 2. Error: "Server did not send the correct CORS headers"

Ya corregido en el código del backend con la configuración de CORS actualizada.

---

### 3. Verificar configuración de Google Cloud Console

**IMPORTANTE: Debes configurar tu proyecto en Google Cloud Console**

1. Ve a: https://console.cloud.google.com/
2. Selecciona tu proyecto o crea uno nuevo
3. Ve a "APIs y servicios" > "Credenciales"
4. Selecciona tu OAuth 2.0 Client ID: `1013873914332-sf1up07lqjoch6tork8cpfohi32st8pi`

5. **Asegúrate de agregar estos URIs autorizados:**

   **Orígenes de JavaScript autorizados:**

   ```
   http://localhost:8080
   http://localhost:3000
   ```

   **URIs de redireccionamiento autorizados (DEJAR VACÍO para Google Identity Services)**
   - No necesitas URIs de redirección para el flujo que usamos

---

### 4. Pasos para probar el login

1. **Reinicia ambos servidores:**

   ```bash
   # Terminal 1 - Backend
   cd Back
   npm run startBack

   # Terminal 2 - Frontend
   cd Front
   npm run startFront
   ```

2. **Abre el navegador en modo incognito:**
   - Chrome/Edge: Ctrl+Shift+N
   - Firefox: Ctrl+Shift+P

3. **Ve a:** http://localhost:8080/login

4. **Abre la consola del navegador** (F12) para ver los logs

5. **Haz clic en el botón de Google:**
   - Ahora deberías ver un botón de Google renderizado (nuevo)
   - O el botón personalizado si el primero falla

6. **Revisa los logs en la consola:**
   - Deberías ver: "Google Identity Services script loaded successfully"
   - Luego: "Google initialized successfully"
   - Al hacer clic: "Google token received, sending to backend..."

---

### 5. Verificar que el backend recibe la petición

En la terminal del backend deberías ver:

```
Received Google login request
Verifying Google token...
Google token verified successfully
```

---

## Cambios implementados

### Frontend (Login.tsx):

- ✅ Script de Google cargado correctamente
- ✅ Botón de Google renderizado (método oficial más confiable)
- ✅ Botón alternativo como fallback
- ✅ Mejor manejo de errores
- ✅ withCredentials habilitado para CORS

### Backend (server.ts):

- ✅ CORS configurado para aceptar dominios de Google
- ✅ Headers y métodos HTTP permitidos
- ✅ Credentials habilitados
- ✅ Eliminado Passport que causaba conflictos

### Backend (usuario.controller.ts):

- ✅ Mejor logging para debugging
- ✅ Manejo robusto de errores
- ✅ Creación/actualización automática de usuarios

---

## Si el problema persiste

1. **Verifica que no haya extensiones activas** (modo incognito)
2. **Limpia la caché del navegador** (Ctrl+Shift+Delete)
3. **Verifica la consola del backend** para ver si llega la petición
4. **Verifica la consola del frontend** para ver errores específicos
5. **Asegúrate de que ambos servidores están corriendo:**
   - Backend en http://localhost:3000
   - Frontend en http://localhost:8080

---

## Comandos útiles para debugging

### Ver peticiones en el backend:

El controlador ahora tiene console.log que muestra:

- Cuando recibe la petición
- El resultado de la verificación del token
- Errores específicos

### Ver en el navegador:

Abre DevTools (F12) > Console para ver todos los logs.

---

## Contacto con Google

Si después de todo esto sigue sin funcionar, verifica:

1. Que el Client ID sea válido y activo
2. Que el proyecto de Google Cloud no esté suspendido
3. Que tengas cuota disponible en Google Cloud
