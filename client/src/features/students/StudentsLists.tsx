import { getStudents } from "../students/students.api";
import { useQuery } from '@tanstack/react-query';


//mostrar os estudantes cadastrados logo apos o pagamento:
export default function ShowStudents() {
    const { data: students, isLoading, error } = useQuery({
        queryKey: ['students'],
        queryFn: getStudents,
    });

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error loading students.</p>;
    }

            return (
                <ul>
                    {students.map((student: any) => (
                        <li key={student.id}>
                            <p>Nome:{student.name}</p>
                            <p>Email:{student.email}</p>
                            <p>Telefone:{student.phone}</p>
                            <p>Status:{student.status}</p>
                        </li>
                    ))}
                </ul>
        );  
}