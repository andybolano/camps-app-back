# Camp Events API - Ejemplos de Payloads y Responses

## POST /api/camp-events - Crear Evento de Campamento

### Ejemplo 1: Evento con Items Regulares y Member-Based Items

**Request Payload:**
```json
{
  "campId": 1,
  "name": "Nudos y Amarres - Campamento Nacional 2025",
  "description": "Competencia de habilidades en nudos y técnicas de amarre",
  "maxScore": 100,
  "isActive": true,
  "items": [
    {
      "name": "Nudo de Ocho"
    },
    {
      "name": "Nudo Ballestrinque"
    },
    {
      "name": "Amarre Cuadrado"
    }
  ],
  "memberBasedItems": [
    {
      "name": "Cantidad de Menores",
      "applicableCharacteristics": ["MENOR"],
      "calculationType": "COUNT",
      "isRequired": false
    },
    {
      "name": "Cantidad de Adultos",
      "applicableCharacteristics": ["ADULTO"],
      "calculationType": "COUNT",
      "isRequired": false
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "isActive": true,
  "customName": "Nudos y Amarres - Campamento Nacional 2025",
  "customDescription": "Competencia de habilidades en nudos y técnicas de amarre",
  "customMaxScore": 100,
  "createdAt": "2025-01-23T09:00:00.000Z",
  "updatedAt": "2025-01-23T09:00:00.000Z",
  "camp": {
    "id": 1,
    "name": "Campamento Nacional 2025",
    "location": "Parque Nacional Tayrona",
    "startDate": "2025-03-15T00:00:00.000Z",
    "endDate": "2025-03-18T00:00:00.000Z"
  },
  "items": [
    {
      "id": 1,
      "customName": "Nudo de Ocho",
      "isActive": true,
      "eventItemTemplate": null
    },
    {
      "id": 2,
      "customName": "Nudo Ballestrinque",
      "isActive": true,
      "eventItemTemplate": null
    },
    {
      "id": 3,
      "customName": "Amarre Cuadrado",
      "isActive": true,
      "eventItemTemplate": null
    }
  ],
  "memberBasedItems": [
    {
      "id": 1,
      "customName": "Cantidad de Menores",
      "applicableCharacteristics": ["MENOR"],
      "calculationType": "COUNT",
      "isRequired": false,
      "isActive": true,
      "eventItemTemplate": null
    },
    {
      "id": 2,
      "customName": "Cantidad de Adultos",
      "applicableCharacteristics": ["ADULTO"],
      "calculationType": "COUNT",
      "isRequired": false,
      "isActive": true,
      "eventItemTemplate": null
    }
  ]
}
```

### Ejemplo 2: Evento Solo con Items Regulares

**Request Payload:**
```json
{
  "campId": 1,
  "name": "Carrera de Relevos",
  "description": "Competencia deportiva",
  "maxScore": 50,
  "items": [
    {
      "name": "Velocidad"
    },
    {
      "name": "Coordinación"
    },
    {
      "name": "Trabajo en Equipo"
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "id": 2,
  "isActive": true,
  "customName": "Carrera de Relevos",
  "customDescription": "Competencia deportiva",
  "customMaxScore": 50,
  "createdAt": "2025-01-23T10:00:00.000Z",
  "updatedAt": "2025-01-23T10:00:00.000Z",
  "camp": {
    "id": 1,
    "name": "Campamento Nacional 2025",
    "location": "Parque Nacional Tayrona",
    "startDate": "2025-03-15T00:00:00.000Z",
    "endDate": "2025-03-18T00:00:00.000Z"
  },
  "items": [
    {
      "id": 4,
      "customName": "Velocidad",
      "isActive": true,
      "eventItemTemplate": null
    },
    {
      "id": 5,
      "customName": "Coordinación",
      "isActive": true,
      "eventItemTemplate": null
    },
    {
      "id": 6,
      "customName": "Trabajo en Equipo",
      "isActive": true,
      "eventItemTemplate": null
    }
  ],
  "memberBasedItems": []
}
```

### Ejemplo 3: Evento Sin Items (Solo Información General)

**Request Payload:**
```json
{
  "campId": 1,
  "name": "Ceremonia de Apertura",
  "description": "Evento de inauguración del campamento",
  "maxScore": 0
}
```

