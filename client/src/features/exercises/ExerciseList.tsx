import { useQuery } from "@tanstack/react-query";
import { getExercises } from "../exercises/exercises.api";
import type { Exercise } from "../types/exercises";
import { useState } from "react";

//renderiza a lista de exercicios do treinador:
export default function ExerciseList() {
  const [filter, setFilter] = useState("all");

  const {data: exercises,isLoading,error,} = useQuery({
    queryKey: ["exercises"],
    queryFn: getExercises,
  });

  //manejo de errores:
  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>Error loading exercises.</p>;

  if (!exercises?.length) return <p>No exercises found.</p>;

  
  //obtem todas as categorias sem repetir:
  const categories = [ "all", ...new Set(exercises?.map((exercise) => exercise.category)),
  ];

  //filtra os exercicios pela categoria:
  const filteredExercises = exercises?.filter((exercise: Exercise) => {

    if (filter === "all") return true;
    return exercise.category === filter;

  });

  return (
    <>
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category === "all" ? "Todas as categorias" : category}
          </option>
        ))}
      </select>

      <ul>
        {filteredExercises?.map((exercise: Exercise) => (
          <li key={exercise.id}>{exercise.name}</li>
        ))}
      </ul>
    </>
  );
}