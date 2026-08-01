import api from "../lib/axios";

//checkout de um plano com os dados do cliente e preencher os dados do cliente e mandar para o backend do formulario
export async function checkoutPlan(planDetails: { name: string; email: string; phone: string; planId: number; trainerId: number; }) {
    const response = await api.post('/payments/public', planDetails);
    return response.data;
}