**Response (201 Created):**
```json
{
  "id": 3,
  "isActive": true,
  "customName": "Ceremonia de Apertura",
  "customDescription": "Evento de inauguración del campamento",
  "customMaxScore": 0,
  "createdAt": "2025-01-23T11:00:00.000Z",
  "updatedAt": "2025-01-23T11:00:00.000Z",
  "camp": {
    "id": 1,
    "name": "Campamento Nacional 2025",
    "location": "Parque Nacional Tayrona",
    "startDate": "2025-03-15T00:00:00.000Z",
    "endDate": "2025-03-18T00:00:00.000Z"
  },
  "items": [],
  "memberBasedItems": []
}
```

---

## GET /api/camp-events - Obtener Todos los Eventos

### Sin Filtros

**Request:**
```
GET /api/camp-events
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "isActive": true,
    "customName": "Nudos y Amarres - Campamento Nacional 2025",
    "customDescription": "Competencia de habilidades en nudos y técnicas de amarre",
    "customMaxScore": 100,
    "createdAt": "2025-01-23T09:00:00.000Z",
    "updatedAt": "2025-01-23T09:00:00.000Z",
    "camp": {
      "id": 1,
      "name": "Campamento Nacional 2025",
      "location": "Parque Nacional Tayrona",
      "startDate": "2025-03-15T00:00:00.000Z",
      "endDate": "2025-03-18T00:00:00.000Z"
    },
    "items": [
      {
        "id": 1,
        "customName": "Nudo de Ocho",
        "isActive": true,
        "eventItemTemplate": null
      },
      {
        "id": 2,
        "customName": "Nudo Ballestrinque",
        "isActive": true,
        "eventItemTemplate": null
      }
    ],
    "memberBasedItems": [
      {
        "id": 1,
        "customName": "Cantidad de Menores",
        "applicableCharacteristics": ["MENOR"],
        "calculationType": "COUNT",
        "isRequired": false,
        "isActive": true,
        "eventItemTemplate": null
      }
    ]
  },
  {
    "id": 2,
    "isActive": true,
    "customName": "Carrera de Relevos",
    "customDescription": "Competencia deportiva",
    "customMaxScore": 50,
    "createdAt": "2025-01-23T10:30:00.000Z",
    "updatedAt": "2025-01-23T10:30:00.000Z",
    "camp": {
      "id": 1,
      "name": "Campamento Nacional 2025",
      "location": "Parque Nacional Tayrona"
    },
    "items": [
      {
        "id": 4,
        "customName": "Velocidad",
        "isActive": true,
        "eventItemTemplate": null
      }
    ],
    "memberBasedItems": []
  }
]
```

### Filtrado por Campamento

**Request:**
```
GET /api/camp-events?campId=1
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "isActive": true,
    "customName": "Nudos y Amarres - Campamento Nacional 2025",
    "customDescription": "Competencia de habilidades en nudos y técnicas de amarre",
    "customMaxScore": 100,
    "createdAt": "2025-01-23T09:00:00.000Z",
    "updatedAt": "2025-01-23T09:00:00.000Z",
    "items": [
      {
        "id": 1,
        "customName": "Nudo de Ocho",
        "isActive": true,
        "eventItemTemplate": null
      },
      {
        "id": 2,
        "customName": "Nudo Ballestrinque",
        "isActive": true,
        "eventItemTemplate": null
      },
      {
        "id": 3,
        "customName": "Amarre Cuadrado",
        "isActive": true,
        "eventItemTemplate": null
      }
    ],
    "memberBasedItems": [
      {
        "id": 1,
        "customName": "Cantidad de Menores",
        "applicableCharacteristics": ["MENOR"],
        "calculationType": "COUNT",
        "isRequired": false,
        "isActive": true,
        "eventItemTemplate": null
      },
      {
        "id": 2,
        "customName": "Cantidad de Adultos",
        "applicableCharacteristics": ["ADULTO"],
        "calculationType": "COUNT",
        "isRequired": false,
        "isActive": true,
        "eventItemTemplate": null
      }
    ]
  },
  {
    "id": 2,
    "isActive": true,
    "customName": "Carrera de Relevos",
    "customDescription": "Competencia deportiva",
    "customMaxScore": 50,
    "createdAt": "2025-01-23T10:30:00.000Z",
    "updatedAt": "2025-01-23T10:30:00.000Z",
    "items": [
      {
        "id": 4,
        "customName": "Velocidad",
        "isActive": true,
        "eventItemTemplate": null
      },
      {
        "id": 5,
        "customName": "Coordinación",
        "isActive": true,
        "eventItemTemplate": null
      },
      {
        "id": 6,
        "customName": "Trabajo en Equipo",
        "isActive": true,
        "eventItemTemplate": null
      }
    ],
    "memberBasedItems": []
  }
]
```

