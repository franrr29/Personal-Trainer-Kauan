import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPlans, deletePlan } from "./plans.api";
import PlanForm from "./Plans";
import type { Plan } from "../types/plans";


//componente para listar os planos e permitir criar, editar ou desativar:
export default function PlanList() {
    const [showForm, setShowForm] = useState(false);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

    const queryClient = useQueryClient();

    const { data: plans, isLoading, error } = useQuery({
        queryKey: ["plans"],
        queryFn: getPlans,
    });

    //mutation para desativar um plano:
    const deactivate = useMutation({
        mutationFn: (id: number) => deletePlan(String(id)),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["plans"] }),
    });

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading plans.</p>;

    return (
        <div>
            <button onClick={() => { setEditingPlan(null); setShowForm(true); }}>
                Criar plano
            </button>

            {showForm && (
                <PlanForm
                    plan={editingPlan ?? undefined}
                    onClose={() => { setShowForm(false); setEditingPlan(null); }}
                />
            )}

            {!plans?.length ? (
                <p>No plans found.</p>
            ) : (
                <ul>
                    {plans.map((plan: Plan) => (
                        <li key={plan.id}>
                            <p>{plan.name}</p>
                            <p>{plan.description}</p>
                            <p>{plan.price} RS</p>
                            <p>{plan.duration_value} {plan.duration_unit}</p>
                            <button onClick={() => { setEditingPlan(plan); setShowForm(true); }}>
                                Editar
                            </button>
                            <button onClick={() => deactivate.mutate(plan.id)}>
                                Desativar
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}