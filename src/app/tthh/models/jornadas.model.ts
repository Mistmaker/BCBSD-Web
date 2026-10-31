export class JornadasModel {
    jornada_id!: number;
    jornada_registro!: string;
    jornada_estado!: string;
    fk_usuario_id!: number;
    jornada_nombre!: string;
    jornada_rancho!: number;
    jornada_diasminimo!: number;
    jornada_diasmaximo!: number;
    jornada_dias_semana!: string;
    jornada_horas_dia!: number;
    jornada_entrada!: string;
    jornada_salida!: string;
    jornada_break!: string;
    jornada_entrada_break!: string;
    jornada_salida_break!: string;
}