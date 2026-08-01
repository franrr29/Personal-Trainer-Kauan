import { useQuery } from "@tanstack/react-query";
import { Navbar } from "../components/Navbar";
import { getPublicPlans } from "../plans/plans.api";


//landing principal do site, onde o usuario pode ver os planos disponiveis e assinar
export default function Landing() {
    const { data: plans, isLoading, error } = useQuery({
        queryKey: ["publicPlans"],
        queryFn: () => getPublicPlans(Number(import.meta.env.VITE_TRAINER_ID)),
    });

    return (
        <>
            <Navbar />

            <h1>Planos disponíveis</h1>

            {isLoading && <p>Loading...</p>}
            {error && <p>Erro ao carregar planos.</p>}
            {plans && plans.length === 0 && <p>Nenhum plano disponível.</p>}

            {plans && plans.length > 0 && (
                <ul>
                    {plans.map((plan: any) => (
                        <li key={plan.id}>
                            <h2>{plan.name}</h2>
                            <p>{plan.description}</p>
                            <p>R$ {plan.price}</p>
                            <p>{plan.duration_value} {plan.duration_unit}</p>
                            <ul>
                                {JSON.parse(plan.features).map((feature: string, index: number) => (
                                    <li key={index}>{feature}</li>
                                ))}
                            </ul>
                            <button>Assinar</button>
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}