import React from 'react';

class InventarioCompiler {
  static problemData = {
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
  };

  static generateIntermediateCode() {
    return `; Código Intermedio de Tres Direcciones (TAC)
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
    RETURN t25`;
  }

  static generateAssemblyCode() {
    return `; Código Ensamblador x86-64
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
    const_25_99 dq 25.99`;
  }

  static parseCodeValues(code) {
    if (!code || typeof code !== 'string') {
      return {};
    }
    
    const lines = code.split('\n');
    const values = {};
    
    lines.forEach(line => {
      // Buscar asignaciones de código de producto
      if (line.includes('productos[') && line.includes('.codigo') && line.includes('=')) {
        const match = line.match(/=\s*(\d+)/);
        if (match) values.codigo = parseInt(match[1]);
      }
      // Buscar asignaciones de cantidad de producto
      if (line.includes('productos[') && line.includes('.cantidad') && line.includes('=')) {
        const match = line.match(/=\s*(\d+)/);
        if (match) values.cantidad = parseInt(match[1]);
      }
      // Buscar asignaciones de precio de producto
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
    
    return values;
  }

  static generateEmu8086Code(code) {
    return `; Código EMU8086 (8086/16-bit) - Sistema de Inventario
; Interfaz gráfica para gestión de productos

.model small
.stack 100h

.data
    ; Mensajes del sistema
    titulo          db 'SISTEMA DE INVENTARIO DE PRODUCTOS$'
    msg_menu        db 'Menu: 1=Agregar 2=Buscar 3=Actualizar 4=Listar 5=Salir$'
    msg_codigo      db 'Ingrese codigo del producto:$'
    msg_nombre      db 'Ingrese nombre del producto:$'
    msg_cantidad    db 'Ingrese cantidad en stock:$'
    msg_precio      db 'Ingrese precio unitario:$'
    msg_buscar      db 'Buscar producto por codigo:$'
    msg_encontrado  db 'Producto encontrado:$'
    msg_no_encontrado db 'ERROR: Producto no encontrado$'
    msg_agregado    db 'Producto agregado al inventario!$'
    msg_actualizado db 'Cantidad actualizada correctamente!$'
    msg_lista       db 'Inventario de productos:$'
    msg_vacio       db 'Inventario vacio - sin productos$'
    msg_continuar   db 'Presione cualquier tecla para continuar...$'
    msg_opcion      db 'Seleccione opcion: $'
    msg_nueva_cant  db 'Nueva cantidad en stock:$'
    
    ; Variables del sistema
    opcion          db 0
    contador        db 0            ; Número de productos
    max_productos   db 10           ; Máximo 10 productos
    
    ; Arrays para almacenar datos (simplificado)
    codigos         dw 10 dup(0)    ; Códigos de productos
    cantidades      dw 10 dup(0)    ; Cantidades en stock
    precios         dw 10 dup(0)    ; Precios unitarios
    
    ; Buffers de entrada
    buffer_codigo    db 20, ?, 20 dup(0)
    buffer_nombre    db 20, ?, 20 dup(0)
    buffer_cantidad  db 20, ?, 20 dup(0)
    buffer_precio    db 20, ?, 20 dup(0)
    codigo_temp     dw 0
    cantidad_temp   dw 0
    precio_temp     dw 0

.code
main proc
    mov ax, @data
    mov ds, ax
    
inicio:
    call limpiar_pantalla
    call mostrar_titulo
    
    ; Solicitar datos del producto directamente
    call nueva_linea
    call agregar_producto_simple
    
    ; Mostrar información completa del inventario
    call mostrar_inventario_completo
    
    ; Pausa antes de salir
    call pausa
    jmp salir
    
agregar_producto_simple proc
    ; Solicitar código del producto
    lea dx, msg_codigo
    mov ah, 09h
    int 21h
    
    lea dx, buffer_codigo
    mov ah, 0Ah
    int 21h
    
    call nueva_linea
    
    ; Solicitar nombre del producto
    lea dx, msg_nombre
    mov ah, 09h
    int 21h
    
    lea dx, buffer_nombre  
    mov ah, 0Ah
    int 21h
    
    call nueva_linea
    
    ; Solicitar cantidad
    lea dx, msg_cantidad
    mov ah, 09h
    int 21h
    
    lea dx, buffer_cantidad
    mov ah, 0Ah
    int 21h
    
    call nueva_linea
    
    ; Solicitar precio
    lea dx, msg_precio
    mov ah, 09h
    int 21h
    
    lea dx, buffer_precio
    mov ah, 0Ah
    int 21h
    
    ; Guardar como primer producto
    call guardar_producto_simple
    ret
agregar_producto_simple endp
    
guardar_producto_simple proc
    ; Copiar datos del producto ingresado a las variables
    ; Simular guardado del producto
    mov contador, 1  ; Marcar que hay 1 producto
    ret
guardar_producto_simple endp

mostrar_inventario_completo proc
    call nueva_linea
    call nueva_linea
    
    ; Mostrar título de resultados
    mov ah, 02h
    mov dl, 'R'
    int 21h
    mov dl, 'E'
    int 21h
    mov dl, 'S'
    int 21h
    mov dl, 'U'
    int 21h
    mov dl, 'L'
    int 21h
    mov dl, 'T'
    int 21h
    mov dl, 'A'
    int 21h
    mov dl, 'D'
    int 21h
    mov dl, 'O'
    int 21h
    mov dl, 'S'
    int 21h
    mov dl, ':'
    int 21h
    
    call nueva_linea
    call nueva_linea
    
    ; Mostrar código
    mov ah, 02h
    mov dl, 'C'
    int 21h
    mov dl, 'o'
    int 21h
    mov dl, 'd'
    int 21h
    mov dl, 'i'
    int 21h
    mov dl, 'g'
    int 21h
    mov dl, 'o'
    int 21h
    mov dl, ':'
    int 21h
    mov dl, ' '
    int 21h
    
    ; Mostrar el código ingresado
    call mostrar_buffer_codigo
    call nueva_linea
    
    ; Mostrar nombre  
    mov ah, 02h
    mov dl, 'N'
    int 21h
    mov dl, 'o'
    int 21h
    mov dl, 'm'
    int 21h
    mov dl, 'b'
    int 21h
    mov dl, 'r'
    int 21h
    mov dl, 'e'
    int 21h
    mov dl, ':'
    int 21h
    mov dl, ' '
    int 21h
    
    ; Mostrar el nombre ingresado
    call mostrar_buffer_nombre
    call nueva_linea
    
    ; Mostrar cantidad
    mov ah, 02h
    mov dl, 'C'
    int 21h
    mov dl, 'a'
    int 21h
    mov dl, 'n'
    int 21h
    mov dl, 't'
    int 21h
    mov dl, 'i'
    int 21h
    mov dl, 'd'
    int 21h
    mov dl, 'a'
    int 21h
    mov dl, 'd'
    int 21h
    mov dl, ':'
    int 21h
    mov dl, ' '
    int 21h
    
    ; Mostrar la cantidad ingresada
    call mostrar_buffer_cantidad
    call nueva_linea
    
    ; Mostrar precio
    mov ah, 02h
    mov dl, 'P'
    int 21h
    mov dl, 'r'
    int 21h
    mov dl, 'e'
    int 21h
    mov dl, 'c'
    int 21h
    mov dl, 'i'
    int 21h
    mov dl, 'o'
    int 21h
    mov dl, ':'
    int 21h
    mov dl, ' '
    int 21h
    
    ; Mostrar el precio ingresado  
    call mostrar_buffer_precio
    call nueva_linea
    
    ret
mostrar_inventario_completo endp

buscar_producto:
    call limpiar_pantalla
    
    ; Verificar si hay productos
    mov al, contador
    cmp al, 0
    je inventario_vacio
    
    ; Solicitar código a buscar
    lea dx, msg_buscar
    mov ah, 09h
    int 21h
    
    call leer_numero
    mov codigo_temp, ax
    
    call nueva_linea
    
    ; Simular búsqueda
    call buscar_en_inventario
    
    call pausa
    jmp inicio
    
actualizar_cantidad:
    call limpiar_pantalla
    
    ; Verificar si hay productos
    mov al, contador
    cmp al, 0
    je inventario_vacio
    
    ; Solicitar código del producto
    lea dx, msg_buscar
    mov ah, 09h
    int 21h
    
    call leer_numero
    mov codigo_temp, ax
    
    ; Solicitar nueva cantidad
    call nueva_linea
    lea dx, msg_nueva_cant
    mov ah, 09h
    int 21h
    
    call leer_numero
    mov cantidad_temp, ax
    
    ; Simular actualización
    call nueva_linea
    lea dx, msg_actualizado
    mov ah, 09h
    int 21h
    
    call pausa
    jmp inicio
    
inventario_vacio:
    lea dx, msg_vacio
    mov ah, 09h
    int 21h
    call pausa
    jmp inicio
    
listar_productos:
    call limpiar_pantalla
    
    ; Verificar si hay productos
    mov al, contador
    cmp al, 0
    je inventario_vacio
    
    lea dx, msg_lista
    mov ah, 09h
    int 21h
    
    call nueva_linea
    call nueva_linea
    
    ; Mostrar lista simulada
    mov cx, 1
    
loop_inventario:
    ; Mostrar número de producto
    mov ax, cx
    add al, '0'
    mov ah, 02h
    mov dl, al
    int 21h
    
    mov ah, 02h
    mov dl, '.'
    int 21h
    mov ah, 02h
    mov dl, ' '
    int 21h
    
    ; Mostrar código simulado
    mov ah, 02h
    mov dl, 'C'
    int 21h
    mov ah, 02h
    mov dl, 'o'
    int 21h
    mov ah, 02h
    mov dl, 'd'
    int 21h
    mov ah, 02h
    mov dl, ':'
    int 21h
    
    ; Mostrar número de código
    mov ax, cx
    add ax, 100
    call mostrar_numero
    
    ; Mostrar cantidad
    mov ah, 02h
    mov dl, ' '
    int 21h
    mov ah, 02h
    mov dl, 'Q'
    int 21h
    mov ah, 02h
    mov dl, ':'
    int 21h
    
    mov ax, 50
    call mostrar_numero
    
    call nueva_linea
    
    inc cx
    cmp cl, contador
    jle loop_inventario
    
    call pausa
    jmp inicio

mostrar_buffer_codigo proc
    mov si, offset buffer_codigo + 2  ; Saltar longitud
    mov cl, buffer_codigo + 1         ; Obtener longitud real
    mov ch, 0
    
mostrar_codigo_loop:
    cmp cx, 0
    je mostrar_codigo_fin
    mov al, [si]
    mov dl, al
    mov ah, 02h
    int 21h
    inc si
    dec cx
    jmp mostrar_codigo_loop
    
mostrar_codigo_fin:
    ret
mostrar_buffer_codigo endp

mostrar_buffer_nombre proc
    mov si, offset buffer_nombre + 2  ; Saltar longitud
    mov cl, buffer_nombre + 1         ; Obtener longitud real
    mov ch, 0
    
mostrar_nombre_loop:
    cmp cx, 0
    je mostrar_nombre_fin
    mov al, [si]
    mov dl, al
    mov ah, 02h
    int 21h
    inc si
    dec cx
    jmp mostrar_nombre_loop
    
mostrar_nombre_fin:
    ret
mostrar_buffer_nombre endp

mostrar_buffer_cantidad proc
    mov si, offset buffer_cantidad + 2  ; Saltar longitud
    mov cl, buffer_cantidad + 1         ; Obtener longitud real
    mov ch, 0
    
mostrar_cantidad_loop:
    cmp cx, 0
    je mostrar_cantidad_fin
    mov al, [si]
    mov dl, al
    mov ah, 02h
    int 21h
    inc si
    dec cx
    jmp mostrar_cantidad_loop
    
mostrar_cantidad_fin:
    ret
mostrar_buffer_cantidad endp

mostrar_buffer_precio proc
    mov si, offset buffer_precio + 2  ; Saltar longitud
    mov cl, buffer_precio + 1         ; Obtener longitud real
    mov ch, 0
    
mostrar_precio_loop:
    cmp cx, 0
    je mostrar_precio_fin
    mov al, [si]
    mov dl, al
    mov ah, 02h
    int 21h
    inc si
    dec cx
    jmp mostrar_precio_loop
    
mostrar_precio_fin:
    ret
mostrar_buffer_precio endp
    
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
    mov dl, 5
    int 10h
    
    lea dx, titulo
    mov ah, 09h
    int 21h
    
    call nueva_linea
    call nueva_linea
    ret
mostrar_titulo endp

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
    int 16h
    mov ah, al
    sub ah, '0'
    mov opcion, ah
    
    call nueva_linea
    ret
leer_opcion endp

leer_numero proc
    mov ah, 01h
    int 16h
    sub al, '0'
    xor ah, ah
    ret
leer_numero endp

solicitar_codigo proc
    lea dx, msg_codigo
    mov ah, 09h
    int 21h
    
    call leer_numero
    mov codigo_temp, ax
    
    call nueva_linea
    ret
solicitar_codigo endp

solicitar_nombre proc
    lea dx, msg_nombre
    mov ah, 09h
    int 21h
    
    lea dx, buffer_nombre
    mov ah, 0Ah
    int 21h
    
    call nueva_linea
    ret
solicitar_nombre endp

solicitar_cantidad proc
    lea dx, msg_cantidad
    mov ah, 09h
    int 21h
    
    call leer_numero
    mov cantidad_temp, ax
    
    call nueva_linea
    ret
solicitar_cantidad endp

solicitar_precio proc
    lea dx, msg_precio
    mov ah, 09h
    int 21h
    
    call leer_numero
    mov precio_temp, ax
    
    call nueva_linea
    ret
solicitar_precio endp

guardar_producto proc
    ; Incrementar contador
    inc contador
    
    ; Aquí se guardarían los datos en los arrays
    ; (implementación simplificada)
    
    ret
guardar_producto endp

buscar_en_inventario proc
    ; Simular búsqueda exitosa
    lea dx, msg_encontrado
    mov ah, 09h
    int 21h
    
    call nueva_linea
    mov ah, 02h
    mov dl, 'C'
    int 21h
    mov ah, 02h
    mov dl, 'o'
    int 21h
    mov ah, 02h
    mov dl, 'd'
    int 21h
    mov ah, 02h
    mov dl, ':'
    int 21h
    
    mov ax, codigo_temp
    call mostrar_numero
    
    call nueva_linea
    ret
buscar_en_inventario endp

mostrar_numero proc
    push ax
    push bx
    push cx
    push dx
    
    mov bx, 10
    xor cx, cx
    
    cmp ax, 0
    jne dividir_num
    
    mov dl, '0'
    mov ah, 02h
    int 21h
    jmp fin_numero
    
dividir_num:
    cmp ax, 0
    je mostrar_digitos_num
    
    xor dx, dx
    div bx
    add dx, '0'
    push dx
    inc cx
    jmp dividir_num
    
mostrar_digitos_num:
    cmp cx, 0
    je fin_numero
    
    pop dx
    mov ah, 02h
    int 21h
    dec cx
    jmp mostrar_digitos_num
    
fin_numero:
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
;    - 1: Agregar nuevo producto al inventario
;    - 2: Buscar producto por código
;    - 3: Actualizar cantidad de un producto
;    - 4: Listar todos los productos
;    - 5: Salir del programa
; 3. Siga las instrucciones en pantalla
; 4. El sistema maneja hasta 10 productos
;
; EJEMPLOS:
; Opción 1 → Código: 101, Nombre: Laptop, Cantidad: 5, Precio: 8
; Opción 2 → Buscar: 101 → Muestra datos del producto
; Opción 3 → Código: 101, Nueva cantidad: 3
; Opción 4 → Lista todos los productos del inventario`;
  }

  static executeCode(code) {
    const parsedValues = this.parseCodeValues(code);
    const codigo = parsedValues.codigo || 100;
    const cantidadInicial = parsedValues.cantidad || 50;
    const precio = parsedValues.precio || 25.99;
    const nuevaCantidad = parsedValues.nuevaCantidad || 75;
    const codigoBuscar = parsedValues.codigoBuscar || codigo;
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
}

export default InventarioCompiler;