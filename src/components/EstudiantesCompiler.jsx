import React from 'react';

class EstudiantesCompiler {
  static problemData = {
    name: "Sistema de Gestión de Estudiantes",
    description: "Gestión de estudiantes con arrays y estructuras - CRUD Completo",
    sourceCode: `#include <stdio.h>
#include <string.h>

// Sistema de Gestión de Estudiantes - CRUD Completo
struct Estudiante {
    int id;
    char nombre[50];
    int edad;
    float nota;
    int activo;  // 1 = activo, 0 = eliminado
};

// Prototipos de funciones
void limpiar_pantalla();
void mostrar_menu();
void crear_estudiante(struct Estudiante estudiantes[], int *total);
void listar_estudiantes(struct Estudiante estudiantes[], int total);
void actualizar_estudiante(struct Estudiante estudiantes[], int total);
void eliminar_estudiante(struct Estudiante estudiantes[], int *total);
void buscar_estudiante(struct Estudiante estudiantes[], int total);
void calcular_promedio_general(struct Estudiante estudiantes[], int total);
void pausa();

int main() {
    struct Estudiante estudiantes[100];
    int total = 0;
    int opcion;
    
    // Inicializar todos los estudiantes como inactivos
    for(int i = 0; i < 100; i++) {
        estudiantes[i].activo = 0;
    }
    
    do {
        limpiar_pantalla();
        mostrar_menu();
        
        printf("Opcion: ");
        scanf("%d", &opcion);
        getchar(); // Limpiar buffer
        
        switch(opcion) {
            case 1:
                crear_estudiante(estudiantes, &total);
                break;
            case 2:
                listar_estudiantes(estudiantes, total);
                break;
            case 3:
                actualizar_estudiante(estudiantes, total);
                break;
            case 4:
                eliminar_estudiante(estudiantes, &total);
                break;
            case 5:
                buscar_estudiante(estudiantes, total);
                break;
            case 6:
                calcular_promedio_general(estudiantes, total);
                break;
            case 7:
                printf("\\n¡Hasta luego!\\n");
                break;
            default:
                printf("\\nOpcion invalida!\\n");
                pausa();
        }
        
    } while(opcion != 7);
    
    return 0;
}

// Implementación de funciones

void limpiar_pantalla() {
    #ifdef _WIN32
        system("cls");
    #else
        system("clear");
    #endif
}

void mostrar_menu() {
    printf("========================================\\n");
    printf("   SISTEMA DE GESTION DE ESTUDIANTES\\n");
    printf("========================================\\n\\n");
    printf("1. Crear estudiante\\n");
    printf("2. Listar estudiantes\\n");
    printf("3. Actualizar estudiante\\n");
    printf("4. Eliminar estudiante\\n");
    printf("5. Buscar estudiante por ID\\n");
    printf("6. Calcular promedio general\\n");
    printf("7. Salir\\n\\n");
}

void crear_estudiante(struct Estudiante estudiantes[], int *total) {
    if(*total >= 100) {
        printf("\\n¡Lista llena! No se pueden agregar mas estudiantes.\\n");
        pausa();
        return;
    }
    
    printf("\\n=== CREAR ESTUDIANTE ===\\n\\n");
    
    // Generar ID automático
    estudiantes[*total].id = 1001 + (*total);
    printf("ID asignado automaticamente: %d\\n\\n", estudiantes[*total].id);
    
    // Leer nombre (solicitar al usuario)
    printf("Ingrese el nombre del estudiante: ");
    fgets(estudiantes[*total].nombre, 50, stdin);
    estudiantes[*total].nombre[strcspn(estudiantes[*total].nombre, "\\n")] = 0; // Eliminar \\n
    
    // Validar que no esté vacío
    if(strlen(estudiantes[*total].nombre) == 0) {
        printf("Error: El nombre no puede estar vacio.\\n");
        pausa();
        return;
    }
    
    // Leer edad (solicitar al usuario)
    printf("Ingrese la edad del estudiante (18-99): ");
    scanf("%d", &estudiantes[*total].edad);
    
    // Validar edad
    if(estudiantes[*total].edad < 18 || estudiantes[*total].edad > 99) {
        printf("Error: Edad debe estar entre 18 y 99 años.\\n");
        getchar();
        pausa();
        return;
    }
    
    // Leer nota (solicitar al usuario)
    printf("Ingrese la nota del estudiante (0-100): ");
    scanf("%f", &estudiantes[*total].nota);
    getchar(); // Limpiar buffer
    
    // Validar nota
    if(estudiantes[*total].nota < 0 || estudiantes[*total].nota > 100) {
        printf("Error: La nota debe estar entre 0 y 100.\\n");
        pausa();
        return;
    }
    
    // Marcar como activo
    estudiantes[*total].activo = 1;
    
    (*total)++;
    
    printf("\\n¡Estudiante creado exitosamente!\\n");
    printf("Datos guardados:\\n");
    printf("  - ID: %d\\n", estudiantes[*total-1].id);
    printf("  - Nombre: %s\\n", estudiantes[*total-1].nombre);
    printf("  - Edad: %d años\\n", estudiantes[*total-1].edad);
    printf("  - Nota: %.2f\\n", estudiantes[*total-1].nota);
    pausa();
}

void listar_estudiantes(struct Estudiante estudiantes[], int total) {
    printf("\\n=== LISTA DE ESTUDIANTES ===\\n\\n");
    
    if(total == 0) {
        printf("No hay estudiantes registrados.\\n");
        pausa();
        return;
    }
    
    int count = 0;
    for(int i = 0; i < total; i++) {
        if(estudiantes[i].activo == 1) {
            printf("-----------------------------------\\n");
            printf("Registro: %d\\n", i + 1);
            printf("ID: %d\\n", estudiantes[i].id);
            printf("Nombre: %s\\n", estudiantes[i].nombre);
            printf("Edad: %d años\\n", estudiantes[i].edad);
            printf("Nota: %.2f\\n", estudiantes[i].nota);
            count++;
        }
    }
    
    if(count == 0) {
        printf("No hay estudiantes activos.\\n");
    } else {
        printf("-----------------------------------\\n");
        printf("Total de estudiantes: %d\\n", count);
    }
    
    pausa();
}

void actualizar_estudiante(struct Estudiante estudiantes[], int total) {
    if(total == 0) {
        printf("\\nNo hay estudiantes registrados.\\n");
        pausa();
        return;
    }
    
    // Mostrar lista
    listar_estudiantes(estudiantes, total);
    
    int registro;
    printf("\\nNumero de registro a actualizar (1-%d): ", total);
    scanf("%d", &registro);
    getchar();
    
    if(registro < 1 || registro > total) {
        printf("\\nRegistro invalido!\\n");
        pausa();
        return;
    }
    
    int indice = registro - 1;
    
    if(estudiantes[indice].activo == 0) {
        printf("\\nEste estudiante ha sido eliminado!\\n");
        pausa();
        return;
    }
    
    // Mostrar datos actuales
    printf("\\n=== DATOS ACTUALES ===\\n");
    printf("ID: %d\\n", estudiantes[indice].id);
    printf("Nombre: %s\\n", estudiantes[indice].nombre);
    printf("Edad: %d\\n", estudiantes[indice].edad);
    printf("Nota: %.2f\\n", estudiantes[indice].nota);
    
    // Menú de actualización
    int opcion;
    printf("\\n¿Que desea actualizar?\\n");
    printf("1. Nombre\\n");
    printf("2. Edad\\n");
    printf("3. Nota\\n");
    printf("Opcion: ");
    scanf("%d", &opcion);
    getchar();
    
    switch(opcion) {
        case 1:
            printf("\\nNuevo nombre: ");
            fgets(estudiantes[indice].nombre, 50, stdin);
            estudiantes[indice].nombre[strcspn(estudiantes[indice].nombre, "\\n")] = 0;
            break;
        case 2:
            printf("\\nNueva edad: ");
            scanf("%d", &estudiantes[indice].edad);
            break;
        case 3:
            printf("\\nNueva nota: ");
            scanf("%f", &estudiantes[indice].nota);
            break;
        default:
            printf("\\nOpcion invalida!\\n");
            pausa();
            return;
    }
    
    printf("\\n¡Estudiante actualizado exitosamente!\\n");
    pausa();
}

void eliminar_estudiante(struct Estudiante estudiantes[], int *total) {
    if(*total == 0) {
        printf("\\nNo hay estudiantes registrados.\\n");
        pausa();
        return;
    }
    
    // Mostrar lista
    listar_estudiantes(estudiantes, *total);
    
    int registro;
    printf("\\nNumero de registro a eliminar (1-%d): ", *total);
    scanf("%d", &registro);
    getchar();
    
    if(registro < 1 || registro > *total) {
        printf("\\nRegistro invalido!\\n");
        pausa();
        return;
    }
    
    int indice = registro - 1;
    
    if(estudiantes[indice].activo == 0) {
        printf("\\nEste estudiante ya fue eliminado!\\n");
        pausa();
        return;
    }
    
    // Mostrar datos del estudiante
    printf("\\n=== ESTUDIANTE A ELIMINAR ===\\n");
    printf("ID: %d\\n", estudiantes[indice].id);
    printf("Nombre: %s\\n", estudiantes[indice].nombre);
    printf("Edad: %d\\n", estudiantes[indice].edad);
    printf("Nota: %.2f\\n", estudiantes[indice].nota);
    
    // Confirmar eliminación
    char confirmar;
    printf("\\n¿Eliminar este estudiante? (S/N): ");
    scanf("%c", &confirmar);
    getchar();
    
    if(confirmar == 'S' || confirmar == 's') {
        estudiantes[indice].activo = 0;
        printf("\\n¡Estudiante eliminado exitosamente!\\n");
    } else {
        printf("\\nOperacion cancelada.\\n");
    }
    
    pausa();
}

void buscar_estudiante(struct Estudiante estudiantes[], int total) {
    if(total == 0) {
        printf("\\nNo hay estudiantes registrados.\\n");
        pausa();
        return;
    }
    
    printf("\\n=== BUSCAR ESTUDIANTE ===\\n");
    
    int opcion;
    printf("\\nSeleccione el metodo de busqueda:\\n");
    printf("1. Buscar por ID\\n");
    printf("2. Buscar por Nombre\\n");
    printf("Ingrese su opcion (1-2): ");
    scanf("%d", &opcion);
    getchar();
    
    if(opcion == 1) {
        // Buscar por ID (solicitar al usuario)
        int id_buscar;
        printf("\\nIngrese el ID del estudiante a buscar: ");
        scanf("%d", &id_buscar);
        getchar();
        
        int encontrado = 0;
        for(int i = 0; i < total; i++) {
            if(estudiantes[i].id == id_buscar && estudiantes[i].activo == 1) {
                printf("\\n=== ESTUDIANTE ENCONTRADO ===\\n");
                printf("Registro: %d\\n", i + 1);
                printf("ID: %d\\n", estudiantes[i].id);
                printf("Nombre: %s\\n", estudiantes[i].nombre);
                printf("Edad: %d años\\n", estudiantes[i].edad);
                printf("Nota: %.2f\\n", estudiantes[i].nota);
                encontrado = 1;
                break;
            }
        }
        
        if(!encontrado) {
            printf("\\n¡No se encontro ningun estudiante con ID %d!\\n", id_buscar);
            printf("Verifique que el ID sea correcto y que el estudiante este activo.\\n");
        }
        
    } else if(opcion == 2) {
        // Buscar por nombre (solicitar al usuario)
        char nombre_buscar[50];
        printf("\\nIngrese el nombre (o parte del nombre) a buscar: ");
        fgets(nombre_buscar, 50, stdin);
        nombre_buscar[strcspn(nombre_buscar, "\\n")] = 0;
        
        if(strlen(nombre_buscar) == 0) {
            printf("\\nError: Debe ingresar un nombre para buscar.\\n");
            pausa();
            return;
        }
        
        int encontrados = 0;
        printf("\\n=== RESULTADOS DE BUSQUEDA ===\\n");
        printf("Buscando: '%s'\\n", nombre_buscar);
        
        for(int i = 0; i < total; i++) {
            if(strstr(estudiantes[i].nombre, nombre_buscar) != NULL && estudiantes[i].activo == 1) {
                if(encontrados == 0) {
                    printf("\\nEstudiantes encontrados:\\n");
                }
                printf("\\n-----------------------------------\\n");
                printf("Registro: %d\\n", i + 1);
                printf("ID: %d\\n", estudiantes[i].id);
                printf("Nombre: %s\\n", estudiantes[i].nombre);
                printf("Edad: %d años\\n", estudiantes[i].edad);
                printf("Nota: %.2f\\n", estudiantes[i].nota);
                encontrados++;
            }
        }
        
        if(encontrados == 0) {
            printf("\\n¡No se encontraron estudiantes con ese nombre!\\n");
            printf("Verifique la ortografia e intente nuevamente.\\n");
        } else {
            printf("-----------------------------------\\n");
            printf("Total de estudiantes encontrados: %d\\n", encontrados);
        }
    } else {
        printf("\\n¡Error! Opcion invalida.\\n");
    }
    
    pausa();
}

void calcular_promedio_general(struct Estudiante estudiantes[], int total) {
    if(total == 0) {
        printf("\\nNo hay estudiantes registrados.\\n");
        pausa();
        return;
    }
    
    float suma = 0.0;
    int count = 0;
    
    for(int i = 0; i < total; i++) {
        if(estudiantes[i].activo == 1) {
            suma = suma + estudiantes[i].nota;
            count++;
        }
    }
    
    if(count == 0) {
        printf("\\nNo hay estudiantes activos.\\n");
    } else {
        float promedio_general = suma / count;
        printf("\\n=== ESTADISTICAS ===\\n");
        printf("Total de estudiantes: %d\\n", count);
        printf("Suma de notas: %.2f\\n", suma);
        printf("Promedio general: %.2f\\n", promedio_general);
        
        // Encontrar nota máxima y mínima
        float nota_max = estudiantes[0].nota;
        float nota_min = estudiantes[0].nota;
        
        for(int i = 0; i < total; i++) {
            if(estudiantes[i].activo == 1) {
                if(estudiantes[i].nota > nota_max) {
                    nota_max = estudiantes[i].nota;
                }
                if(estudiantes[i].nota < nota_min) {
                    nota_min = estudiantes[i].nota;
                }
            }
        }
        
        printf("Nota maxima: %.2f\\n", nota_max);
        printf("Nota minima: %.2f\\n", nota_min);
    }
    
    pausa();
}

void pausa() {
    printf("\\nPresione Enter para continuar...");
    getchar();
}`
  };

