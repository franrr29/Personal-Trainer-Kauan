import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPlan, updatePlan } from "./plans.api";
import type { Plan } from "../types/plans";

interface Props {
    plan?: Plan;
    onClose: () => void;
}


//componente para criar ou atualizar um plano, dependendo se plan e undefined ou nao:
export default function PlanForm({ plan, onClose }: Props) {

    const [planForm, setPlanForm] = useState({
        name: plan?.name ?? "",
        description: plan?.description ?? "",
        features: plan?.features ?? [""],
        price: plan?.price ?? 0,
        duration_value: plan?.duration_value ?? 1,
        duration_unit: plan?.duration_unit ?? "months",
    });

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async () => {
            if (plan) {
                return updatePlan(String(plan.id), planForm);
            }
            return createPlan(planForm);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["plans"] });
            onClose();
        }
    });

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
        }}>
            <input
                type="text"
                placeholder="Nome do plano"
                value={planForm.name}
                onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
            />
            <input
                type="text"
                placeholder="Descrição"
                value={planForm.description}
                onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
            />
            <input
                type="number"
                placeholder="Preço"
                value={planForm.price}
                onChange={(e) => setPlanForm({ ...planForm, price: Number(e.target.value) })}
            />
            <input
                type="number"
                placeholder="Duração"
                value={planForm.duration_value}
                onChange={(e) => setPlanForm({ ...planForm, duration_value: Number(e.target.value) })}
            />
            <select
                value={planForm.duration_unit}
                onChange={(e) => setPlanForm({ ...planForm, duration_unit: e.target.value })}
            >
                <option value="days">Dias</option>
                <option value="weeks">Semanas</option>
                <option value="months">Meses</option>
                <option value="years">Anos</option>
            </select>

            {planForm.features.map((feature, index) => (
                <div key={index}>
                    <input
                        type="text"
                        placeholder="Ex: Rotinas personalizadas"
                        value={feature}
                        onChange={(e) => {
                            const updated = [...planForm.features];
                            updated[index] = e.target.value;
                            setPlanForm({ ...planForm, features: updated });
                        }}
                    />
                    <button type="button" onClick={() => {
                        const updated = planForm.features.filter((_, i) => i !== index);
                        setPlanForm({ ...planForm, features: updated });
                    }}>X</button>
                </div>
            ))}
            <button type="button" onClick={() => setPlanForm({ ...planForm, features: [...planForm.features, ""] })}>
                + Adicionar benefício
            </button>

            <button type="submit">{plan ? "Atualizar" : "Salvar"}</button>
        </form>
    );
}