import React, { useState, useEffect } from 'react';
import { Play, Code, Cpu, FileCode, BookOpen, Terminal } from 'lucide-react';

// Importar las clases compiladoras
import EstudiantesCompiler from './components/EstudiantesCompiler';
import InventarioCompiler from './components/InventarioCompiler';
import CadenasCompiler from './components/CadenasCompiler';
import FactorialCompiler from './components/FactorialCompiler';

// Configuración de problemas usando las nuevas clases
const problems = {
    estudiantes: EstudiantesCompiler.problemData,
    inventario: InventarioCompiler.problemData,
    cadenas: CadenasCompiler.problemData,
    factorial: FactorialCompiler.problemData
  };

const CompilerSystem = () => {
  const [selectedProblem, setSelectedProblem] = useState('estudiantes');
  const [intermediateCode, setIntermediateCode] = useState('');
  const [assemblyCode, setAssemblyCode] = useState('');
  const [emu8086Code, setEmu8086Code] = useState('');
  const [executionResult, setExecutionResult] = useState('');
  const [showOutput, setShowOutput] = useState(false);
  const [showExecution, setShowExecution] = useState(false);
  const [editableCode, setEditableCode] = useState('');

  // Sincronizar código editable cuando cambia el problema seleccionado
  useEffect(() => {
    setEditableCode(problems[selectedProblem].sourceCode);
  }, [selectedProblem]);

  const generateIntermediateCode = (problem) => {
    const compilerMap = {
      estudiantes: EstudiantesCompiler,
      inventario: InventarioCompiler,
      cadenas: CadenasCompiler,
      factorial: FactorialCompiler
    };
    
    const compiler = compilerMap[problem];
    return compiler ? compiler.generateIntermediateCode() : '';
  };

  const generateAssemblyCode = (problem) => {
    const compilerMap = {
      estudiantes: EstudiantesCompiler,
      inventario: InventarioCompiler,
      cadenas: CadenasCompiler,
      factorial: FactorialCompiler
    };
    
    const compiler = compilerMap[problem];
    return compiler ? compiler.generateAssemblyCode() : '';
  };

  // Función temporal para compatibilidad
  const _OLD_generateAssemblyCode = (problem) => {
    const assemblyCodeMap = {
      estudiantes: `; Código Ensamblador x86-64
; Sistema de Gestión de Estudiantes

section .data
    struct_size equ 64          ; Tamaño de struct Estudiante

section .bss
    estudiantes resb 6400       ; 100 estudiantes * 64 bytes
    total resd 1                ; int total
    id_buscar resd 1            ; int id_buscar
    encontrado resd 1           ; int encontrado
    suma resq 1                 ; double suma
    promedio_general resq 1     ; double promedio_general

section .text
global main

main:
    push rbp
    mov rbp, rsp
    
    ; Inicializar total = 0
    mov dword [total], 0
    
    ; Agregar primer estudiante
    ; estudiantes[0].id = 1001
    mov eax, [total]
    imul eax, struct_size       ; offset = total * struct_size
    lea rbx, [estudiantes]
    add rbx, rax
    mov dword [rbx], 1001       ; id = 1001
    
    ; estudiantes[0].promedio = 8.5
    movsd xmm0, [const_8_5]
    movsd [rbx + 8], xmm0
    
    ; total++
    inc dword [total]
    
    ; Buscar estudiante por ID
    mov dword [id_buscar], 1001
    mov dword [encontrado], 0
    xor ecx, ecx                ; i = 0
    
.buscar_loop:
    mov eax, [total]
    cmp ecx, eax
    jge .buscar_end
    
    ; Calcular offset estudiantes[i]
    mov eax, ecx
    imul eax, struct_size
    lea rbx, [estudiantes]
    add rbx, rax
    
    ; Comparar id
    mov edx, [rbx]              ; estudiantes[i].id
    cmp edx, [id_buscar]
    jne .buscar_continue
    
    ; Encontrado!
    mov dword [encontrado], 1
    jmp .buscar_end
    
.buscar_continue:
    inc ecx
    jmp .buscar_loop
    
.buscar_end:
    ; Calcular promedio general
    pxor xmm0, xmm0             ; suma = 0.0
    movsd [suma], xmm0
    xor ecx, ecx                ; i = 0
    
.promedio_loop:
    mov eax, [total]
    cmp ecx, eax
    jge .promedio_end
    
    ; Calcular offset
    mov eax, ecx
    imul eax, struct_size
    lea rbx, [estudiantes]
    add rbx, rax
    
    ; suma += estudiantes[i].promedio
    movsd xmm0, [suma]
    movsd xmm1, [rbx + 8]
    addsd xmm0, xmm1
    movsd [suma], xmm0
    
    inc ecx
    jmp .promedio_loop
    
.promedio_end:
    ; promedio_general = suma / total
    movsd xmm0, [suma]
    cvtsi2sd xmm1, dword [total]
    divsd xmm0, xmm1
    movsd [promedio_general], xmm0
    
    ; Retornar 0
    xor eax, eax
    mov rsp, rbp
    pop rbp
    ret

section .data
    const_8_5 dq 8.5`,

      inventario: `; Código Ensamblador x86-64
; Sistema de Inventario

section .data
    struct_size equ 48          ; Tamaño de struct Producto

section .bss
    productos resb 2400         ; 50 productos * 48 bytes
    total_productos resd 1      ; int total_productos
    codigo_buscar resd 1        ; int codigo_buscar
    nueva_cantidad resd 1       ; int nueva_cantidad
    valor_total resq 1          ; double valor_total

section .text
global main

main:
    push rbp
    mov rbp, rsp
    
    ; Agregar primer producto
    lea rbx, [productos]
    
    ; productos[0].codigo = 100
    mov dword [rbx], 100
    
    ; productos[0].cantidad = 50
    mov dword [rbx + 8], 50
    
    ; productos[0].precio = 25.99
    movsd xmm0, [const_25_99]
    movsd [rbx + 12], xmm0
    
    ; total_productos = 1
    mov dword [total_productos], 1
    
    ; Actualizar cantidad
    mov dword [codigo_buscar], 100
    mov dword [nueva_cantidad], 75
    
    xor ecx, ecx                ; i = 0
    
.actualizar_loop:
    mov eax, [total_productos]
    cmp ecx, eax
    jge .actualizar_end
    
    ; Calcular offset productos[i]
    mov eax, ecx
    imul eax, struct_size
    lea rbx, [productos]
    add rbx, rax
    
    ; Comparar código
    mov edx, [rbx]              ; productos[i].codigo
    cmp edx, [codigo_buscar]
    jne .actualizar_continue
    
    ; Actualizar cantidad
    mov eax, [nueva_cantidad]
    mov [rbx + 8], eax
    
.actualizar_continue:
    inc ecx
    jmp .actualizar_loop
    
.actualizar_end:
    ; Calcular valor total del inventario
    pxor xmm0, xmm0             ; valor_total = 0.0
    movsd [valor_total], xmm0
    xor ecx, ecx                ; i = 0
    
.valor_loop:
    mov eax, [total_productos]
    cmp ecx, eax
    jge .valor_end
    
    ; Calcular offset
    mov eax, ecx
    imul eax, struct_size
    lea rbx, [productos]
    add rbx, rax
    
    ; valor_producto = cantidad * precio
    cvtsi2sd xmm0, dword [rbx + 8]  ; cantidad
    movsd xmm1, [rbx + 12]          ; precio
    mulsd xmm0, xmm1
    
    ; valor_total += valor_producto
    movsd xmm1, [valor_total]
    addsd xmm1, xmm0
    movsd [valor_total], xmm1
    
    inc ecx
    jmp .valor_loop
    
.valor_end:
    ; Retornar 0
    xor eax, eax
    mov rsp, rbp
    pop rbp
    ret

section .data
    const_25_99 dq 25.99`,

      cadenas: `; Código Ensamblador x86-64
; Sistema de Procesamiento de Cadenas

section .data
    texto db "Hola Mundo", 0
    texto_size equ 100

section .bss
    len resd 1                  ; int len
    vocales resd 1              ; int vocales

section .text
global main

; Función longitud_cadena(char* str)
; Parámetro: rdi = puntero a string
; Retorna: rax = longitud
longitud_cadena:
    push rbp
    mov rbp, rsp
    xor rax, rax                ; len = 0
    
.loop:
    cmp byte [rdi + rax], 0     ; str[len] == '\0'?
    je .end
    inc rax
    jmp .loop
    
.end:
    mov rsp, rbp
    pop rbp
    ret

; Función invertir_cadena(char* str)
; Parámetro: rdi = puntero a string
invertir_cadena:
    push rbp
    mov rbp, rsp
    push rbx
    push r12
    push r13
    
    mov rbx, rdi                ; guardar puntero
    
    ; Obtener longitud
    call longitud_cadena
    mov r12, rax                ; r12 = len
    
    xor r13, r13                ; i = 0
    dec r12                     ; j = len - 1
    
.loop:
    cmp r13, r12
    jge .end
    
    ; Intercambiar str[i] y str[j]
    mov al, [rbx + r13]         ; temp = str[i]
    mov cl, [rbx + r12]
    mov [rbx + r13], cl         ; str[i] = str[j]
    mov [rbx + r12], al         ; str[j] = temp
    
    inc r13                     ; i++
    dec r12                     ; j--
    jmp .loop
    
.end:
    pop r13
    pop r12
    pop rbx
    mov rsp, rbp
    pop rbp
    ret

main:
    push rbp
    mov rbp, rsp
    
    ; Calcular longitud
    lea rdi, [texto]
    call longitud_cadena
    mov [len], eax
    
    ; Invertir cadena
    lea rdi, [texto]
    call invertir_cadena
    
    ; Contar vocales
    mov dword [vocales], 0
    xor ecx, ecx                ; i = 0
    lea rbx, [texto]
    
.vocales_loop:
    mov eax, [len]
    cmp ecx, eax
    jge .vocales_end
    
    ; Cargar carácter
    movzx edx, byte [rbx + rcx]
    
    ; Comparar con vocales
    cmp dl, 'a'
    je .es_vocal
    cmp dl, 'e'
    je .es_vocal
    cmp dl, 'i'
    je .es_vocal
    cmp dl, 'o'
    je .es_vocal
    cmp dl, 'u'
    je .es_vocal
    cmp dl, 'A'
    je .es_vocal
    cmp dl, 'E'
    je .es_vocal
    cmp dl, 'I'
    je .es_vocal
    cmp dl, 'O'
    je .es_vocal
    cmp dl, 'U'
    je .es_vocal
    jmp .no_vocal
    
.es_vocal:
    inc dword [vocales]
    
.no_vocal:
    inc ecx
    jmp .vocales_loop
    
.vocales_end:
    ; Retornar 0
    xor eax, eax
    mov rsp, rbp
    pop rbp
    ret`,

      factorial: `; Código Ensamblador x86-64
; Cálculo de Factorial Recursivo

section .bss
    numero resd 1               ; int numero
    resultado resd 1            ; int resultado
    fact_iter resd 1            ; int fact_iter

section .text
global main

; Función factorial(int n)
; Parámetro: edi = n
; Retorna: eax = factorial(n)
factorial:
    push rbp
    mov rbp, rsp
    
    ; Caso base: n <= 1
    cmp edi, 1
    jle .base_case
    
    ; Caso recursivo
    push rdi                    ; Guardar n
    dec edi                     ; n - 1
    call factorial              ; factorial(n-1)
    pop rdi                     ; Recuperar n
    
    imul eax, edi               ; n * factorial(n-1)
    jmp .end
    
.base_case:
    mov eax, 1                  ; return 1
    
.end:
    mov rsp, rbp
    pop rbp
    ret

main:
    push rbp
    mov rbp, rsp
    
    ; Inicializar número = 5
    mov dword [numero], 5
    
    ; Calcular factorial recursivo
    mov edi, [numero]
    call factorial
    mov [resultado], eax
    
    ; Calcular factorial iterativo
    mov dword [fact_iter], 1
    mov ecx, 1                  ; i = 1
    
.iter_loop:
    mov eax, [numero]
    cmp ecx, eax
    jg .iter_end
    
    ; fact_iter *= i
    mov eax, [fact_iter]
    imul eax, ecx
    mov [fact_iter], eax
    
    inc ecx
    jmp .iter_loop
    
.iter_end:
    ; Retornar 0
    xor eax, eax
    mov rsp, rbp
    pop rbp
    ret

; Nota: Para compilar y ejecutar:
; nasm -f elf64 factorial.asm -o factorial.o
; gcc factorial.o -o factorial -no-pie
; ./factorial`
    };

    return assemblyCodeMap[problem];
  };

  const generateEmu8086Code = (problem) => {
    const compilerMap = {
      estudiantes: EstudiantesCompiler,
      inventario: InventarioCompiler,
      cadenas: CadenasCompiler,
      factorial: FactorialCompiler
    };
    
    const compiler = compilerMap[problem];
    const currentCode = editableCode || problems[problem].sourceCode;
    return compiler ? compiler.generateEmu8086Code(currentCode) : '';
  };

  // Funciones movidas a las clases compiladoras individuales

  const executeCode = (problem) => {
    const compilerMap = {
      estudiantes: EstudiantesCompiler,
      inventario: InventarioCompiler,
      cadenas: CadenasCompiler,
      factorial: FactorialCompiler
    };
    
    const compiler = compilerMap[problem];
    const currentCode = editableCode || problems[problem].sourceCode;
    return compiler ? compiler.executeCode(currentCode) : { variables: {}, output: 'Error: Problema no encontrado' };
  };

  const handleExecute = () => {
    const result = executeCode(selectedProblem);
    setExecutionResult(result.output);
    setShowExecution(true);
  };

  const handleGenerate = () => {
    const intermediate = generateIntermediateCode(selectedProblem);
    const assembly = generateAssemblyCode(selectedProblem);
    const emu8086 = generateEmu8086Code(selectedProblem);
    
    setIntermediateCode(intermediate);
    setAssemblyCode(assembly);
    setEmu8086Code(emu8086);
    setShowOutput(true);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Cpu className="w-10 h-10 text-purple-400" />
            Generador de Código Intermedio y Ensamblador
          </h1>
          <p className="text-purple-200">
            Código Intermedio (TAC) → Código Máquina (x86-64)
          </p>
        </div>

        {/* Problem Selection */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-purple-400" />
            Selecciona un Problema
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(problems).map(([key, problem]) => (
              <button
                key={key}
                onClick={() => setSelectedProblem(key)}
                className={`p-4 rounded-lg text-left transition-all ${
                  selectedProblem === key
                    ? 'bg-purple-600 border-2 border-purple-400 shadow-lg shadow-purple-500/50'
                    : 'bg-white/5 border-2 border-white/10 hover:bg-white/10'
                }`}
              >
                <h3 className="font-semibold text-white mb-1">{problem.name}</h3>
                <p className="text-sm text-purple-200">{problem.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Source Code Display */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Code className="w-6 h-6 text-green-400" />
              Código Fuente C
            </h2>
            <button
              onClick={() => setEditableCode(problems[selectedProblem].sourceCode)}
              className="text-yellow-400 hover:text-yellow-300 transition-colors text-sm font-medium"
            >
              🔄 Restablecer código original
            </button>
          </div>
          <div className="bg-slate-950/50 rounded-lg border border-green-500/30">
            <textarea
              value={editableCode}
              onChange={(e) => setEditableCode(e.target.value)}
              className="w-full h-96 bg-transparent text-sm text-green-300 font-mono p-4 resize-none focus:outline-none focus:ring-2 focus:ring-green-500/50 rounded-lg"
              placeholder="Edita el código C aquí..."
              spellCheck={false}
            />
          </div>
        </div>

        {/* Generate and Execute Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={handleGenerate}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-lg flex items-center gap-3 shadow-lg shadow-purple-500/50 transition-all transform hover:scale-105"
          >
            <Play className="w-6 h-6" />
            Generar Código Intermedio y Ensamblador
          </button>
          
          <button
            onClick={handleExecute}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-lg flex items-center gap-3 shadow-lg shadow-green-500/50 transition-all transform hover:scale-105"
          >
            <Terminal className="w-6 h-6" />
            Ejecutar Código C
          </button>
        </div>

        {/* Output Display */}
        {showOutput && (
          <div className="space-y-6">
            {/* Intermediate Code */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <FileCode className="w-6 h-6 text-blue-400" />
                  Código Intermedio (Three-Address Code)
                </h2>
                <button
                  onClick={() => handleCopy(intermediateCode)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-all"
                >
                  Copiar
                </button>
              </div>
              <div className="bg-slate-950/50 rounded-lg p-4 border border-blue-500/30">
                <pre className="text-sm text-blue-300 overflow-x-auto whitespace-pre">
                  {intermediateCode}
                </pre>
              </div>
              <div className="mt-4 bg-blue-950/30 border border-blue-500/30 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">📋 Características del TAC:</h3>
                <ul className="text-blue-200 text-sm space-y-1 list-disc list-inside">
                  <li>Instrucciones de 3 direcciones máximo</li>
                  <li>Variables temporales (t1, t2, ...)</li>
                  <li>Saltos condicionales e incondicionales</li>
                  <li>Llamadas a funciones y parámetros</li>
                  <li>Operaciones aritméticas y lógicas</li>
                </ul>
              </div>
            </div>

            {/* x86-64 Assembly Code */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <FileCode className="w-6 h-6 text-green-400" />
                  Código Ensamblador x86-64 (NASM)
                </h2>
                <button
                  onClick={() => handleCopy(assemblyCode)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-all"
                >
                  Copiar
                </button>
              </div>
              <div className="bg-slate-950/50 rounded-lg p-4 border border-green-500/30">
                <pre className="text-sm text-green-300 overflow-x-auto whitespace-pre">
                  {assemblyCode}
                </pre>
              </div>
              <div className="mt-4 bg-green-950/30 border border-green-500/30 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">⚡ x86-64 Assembly - NASM:</h3>
                <ul className="text-green-200 text-sm space-y-1 list-disc list-inside">
                  <li><strong>Registros:</strong> RAX, RBX, RCX, RDX, RSI, RDI, RBP, RSP</li>
                  <li><strong>Arquitectura:</strong> 64-bit, System V ABI</li>
                  <li><strong>Sintaxis:</strong> Intel syntax (dest, src)</li>
                  <li><strong>Punto flotante:</strong> SSE2 (XMM registers)</li>
                  <li><strong>Compatible con:</strong> NASM, GAS, YASM</li>
                </ul>
              </div>
            </div>

            {/* EMU8086 Code */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Cpu className="w-6 h-6 text-orange-400" />
                  Código EMU8086 (8086/16-bit)
                </h2>
                <button
                  onClick={() => handleCopy(emu8086Code)}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm transition-all"
                >
                  Copiar
                </button>
              </div>
              <div className="bg-slate-950/50 rounded-lg p-4 border border-orange-500/30">
                <pre className="text-sm text-orange-300 overflow-x-auto whitespace-pre">
                  {emu8086Code}
                </pre>
              </div>
              <div className="mt-4 bg-orange-950/30 border border-orange-500/30 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">🖥️ EMU8086 - Arquitectura 8086:</h3>
                <ul className="text-orange-200 text-sm space-y-1 list-disc list-inside">
                  <li><strong>Registros:</strong> AX, BX, CX, DX, SI, DI, BP, SP</li>
                  <li><strong>Segmentos:</strong> CS (Code), DS (Data), SS (Stack), ES (Extra)</li>
                  <li><strong>Modelo de memoria:</strong> Small model (64KB code + 64KB data)</li>
                  <li><strong>Directivas:</strong> .model, .data, .code, .stack</li>
                  <li><strong>Compatible con:</strong> EMU8086, MASM, TASM</li>
                </ul>
              </div>
            </div>

            {/* Compilation Instructions */}
            <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 backdrop-blur-lg rounded-xl p-6 border border-green-500/30">
              <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                🔧 Instrucciones de Compilación
              </h3>
              
              {/* x86-64 Instructions */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-green-200 mb-3">📟 Para x86-64 (NASM + GCC):</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-green-200 font-semibold mb-2">1. Guardar código x86-64:</p>
                    <code className="block bg-slate-950/50 text-green-300 p-3 rounded border border-green-500/30">
                      nano programa64.asm
                    </code>
                  </div>
                  <div>
                    <p className="text-green-200 font-semibold mb-2">2. Ensamblar con NASM:</p>
                    <code className="block bg-slate-950/50 text-green-300 p-3 rounded border border-green-500/30">
                      nasm -f elf64 programa64.asm -o programa64.o
                    </code>
                  </div>
                  <div>
                    <p className="text-green-200 font-semibold mb-2">3. Enlazar con GCC:</p>
                    <code className="block bg-slate-950/50 text-green-300 p-3 rounded border border-green-500/30">
                      gcc programa64.o -o programa64 -no-pie
                    </code>
                  </div>
                  <div>
                    <p className="text-green-200 font-semibold mb-2">4. Ejecutar:</p>
                    <code className="block bg-slate-950/50 text-green-300 p-3 rounded border border-green-500/30">
                      ./programa64
                    </code>
                  </div>
                </div>
              </div>

              {/* EMU8086 Instructions */}
              <div>
                <h4 className="text-lg font-semibold text-orange-200 mb-3">🖥️ Para EMU8086 (8086/16-bit):</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-orange-200 font-semibold mb-2">1. Abrir EMU8086</p>
                    <code className="block bg-slate-950/50 text-orange-300 p-3 rounded border border-orange-500/30">
                      Ejecutar EMU8086.exe
                    </code>
                  </div>
                  <div>
                    <p className="text-orange-200 font-semibold mb-2">2. Crear nuevo archivo</p>
                    <code className="block bg-slate-950/50 text-orange-300 p-3 rounded border border-orange-500/30">
                      File → New → Copiar código EMU8086
                    </code>
                  </div>
                  <div>
                    <p className="text-orange-200 font-semibold mb-2">3. Compilar y ejecutar</p>
                    <code className="block bg-slate-950/50 text-orange-300 p-3 rounded border border-orange-500/30">
                      Emulate → Compile and Emulate
                    </code>
                  </div>
                  <div>
                    <p className="text-orange-200 font-semibold mb-2">4. Ver resultados</p>
                    <code className="block bg-slate-950/50 text-orange-300 p-3 rounded border border-orange-500/30">
                      Single Step o Run para ejecutar
                    </code>
                  </div>
                </div>
              </div>
            </div>

            {/* Theory Section */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">📚 Proceso de Compilación</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/30">
                  <div className="text-3xl mb-2">📝</div>
                  <h4 className="text-white font-semibold mb-2">1. Código Fuente</h4>
                  <p className="text-purple-200 text-sm">Lenguaje de alto nivel (C, C++, etc.)</p>
                </div>
                <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-500/30">
                  <div className="text-3xl mb-2">🔄</div>
                  <h4 className="text-white font-semibold mb-2">2. Código Intermedio</h4>
                  <p className="text-blue-200 text-sm">TAC, IR independiente de arquitectura</p>
                </div>
                <div className="bg-amber-900/30 p-4 rounded-lg border border-amber-500/30">
                  <div className="text-3xl mb-2">⚡</div>
                  <h4 className="text-white font-semibold mb-2">3. Código Ensamblador</h4>
                  <p className="text-amber-200 text-sm">Mnemonics específicos de arquitectura</p>
                </div>
                <div className="bg-green-900/30 p-4 rounded-lg border border-green-500/30">
                  <div className="text-3xl mb-2">💾</div>
                  <h4 className="text-white font-semibold mb-2">4. Código Máquina</h4>
                  <p className="text-green-200 text-sm">Binario ejecutable por el hardware</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* C Code Execution Results */}
        {showExecution && (
          <div className="bg-gradient-to-r from-green-900/30 to-teal-900/30 backdrop-blur-lg rounded-xl p-6 border border-green-500/30 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <Terminal className="w-6 h-6 text-green-400" />
                🚀 Ejecución del Programa C
              </h3>
              <button
                onClick={() => navigator.clipboard.writeText(executionResult)}
                className="text-green-400 hover:text-green-300 transition-colors"
              >
                Copiar
              </button>
            </div>
            <div className="bg-slate-950/50 rounded-lg p-4 border border-green-500/30">
              <pre className="text-sm text-green-300 overflow-x-auto whitespace-pre">
                {executionResult}
              </pre>
            </div>
            <div className="mt-4 bg-green-950/30 border border-green-500/30 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">💻 Simulación de Ejecución:</h3>
              <ul className="text-green-200 text-sm space-y-1 list-disc list-inside">
                <li><strong>Modelo:</strong> Simulación completa del flujo de ejecución</li>
                <li><strong>Variables:</strong> Seguimiento en tiempo real de valores</li>
                <li><strong>Salida:</strong> Resultados paso a paso como EMU8086</li>
                <li><strong>Compatibilidad:</strong> Comportamiento idéntico al ensamblador</li>
                <li><strong>Debugging:</strong> Trazabilidad completa del programa</li>
              </ul>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-purple-300 text-sm">
          <p>Sistema de Generación de Código Intermedio y Ensamblador</p>
          <p className="mt-1">Arquitectura x86-64 | NASM Syntax | System V ABI</p>
        </div>
      </div>
    </div>
  );
};

export default CompilerSystem;