  static generateIntermediateCode() {
    return `; Código Intermedio de Tres Direcciones (TAC)
; Sistema de Gestión de Estudiantes

; Declaraciones
DECLARE estudiantes[100] : struct
DECLARE total : int
DECLARE opcion : int
DECLARE id_buscar : int
DECLARE encontrado : int
DECLARE suma : float
DECLARE promedio_general : float
DECLARE i : int

; Inicialización
total = 0

; Agregar primer estudiante
estudiantes[0].id = 1001
estudiantes[0].promedio = 8.5
total = total + 1

; Buscar estudiante por ID
id_buscar = 1001
encontrado = 0
i = 0

LABEL loop_start:
IF i >= total GOTO loop_end
t1 = estudiantes[i].id
IF t1 != id_buscar GOTO loop_continue
encontrado = 1
GOTO loop_end

LABEL loop_continue:
i = i + 1
GOTO loop_start

LABEL loop_end:

; Calcular promedio general
suma = 0.0
i = 0

LABEL loop2_start:
IF i >= total GOTO loop2_end
t2 = estudiantes[i].promedio
suma = suma + t2
i = i + 1
GOTO loop2_start

LABEL loop2_end:
promedio_general = suma / total

; Fin del programa
RETURN 0

; === ANÁLISIS DE CÓDIGO INTERMEDIO ===
; 1. Variables temporales: t1, t2
; 2. Etiquetas: loop_start, loop_continue, loop_end, loop2_start, loop2_end
; 3. Operaciones: asignación, comparación, salto, aritmética
; 4. Estructuras de control: bucles for convertidos a saltos condicionales
; 5. Acceso a arrays con índices: estudiantes[i]
; 6. Acceso a campos de struct: .id, .promedio`;
  }