---

## GET /api/camp-events/:id - Obtener Evento por ID

**Request:**
```
GET /api/camp-events/1
```

**Response (200 OK):**
```json
{
  "id": 1,
  "isActive": true,
  "customName": "Nudos y Amarres - Campamento Nacional 2025",
  "customDescription": "Competencia de habilidades en nudos y técnicas de amarre",
  "customMaxScore": 100,
  "createdAt": "2025-01-23T09:00:00.000Z",
  "updatedAt": "2025-01-23T09:00:00.000Z",
  "camp": {
    "id": 1,
    "name": "Campamento Nacional 2025",
    "startDate": "2025-03-15T00:00:00.000Z",
    "endDate": "2025-03-18T00:00:00.000Z",
    "location": "Parque Nacional Tayrona"
  },
  "items": [
    {
      "id": 1,
      "customName": "Nudo de Ocho",
      "isActive": true,
      "eventItemTemplate": null
    },
    {
      "id": 2,
      "customName": "Nudo Ballestrinque",
      "isActive": true,
      "eventItemTemplate": null
    },
    {
      "id": 3,
      "customName": "Amarre Cuadrado",
      "isActive": true,
      "eventItemTemplate": null
    }
  ],
  "memberBasedItems": [
    {
      "id": 1,
      "customName": "Cantidad de Menores",
      "applicableCharacteristics": ["MENOR"],
      "calculationType": "COUNT",
      "isRequired": false,
      "isActive": true,
      "eventItemTemplate": null
    },
    {
      "id": 2,
      "customName": "Cantidad de Adultos",
      "applicableCharacteristics": ["ADULTO"],
      "calculationType": "COUNT",
      "isRequired": false,
      "isActive": true,
      "eventItemTemplate": null
    }
  ]
}
```

---

## PATCH /api/camp-events/:id - Actualizar Evento

**Request:**
```
PATCH /api/camp-events/1
```

**Request Payload:**
```json
{
  "name": "Nudos y Amarres - Edición Especial",
  "description": "Competencia especial de nudos actualizada para el Campamento Nacional 2025",
  "maxScore": 120,
  "isActive": true
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "isActive": true,
  "customName": "Nudos y Amarres - Edición Especial",
  "customDescription": "Competencia especial de nudos actualizada para el Campamento Nacional 2025",
  "customMaxScore": 120,
  "createdAt": "2025-01-23T09:00:00.000Z",
  "updatedAt": "2025-01-24T11:20:00.000Z",
  "camp": {
    "id": 1,
    "name": "Campamento Nacional 2025",
    "startDate": "2025-03-15T00:00:00.000Z",
    "endDate": "2025-03-18T00:00:00.000Z",
    "location": "Parque Nacional Tayrona"
  },
  "items": [
    {
      "id": 1,
      "customName": "Nudo de Ocho",
      "isActive": true,
      "eventItemTemplate": null
    }
  ],
  "memberBasedItems": []
}
```

---

## DELETE /api/camp-events/:id - Eliminar Evento

**Request:**
```
DELETE /api/camp-events/1
```

**Response (200 OK):**
```json
{
  "message": "Evento eliminado exitosamente"
}
```

---

## Notas Importantes

1. **Estructura de Items**:
   - Los items regulares solo requieren `name`
   - Los items basados en miembros requieren `name`, `applicableCharacteristics`, y opcionalmente `calculationType` e `isRequired`

2. **Campos Opcionales**:
   - `description`: Si no se proporciona, será `null`
   - `isActive`: Por defecto es `true` si no se especifica
   - `items` y `memberBasedItems`: Son opcionales, pueden ser arrays vacíos o no incluirse

3. **Diferencias con /api/events**:
   - `/api/camp-events` requiere `campId` para asociar el evento a un campamento específico
   - `/api/events` no requiere `campId` ya que son plantillas de eventos reutilizables

4. **eventItemTemplate**:
   - Siempre será `null` en los eventos de campamento ya que son instancias independientes
   - Este campo se mantiene en la respuesta por compatibilidad con la estructura de la base de datos
