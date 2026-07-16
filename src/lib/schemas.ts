import { z } from 'zod';

export const LoginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

export type LoginData = z.infer<typeof LoginSchema>;

export const RegistroTreinoSchema = z.object({
    id: z.string(),
    carga: z.number().min(0, 'A carga não pode ser negativa'),
    rpe: z.number().min(1, 'Mínimo 1').max(10, 'Máximo 10'),
    observacoes: z.string().optional(),
    concluido: z.boolean(),
});

export const ExecutarTreinoSchema = z.object({
    itens: z.array(RegistroTreinoSchema)
});

export type RegistroTreinoData = z.infer<typeof RegistroTreinoSchema>;
export type ExecutarTreinoData = z.infer<typeof ExecutarTreinoSchema>;
