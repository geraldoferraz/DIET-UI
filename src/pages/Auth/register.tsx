import { useMutation } from "@tanstack/react-query";
import { register, verifyOtp } from "@/api/register";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterSchemaType } from "@/schemas/register";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { MdMarkEmailRead } from "react-icons/md";
import { Card } from "@/components/ui/card";

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

type Step = 1 | 2 | 3;

export function Register() {
    const navigate = useNavigate();
    const [showAlert, setShowAlert] = useState(false);
    const [currentStep, setCurrentStep] = useState<Step>(1);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<RegisterSchemaType>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            cpf: "",
            phone: "",
            age: "",
            otp: "",
        },
    })

    const registerMutation = useMutation({
        mutationFn: register,
        onSuccess: () => {
            setIsLoading(false)
            toast.success("Código de verificação enviado para seu e-mail.")
            setCurrentStep(3) // vamos para passo 3 (otp)
        },
        onError: (error: any) => {
            setIsLoading(false)
            console.error("Erro ao registrar:", error?.response?.data || error.message)
            const errMsg = error?.response?.data?.error || "Erro ao registrar"
            toast.error(errMsg)
        },
    })

    const verifyOtpMutation = useMutation({
        mutationFn: verifyOtp,
        onSuccess: (data) => {
            setIsLoading(false)
            toast.success(`Olá ${data.user.name}, seu cadastro foi concluído com sucesso!`)
            navigate("/sign-in")
        },
        onError: (error: any) => {
            setIsLoading(false)
            console.error("Erro ao verificar OTP:", error?.response?.data || error.message)
            const errMsg = error?.response?.data?.error || "Erro ao verificar OTP"
            toast.error(errMsg)
        },
    })

    // function validateStep1() {
    //     const newErrors: FormErrors = {};

    //     if (!formData.name) {
    //         newErrors.name = "Nome é obrigatório";
    //     } else if (formData.name.length < 3) {
    //         newErrors.name = "Nome deve ter no mínimo 3 caracteres";
    //     }

    //     if (!formData.email) {
    //         newErrors.email = "E-mail é obrigatório";
    //     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    //         newErrors.email = "E-mail inválido";
    //     }

    //     if (!formData.password) {
    //         newErrors.password = "Senha é obrigatória";
    //     } else if (formData.password.length < 6) {
    //         newErrors.password = "Senha deve ter no mínimo 6 caracteres";
    //     }

    //     setErrors(newErrors);
    //     return Object.keys(newErrors).length === 0;
    // }

    // function validateStep2() {
    //     const newErrors: FormErrors = {};

    //     if (!formData.cpf) {
    //         newErrors.cpf = "CPF é obrigatório";
    //     } else if (!/^\d{11}$/.test(formData.cpf.replace(/\D/g, ""))) {
    //         newErrors.cpf = "CPF inválido";
    //     }

    //     if (!formData.phone) {
    //         newErrors.phone = "Telefone é obrigatório";
    //     } else if (!/^\d{10,11}$/.test(formData.phone.replace(/\D/g, ""))) {
    //         newErrors.phone = "Telefone inválido";
    //     }

    //     if (!formData.age) {
    //         newErrors.age = "Idade é obrigatória";
    //     } else if (Number(formData.age) < 18 || Number(formData.age) > 100) {
    //         newErrors.age = "Idade deve estar entre 18 e 100 anos";
    //     }

    //     setErrors(newErrors);
    //     return Object.keys(newErrors).length === 0;
    // }

    // function validateStep3() {
    //     const newErrors: FormErrors = {};

    //     if (!formData.otp) {
    //         newErrors.otp = "Código de verificação é obrigatório";
    //     } else if (formData.otp.length < 6) {
    //         newErrors.otp = "Código de verificação inválido";
    //     }

    //     setErrors(newErrors);
    //     return Object.keys(newErrors).length === 0;
    // }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();


        if (currentStep === 1) {
            const valid = await form.trigger(["name", "email", "password"])
            if (valid) {
                setCurrentStep(2)
            }
            return
        }

        if (currentStep === 2) {
            const valid = await form.trigger(["cpf", "phone", "age"])
            if (valid) {
                setShowAlert(true)
            }
            return
        }

        if (currentStep === 3) {
            const valid = await form.trigger("otp")
            if (!valid) return

            setIsLoading(true)
            const { otp } = form.getValues()
            verifyOtpMutation.mutate({ otp })
        }
    }

    function handleConfirmRegister() {
        setShowAlert(false);
        setIsLoading(true);

        const data = form.getValues()

        registerMutation.mutate({
            name: data.name,
            email: data.email,
            password: data.password,
            cpf: data.cpf,
            phone: data.phone,
            age: data.age,
        });
    }

    return (
        <>
            <Helmet title="Cadastro" />
            <div className="min-h-screen flex items-center justify-center">
                <Card className="max-w-[680px] w-full p-12 sm:p-10 rounded-2xl">
                    {currentStep !== 3 && (
                        <div className="flex justify-between items-center mb-2">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Criar nova conta
                            </h1>
                        </div>
                    )}

                    {currentStep < 3 && (
                        <p className="text-sm text-muted-foreground mb-8">
                            {currentStep === 1
                                ? "Preencha seus dados de acesso"
                                : "Complete seu cadastro com informações adicionais"}
                        </p>
                    )}

                    <form onSubmit={onSubmit} className="space-y-6">
                        {currentStep === 1 && (
                            <div className="space-y-4">
                                <div className="space-y-2 w-96">
                                    <Label htmlFor="name">Nome completo</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Digite seu nome"
                                        {...form.register("name")}
                                    />
                                    {form.formState.errors.name && (
                                        <span className="text-xs text-red-500">
                                            {form.formState.errors.name.message}
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">E-mail</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Digite seu e-mail"
                                        {...form.register("email")}
                                    />
                                    {form.formState.errors.email && (
                                        <span className="text-xs text-red-500">
                                            {form.formState.errors.email.message}
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Senha</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Digite sua senha"
                                        {...form.register("password")}
                                    />
                                    {form.formState.errors.password && (
                                        <span className="text-xs text-red-500">
                                            {form.formState.errors.password.message}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-4">
                                <div className="space-y-2 w-96">
                                    <Label htmlFor="cpf">CPF</Label>
                                    <Input
                                        id="cpf"
                                        type="text"
                                        placeholder="Digite seu CPF"
                                        {...form.register("cpf")}
                                    />
                                    {form.formState.errors.cpf && (
                                        <span className="text-xs text-red-500">
                                            {form.formState.errors.cpf.message}
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Telefone</Label>
                                    <Input
                                        id="phone"
                                        type="text"
                                        placeholder="Digite seu telefone"
                                        {...form.register("phone")}
                                    />
                                    {form.formState.errors.phone && (
                                        <span className="text-xs text-red-500">
                                            {form.formState.errors.phone.message}
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="age">Idade</Label>
                                    <Input
                                        id="age"
                                        type="number"
                                        placeholder="Digite sua idade"
                                        {...form.register("age")}
                                    />
                                    {form.formState.errors.age && (
                                        <span className="text-xs text-red-500">
                                            {form.formState.errors.age.message}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="space-y-2 w-96">
                                    <h2 className="text-xl font-semibold">Confirme que é você</h2>
                                    <p className="text-sm text-muted-foreground">
                                        Enviamos um código de verificação para o seu <strong>e-mail</strong>.
                                        Verifique sua caixa de entrada ou pasta de spam e insira o código abaixo
                                        para continuar.
                                    </p>
                                </div>


                                <div className="flex flex-col items-center space-y-4 ">
                                    <InputOTP
                                        maxLength={6}
                                        className="flex gap-2"
                                        {...form.register("otp")}
                                    >
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                        </InputOTPGroup>
                                        <InputOTPSeparator />
                                        <InputOTPGroup>
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                    {form.formState.errors.otp && (
                                        <span className="text-xs text-red-500">
                                            {form.formState.errors.otp.message}
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
                                    className="flex-1 mt-6"
                                    onClick={() => setCurrentStep(1)}
                                >
                                    Voltar
                                </Button>
                            )}

                            <Button
                                disabled={isLoading}
                                type="submit"
                                className="flex-1 h-10 relative overflow-hidden group mt-6"
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
                                                {currentStep < 3 ? (
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
                                                {currentStep < 3 ? "Próximo" : "Entrar"}
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
                                    className={`h-full bg-primary transition-all duration-500 ease-in-out ${currentStep >= 1 ? "w-full" : "w-0"
                                        }`}
                                />
                            </div>
                            <div className="flex-1 h-1 rounded-full overflow-hidden bg-muted">
                                <div
                                    className={`h-full bg-primary transition-all duration-500 ease-in-out ${currentStep >= 2 ? "w-full" : "w-0"
                                        }`}
                                />
                            </div>
                            <div className="flex-1 h-1 rounded-full overflow-hidden bg-muted">
                                <div
                                    className={`h-full bg-primary transition-all duration-500 ease-in-out ${currentStep >= 3 ? "w-full" : "w-0"
                                        }`}
                                />
                            </div>
                        </div>
                        <p className="text-xs text-center text-muted-foreground">
                            Etapa {currentStep} de 3
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

            <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirme o E-mail</AlertDialogTitle>
                        <AlertDialogDescription>
                            Você está indo para o último passo.
                            <br />
                            Confirme se o e-mail abaixo está correto, pois vamos enviar um código de verificação.
                            <br />
                            <br />
                            <div className="flex items-center gap-2"><MdMarkEmailRead size={20} className="text-emerald-600" /><strong className="text-sm text-bold text-black">{form.getValues("email")}</strong></div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button variant="outline" onClick={() => setShowAlert(false)}>
                            Voltar
                        </Button>
                        <Button onClick={handleConfirmRegister}>
                            Continuar
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
