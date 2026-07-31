import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateExercise } from "./exercises.api";
import type { Exercise } from "../types/exercises";
import { createExercise } from "./exercises.api";

interface Props {
    exercise?: Exercise;
}

export default function ExerciseForm({ exercise }: Props) {
    const [exForm, setExForm] = useState({
        name: exercise?.name ?? "",
        description: exercise?.description ?? "",
        video_url: exercise?.video_url ?? "",
        category: exercise?.category ?? "",
        notes: exercise?.notes ?? "",
    });

    //para modificar o crear un ejercicio, dependiendo si exercise es undefined o no
    const queryClient = useQueryClient();
    const mutation = useMutation({
    mutationFn: async () => {
        if (exercise) {
            return updateExercise(String(exercise.id), exForm);
        }
        return createExercise(exForm);
    },

    // invalidar la cache de ejercicios para que se actualice la lista de ejercicios
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["exercises"] });
        }
    },
    );

return (

    <form onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate();
    }}>
        {/* inputs*/}
        <input
            type="text"
            placeholder="Nome do exercicio"
            value={exForm.name}
            onChange={(e) => setExForm({ ...exForm, name: e.target.value })}
        />
        <input
            type="text"
            placeholder="Descrição do exercicio"
            value={exForm.description}  
            onChange={(e) => setExForm({ ...exForm, description: e.target.value })}
        />
        <input
            type="text" 
            placeholder="Carregar video"
            value={exForm.video_url}
            onChange={(e) => setExForm({ ...exForm, video_url: e.target.value })}   
        />
        <input
            type="text"
            placeholder="Categoria do exercicio"
            value={exForm.category}
            onChange={(e) => setExForm({ ...exForm, category: e.target.value })}
        />
        <input
            type="text"
            placeholder="Notas do exercicio"
            value={exForm.notes}
            onChange={(e) => setExForm({ ...exForm, notes: e.target.value })}
        />
        <button type="submit">{exercise ? "Actualizar" : "Crear"}</button>

    </form>
);
}