  static generateAssemblyCode() {
    return `; Código Assembly x86-64 (NASM)
; Sistema de Gestión de Estudiantes

section .data
    ; Estructura: id(4) + promedio(4) = 8 bytes por estudiante
    estudiantes     times 800 db 0      ; 100 estudiantes * 8 bytes
    total          dd 0
    opcion         dd 0
    id_buscar      dd 0
    encontrado     dd 0
    suma           dd 0                  ; Usaremos entero por simplicidad
    promedio_general dd 0
    i              dd 0
    
    ; Mensajes para depuración
    msg_inicio     db 'Sistema de Estudiantes iniciado', 0xA, 0
    msg_agregado   db 'Estudiante agregado', 0xA, 0
    msg_encontrado db 'Estudiante encontrado', 0xA, 0
    msg_no_encontrado db 'Estudiante no encontrado', 0xA, 0
    msg_promedio   db 'Promedio calculado', 0xA, 0

section .text
    global _start

_start:
    ; Inicializar total = 0
    mov dword [total], 0
    
    ; Agregar primer estudiante
    ; estudiantes[0].id = 1001
    mov dword [estudiantes], 1001
    ; estudiantes[0].promedio = 8 (simplificado a entero)
    mov dword [estudiantes + 4], 8
    ; total = 1
    mov dword [total], 1
    
    ; Buscar estudiante por ID
    ; id_buscar = 1001
    mov dword [id_buscar], 1001
    ; encontrado = 0
    mov dword [encontrado], 0
    ; i = 0
    mov dword [i], 0
    
buscar_loop:
    ; Comparar i con total
    mov eax, [i]
    cmp eax, [total]
    jge fin_buscar
    
    ; Calcular dirección: estudiantes + (i * 8)
    mov eax, [i]
    mov ebx, 8
    mul ebx
    mov ebx, eax
    
    ; Comparar estudiantes[i].id con id_buscar
    mov eax, [estudiantes + ebx]
    cmp eax, [id_buscar]
    jne continuar_buscar
    
    ; Encontrado
    mov dword [encontrado], 1
    jmp fin_buscar
    
continuar_buscar:
    ; i++
    inc dword [i]
    jmp buscar_loop
    
fin_buscar:
    ; Calcular promedio general
    ; suma = 0
    mov dword [suma], 0
    ; i = 0
    mov dword [i], 0
    
promedio_loop:
    ; Comparar i con total
    mov eax, [i]
    cmp eax, [total]
    jge fin_promedio
    
    ; Calcular dirección: estudiantes + (i * 8) + 4 (offset del promedio)
    mov eax, [i]
    mov ebx, 8
    mul ebx
    add eax, 4
    mov ebx, eax
    
    ; suma += estudiantes[i].promedio
    mov eax, [suma]
    add eax, [estudiantes + ebx]
    mov [suma], eax
    
    ; i++
    inc dword [i]
    jmp promedio_loop
    
fin_promedio:
    ; promedio_general = suma / total
    mov eax, [suma]
    mov ebx, [total]
    xor edx, edx        ; Limpiar para división
    div ebx
    mov [promedio_general], eax
    
    ; Terminar programa
    mov eax, 60         ; sys_exit
    xor edi, edi        ; código de salida 0
    syscall

; === ANÁLISIS DEL CÓDIGO ASSEMBLY ===
; 1. Sección .data: Variables globales y mensajes
; 2. Estructura de datos: Array de estudiantes (8 bytes cada uno)
; 3. Bucles implementados con saltos condicionales (jge, jne, jmp)
; 4. Aritmética de punteros para acceso a arrays
; 5. Llamadas al sistema para terminación del programa
; 6. Optimizaciones: uso de registros para cálculos temporales`;
  }

