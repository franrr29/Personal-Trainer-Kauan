import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "../components/Navbar";
import { getPublicPlans } from "../plans/plans.api";
import CheckoutModal from "../plans/CheckoutModal";

export default function Landing() {
    const { data: plans, isLoading, error } = useQuery({
        queryKey: ["publicPlans"],
        queryFn: () => getPublicPlans(Number(import.meta.env.VITE_TRAINER_ID)),
    });

    // plan seleccionado controla si el modal esta abierto y cual plan eligio
    const [selectedPlan, setSelectedPlan] = useState<any>(null);

    return (
        <>
            <Navbar />

            <h1>Planos disponíveis</h1>

            {isLoading && <p>Loading...</p>}
            {error && <p>Erro ao carregar planos.</p>}
            {plans && plans.length === 0 && <p>Nenhum plano disponível.</p>}

            {plans && plans.length > 0 && (
                <ul>
                    {plans.map((plan: any) => {
                        //si viene undefined o null, devuelve un array vaci
                        const features = (() => {
                            try { return JSON.parse(plan.features); }
                            catch { return []; }
                        })();

                        return (
                            <li key={plan.id}>
                                <h2>{plan.name}</h2>
                                <p>{plan.description}</p>
                                <p>R$ {plan.price}</p>
                                <p>{plan.duration_value} {plan.duration_unit}</p>
                                <ul>
                                    {features.map((feature: string, index: number) => (
                                        <li key={index}>{feature}</li>
                                    ))}
                                </ul>
                                <button onClick={() => setSelectedPlan(plan)}>
                                    Assinar
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}

            {selectedPlan && (
                <CheckoutModal
                    plan={selectedPlan}
                    onClose={() => setSelectedPlan(null)}
                />
            )}
        </>
    );
}