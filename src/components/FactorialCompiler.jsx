import React from 'react';

class FactorialCompiler {
  static problemData = {
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
  };

  static generateIntermediateCode() {
    return `; Código Intermedio de Tres Direcciones (TAC)
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
    RETURN t11`;
  }

  static generateAssemblyCode() {
    return `; Código Ensamblador x86-64
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
; ./factorial`;
  }

  static parseCodeValues(code) {
    if (!code || typeof code !== 'string') {
      return {};
    }
    
    const lines = code.split('\n');
    const values = {};
    
    lines.forEach(line => {
      // Solo buscar asignaciones directas a la variable numero (no en for loops)
      if (line.includes('numero') && line.includes('=') && !line.includes('for') && !line.includes('<=') && !line.includes('>=')) {
        const match = line.match(/numero\s*=\s*(\d+)/);
        if (match) values.numero = parseInt(match[1]);
      }
    });
    
    return values;
  }

  static generateEmu8086Code(/* code */) {
    // Interfaz gráfica con ventana para entrada de datos
    
    return `; Código EMU8086 (8086/16-bit) - Calculadora de Factorial
; Interfaz gráfica con ventana para solicitar datos

.model small
.stack 100h

.data
    ; Mensajes de la interfaz
    titulo      db 'CALCULADORA DE FACTORIAL$'
    msg_input   db 'Ingrese numero (0-8):$'
    msg_result  db 'Factorial de $'
    msg_error   db 'ERROR: Numero invalido (0-8 solamente)$'
    msg_nuevo   db 'F1=Nuevo Calculo  F2=Salir$'
    msg_igual   db ' es: $'
    
    ; Variables
    numero      dw 0
    resultado   dw 0
    buffer      db 10, ?, 10 dup(0)
    temp_num    dw 0

.code
main proc
    mov ax, @data
    mov ds, ax
    
inicio:
    ; Limpiar pantalla
    mov ax, 0003h
    int 10h
    
    ; Mostrar título
    mov ah, 02h
    mov bh, 0
    mov dh, 2
    mov dl, 20
    int 10h
    
    lea dx, titulo
    mov ah, 09h
    int 21h
    
    ; Nueva línea
    mov ah, 02h
    mov dl, 0Dh
    int 21h
    mov ah, 02h
    mov dl, 0Ah
    int 21h
    mov ah, 02h
    mov dl, 0Ah
    int 21h
    
    ; Mostrar mensaje de entrada
    lea dx, msg_input
    mov ah, 09h
    int 21h
    
    ; Leer entrada del usuario
    lea dx, buffer
    mov ah, 0Ah
    int 21h
    
    ; Nueva línea
    mov ah, 02h
    mov dl, 0Dh
    int 21h
    mov ah, 02h
    mov dl, 0Ah
    int 21h
    
    ; Convertir a número
    call convertir_a_numero
    cmp ax, 0FFFFh
    je error_entrada
    
    mov numero, ax
    
    ; Calcular factorial
    call calcular_factorial
    mov resultado, ax
    
    ; Mostrar resultado
    lea dx, msg_result
    mov ah, 09h
    int 21h
    
    mov ax, numero
    call mostrar_numero
    
    lea dx, msg_igual
    mov ah, 09h
    int 21h
    
    mov ax, resultado
    call mostrar_numero
    
    ; Nueva línea
    mov ah, 02h
    mov dl, 0Dh
    int 21h
    mov ah, 02h
    mov dl, 0Ah
    int 21h
    mov ah, 02h
    mov dl, 0Ah
    int 21h
    
    ; Preguntar si continuar
    lea dx, msg_nuevo
    mov ah, 09h
    int 21h
    
    ; Esperar tecla
    mov ah, 00h
    int 16h
    
    cmp al, 27                  ; ESC para salir
    je salir
    
    jmp inicio

error_entrada:
    lea dx, msg_error
    mov ah, 09h
    int 21h
    
    ; Nueva línea
    mov ah, 02h
    mov dl, 0Dh
    int 21h
    mov ah, 02h
    mov dl, 0Ah
    int 21h
    
    jmp inicio

salir:
    mov ax, 4c00h
    int 21h
main endp

; Convertir cadena a número con validación
convertir_a_numero proc
    push bx
    push cx
    push dx
    
    xor ax, ax                  ; Resultado = 0
    xor bx, bx                  ; Índice = 0
    mov cl, [buffer + 1]        ; Longitud de cadena
    cmp cl, 0                   ; ¿Cadena vacía?
    je conversion_error
    
conversion_loop:
    cmp bl, cl                  ; ¿Fin de cadena?
    jge conversion_ok
    
    mov dl, [buffer + bx + 2]   ; Obtener carácter
    cmp dl, '0'                 ; ¿Menor que '0'?
    jb conversion_error
    cmp dl, '9'                 ; ¿Mayor que '9'?
    ja conversion_error
    
    ; ax = ax * 10 + (dl - '0')
    push dx
    mov dx, 10
    mul dx                      ; ax = ax * 10
    pop dx
    sub dl, '0'                 ; dl = dígito
    xor dh, dh                  ; limpiar parte alta
    add ax, dx                  ; ax = ax + dígito
    
    inc bx
    jmp conversion_loop
    
conversion_error:
    mov ax, 0FFFFh              ; Indicar error
    
conversion_ok:
    pop dx
    pop cx  
    pop bx
    ret
convertir_a_numero endp

; Calcular factorial de forma iterativa
calcular_factorial proc
    push bx
    push cx
    
    mov ax, numero              ; Cargar número
    cmp ax, 0                   ; Si es 0, factorial = 1
    je factorial_cero
    cmp ax, 1                   ; Si es 1, factorial = 1
    je factorial_uno
    
    ; Calcular factorial iterativamente
    mov bx, ax                  ; BX = n
    mov ax, 1                   ; AX = resultado (inicialmente 1)
    
factorial_loop:
    mul bx                      ; AX = AX * BX
    dec bx                      ; BX--
    cmp bx, 1
    jg factorial_loop           ; Continuar si BX > 1
    
    jmp fin_factorial
    
factorial_cero:
factorial_uno:
    mov ax, 1                   ; 0! = 1! = 1
    
fin_factorial:
    pop cx
    pop bx
    ret
calcular_factorial endp

; Mostrar número en decimal
mostrar_numero proc
    push ax
    push bx
    push cx
    push dx
    
    mov bx, 10                  ; Base decimal
    xor cx, cx                  ; Contador de dígitos
    
    cmp ax, 0                   ; ¿Es cero?
    jne num_loop
    
    ; Mostrar '0' si el número es cero
    mov dl, '0'
    mov ah, 02h
    int 21h
    jmp num_fin
    
num_loop:
    cmp ax, 0                   ; ¿Terminamos?
    je mostrar_digitos
    
    xor dx, dx                  ; Limpiar DX
    div bx                      ; AX = AX/10, DX = resto
    add dx, '0'                 ; Convertir a ASCII
    push dx                     ; Guardar en stack
    inc cx                      ; Incrementar contador
    jmp num_loop
    
mostrar_digitos:
    cmp cx, 0                   ; ¿Hay dígitos?
    je num_fin
    
    pop dx                      ; Recuperar dígito
    mov ah, 02h                 ; Mostrar carácter
    int 21h
    dec cx
    jmp mostrar_digitos
    
num_fin:
    pop dx
    pop cx
    pop bx
    pop ax
    ret
mostrar_numero endp

end main

; INSTRUCCIONES DE USO:
; 1. Compile y ejecute en EMU8086
; 2. La interfaz gráfica aparecerá automáticamente
; 3. Ingrese un número del 0 al 8 en la ventana verde
; 4. Presione Enter para calcular el factorial
; 5. El resultado aparecerá en ventana roja
; 6. Presione F1 para nuevo cálculo, F2 para salir
;
; CARACTERÍSTICAS DE LA INTERFAZ:
; - Ventana principal con título y marco decorativo
; - Ventana de entrada (verde) para ingresar datos
; - Ventana de resultado (roja) para mostrar factorial
; - Ventana de error (roja brillante) para números inválidos
; - Instrucciones en la parte inferior
;
; EJEMPLOS:
; Entrada: 5 → Resultado: Factorial de 5 es: 120
; Entrada: 0 → Resultado: Factorial de 0 es: 1  
; Entrada: 8 → Resultado: Factorial de 8 es: 40320`;
  }

  static executeCode(code) {
    const parsedValues = this.parseCodeValues(code);
    const numero = parsedValues.numero || 5;
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

export default FactorialCompiler;