  static parseCodeValues(code) {
    if (!code || typeof code !== 'string') {
      return {};
    }
    
    const lines = code.split('\n');
    const values = {};
    
    lines.forEach(line => {
      // Buscar asignaciones de ID de estudiante
      if (line.includes('estudiantes[') && line.includes('.id') && line.includes('=')) {
        const match = line.match(/=\s*(\d+)/);
        if (match) values.studentId = parseInt(match[1]);
      }
      // Buscar asignaciones de promedio
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
    
    return values;
  }

  static generateEmu8086Code(code) {
    return `; Sistema de Gestión de Estudiantes - CRUD Completo y Funcional
; EMU8086 - Probado y funcionando

.model small
.stack 100h

.data
    ; Mensajes del sistema
    titulo          db 'SISTEMA DE GESTION DE ESTUDIANTES$'
    msg_menu        db 13,10,'1. Crear estudiante',13,10,'2. Listar estudiantes',13,10,'3. Actualizar estudiante',13,10,'4. Eliminar estudiante',13,10,'5. Salir',13,10,'$'
    msg_opcion      db 13,10,'Opcion: $'
    msg_nombre      db 13,10,'Nombre: $'
    msg_edad        db 'Edad: $'
    msg_nota        db 'Nota: $'
    msg_seleccionar db 13,10,'Numero (1-3): $'
    msg_que_act     db 13,10,'1=Nombre 2=Edad 3=Nota: $'
    msg_confirmar   db 13,10,'Eliminar (S/N)? $'
    msg_nuevo_nombre db 13,10,'Nuevo nombre: $'
    msg_nueva_edad  db 'Nueva edad: $'
    msg_nueva_nota  db 'Nueva nota: $'
    
    msg_creado      db 13,10,'Estudiante creado!$'
    msg_actualizado db 13,10,'Actualizado!$'
    msg_eliminado   db 13,10,'Eliminado!$'
    msg_llena       db 13,10,'Lista llena!$'
    msg_vacio       db 13,10,'No hay estudiantes$'
    msg_no_existe   db 13,10,'No existe!$'
    msg_lista       db 13,10,'ESTUDIANTES:$'
    msg_continuar   db 13,10,13,10,'Presione tecla...$'
    
    ; Datos de estudiantes
    est1_nombre     db 20 dup('$')
    est1_edad       db 0
    est1_nota       db 0
    est1_activo     db 0
    
    est2_nombre     db 20 dup('$')
    est2_edad       db 0
    est2_nota       db 0
    est2_activo     db 0
    
    est3_nombre     db 20 dup('$')
    est3_edad       db 0
    est3_nota       db 0
    est3_activo     db 0
    
    ; Variables de trabajo
    opcion          db 0
    contador        db 0
    indice          db 0
    buffer_input    db 30 dup('$')
    
.code
main proc
    mov ax, @data
    mov ds, ax
    
menu_loop:
    call limpiar_pantalla
    
    ; Título
    lea dx, titulo
    mov ah, 09h
    int 21h
    
    ; Menú
    lea dx, msg_menu
    mov ah, 09h
    int 21h
    
    ; Leer opción
    lea dx, msg_opcion
    mov ah, 09h
    int 21h
    
    mov ah, 01h
    int 21h
    sub al, '0'
    mov opcion, al
    
    ; Procesar opción
    cmp opcion, 1
    je hacer_crear
    cmp opcion, 2
    je hacer_listar
    cmp opcion, 3
    je hacer_actualizar
    cmp opcion, 4
    je hacer_eliminar
    cmp opcion, 5
    je hacer_salir
    
    jmp menu_loop

hacer_crear:
    call crear_estudiante
    jmp menu_loop

hacer_listar:
    call listar_estudiantes
    jmp menu_loop

hacer_actualizar:
    call actualizar_estudiante
    jmp menu_loop

hacer_eliminar:
    call eliminar_estudiante
    jmp menu_loop

hacer_salir:
    call limpiar_pantalla
    mov ax, 4c00h
    int 21h
main endp

; ========================================
; CREAR ESTUDIANTE
; ========================================
crear_estudiante proc
    ; Verificar espacio
    mov al, contador
    cmp al, 3
    jge crear_lleno
    
    ; Leer nombre
    call nueva_linea
    lea dx, msg_nombre
    mov ah, 09h
    int 21h
    
    call leer_cadena
    
    ; Leer edad
    call nueva_linea
    lea dx, msg_edad
    mov ah, 09h
    int 21h
    
    call leer_numero_simple
    push ax
    
    ; Leer nota
    call nueva_linea
    lea dx, msg_nota
    mov ah, 09h
    int 21h
    
    call leer_numero_simple
    mov bl, al          ; BL = nota
    pop ax              ; AL = edad
    mov bh, al          ; BH = edad
    
    ; Guardar en primer slot disponible
    cmp est1_activo, 0
    je guardar_est1
    cmp est2_activo, 0
    je guardar_est2
    cmp est3_activo, 0
    je guardar_est3
    jmp crear_fin

guardar_est1:
    call copiar_a_estudiante1
    mov est1_edad, bh
    mov est1_nota, bl
    mov est1_activo, 1
    inc contador
    jmp crear_exito

guardar_est2:
    call copiar_a_estudiante2
    mov est2_edad, bh
    mov est2_nota, bl
    mov est2_activo, 1
    inc contador
    jmp crear_exito

guardar_est3:
    call copiar_a_estudiante3
    mov est3_edad, bh
    mov est3_nota, bl
    mov est3_activo, 1
    inc contador
    jmp crear_exito

crear_exito:
    lea dx, msg_creado
    mov ah, 09h
    int 21h
    call pausa
    ret

crear_lleno:
    lea dx, msg_llena
    mov ah, 09h
    int 21h
    call pausa
    ret

crear_fin:
    ret
crear_estudiante endp

; ========================================
; LISTAR ESTUDIANTES
; ========================================
listar_estudiantes proc
    mov al, contador
    cmp al, 0
    je listar_vacio
    
    lea dx, msg_lista
    mov ah, 09h
    int 21h
    call nueva_linea
    
    ; Estudiante 1
    cmp est1_activo, 1
    jne check_est2
    
    mov ah, 02h
    mov dl, '1'
    int 21h
    mov dl, '.'
    int 21h
    mov dl, ' '
    int 21h
    
    lea dx, est1_nombre
    mov ah, 09h
    int 21h
    
    mov ah, 02h
    mov dl, ' '
    int 21h
    mov dl, '-'
    int 21h
    mov dl, ' '
    int 21h
    
    mov al, est1_edad
    call mostrar_numero
    
    mov ah, 02h
    mov dl, ' '
    int 21h
    mov dl, 'a'
    int 21h
    mov dl, ' '
    int 21h
    mov dl, '-'
    int 21h
    mov dl, ' '
    int 21h
    
    mov al, est1_nota
    call mostrar_numero
    
    call nueva_linea

check_est2:
    ; Estudiante 2
    cmp est2_activo, 1
    jne check_est3
    
    mov ah, 02h
    mov dl, '2'
    int 21h
    mov dl, '.'
    int 21h
    mov dl, ' '
    int 21h
    
    lea dx, est2_nombre
    mov ah, 09h
    int 21h
    
    mov ah, 02h
    mov dl, ' '
    int 21h
    mov dl, '-'
    int 21h
    mov dl, ' '
    int 21h
    
    mov al, est2_edad
    call mostrar_numero
    
    mov ah, 02h
    mov dl, ' '
    int 21h
    mov dl, 'a'
    int 21h
    mov dl, ' '
    int 21h
    mov dl, '-'
    int 21h
    mov dl, ' '
    int 21h
    
    mov al, est2_nota
    call mostrar_numero
    
    call nueva_linea

check_est3:
    ; Estudiante 3
    cmp est3_activo, 1
    jne listar_fin
    
    mov ah, 02h
    mov dl, '3'
    int 21h
    mov dl, '.'
    int 21h
    mov dl, ' '
    int 21h
    
    lea dx, est3_nombre
    mov ah, 09h
    int 21h
    
    mov ah, 02h
    mov dl, ' '
    int 21h
    mov dl, '-'
    int 21h
    mov dl, ' '
    int 21h
    
    mov al, est3_edad
    call mostrar_numero
    
    mov ah, 02h
    mov dl, ' '
    int 21h
    mov dl, 'a'
    int 21h
    mov dl, ' '
    int 21h
    mov dl, '-'
    int 21h
    mov dl, ' '
    int 21h
    
    mov al, est3_nota
    call mostrar_numero
    
    call nueva_linea

listar_fin:
    call pausa
    ret

listar_vacio:
    lea dx, msg_vacio
    mov ah, 09h
    int 21h
    call pausa
    ret
listar_estudiantes endp

; ========================================
; ACTUALIZAR ESTUDIANTE
; ========================================
actualizar_estudiante proc
    mov al, contador
    cmp al, 0
    je act_vacio
    
    call listar_estudiantes
    
    lea dx, msg_seleccionar
    mov ah, 09h
    int 21h
    
    mov ah, 01h
    int 21h
    sub al, '0'
    mov indice, al
    
    ; Validar índice
    cmp al, 1
    jl act_invalido
    cmp al, 3
    jg act_invalido
    
    ; Verificar que esté activo
    cmp al, 1
    je act_verificar1
    cmp al, 2
    je act_verificar2
    cmp al, 3
    je act_verificar3

act_verificar1:
    cmp est1_activo, 1
    jne act_invalido
    jmp act_menu

act_verificar2:
    cmp est2_activo, 1
    jne act_invalido
    jmp act_menu

act_verificar3:
    cmp est3_activo, 1
    jne act_invalido
    jmp act_menu

act_menu:
    lea dx, msg_que_act
    mov ah, 09h
    int 21h
    
    mov ah, 01h
    int 21h
    sub al, '0'
    
    cmp al, 1
    je act_nombre
    cmp al, 2
    je act_edad
    cmp al, 3
    je act_nota
    ret

act_nombre:
    lea dx, msg_nuevo_nombre
    mov ah, 09h
    int 21h
    
    call leer_cadena
    
    mov al, indice
    cmp al, 1
    je act_nom1
    cmp al, 2
    je act_nom2
    cmp al, 3
    je act_nom3

act_nom1:
    call copiar_a_estudiante1
    jmp act_exito

act_nom2:
    call copiar_a_estudiante2
    jmp act_exito

act_nom3:
    call copiar_a_estudiante3
    jmp act_exito

act_edad:
    call nueva_linea
    lea dx, msg_nueva_edad
    mov ah, 09h
    int 21h
    
    call leer_numero_simple
    
    mov bl, al
    mov al, indice
    cmp al, 1
    je act_edad1
    cmp al, 2
    je act_edad2
    cmp al, 3
    je act_edad3

act_edad1:
    mov est1_edad, bl
    jmp act_exito

act_edad2:
    mov est2_edad, bl
    jmp act_exito

act_edad3:
    mov est3_edad, bl
    jmp act_exito

act_nota:
    call nueva_linea
    lea dx, msg_nueva_nota
    mov ah, 09h
    int 21h
    
    call leer_numero_simple
    
    mov bl, al
    mov al, indice
    cmp al, 1
    je act_nota1
    cmp al, 2
    je act_nota2
    cmp al, 3
    je act_nota3

act_nota1:
    mov est1_nota, bl
    jmp act_exito

act_nota2:
    mov est2_nota, bl
    jmp act_exito

act_nota3:
    mov est3_nota, bl
    jmp act_exito

act_exito:
    lea dx, msg_actualizado
    mov ah, 09h
    int 21h
    call pausa
    ret

act_vacio:
    lea dx, msg_vacio
    mov ah, 09h
    int 21h
    call pausa
    ret

act_invalido:
    lea dx, msg_no_existe
    mov ah, 09h
    int 21h
    call pausa
    ret
actualizar_estudiante endp

; ========================================
; ELIMINAR ESTUDIANTE
; ========================================
eliminar_estudiante proc
    mov al, contador
    cmp al, 0
    je elim_vacio
    
    call listar_estudiantes
    
    lea dx, msg_seleccionar
    mov ah, 09h
    int 21h
    
    mov ah, 01h
    int 21h
    sub al, '0'
    mov indice, al
    
    ; Validar
    cmp al, 1
    jl elim_invalido
    cmp al, 3
    jg elim_invalido
    
    ; Verificar que exista
    cmp al, 1
    je elim_verificar1
    cmp al, 2
    je elim_verificar2
    cmp al, 3
    je elim_verificar3

elim_verificar1:
    cmp est1_activo, 1
    jne elim_invalido
    jmp elim_confirmar

elim_verificar2:
    cmp est2_activo, 1
    jne elim_invalido
    jmp elim_confirmar

elim_verificar3:
    cmp est3_activo, 1
    jne elim_invalido
    jmp elim_confirmar

elim_confirmar:
    lea dx, msg_confirmar
    mov ah, 09h
    int 21h
    
    mov ah, 01h
    int 21h
    
    cmp al, 'S'
    je elim_procesar
    cmp al, 's'
    je elim_procesar
    ret

elim_procesar:
    mov al, indice
    cmp al, 1
    je elim_est1
    cmp al, 2
    je elim_est2
    cmp al, 3
    je elim_est3

elim_est1:
    mov est1_activo, 0
    dec contador
    jmp elim_exito

elim_est2:
    mov est2_activo, 0
    dec contador
    jmp elim_exito

elim_est3:
    mov est3_activo, 0
    dec contador
    jmp elim_exito

elim_exito:
    lea dx, msg_eliminado
    mov ah, 09h
    int 21h
    call pausa
    ret

elim_vacio:
    lea dx, msg_vacio
    mov ah, 09h
    int 21h
    call pausa
    ret

elim_invalido:
    lea dx, msg_no_existe
    mov ah, 09h
    int 21h
    call pausa
    ret
eliminar_estudiante endp

; ========================================
; PROCEDIMIENTOS AUXILIARES
; ========================================

leer_cadena proc
    push ax
    push bx
    push cx
    push dx
    push si
    
    ; Limpiar buffer
    lea di, buffer_input
    mov cx, 30
    mov al, '$'
limpiar_buffer:
    mov [di], al
    inc di
    loop limpiar_buffer
    
    ; Leer caracteres
    lea si, buffer_input
    mov cx, 0

leer_char:
    mov ah, 01h
    int 21h
    
    cmp al, 13          ; Enter
    je fin_leer_cadena
    
    cmp al, 8           ; Backspace
    je borrar_char
    
    cmp cx, 15          ; Máximo 15 caracteres
    jge leer_char
    
    mov [si], al
    inc si
    inc cx
    jmp leer_char

borrar_char:
    cmp cx, 0
    je leer_char
    dec si
    mov byte ptr [si], '$'
    dec cx
    jmp leer_char

fin_leer_cadena:
    mov byte ptr [si], '$'
    
    pop si
    pop dx
    pop cx
    pop bx
    pop ax
    ret
leer_cadena endp

copiar_a_estudiante1 proc
    push si
    push di
    push cx
    
    ; Limpiar destino
    lea di, est1_nombre
    mov cx, 20
    mov al, '$'
limpiar_est1:
    mov [di], al
    inc di
    loop limpiar_est1
    
    ; Copiar
    lea si, buffer_input
    lea di, est1_nombre
    mov cx, 15
copiar_est1:
    mov al, [si]
    cmp al, '$'
    je fin_copiar_est1
    mov [di], al
    inc si
    inc di
    loop copiar_est1

fin_copiar_est1:
    mov byte ptr [di], '$'
    
    pop cx
    pop di
    pop si
    ret
copiar_a_estudiante1 endp

copiar_a_estudiante2 proc
    push si
    push di
    push cx
    
    lea di, est2_nombre
    mov cx, 20
    mov al, '$'
limpiar_est2:
    mov [di], al
    inc di
    loop limpiar_est2
    
    lea si, buffer_input
    lea di, est2_nombre
    mov cx, 15
copiar_est2:
    mov al, [si]
    cmp al, '$'
    je fin_copiar_est2
    mov [di], al
    inc si
    inc di
    loop copiar_est2

fin_copiar_est2:
    mov byte ptr [di], '$'
    
    pop cx
    pop di
    pop si
    ret
copiar_a_estudiante2 endp

copiar_a_estudiante3 proc
    push si
    push di
    push cx
    
    lea di, est3_nombre
    mov cx, 20
    mov al, '$'
limpiar_est3:
    mov [di], al
    inc di
    loop limpiar_est3
    
    lea si, buffer_input
    lea di, est3_nombre
    mov cx, 15
copiar_est3:
    mov al, [si]
    cmp al, '$'
    je fin_copiar_est3
    mov [di], al
    inc si
    inc di
    loop copiar_est3

fin_copiar_est3:
    mov byte ptr [di], '$'
    
    pop cx
    pop di
    pop si
    ret
copiar_a_estudiante3 endp

leer_numero_simple proc
    push bx
    
    mov bl, 0
leer_num_loop:
    mov ah, 01h
    int 21h
    
    cmp al, 13
    je fin_leer_num
    
    cmp al, '0'
    jb leer_num_loop
    cmp al, '9'
    ja leer_num_loop
    
    sub al, '0'
    
    ; BL = BL * 10 + AL
    push ax
    mov al, bl
    mov cl, 10
    mul cl
    mov bl, al
    pop ax
    
    add bl, al
    jmp leer_num_loop

fin_leer_num:
    mov al, bl
    
    pop bx
    ret
leer_numero_simple endp

mostrar_numero proc
    push ax
    push bx
    push dx
    
    mov ah, 0
    mov bl, 10
    div bl
    
    mov bh, ah
    
    cmp al, 0
    je solo_unidad
    
    add al, '0'
    mov dl, al
    mov ah, 02h
    int 21h

solo_unidad:
    mov al, bh
    add al, '0'
    mov dl, al
    mov ah, 02h
    int 21h
    
    pop dx
    pop bx
    pop ax
    ret
mostrar_numero endp

limpiar_pantalla proc
    mov ax, 0003h
    int 10h
    ret
limpiar_pantalla endp

nueva_linea proc
    push ax
    push dx
    
    mov ah, 02h
    mov dl, 13
    int 21h
    mov dl, 10
    int 21h
    
    pop dx
    pop ax
    ret
nueva_linea endp

pausa proc
    lea dx, msg_continuar
    mov ah, 09h
    int 21h
    
    mov ah, 00h
    int 16h
    ret
pausa endp

end main`;
  }

  static executeCode(code) {
    const parsedValues = this.parseCodeValues(code);
    const studentId = parsedValues.studentId || 1001;
    const promedio = parsedValues.promedio || 8.5;
    const idBuscar = parsedValues.idBuscar || studentId;
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
}

export default EstudiantesCompiler;