import React from 'react';

class CadenasCompiler {
  static problemData = {
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
  };

  static generateIntermediateCode() {
    return `; Código Intermedio de Tres Direcciones (TAC)
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
    RETURN t24`;
  }

  static generateAssemblyCode() {
    return `; Código Ensamblador x86-64
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
    cmp byte [rdi + rax], 0     ; str[len] == '\\0'?
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
    ret`;
  }

  static parseCodeValues(code) {
    if (!code || typeof code !== 'string') {
      return {};
    }
    
    const lines = code.split('\n');
    const values = {};
    
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
    
    return values;
  }

  static generateEmu8086Code(code) { // eslint-disable-line no-unused-vars
    return `; Código EMU8086 (8086/16-bit) - Procesador de Cadenas
; Interfaz gráfica para análisis de texto

.model small
.stack 100h

.data
    ; Mensajes del sistema
    titulo          db 'PROCESADOR DE CADENAS DE TEXTO$'
    msg_menu        db 'Menu: 1=Ingresar 2=Longitud 3=Vocales 4=Invertir 5=Salir$'
    msg_entrada     db 'Ingrese texto a procesar:$'
    msg_longitud    db 'Longitud del texto:$'
    msg_vocales     db 'Cantidad de vocales:$'
    msg_invertido   db 'Texto invertido:$'
    msg_resultado   db 'Resultado: $'
    msg_texto_actual db 'Texto actual: $'
    msg_continuar   db 'Presione cualquier tecla para continuar...$'
    msg_opcion      db 'Seleccione opcion: $'
    msg_sin_texto   db 'ERROR: Debe ingresar texto primero$'
    
    ; Variables del sistema
    opcion          db 0
    tiene_texto     db 0            ; Flag si hay texto ingresado
    
    ; Buffers para texto
    texto_original  db 80 dup(0)    ; Texto original
    texto_invertido db 80 dup(0)    ; Texto invertido
    buffer_entrada  db 80, ?, 80 dup(0)  ; Buffer para entrada
    longitud_actual dw 0            ; Longitud calculada
    contador_vocales dw 0           ; Contador de vocales

.code
main proc
    mov ax, @data
    mov ds, ax
    
inicio:
    call limpiar_pantalla
    call mostrar_titulo
    
    ; Solicitar texto directamente
    call nueva_linea
    lea dx, msg_entrada
    mov ah, 09h
    int 21h
    
    ; Leer texto del usuario
    lea dx, buffer_entrada
    mov ah, 0Ah
    int 21h
    
    ; Procesar texto automáticamente
    call procesar_texto_completo
    
    ; Mostrar resultados
    call mostrar_todos_resultados
    
    ; Pausa antes de salir
    call pausa
    
procesar_texto_completo proc
    ; Copiar texto ingresado al buffer principal
    mov si, offset buffer_entrada + 2  ; Apuntar al texto (saltar longitud)
    mov di, offset texto_original
    mov cl, buffer_entrada + 1         ; Obtener longitud real
    mov ch, 0
    
copiar_loop:
    cmp cx, 0
    je copiar_fin
    mov al, [si]
    mov [di], al
    inc si
    inc di
    dec cx
    jmp copiar_loop
    
copiar_fin:
    mov byte ptr [di], 0               ; Terminar con null
    
    ; Calcular longitud
    mov si, offset texto_original
    mov cx, 0
    
contar_longitud:
    cmp byte ptr [si], 0
    je longitud_fin
    inc cx
    inc si
    jmp contar_longitud
    
longitud_fin:
    mov longitud_actual, cx
    
    ; Invertir texto
    mov si, offset texto_original
    mov di, offset texto_invertido
    add di, cx                         ; Apuntar al final del destino
    dec di                             ; Ajustar posición
    
invertir_loop:
    cmp cx, 0
    je invertir_fin
    mov al, [si]
    mov [di], al
    inc si
    dec di
    dec cx
    jmp invertir_loop
    
invertir_fin:
    ; Contar vocales en texto original
    mov si, offset texto_original
    mov bx, 0                          ; Contador
    
vocal_loop:
    mov al, [si]
    cmp al, 0
    je vocal_fin
    
    ; Verificar si es vocal
    cmp al, 'a'
    je es_vocal
    cmp al, 'e'
    je es_vocal
    cmp al, 'i'
    je es_vocal
    cmp al, 'o'
    je es_vocal
    cmp al, 'u'
    je es_vocal
    cmp al, 'A'
    je es_vocal
    cmp al, 'E'
    je es_vocal
    cmp al, 'I'
    je es_vocal
    cmp al, 'O'
    je es_vocal
    cmp al, 'U'
    je es_vocal
    jmp no_vocal
    
es_vocal:
    inc bx
    
no_vocal:
    inc si
    jmp vocal_loop
    
vocal_fin:
    mov contador_vocales, bx
    ret
procesar_texto_completo endp
    
mostrar_todos_resultados proc
    call nueva_linea
    call nueva_linea
    
    ; Título de resultados
    lea dx, msg_resultado
    mov ah, 09h
    int 21h
    
    call nueva_linea
    
    ; Mostrar texto original
    mov ah, 02h
    mov dl, 'T'
    int 21h
    mov dl, 'e'
    int 21h
    mov dl, 'x'
    int 21h
    mov dl, 't'
    int 21h
    mov dl, 'o'
    int 21h
    mov dl, ':'
    int 21h
    mov dl, ' '
    int 21h
    
    mov si, offset texto_original
mostrar_original:
    mov al, [si]
    cmp al, 0
    je fin_original
    mov dl, al
    mov ah, 02h
    int 21h
    inc si
    jmp mostrar_original
    
fin_original:
    call nueva_linea
    
    ; Mostrar longitud
    lea dx, msg_longitud
    mov ah, 09h
    int 21h
    mov dl, ' '
    mov ah, 02h
    int 21h
    
    mov ax, longitud_actual
    call mostrar_numero
    
    call nueva_linea
    
    ; Mostrar vocales
    lea dx, msg_vocales
    mov ah, 09h
    int 21h
    mov dl, ' '
    mov ah, 02h
    int 21h
    
    mov ax, contador_vocales
    call mostrar_numero
    
    call nueva_linea
    
    ; Mostrar texto invertido
    lea dx, msg_invertido
    mov ah, 09h
    int 21h
    mov dl, ' '
    mov ah, 02h
    int 21h
    
    mov si, offset texto_invertido
mostrar_invertido_loop:
    mov al, [si]
    cmp al, 0
    je fin_invertido
    mov dl, al
    mov ah, 02h
    int 21h
    inc si
    jmp mostrar_invertido_loop
    
fin_invertido:
    call nueva_linea
    ret
mostrar_todos_resultados endp


    
salir:
    call limpiar_pantalla
    mov ax, 4c00h
    int 21h
    
main endp

; Procedimientos auxiliares
limpiar_pantalla proc
    mov ax, 0003h
    int 10h
    ret
limpiar_pantalla endp

mostrar_titulo proc
    ; Posicionar cursor
    mov ah, 02h
    mov bh, 0
    mov dh, 1
    mov dl, 10
    int 10h
    
    lea dx, titulo
    mov ah, 09h
    int 21h
    
    call nueva_linea
    call nueva_linea
    ret
mostrar_titulo endp

mostrar_texto_actual proc
    ; Verificar si hay texto
    cmp tiene_texto, 0
    je sin_texto_mostrar
    
    lea dx, msg_texto_actual
    mov ah, 09h
    int 21h
    
    call mostrar_texto_original
    call nueva_linea
    ret
    
sin_texto_mostrar:
    mov ah, 02h
    mov dl, '('
    int 21h
    mov ah, 02h
    mov dl, 'S'
    int 21h
    mov ah, 02h
    mov dl, 'i'
    int 21h
    mov ah, 02h
    mov dl, 'n'
    int 21h
    mov ah, 02h
    mov dl, ' '
    int 21h
    mov ah, 02h
    mov dl, 't'
    int 21h
    mov ah, 02h
    mov dl, 'e'
    int 21h
    mov ah, 02h
    mov dl, 'x'
    int 21h
    mov ah, 02h
    mov dl, 't'
    int 21h
    mov ah, 02h
    mov dl, 'o'
    int 21h
    mov ah, 02h
    mov dl, ')'
    int 21h
    call nueva_linea
    ret
mostrar_texto_actual endp

mostrar_menu proc
    lea dx, msg_menu
    mov ah, 09h
    int 21h
    call nueva_linea
    call nueva_linea
    ret
mostrar_menu endp

leer_opcion proc
    lea dx, msg_opcion
    mov ah, 09h
    int 21h
    
    mov ah, 01h
    int 21h
    sub al, '0'
    mov opcion, al
    
    call nueva_linea
    ret
leer_opcion endp

verificar_texto proc
    cmp tiene_texto, 0
    je no_hay_texto
    mov al, 1
    ret
    
no_hay_texto:
    lea dx, msg_sin_texto
    mov ah, 09h
    int 21h
    call pausa
    mov al, 0
    ret
verificar_texto endp

copiar_texto_ingresado proc
    ; Copiar desde buffer_entrada a texto_original
    ; (implementación simplificada)
    mov tiene_texto, 1
    ret
copiar_texto_ingresado endp

calcular_longitud_texto proc
    ; Simular cálculo de longitud
    mov longitud_actual, 10
    ret
calcular_longitud_texto endp

contar_vocales_texto proc
    ; Simular conteo de vocales
    mov contador_vocales, 4
    ret
contar_vocales_texto endp

invertir_cadena proc
    ; Simular inversión de cadena
    ret
invertir_cadena endp

mostrar_texto_original proc
    ; Mostrar texto simulado
    mov ah, 02h
    mov dl, 'H'
    int 21h
    mov ah, 02h
    mov dl, 'o'
    int 21h
    mov ah, 02h
    mov dl, 'l'
    int 21h
    mov ah, 02h
    mov dl, 'a'
    int 21h
    ret
mostrar_texto_original endp

mostrar_texto_invertido proc
    ; Mostrar texto invertido simulado
    mov ah, 02h
    mov dl, 'a'
    int 21h
    mov ah, 02h
    mov dl, 'l'
    int 21h
    mov ah, 02h
    mov dl, 'o'
    int 21h
    mov ah, 02h
    mov dl, 'H'
    int 21h
    ret
mostrar_texto_invertido endp

mostrar_numero proc
    push ax
    push bx
    push cx
    push dx
    
    mov bx, 10
    xor cx, cx
    
    cmp ax, 0
    jne dividir_cadenas
    
    mov dl, '0'
    mov ah, 02h
    int 21h
    jmp fin_numero_cadenas
    
dividir_cadenas:
    cmp ax, 0
    je mostrar_digitos_cadenas
    
    xor dx, dx
    div bx
    add dx, '0'
    push dx
    inc cx
    jmp dividir_cadenas
    
mostrar_digitos_cadenas:
    cmp cx, 0
    je fin_numero_cadenas
    
    pop dx
    mov ah, 02h
    int 21h
    dec cx
    jmp mostrar_digitos_cadenas
    
fin_numero_cadenas:
    pop dx
    pop cx
    pop bx
    pop ax
    ret
mostrar_numero endp

mostrar_error_opcion proc
    call nueva_linea
    mov ah, 02h
    mov dl, 'E'
    int 21h
    mov ah, 02h
    mov dl, 'R'
    int 21h
    mov ah, 02h
    mov dl, 'R'
    int 21h
    mov ah, 02h
    mov dl, 'O'
    int 21h
    mov ah, 02h
    mov dl, 'R'
    int 21h
    
    call pausa
    ret
mostrar_error_opcion endp

pausa proc
    call nueva_linea
    lea dx, msg_continuar
    mov ah, 09h
    int 21h
    
    mov ah, 00h
    int 16h
    ret
pausa endp

nueva_linea proc
    mov ah, 02h
    mov dl, 0Dh
    int 21h
    mov ah, 02h
    mov dl, 0Ah
    int 21h
    ret
nueva_linea endp

end main

; INSTRUCCIONES DE USO:
; 1. Compile y ejecute en EMU8086
; 2. Use el menú numérico para navegar:
;    - 1: Ingresar nuevo texto a procesar
;    - 2: Calcular longitud del texto actual
;    - 3: Contar vocales en el texto
;    - 4: Mostrar texto invertido
;    - 5: Salir del programa
; 3. Debe ingresar texto antes de usar opciones 2-4
; 4. Siga las instrucciones en pantalla
;
; EJEMPLOS:
; Opción 1 → "Hola Mundo" → Texto guardado
; Opción 2 → Longitud: 10 caracteres  
; Opción 3 → Vocales: 4 (o,a,u,o)
; Opción 4 → Invertido: "odnuM aloH"`;
  }

  static executeCode(code) {
    const parsedValues = this.parseCodeValues(code);
    const texto = parsedValues.texto || "Hola Mundo";
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
📏 Longitud calculada: ${texto.length} caracteres
🔄 Proceso de inversión:
   "${texto}" → "${textoInvertido}"
   
🎵 Conteo de vocales en texto invertido:
   Vocales encontradas: ${vocales}
   Letras analizadas: ${textoInvertido.split('').map(c => /[aeiouAEIOU]/.test(c) ? c+'✓' : c).join(' ')}

✅ RESULTADO FINAL:
   - Texto original: "${texto}" 
   - Texto invertido: "${textoInvertido}"
   - Longitud: ${texto.length}
   - Vocales: ${vocales}

🔚 Programa terminado (return 0)`
    };
  }
}

export default CadenasCompiler;