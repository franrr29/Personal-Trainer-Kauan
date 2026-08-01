import { useState } from "react";
import type { Plan } from "../types/plans";
import { checkoutPlan } from "./payments.api";
import { useMutation } from "@tanstack/react-query";


//componetne do checkout, recebe o plan e onClose como props
export default function Checkout({ plan, onClose }: { plan: Plan; onClose: () => void }) {

    const [planDetails, setPlanDetails] = useState({
        name: "",
        email: "",
        phone: "",
        planId: plan.id,
        trainerId: Number(import.meta.env.VITE_TRAINER_ID),
    });

    //guardar o qr code que vem do backend
    const [qrData, setQrData] = useState<any>(null);

    const mutation = useMutation({
        mutationFn: checkoutPlan,
        onSuccess: (data) => {
            setQrData(data.payment);
        }
    });

    // se tiver qr code, mostrar o qr code e o boto de fechar
    if (qrData) {
        return (
            <div>
                <h3>Escaneie o QR Code para pagar</h3>
                <p>{plan.name} — R$ {plan.price}</p>
                <img src={`data:image/png;base64,${qrData.qr_code_base64}`} alt="QR PIX" />
                <button onClick={onClose}>Fechar</button>
            </div>
        );
    }

    return (
        <div>
            <h2>Checkout</h2>
            <p>Plano: {plan.name} — R$ {plan.price}</p>

            <form onSubmit={(e) => {
                e.preventDefault();
                mutation.mutate(planDetails);
            }}>
                <label>
                    Nome:
                    <input
                        type="text"
                        value={planDetails.name}
                        onChange={(e) => setPlanDetails({ ...planDetails, name: e.target.value })}
                        required
                    />
                </label>
                <label>
                    Email:
                    <input
                        type="email"
                        value={planDetails.email}
                        onChange={(e) => setPlanDetails({ ...planDetails, email: e.target.value })}
                        required
                    />
                </label>
                <label>
                    Telefone:
                    <input
                        type="tel"
                        value={planDetails.phone}
                        onChange={(e) => setPlanDetails({ ...planDetails, phone: e.target.value })}
                        required
                    />
                </label>
                <button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? "Processando..." : "Finalizar Compra"}
                </button>
                <button type="button" onClick={onClose}>Cancelar</button>
                {mutation.isError && <p>Erro ao processar pagamento.</p>}
            </form>
        </div>
    );
}