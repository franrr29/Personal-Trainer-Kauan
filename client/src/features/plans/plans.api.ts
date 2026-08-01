import api from "../lib/axios";


//get aos planos do treinador:
export async function getPlans() {
    const response = await api.get('/plans');
    return response.data;
}

//criar um plano
export async function createPlan(plan: { name: string; description: string; price: number; 
    features: string[];duration_value: number; duration_unit: string; }) {
    const response = await api.post('/plans', plan);
    return response.data;
}

//atualizar um plano
export async function updatePlan(id: string, plan: { name?: string; description?: string; price?: number; 
    features?: string[]; duration_value?: number; duration_unit?: string; }) {
    const response = await api.put(`/plans/${id}`, plan);
    return response.data;
}

//deletar um plano
export async function deletePlan(id: string) {
    const response = await api.delete(`/plans/${id}`);
    return response.data;
}