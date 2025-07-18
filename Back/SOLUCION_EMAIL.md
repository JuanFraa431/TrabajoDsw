# 🚨 Solución al Error de Autenticación Gmail

## Error Actual
```
Error: Invalid login: 535-5.7.8 Username and Password not accepted
```

## ✅ Pasos para Solucionarlo

### 1. Verificar Contraseña de Aplicación

**IMPORTANTE**: Gmail ya NO acepta contraseñas normales para aplicaciones de terceros.

#### Pasos para crear una contraseña de aplicación:

1. **Ve a tu cuenta de Google**: https://myaccount.google.com
2. **Habilita la verificación en 2 pasos**:
   - Seguridad → Verificación en 2 pasos → Empezar
   - Sigue los pasos para activarla

3. **Crea una contraseña de aplicación**:
   - Seguridad → Verificación en 2 pasos → Contraseñas de aplicaciones
   - Selecciona "Correo" y tu dispositivo
   - **Copia la contraseña de 16 caracteres que aparece**

4. **Actualiza el archivo .env**:
   ```env
   EMAIL_PASS=xxxx xxxx xxxx xxxx  # La contraseña de 16 caracteres
   ```

### 2. Verificar la Configuración

Usa estos endpoints para probar:

#### Verificar conexión SMTP:
```bash
GET http://localhost:3000/api/email/verificar
```

#### Enviar email de prueba:
```bash
POST http://localhost:3000/api/email/prueba
Content-Type: application/json

{
  "email": "tu_email@gmail.com"
}
```

### 3. Alternativas si Gmail sigue fallando

#### Opción A: Usar otro proveedor
Si tienes problemas con Gmail, puedes usar:

**Outlook/Hotmail:**
```env
EMAIL_SERVICE=hotmail
EMAIL_USER=tu_email@outlook.com
EMAIL_PASS=tu_contraseña
```

**Yahoo:**
```env
EMAIL_SERVICE=yahoo
EMAIL_USER=tu_email@yahoo.com
EMAIL_PASS=tu_contraseña_de_aplicacion
```

#### Opción B: Configuración SMTP personalizada
```typescript
// En emailService.ts
this.transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false
    }
});
```

### 4. Verificación de Variables de Entorno

Asegúrate de que el archivo `.env` esté en la raíz del proyecto Back/:

```
Back/
├── .env          ← Aquí debe estar
├── package.json
├── src/
└── ...
```

### 5. Testing Step by Step

1. **Reinicia el servidor** después de cambiar `.env`
2. **Verifica la conexión**: `GET /api/email/verificar`
3. **Envía email de prueba**: `POST /api/email/prueba`
4. **Si funciona**, prueba creando una reserva

### 6. Debugging

Si sigues teniendo problemas, verifica:

- ✅ Verificación en 2 pasos activada
- ✅ Contraseña de aplicación creada correctamente
- ✅ Variables de entorno cargadas (sin espacios extra)
- ✅ Servidor reiniciado después de cambios en .env

### 7. Logs Útiles

El sistema ahora muestra logs más descriptivos:
- ✅ Conexión SMTP verificada exitosamente
- ❌ Error en la conexión SMTP: [detalles]
- ✅ Email enviado a: ejemplo@email.com

## 🎯 Resultado Esperado

Una vez configurado correctamente, deberías ver:
```
✅ Conexión SMTP verificada exitosamente
✅ Email de confirmación enviado a: usuario@email.com
```

## 📞 Si Necesitas Ayuda

1. Primero prueba los endpoints de verificación
2. Revisa los logs del servidor
3. Verifica que la contraseña de aplicación esté correcta
4. Considera usar un proveedor alternativo temporalmente
