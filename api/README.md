# OMNIA CRM - Sistema Inteligente de Gestión de Clientes

## 🚀 Sistema de Email Marketing con Resend

Sistema profesional de captura y gestión de leads con comunicación automática inteligente.

## ✨ Características

- ✅ **Email Automático al Admin** - Notificación inmediata de nuevos leads
- ✅ **Auto-respuesta al Cliente** - Confirmación profesional automática
- ✅ **Almacenamiento de Leads** - Base de datos JSON local
- ✅ **Tracking de Status** - Gestión de pipeline de ventas
- ✅ **Templates Profesionales** - Emails con diseño branded
- ✅ **Doble Confirmación** - Emails a ambos correos del negocio

## 📧 Configuración de Email

- **Emisor**: info@neiveralvarez.site
- **Receptores Admin**: 
  - info@neiveralvarezdev.com
  - business@neiveralvarez.dev
- **API Key Resend**: Configurada en `server.js`

## 🛠️ Instalación

### 1. Instalar dependencias del API

```bash
cd api
npm install
```

### 2. Iniciar el servidor CRM

```bash
npm start
```

El API correrá en `http://localhost:3001`

## 📡 Endpoints

### POST /api/contact
Envía un nuevo contacto y dispara los emails automáticos.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Tech Corp",
  "service": "web",
  "message": "Necesito un sitio web",
  "budget": "10k-25k"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Mensaje enviado exitosamente",
  "leadId": 1705947823456
}
```

### GET /api/leads
Obtiene todos los leads guardados.

**Response:**
```json
{
  "total": 5,
  "leads": [...]
}
```

### PATCH /api/leads/:id
Actualiza el status de un lead.

**Body:**
```json
{
  "status": "contacted" | "qualified" | "proposal" | "won" | "lost"
}
```

## 🎯 Flujo de Comunicación

1. **Cliente envía formulario** → Frontend hace POST a `/api/contact`
2. **Sistema procesa** → Valida datos y genera emails HTML
3. **Email Admin** → Notificación inmediata con toda la info del lead
4. **Email Cliente** → Auto-respuesta profesional con CTA a Calendly
5. **Lead guardado** → Se almacena en `leads.json` para seguimiento
6. **Logs** → Console muestra actividad en tiempo real

## 📊 Gestión de Leads

Todos los leads se guardan en `api/leads.json` con:

```json
{
  "id": 1705947823456,
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Tech Corp",
  "service": "web",
  "message": "...",
  "budget": "10k-25k",
  "status": "new",
  "createdAt": "2026-01-24T20:30:23.456Z",
  "emailSent": true
}
```

### Status disponibles:
- `new` - Lead recién llegado
- `contacted` - Primer contacto realizado
- `qualified` - Lead calificado
- `proposal` - Propuesta enviada
- `won` - Cliente ganado 🎉
- `lost` - Oportunidad perdida

## 🚀 Uso en Producción

Para producción, despliega el API en:
- **Vercel** (recomendado para Next.js)
- **Railway**
- **Render**
- **DigitalOcean**

Actualiza la URL en `App.tsx`:
```typescript
const response = await fetch('https://tu-api.com/api/contact', {
```

## 🔐 Seguridad

- ✅ CORS configurado
- ✅ API Key de Resend en servidor (no expuesta al cliente)
- ✅ Validación de campos requeridos
- ✅ Rate limiting recomendado para producción

## 📈 Métricas y Análisis

Puedes agregar tracking adicional:
- Google Analytics en emails
- Webhooks de Resend para ver aperturas
- Dashboard de visualización de leads

## 🆘 Soporte

Para problemas o preguntas:
- Email: info@neiveralvarezdev.com
- LinkedIn: https://www.linkedin.com/in/neiveralvarez/

---

**Desarrollado por Neiver Álvarez | OMNIA**
