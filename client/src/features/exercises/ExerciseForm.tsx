import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createExercise, updateExercise, uploadExerciseVideo } from "./exercises.api";
import type { Exercise } from "../types/exercises";

interface Props {
    exercise?: Exercise;
}

// formulario para criar ou editar exercicio com upload de video
export default function ExerciseForm({ exercise }: Props) {

    const [exForm, setExForm] = useState({
        name: exercise?.name ?? "",
        description: exercise?.description ?? "",
        category: exercise?.category ?? "",
        notes: exercise?.notes ?? "",
    });

    // arquivo de video selecionado pelo trainer
    const [videoFile, setVideoFile] = useState<File | null>(null);

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async () => {
            // criar ou atualizar exercicio
            let result;
            if (exercise) {
                result = await updateExercise(String(exercise.id), exForm);
            } else {
                result = await createExercise(exForm);
            }

            // se tem video subir depois de salvar o exercicio
            if (videoFile) {
                const id = exercise?.id ?? result.id;
                await uploadExerciseVideo(id, videoFile);
            }

            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["exercises"] });
        },
    });

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
        }}>
            <input
                type="text"
                placeholder="Nome do exercicio"
                value={exForm.name}
                onChange={(e) => setExForm({ ...exForm, name: e.target.value })}
                required
            />
            <input
                type="text"
                placeholder="Descricao do exercicio"
                value={exForm.description}
                onChange={(e) => setExForm({ ...exForm, description: e.target.value })}
            />
            <input
                type="text"
                placeholder="Categoria do exercicio"
                value={exForm.category}
                onChange={(e) => setExForm({ ...exForm, category: e.target.value })}
                required
            />
            <input
                type="text"
                placeholder="Notas do exercicio"
                value={exForm.notes}
                onChange={(e) => setExForm({ ...exForm, notes: e.target.value })}
            />

            {/* upload de video */}
            <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
            />

            <button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Salvando..." : exercise ? "Atualizar" : "Criar"}
            </button>

            {mutation.isError && <p>Erro ao salvar exercicio.</p>}
        </form>
    );
}