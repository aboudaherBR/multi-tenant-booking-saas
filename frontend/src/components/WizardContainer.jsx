import { useState } from "react";
import StepSalon from "./StepSalon";
import StepAddress from "./StepAddress";

function WizardContainer() {
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        salonName: "",
        companyPhone: "",
        address_street: "",
        address_number: "",
        address_neighborhood: "",
        address_city: "",
        address_state: "",
        name: "",
        username: "",
        password: ""
    });

    function nextStep() {
        setStep((prev) => prev + 1);
    }

    function prevStep() {
        setStep((prev) => prev - 1);
    }

    function updateField(field, value) {
        setFormData((prev) => ({
            ...prev,
            [field]: value
        }));
    }

    return (
        <div style={styles.container}>
            {/* indicador */}
            <div style={styles.header}>
                <div>Step {step}</div>
            </div>

            {/* conteúdo do step */}
            <div style={styles.body}>
                {step === 1 && (
                    <StepSalon
                        formData={formData}
                        updateField={updateField}
                    />
                )}
                {step === 2 && (
                    <StepAddress
                        formData={formData}
                        updateField={updateField}
                    />
                )}
                {step === 3 && <div>StepAccount</div>}
            </div>

            {/* navegação */}
            <div style={styles.footer}>
                {step > 1 && (
                    <button onClick={prevStep}>
                        Voltar
                    </button>
                )}

                {step < 3 ? (
                    <button onClick={nextStep}>
                        Próximo
                    </button>
                ) : (
                    <button>
                        Finalizar
                    </button>
                )}
            </div>
        </div>
    );
}

export default WizardContainer;

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        gap: "16px"
    },
    header: {
        textAlign: "center",
        color: "#fff"
    },
    body: {
        minHeight: "150px"
    },
    footer: {
        display: "flex",
        justifyContent: "space-between"
    }
};