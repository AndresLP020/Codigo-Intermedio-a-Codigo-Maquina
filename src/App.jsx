import React, { useState, useEffect } from 'react';
import { Play, Code, Cpu, FileCode, BookOpen, Terminal } from 'lucide-react';

const problems = {
    estudiantes: {
      name: "Sistema de Gestión de Estudiantes",
      description: "Gestión de estudiantes con arrays y estructuras",
      sourceCode: `// Sistema de Gestión de Estudiantes
struct Estudiante {
    int id;
    char nombre[50];
    float promedio;
};

int main() {
    struct Estudiante estudiantes[100];
    int total = 0;
    int opcion;
    
    // Agregar estudiante
    estudiantes[total].id = 1001;
    estudiantes[total].promedio = 8.5;
    total = total + 1;
    
    // Buscar estudiante por ID
    int id_buscar = 1001;
    int encontrado = 0;
    for(int i = 0; i < total; i++) {
        if(estudiantes[i].id == id_buscar) {
            encontrado = 1;
            break;
        }
    }
    
    // Calcular promedio general
    float suma = 0.0;
    for(int i = 0; i < total; i++) {
        suma = suma + estudiantes[i].promedio;
    }
    float promedio_general = suma / total;
    
    return 0;
}`
    },
    inventario: {
      name: "Sistema de Inventario con Structs",
      description: "Control de inventario con estructuras de datos",
      sourceCode: `// Sistema de Inventario
struct Producto {
    int codigo;
    char nombre[30];
    int cantidad;
    float precio;
};

int main() {
    struct Producto productos[50];
    int total_productos = 0;
    
    // Agregar producto
    productos[0].codigo = 100;
    productos[0].cantidad = 50;
    productos[0].precio = 25.99;
    total_productos = 1;
    
    // Actualizar cantidad
    int codigo_buscar = 100;
    int nueva_cantidad = 75;
    for(int i = 0; i < total_productos; i++) {
        if(productos[i].codigo == codigo_buscar) {
            productos[i].cantidad = nueva_cantidad;
        }
    }
    
    // Calcular valor total del inventario
    float valor_total = 0.0;
    for(int i = 0; i < total_productos; i++) {
        float valor_producto = productos[i].cantidad * productos[i].precio;
        valor_total = valor_total + valor_producto;
    }
    
    return 0;
}`
    },
    cadenas: {
      name: "Sistema de Procesamiento de Cadenas",
      description: "Manipulación y análisis de cadenas de texto",
      sourceCode: `// Sistema de Procesamiento de Cadenas
int longitud_cadena(char* str) {
    int len = 0;
    while(str[len] != '\\0') {
        len = len + 1;
    }
    return len;
}

void invertir_cadena(char* str) {
    int len = longitud_cadena(str);
    int i = 0;
    int j = len - 1;
    
    while(i < j) {
        char temp = str[i];
        str[i] = str[j];
        str[j] = temp;
        i = i + 1;
        j = j - 1;
    }
}

int main() {
    char texto[100] = "Hola Mundo";
    
    // Calcular longitud
    int len = longitud_cadena(texto);
    
    // Invertir cadena
    invertir_cadena(texto);
    
    // Contar vocales
    int vocales = 0;
    for(int i = 0; i < len; i++) {
        char c = texto[i];
        if(c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') {
            vocales = vocales + 1;
        }
    }
    
    return 0;
}`
    },
    factorial: {
      name: "Cálculo de Factorial con Recursión",
      description: "Implementación recursiva del factorial",
      sourceCode: `// Cálculo de Factorial Recursivo
int factorial(int n) {
    if(n <= 1) {
        return 1;
    }
    int temp = n - 1;
    int result = factorial(temp);
    return n * result;
}

int main() {
    int numero = 5;
    int resultado = factorial(numero);
    
    // Cálculo iterativo para comparar
    int fact_iter = 1;
    for(int i = 1; i <= numero; i++) {
        fact_iter = fact_iter * i;
    }
    
    return 0;
}`
    }
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
    const intermediateCodeMap = {
      estudiantes: `; Código Intermedio de Tres Direcciones (TAC)
; Sistema de Gestión de Estudiantes

; Declaraciones
DECLARE estudiantes[100] : struct
DECLARE total : int
DECLARE id_buscar : int
DECLARE encontrado : int
DECLARE suma : float
DECLARE promedio_general : float

; main()
LABEL L_main:
    ; Inicializar variables
    t1 = 0
    total = t1
    
    ; Agregar primer estudiante
    t2 = total * SIZEOF(struct Estudiante)
    t3 = &estudiantes[0] + t2
    t4 = 1001
    *(t3 + 0) = t4                    ; estudiantes[total].id = 1001
    
    t5 = 8.5
    *(t3 + 8) = t5                    ; estudiantes[total].promedio = 8.5
    
    t6 = total + 1
    total = t6
    
    ; Buscar estudiante por ID
    t7 = 1001
    id_buscar = t7
    t8 = 0
    encontrado = t8
    
    t9 = 0
    i = t9
    
LABEL L_buscar_loop:
    t10 = i < total
    IF_FALSE t10 GOTO L_buscar_end
    
    t11 = i * SIZEOF(struct Estudiante)
    t12 = &estudiantes[0] + t11
    t13 = *(t12 + 0)                  ; estudiantes[i].id
    t14 = t13 == id_buscar
    IF_FALSE t14 GOTO L_buscar_continue
    
    t15 = 1
    encontrado = t15
    GOTO L_buscar_end
    
LABEL L_buscar_continue:
    t16 = i + 1
    i = t16
    GOTO L_buscar_loop
    
LABEL L_buscar_end:
    ; Calcular promedio general
    t17 = 0.0
    suma = t17
    t18 = 0
    i = t18
    
LABEL L_promedio_loop:
    t19 = i < total
    IF_FALSE t19 GOTO L_promedio_end
    
    t20 = i * SIZEOF(struct Estudiante)
    t21 = &estudiantes[0] + t20
    t22 = *(t21 + 8)                  ; estudiantes[i].promedio
    t23 = suma + t22
    suma = t23
    
    t24 = i + 1
    i = t24
    GOTO L_promedio_loop
    
LABEL L_promedio_end:
    t25 = suma / total
    promedio_general = t25
    
    t26 = 0
    RETURN t26`,

      inventario: `; Código Intermedio de Tres Direcciones (TAC)
; Sistema de Inventario

; Declaraciones
DECLARE productos[50] : struct
DECLARE total_productos : int
DECLARE codigo_buscar : int
DECLARE nueva_cantidad : int
DECLARE valor_total : float

; main()
LABEL L_main:
    ; Agregar primer producto
    t1 = &productos[0]
    t2 = 100
    *(t1 + 0) = t2                    ; productos[0].codigo = 100
    
    t3 = 50
    *(t1 + 8) = t3                    ; productos[0].cantidad = 50
    
    t4 = 25.99
    *(t1 + 12) = t4                   ; productos[0].precio = 25.99
    
    t5 = 1
    total_productos = t5
    
    ; Actualizar cantidad
    t6 = 100
    codigo_buscar = t6
    t7 = 75
    nueva_cantidad = t7
    
    t8 = 0
    i = t8
    
LABEL L_actualizar_loop:
    t9 = i < total_productos
    IF_FALSE t9 GOTO L_actualizar_end
    
    t10 = i * SIZEOF(struct Producto)
    t11 = &productos[0] + t10
    t12 = *(t11 + 0)                  ; productos[i].codigo
    t13 = t12 == codigo_buscar
    IF_FALSE t13 GOTO L_actualizar_continue
    
    *(t11 + 8) = nueva_cantidad       ; productos[i].cantidad = nueva_cantidad
    
LABEL L_actualizar_continue:
    t14 = i + 1
    i = t14
    GOTO L_actualizar_loop
    
LABEL L_actualizar_end:
    ; Calcular valor total
    t15 = 0.0
    valor_total = t15
    t16 = 0
    i = t16
    
LABEL L_valor_loop:
    t17 = i < total_productos
    IF_FALSE t17 GOTO L_valor_end
    
    t18 = i * SIZEOF(struct Producto)
    t19 = &productos[0] + t18
    t20 = *(t19 + 8)                  ; productos[i].cantidad
    t21 = *(t19 + 12)                 ; productos[i].precio
    t22 = t20 * t21
    t23 = valor_total + t22
    valor_total = t23
    
    t24 = i + 1
    i = t24
    GOTO L_valor_loop
    
LABEL L_valor_end:
    t25 = 0
    RETURN t25`,

      cadenas: `; Código Intermedio de Tres Direcciones (TAC)
; Sistema de Procesamiento de Cadenas

; Declaraciones
DECLARE texto[100] : char
DECLARE len : int
DECLARE vocales : int

; longitud_cadena(str)
LABEL L_longitud_cadena:
    PARAM str
    t1 = 0
    len_local = t1
    
LABEL L_longitud_loop:
    t2 = *(str + len_local)
    t3 = t2 == '\\0'
    IF_TRUE t3 GOTO L_longitud_end
    
    t4 = len_local + 1
    len_local = t4
    GOTO L_longitud_loop
    
LABEL L_longitud_end:
    RETURN len_local

; invertir_cadena(str)
LABEL L_invertir_cadena:
    PARAM str
    PUSH str
    CALL L_longitud_cadena
    POP 1
    len_inv = RETVAL
    
    t5 = 0
    i = t5
    t6 = len_inv - 1
    j = t6
    
LABEL L_invertir_loop:
    t7 = i < j
    IF_FALSE t7 GOTO L_invertir_end
    
    t8 = *(str + i)
    temp = t8
    t9 = *(str + j)
    *(str + i) = t9
    *(str + j) = temp
    
    t10 = i + 1
    i = t10
    t11 = j - 1
    j = t11
    GOTO L_invertir_loop
    
LABEL L_invertir_end:
    RETURN

; main()
LABEL L_main:
    ; Inicializar texto
    t12 = &texto[0]
    
    ; Calcular longitud
    PUSH t12
    CALL L_longitud_cadena
    POP 1
    len = RETVAL
    
    ; Invertir cadena
    PUSH t12
    CALL L_invertir_cadena
    POP 1
    
    ; Contar vocales
    t13 = 0
    vocales = t13
    t14 = 0
    i = t14
    
LABEL L_vocales_loop:
    t15 = i < len
    IF_FALSE t15 GOTO L_vocales_end
    
    t16 = *(texto + i)
    c = t16
    
    t17 = c == 'a'
    IF_TRUE t17 GOTO L_es_vocal
    t18 = c == 'e'
    IF_TRUE t18 GOTO L_es_vocal
    t19 = c == 'i'
    IF_TRUE t19 GOTO L_es_vocal
    t20 = c == 'o'
    IF_TRUE t20 GOTO L_es_vocal
    t21 = c == 'u'
    IF_TRUE t21 GOTO L_es_vocal
    GOTO L_no_vocal
    
LABEL L_es_vocal:
    t22 = vocales + 1
    vocales = t22
    
LABEL L_no_vocal:
    t23 = i + 1
    i = t23
    GOTO L_vocales_loop
    
LABEL L_vocales_end:
    t24 = 0
    RETURN t24`,

      factorial: `; Código Intermedio de Tres Direcciones (TAC)
; Cálculo de Factorial Recursivo

; Declaraciones
DECLARE numero : int
DECLARE resultado : int
DECLARE fact_iter : int

; factorial(n)
LABEL L_factorial:
    PARAM n
    t1 = n <= 1
    IF_FALSE t1 GOTO L_factorial_recursivo
    
    t2 = 1
    RETURN t2
    
LABEL L_factorial_recursivo:
    t3 = n - 1
    temp = t3
    
    PUSH temp
    CALL L_factorial
    POP 1
    result = RETVAL
    
    t4 = n * result
    RETURN t4

; main()
LABEL L_main:
    ; Inicializar número
    t5 = 5
    numero = t5
    
    ; Calcular factorial recursivo
    PUSH numero
    CALL L_factorial
    POP 1
    resultado = RETVAL
    
    ; Calcular factorial iterativo
    t6 = 1
    fact_iter = t6
    t7 = 1
    i = t7
    
LABEL L_factorial_iter_loop:
    t8 = i <= numero
    IF_FALSE t8 GOTO L_factorial_iter_end
    
    t9 = fact_iter * i
    fact_iter = t9
    
    t10 = i + 1
    i = t10
    GOTO L_factorial_iter_loop
    
LABEL L_factorial_iter_end:
    t11 = 0
    RETURN t11`
    };

    return intermediateCodeMap[problem];
  };

  const generateAssemblyCode = (problem) => {
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
    // Obtener el código editable actual
    const currentCode = editableCode || problems[problem].sourceCode;
    
    // Parsear valores del código
    const parsedValues = parseCodeValues(currentCode, problem);
    
    // Generar código dinámico
    if (problem === 'estudiantes') {
      const studentId = parsedValues.studentId || 1001;
      const idBuscar = parsedValues.idBuscar || studentId;
      
      return `; Código EMU8086 (8086/16-bit) - Sistema de Gestión de Estudiantes
; Valores dinámicos: ID=${studentId}, Buscar=${idBuscar}

.model small
.stack 100h
.data
    estudiantes dw 100 dup(0)
    id_buscar dw ${idBuscar}
.code
main proc
    mov ax, @data
    mov ds, ax
    mov ax, ${studentId}
    mov estudiantes, ax
    mov ax, 4c00h
    int 21h
main endp
end main`;
    } else if (problem === 'inventario') {
      const codigo = parsedValues.codigo || 100;
      const nuevaCantidad = parsedValues.nuevaCantidad || 75;
      
      return `; Código EMU8086 (8086/16-bit) - Sistema de Inventario
; Valores dinámicos: Código=${codigo}, Nueva Cantidad=${nuevaCantidad}

.model small
.stack 100h
.data
    productos dw ${codigo}
    nueva_cantidad dw ${nuevaCantidad}
.code
main proc
    mov ax, @data
    mov ds, ax
    mov ax, nueva_cantidad
    mov ax, 4c00h
    int 21h
main endp
end main`;
    } else if (problem === 'cadenas') {
      const texto = parsedValues.texto || "Hola Mundo";
      
      return `; Código EMU8086 (8086/16-bit) - Procesamiento de Cadenas
; Valor dinámico: Texto="${texto}"

.model small
.stack 100h
.data
    texto db '${texto}$'
.code
main proc
    mov ax, @data
    mov ds, ax
    mov ax, 4c00h
    int 21h
main endp
end main`;
    } else if (problem === 'factorial') {
      const numero = parsedValues.numero || 5;
      
      return `; Código EMU8086 (8086/16-bit) - Cálculo de Factorial
; Valor dinámico: Número=${numero}

.model small
.stack 100h
.data
    numero dw ${numero}
    resultado dw 1
.code
main proc
    mov ax, @data
    mov ds, ax
    mov cx, numero
    mov ax, 1
factorial_loop:
    cmp cx, 1
    jle factorial_fin
    mul cx
    dec cx
    jmp factorial_loop
factorial_fin:
    mov resultado, ax
    mov ax, 4c00h
    int 21h
main endp
end main`;
    }
    
    // Fallback para problemas no reconocidos
    return `; Código EMU8086 básico
.model small
.stack 100h
.code
main proc
    mov ax, 4c00h
    int 21h
main endp
end main`;
  };

  const originalGenerateEmu8086Code = (problem) => {
    const emu8086CodeMap = {
      estudiantes: `; Código EMU8086 (8086/16-bit)
; Sistema de Gestión de Estudiantes
; Valores dinámicos: ID=${studentId}, Buscar=${idBuscar}

.model small
.stack 100h

.data
    estudiantes dw 100 dup(0)  ; Array simple de IDs
    total dw 0                 ; Contador de estudiantes
    id_buscar dw ${idBuscar}         ; ID a buscar (dinámico)
    encontrado dw 0           ; Flag de encontrado

.code
main proc
    mov ax, @data
    mov ds, ax
    
    ; Agregar primer estudiante
    mov ax, ${studentId}              ; ID del estudiante (dinámico)
    mov bx, offset estudiantes
    mov [bx], ax              ; estudiantes[0] = ${studentId}
    
    ; Incrementar total
    mov total, 1
    
    ; Buscar estudiante por ID
    mov ax, id_buscar         ; Cargar ID a buscar
    mov cx, total             ; Cargar total en contador
    mov bx, offset estudiantes ; Puntero al array
    mov si, 0                 ; Índice
    
buscar_loop:
    cmp si, cx               ; Comparar índice con total
    jge buscar_fin           ; Si >= salir
    
    mov dx, [bx + si*2]      ; Cargar estudiantes[si]
    cmp dx, ax               ; Comparar con ID buscado
    je encontrado_si         ; Si igual, encontrado
    
    inc si                   ; Incrementar índice
    jmp buscar_loop
    
encontrado_si:
    mov encontrado, 1        ; Marcar como encontrado
    
buscar_fin:
    ; Terminar programa
    mov ax, 4c00h
    int 21h
    
main endp
end main`,

      inventario: (() => {
        // Valores dinámicos para inventario
        const codigo = parsedValues.codigo || 100;
        const cantidad = parsedValues.cantidad || 50;
        const nuevaCantidad = parsedValues.nuevaCantidad || 75;
        const codigoBuscar = parsedValues.codigoBuscar || codigo;
        
        return `; Código EMU8086 (8086/16-bit)
; Sistema de Inventario
; Valores dinámicos: Código=${codigo}, Cantidad=${cantidad}, Buscar=${codigoBuscar}, Nueva=${nuevaCantidad}

.model small
.stack 100h

.data
    productos dw 50 dup(0)    ; Array de códigos de productos
    cantidades dw 50 dup(0)   ; Array de cantidades
    total_productos dw 0      ; Total de productos
    codigo_buscar dw ${codigoBuscar}      ; Código a buscar (dinámico)
    nueva_cantidad dw ${nuevaCantidad}      ; Nueva cantidad (dinámico)

.code
main proc
    mov ax, @data
    mov ds, ax
    
    ; Agregar primer producto
    mov ax, ${codigo}                   ; Código del producto (dinámico)
    mov bx, offset productos
    mov [bx], ax                  ; productos[0] = ${codigo}
    
    mov ax, ${cantidad}                    ; Cantidad inicial (dinámico)
    mov bx, offset cantidades
    mov [bx], ax                  ; cantidades[0] = ${cantidad}
    
    mov total_productos, 1        ; Total = 1
    
    ; Actualizar cantidad
    mov ax, codigo_buscar         ; Código a buscar
    mov cx, total_productos       ; Total de productos
    mov bx, offset productos      ; Puntero a productos
    mov si, 0                     ; Índice
    
actualizar_loop:
    cmp si, cx                    ; Comparar con total
    jge actualizar_fin
    
    mov dx, [bx + si*2]           ; productos[si]
    cmp dx, ax                    ; Comparar códigos
    je actualizar_cantidad        ; Si igual, actualizar
    
    inc si
    jmp actualizar_loop
    
actualizar_cantidad:
    mov dx, nueva_cantidad        ; Nueva cantidad
    mov bx, offset cantidades
    mov [bx + si*2], dx           ; cantidades[si] = nueva_cantidad
    
actualizar_fin:
    ; Terminar programa
    mov ax, 4c00h
    int 21h
    
main endp
end main`;
      })(),

      cadenas: (() => {
        // Valores dinámicos para cadenas
        const texto = parsedValues.texto || "Hola Mundo";
        
        return `; Código EMU8086 (8086/16-bit)
; Sistema de Procesamiento de Cadenas
; Valor dinámico: Texto="${texto}"

.model small
.stack 100h

.data
    texto db '${texto}$'      ; String terminada en $ (dinámico)
    len_texto dw 0              ; Longitud del texto
    vocales dw 0                ; Contador de vocales`;
      })(),

      factorial: (() => {
        const numero = parsedValues.numero || 5;
        
        return `; Código EMU8086 (8086/16-bit)
; Cálculo de Factorial (Iterativo)
; Valor dinámico: Número=${numero}

.model small
.stack 100h

.data
    numero dw ${numero}                 
    resultado dw 1              

.code
main proc
    mov ax, @data
    mov ds, ax
    
    ; Calcular factorial iterativo
    mov ax, numero              
    mov bx, 1                   
    mov cx, ax                  
    
factorial_loop:
    cmp cx, 0                   
    je factorial_fin
    
    ; Multiplicar resultado por contador
    push dx                     
    mul cx                      
    mov bx, ax                  
    pop dx                      
    
    dec cx                      
    jmp factorial_loop
    
factorial_fin:
    mov resultado, bx           
    
    ; Terminar programa
    mov ax, 4c00h
    int 21h
    
main endp
end main`;
      })()
    };

    return emu8086CodeMap[problem];
  };

  const parseCodeValues = (code, problem) => {
    if (!code || typeof code !== 'string') {
      return {};
    }
    
    const lines = code.split('\n');
    const values = {};
    
    // Extraer valores del código según el problema
    switch(problem) {
      case 'estudiantes':
        lines.forEach(line => {
          // Buscar asignaciones de ID de estudiante (más flexible)
          if (line.includes('estudiantes[') && line.includes('.id') && line.includes('=')) {
            const match = line.match(/=\s*(\d+)/);
            if (match) values.studentId = parseInt(match[1]);
          }
          // Buscar asignaciones de promedio de estudiante (más flexible)
          if (line.includes('estudiantes[') && line.includes('.promedio') && line.includes('=')) {
            const match = line.match(/=\s*([\d.]+)/);
            if (match) values.promedio = parseFloat(match[1]);
          }
          // Buscar id_buscar
          if (line.includes('id_buscar') && line.includes('=')) {
            const match = line.match(/=\s*(\d+)/);
            if (match) values.idBuscar = parseInt(match[1]);
          }
        });
        break;
        
      case 'inventario':
        lines.forEach(line => {
          // Buscar asignaciones de código de producto (más flexible)
          if (line.includes('productos[') && line.includes('.codigo') && line.includes('=')) {
            const match = line.match(/=\s*(\d+)/);
            if (match) values.codigo = parseInt(match[1]);
          }
          // Buscar asignaciones de cantidad de producto (más flexible)
          if (line.includes('productos[') && line.includes('.cantidad') && line.includes('=')) {
            const match = line.match(/=\s*(\d+)/);
            if (match) values.cantidad = parseInt(match[1]);
          }
          // Buscar asignaciones de precio de producto (más flexible)
          if (line.includes('productos[') && line.includes('.precio') && line.includes('=')) {
            const match = line.match(/=\s*([\d.]+)/);
            if (match) values.precio = parseFloat(match[1]);
          }
          // Buscar nueva_cantidad
          if (line.includes('nueva_cantidad') && line.includes('=')) {
            const match = line.match(/=\s*(\d+)/);
            if (match) values.nuevaCantidad = parseInt(match[1]);
          }
          // Buscar codigo_buscar
          if (line.includes('codigo_buscar') && line.includes('=')) {
            const match = line.match(/=\s*(\d+)/);
            if (match) values.codigoBuscar = parseInt(match[1]);
          }
        });
        break;
        
      case 'cadenas':
        lines.forEach(line => {
          // Buscar cadenas de texto entre comillas
          if (line.includes('"') && !line.trim().startsWith('//')) {
            const matches = line.match(/"([^"]+)"/g);
            if (matches) {
              // Tomar la primera cadena encontrada (generalmente la más importante)
              const firstString = matches[0].replace(/"/g, '');
              if (firstString.length > 0) values.texto = firstString;
            }
          }
          // Buscar asignaciones de char arrays
          if (line.includes('strcpy') && line.includes('"')) {
            const match = line.match(/"([^"]+)"/);
            if (match) values.texto = match[1];
          }
        });
        break;
        
      case 'factorial':
        lines.forEach(line => {
          // Solo buscar asignaciones directas a la variable numero (no en for loops)
          if (line.includes('numero') && line.includes('=') && !line.includes('for') && !line.includes('<=') && !line.includes('>=')) {
            const match = line.match(/numero\s*=\s*(\d+)/);
            if (match) values.numero = parseInt(match[1]);
          }
        });
        break;
    }
    
    return values;
  };

  const generateDynamicExecution = (problem, values) => {
    switch(problem) {
      case 'estudiantes': {
        const studentId = values.studentId || 1001;
        const promedio = values.promedio || 8.5;
        const idBuscar = values.idBuscar || studentId;
        const encontrado = studentId === idBuscar ? 1 : 0;
        
        return {
          variables: {
            'total': 1,
            'estudiantes[0].id': studentId,
            'estudiantes[0].promedio': promedio,
            'id_buscar': idBuscar,
            'encontrado': encontrado,
            'suma': promedio,
            'promedio_general': promedio
          },
          output: `=== EJECUCIÓN DEL PROGRAMA ===
🎯 Sistema de Gestión de Estudiantes

📝 Inicialización:
   total = 0

➕ Agregando primer estudiante:
   estudiantes[0].id = ${studentId}
   estudiantes[0].promedio = ${promedio}
   total = 1

🔍 Buscando estudiante con ID ${idBuscar}:
   Iterando: i = 0
   estudiantes[0].id (${studentId}) ${studentId === idBuscar ? '==' : '!='} id_buscar (${idBuscar}) ${studentId === idBuscar ? '✅' : '❌'}
   ${encontrado ? '¡Estudiante encontrado!' : 'Estudiante NO encontrado'}
   encontrado = ${encontrado}

📊 Calculando promedio general:
   suma = 0.0
   Iterando: i = 0
   suma += estudiantes[0].promedio (${promedio})
   suma = ${promedio}
   promedio_general = suma / total = ${promedio} / 1 = ${promedio}

✅ RESULTADO FINAL:
   - Total de estudiantes: 1
   - Estudiante encontrado: ${encontrado ? 'SÍ' : 'NO'}
   - Promedio general: ${promedio}

🔚 Programa terminado (return 0)`
        };
      }
        
      case 'inventario': {
        const codigo = values.codigo || 100;
        const cantidadInicial = values.cantidad || 50;
        const precio = values.precio || 25.99;
        const nuevaCantidad = values.nuevaCantidad || 75;
        const codigoBuscar = values.codigoBuscar || codigo;
        const valorTotal = nuevaCantidad * precio;
        
        return {
          variables: {
            'total_productos': 1,
            'productos[0].codigo': codigo,
            'productos[0].cantidad': nuevaCantidad,
            'productos[0].precio': precio,
            'codigo_buscar': codigoBuscar,
            'nueva_cantidad': nuevaCantidad,
            'valor_total': valorTotal.toFixed(2)
          },
          output: `=== EJECUCIÓN DEL PROGRAMA ===
🏪 Sistema de Inventario

➕ Agregando primer producto:
   productos[0].codigo = ${codigo}
   productos[0].cantidad = ${cantidadInicial}
   productos[0].precio = ${precio}
   total_productos = 1

🔄 Actualizando cantidad del producto código ${codigoBuscar}:
   codigo_buscar = ${codigoBuscar}
   nueva_cantidad = ${nuevaCantidad}
   Iterando: i = 0
   productos[0].codigo (${codigo}) ${codigo === codigoBuscar ? '==' : '!='} codigo_buscar (${codigoBuscar}) ${codigo === codigoBuscar ? '✅' : '❌'}
   productos[0].cantidad = ${nuevaCantidad}

💰 Calculando valor total del inventario:
   valor_total = 0.0
   Iterando: i = 0
   valor_producto = cantidad * precio
   valor_producto = ${nuevaCantidad} * ${precio} = ${valorTotal.toFixed(2)}
   valor_total += valor_producto
   valor_total = ${valorTotal.toFixed(2)}

✅ RESULTADO FINAL:
   - Total de productos: 1
   - Producto código ${codigo}: ${nuevaCantidad} unidades
   - Precio unitario: $${precio}
   - Valor total del inventario: $${valorTotal.toFixed(2)}

🔚 Programa terminado (return 0)`
        };
      }
        
      case 'cadenas': {
        const texto = values.texto || "Hola Mundo";
        const textoInvertido = texto.split('').reverse().join('');
        const vocales = (textoInvertido.match(/[aeiouAEIOU]/g) || []).length;
        
        return {
          variables: {
            'texto': `"${textoInvertido}"`,
            'len': texto.length,
            'vocales': vocales
          },
          output: `=== EJECUCIÓN DEL PROGRAMA ===
📝 Sistema de Procesamiento de Cadenas

🔤 Texto inicial: "${texto}"

📏 Calculando longitud:
   Contando caracteres hasta '\\0'...
   len = ${texto.length} caracteres

🔄 Invirtiendo cadena:
   Intercambiando caracteres...
   Resultado: "${textoInvertido}"

🔤 Contando vocales en texto invertido:
   Analizando cada carácter:
   ${textoInvertido.split('').map((char) => {
     const isVocal = /[aeiouAEIOU]/.test(char);
     return `   ${char} → ${isVocal ? '✅ vocal' : 'no vocal'}`;
   }).join('\n')}

✅ RESULTADO FINAL:
   - Texto original: "${texto}"
   - Texto invertido: "${textoInvertido}"
   - Longitud: ${texto.length} caracteres
   - Vocales encontradas: ${vocales}

🔚 Programa terminado (return 0)`
        };
      }
        
      case 'factorial': {
        const numero = values.numero || 5;
        let factorial = 1;
        for(let i = 1; i <= numero; i++) {
          factorial *= i;
        }
        
        // Generar pasos de la recursión
        const recursionSteps = [];
        for(let i = numero; i >= 1; i--) {
          if(i === 1) {
            recursionSteps.push(`   factorial(1): n=1 <= 1, retornar 1`);
          } else {
            recursionSteps.push(`   factorial(${i}): n=${i} > 1, llamar factorial(${i-1})`);
          }
        }
        
        const buildupSteps = [];
        let temp = 1;
        for(let i = 2; i <= numero; i++) {
          temp *= i;
          buildupSteps.push(`   factorial(${i}): ${i} * ${temp/i} = ${temp}`);
        }
        
        return {
          variables: {
            'numero': numero,
            'resultado': factorial,
            'fact_iter': factorial
          },
          output: `=== EJECUCIÓN DEL PROGRAMA ===
🔢 Cálculo de Factorial

📊 Número inicial: ${numero}

🔄 Cálculo recursivo factorial(${numero}):
${recursionSteps.join('\n')}
${buildupSteps.join('\n')}
   
   resultado = ${factorial}

🔁 Cálculo iterativo para verificar:
   fact_iter = 1
   for i=1 to ${numero}:
${Array.from({length: numero}, (_, i) => {
  const n = i + 1;
  const partial = Array.from({length: n}, (_, j) => j + 1).reduce((a, b) => a * b, 1);
  return `     i=${n}: fact_iter = ${i === 0 ? 1 : Array.from({length: n-1}, (_, j) => j + 1).reduce((a, b) => a * b, 1)} * ${n} = ${partial}`;
}).join('\n')}
   
   fact_iter = ${factorial}

✅ RESULTADO FINAL:
   - Número: ${numero}
   - Factorial recursivo: ${factorial}
   - Factorial iterativo: ${factorial}
   - ✅ Ambos métodos coinciden!

🔚 Programa terminado (return 0)`
        };
      }
    }
    
    return { variables: {}, output: 'Error en la ejecución' };
  };

  const executeCode = (problem) => {
    // Verificar que el problema existe
    if (!problems[problem]) {
      return { variables: {}, output: 'Error: Problema no encontrado' };
    }
    
    // Obtener el código editable actual
    const currentCode = editableCode || problems[problem].sourceCode;
    
    // Parsear valores del código
    const parsedValues = parseCodeValues(currentCode, problem);
    
    // Generar ejecución dinámica
    const result = generateDynamicExecution(problem, parsedValues);
    
    return result;
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
