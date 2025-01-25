import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Step = 1 | 2;

type FormErrors = {
    name?: string;
    email?: string;
    password?: string;
    cpf?: string;
    phone?: string;
    age?: string;
}

export function Register() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState<Step>(1);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        cpf: '',
        phone: '',
        age: ''
    });

    function validateStep1() {
        const newErrors: FormErrors = {};

        if (!formData.name) {
            newErrors.name = 'Nome é obrigatório';
        } else if (formData.name.length < 3) {
            newErrors.name = 'Nome deve ter no mínimo 3 caracteres';
        }

        if (!formData.email) {
            newErrors.email = 'E-mail é obrigatório';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'E-mail inválido';
        }

        if (!formData.password) {
            newErrors.password = 'Senha é obrigatória';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function validateStep2() {
        const newErrors: FormErrors = {};

        if (!formData.cpf) {
            newErrors.cpf = 'CPF é obrigatório';
        } else if (!/^\d{11}$/.test(formData.cpf.replace(/\D/g, ''))) {
            newErrors.cpf = 'CPF inválido';
        }

        if (!formData.phone) {
            newErrors.phone = 'Telefone é obrigatório';
        } else if (!/^\d{10,11}$/.test(formData.phone.replace(/\D/g, ''))) {
            newErrors.phone = 'Telefone inválido';
        }

        if (!formData.age) {
            newErrors.age = 'Idade é obrigatória';
        } else if (Number(formData.age) < 18 || Number(formData.age) > 100) {
            newErrors.age = 'Idade deve estar entre 18 e 100 anos';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (currentStep === 1) {
            if (validateStep1()) {
                setCurrentStep(2);
            }
            return;
        }

        if (!validateStep2()) {
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            console.log('Registro:', formData);
            setIsLoading(false);
            navigate('/sign-in');
        }, 1500);
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
        // Limpa o erro do campo quando o usuário começa a digitar
        if (errors[id as keyof FormErrors]) {
            setErrors(prev => ({
                ...prev,
                [id]: undefined
            }));
        }
    }

    function handleBack() {
        setCurrentStep(1);
    }

    return (
        <>
            <Helmet title="Cadastro" />
            <div className="absolute right-4 top-8">
                <ThemeToggle />
            </div>
            <div className="min-h-screen flex items-center justify-center">
                <Card className="max-w-[680px] w-full p-12 sm:p-10 rounded-2xl">
                    <div className="flex justify-between items-center mb-2">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Criar nova conta
                        </h1>
                    </div>

                    <p className="text-sm text-muted-foreground mb-8">
                        {currentStep === 1
                            ? 'Preencha seus dados de acesso'
                            : 'Complete seu cadastro com informações adicionais'
                        }
                    </p>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {currentStep === 1 ? (
                            <div className="space-y-4">
                                <div className="space-y-2 w-96">
                                    <Label htmlFor="name">Nome completo</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Digite seu nome"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={cn(
                                            errors.name && "border-red-500 focus-visible:ring-red-500"
                                        )}
                                    />
                                    {errors.name && (
                                        <span className="text-xs text-red-500">
                                            {errors.name}
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">E-mail</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Digite seu e-mail"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={cn(
                                            errors.email && "border-red-500 focus-visible:ring-red-500"
                                        )}
                                    />
                                    {errors.email && (
                                        <span className="text-xs text-red-500">
                                            {errors.email}
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Senha</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Digite sua senha"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={cn(
                                            errors.password && "border-red-500 focus-visible:ring-red-500"
                                        )}
                                    />
                                    {errors.password && (
                                        <span className="text-xs text-red-500">
                                            {errors.password}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="space-y-2 w-96">
                                    <Label htmlFor="cpf">CPF</Label>
                                    <Input
                                        id="cpf"
                                        type="text"
                                        placeholder="Digite seu CPF"
                                        value={formData.cpf}
                                        onChange={handleChange}
                                        className={cn(
                                            errors.cpf && "border-red-500 focus-visible:ring-red-500"
                                        )}
                                    />
                                    {errors.cpf && (
                                        <span className="text-xs text-red-500">
                                            {errors.cpf}
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Telefone</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="Digite seu telefone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={cn(
                                            errors.phone && "border-red-500 focus-visible:ring-red-500"
                                        )}
                                    />
                                    {errors.phone && (
                                        <span className="text-xs text-red-500">
                                            {errors.phone}
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="age">Idade</Label>
                                    <Input
                                        id="age"
                                        type="number"
                                        placeholder="Digite sua idade"
                                        value={formData.age}
                                        onChange={handleChange}
                                        className={cn(
                                            errors.age && "border-red-500 focus-visible:ring-red-500"
                                        )}
                                    />
                                    {errors.age && (
                                        <span className="text-xs text-red-500">
                                            {errors.age}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4">
                            {currentStep === 2 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={handleBack}
                                >
                                    Voltar
                                </Button>
                            )}
                            <Button
                                disabled={isLoading}
                                type="submit"
                                className="flex-1 h-10 relative overflow-hidden group"
                            >
                                <div className="relative flex items-center justify-center gap-2">
                                    {isLoading ? (
                                        <>
                                            <FaSpinner className="animate-spin h-5 w-5" />
                                            <span>Criando conta...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                {currentStep === 1 ? (
                                                    <path d="M5 12h14l-3-3m0 6l3-3" />
                                                ) : (
                                                    <>
                                                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                                        <circle cx="9" cy="7" r="4" />
                                                        <line x1="19" y1="8" x2="19" y2="14" />
                                                        <line x1="22" y1="11" x2="16" y2="11" />
                                                    </>
                                                )}
                                            </svg>
                                            <span className="font-bold">
                                                {currentStep === 1 ? 'Próximo' : 'Criar Conta'}
                                            </span>
                                        </>
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            </Button>
                        </div>

                        <div className="flex gap-2 pt-6">
                            <div className="flex-1 h-1 rounded-full overflow-hidden bg-muted">
                                <div
                                    className={`h-full bg-primary transition-all duration-500 ease-in-out ${currentStep >= 1 ? 'w-full' : 'w-0'
                                        }`}
                                />
                            </div>
                            <div className="flex-1 h-1 rounded-full overflow-hidden bg-muted">
                                <div
                                    className={`h-full bg-primary transition-all duration-500 ease-in-out ${currentStep >= 2 ? 'w-full' : 'w-0'
                                        }`}
                                />
                            </div>
                        </div>

                        <p className="text-xs text-center text-muted-foreground">
                            Etapa {currentStep} de 2
                        </p>
                    </form>

                    <div className="mt-8 pt-6 border-t">
                        <div className="flex flex-col gap-3">
                            <p className="text-sm text-muted-foreground">
                                Já possui uma conta?
                            </p>
                            <div className="flex flex-col gap-2">
                                <Button
                                    variant="outline"
                                    className="w-full p-6 flex justify-between"
                                    asChild
                                >
                                    <Link to="/sign-in" className="flex items-center justify-between w-full">
                                        <span className="flex items-center gap-2">
                                            <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="text-primary"
                                            >
                                                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                                <polyline points="10 17 15 12 10 7" />
                                                <line x1="15" y1="12" x2="3" y2="12" />
                                            </svg>
                                            <span className="flex flex-col items-start text-left ml-2">
                                                <span className="text-sm font-medium">Fazer login</span>
                                                <span className="text-xs text-muted-foreground">
                                                    Acesse sua conta existente
                                                </span>
                                            </span>
                                        </span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {isLoading && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                            <FaSpinner className="animate-spin text-white w-10 h-10" />
                        </div>
                    )}
                </Card>
            </div>
        </>
    );
}

