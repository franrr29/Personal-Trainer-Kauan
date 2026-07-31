import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {

    //dados dos alunos:
    const { data: students, isLoading: studentsLoading } = useQuery({
        queryKey: ['students'],
        queryFn: getStudents
    });

    //lista de exercicios:
    const { data: exercises, isLoading: exercisesLoading } = useQuery({
        queryKey: ['exercises'],
        queryFn: getExercises
    });

   
    if (studentsLoading || exercisesLoading) return <div>Loading...</div>;

    return (
        <div>
            <h1>Dashboard</h1>
            <h2>Students</h2>
            <ul>
                {students?.map((student: any) => (
                    <li key={student.id}>{student.name}</li>
                ))}
            </ul>
            <h2>Exercises</h2>
            <ul>
                {exercises?.map((exercise: any) => (
                    <li key={exercise.id}>{exercise.name}</li>
                ))}
            </ul>
        </div>
    );
}