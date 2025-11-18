# Generador de Código Intermedio y Ensamblador - Arquitectura Modular

Este proyecto ha sido refactorizado para usar una arquitectura modular con clases separadas para cada tipo de problema.

## 🏗️ Nueva Estructura

### Clases Compiladoras

El código se ha dividido en 4 clases especializadas:

1. **EstudiantesCompiler** - Sistema de Gestión de Estudiantes
2. **InventarioCompiler** - Sistema de Inventario con Structs  
3. **CadenasCompiler** - Sistema de Procesamiento de Cadenas
4. **FactorialCompiler** - Cálculo de Factorial con Recursión

### Ubicación de Archivos

```
src/
├── components/
│   ├── EstudiantesCompiler.jsx
│   ├── InventarioCompiler.jsx
│   ├── CadenasCompiler.jsx
│   ├── FactorialCompiler.jsx
│   └── index.js
├── App.jsx
└── main.jsx
```

## 🔧 Funcionalidad de cada Clase

Cada clase compiladora implementa los siguientes métodos estáticos:

### Métodos Principales

- `problemData` - Objeto con la información del problema (nombre, descripción, código fuente)
- `generateIntermediateCode()` - Genera código intermedio (Three-Address Code)
- `generateAssemblyCode()` - Genera código ensamblador x86-64 (NASM)
- `generateEmu8086Code(code)` - Genera código EMU8086 (8086/16-bit) dinámico
- `executeCode(code)` - Simula la ejecución del código C
- `parseCodeValues(code)` - Extrae valores dinámicos del código fuente

### Ejemplo de Uso

```javascript
// Generar código intermedio para estudiantes
const tacCode = EstudiantesCompiler.generateIntermediateCode();

// Generar código ensamblador x86-64
const asmCode = InventarioCompiler.generateAssemblyCode();

// Generar código EMU8086 dinámico
const sourceCode = "int numero = 7;";
const emu8086Code = FactorialCompiler.generateEmu8086Code(sourceCode);

// Ejecutar código C
const result = CadenasCompiler.executeCode(sourceCode);
console.log(result.output); // Simulación de ejecución paso a paso
```

## 🎯 Ventajas de la Nueva Arquitectura

### ✅ Modularidad
- Cada problema tiene su propia clase independiente
- Fácil mantenimiento y debugging
- Código más organizado y legible

### ✅ Escalabilidad  
- Agregar nuevos problemas es simple: crear nueva clase
- No afecta el código existente
- Cada clase maneja su propia lógica

### ✅ Reutilización
- Las clases pueden usarse independientemente
- Fácil testing de componentes individuales
- Código más limpio en App.jsx

### ✅ Separación de Responsabilidades
- App.jsx solo maneja la UI y coordinación
- Cada compilador maneja su lógica específica
- Generación de código separada por tipo

## 🔄 Funcionalidades Dinámicas

### Código Adaptativo
Cada compilador puede generar código basado en valores extraídos del código fuente:

**Estudiantes:**
- ID de estudiante dinámico
- Promedio variable
- ID de búsqueda configurable

**Inventario:**
- Código de producto variable
- Cantidades dinámicas
- Precios configurables

**Cadenas:**
- Texto de entrada variable
- Procesamiento dinámico

**Factorial:**
- Número base configurable
- Cálculo adaptativo

### Simulación de Ejecución
Cada clase puede simular la ejecución paso a paso:
- Variables en tiempo real
- Flujo de ejecución detallado
- Resultados finales
- Compatible con EMU8086

## 🛠️ Desarrollo y Mantenimiento

### Agregar Nuevo Problema

1. **Crear nueva clase:** `src/components/NuevoCompiler.jsx`
2. **Implementar métodos requeridos:**
   ```javascript
   class NuevoCompiler {
     static problemData = { name: "...", description: "...", sourceCode: "..." };
     static generateIntermediateCode() { /* ... */ }
     static generateAssemblyCode() { /* ... */ }
     static generateEmu8086Code(code) { /* ... */ }
     static executeCode(code) { /* ... */ }
     static parseCodeValues(code) { /* ... */ }
   }
   ```
3. **Agregar a App.jsx:**
   ```javascript
   import NuevoCompiler from './components/NuevoCompiler';
   
   const problems = {
     // ... problemas existentes
     nuevo: NuevoCompiler.problemData
   };
   
   const compilerMap = {
     // ... compiladores existentes  
     nuevo: NuevoCompiler
   };
   ```

### Modificar Problema Existente

Simplemente editar la clase correspondiente en `src/components/`. Los cambios se reflejan automáticamente en toda la aplicación.

## 📚 Documentación Técnica

### Formato de Código Intermedio (TAC)
- Three-Address Code format
- Variables temporales (t1, t2, ...)
- Labels y saltos (GOTO, IF_FALSE)
- Llamadas a funciones (CALL, RETURN)

### Código Ensamblador x86-64
- NASM syntax (Intel format)
- System V ABI calling convention
- 64-bit registers (RAX, RBX, ...)
- SSE2 floating point

### Código EMU8086
- 8086/16-bit architecture
- Small memory model
- DOS interrupts (int 21h)
- Compatible con EMU8086 emulator

## 🎮 Características de la UI

- **Editor de código** editable en tiempo real
- **Generación dinámica** basada en código editado
- **Ejecución simulada** paso a paso
- **Múltiples formatos** de salida
- **Instrucciones de compilación** incluidas

## 🏃‍♂️ Ejecución

```bash
# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build
```

El proyecto ahora es más **maintible**, **escalable** y **modular** 🚀