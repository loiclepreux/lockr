// Remplace les imports existants par ceux-ci
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../assets/images/logo.png";
import { AuthApi } from "../api/auth.api";
import type { SignupData } from "../types/auth.types";

type SignupFormData = SignupData & { confirmPassword: string };

const Signup = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<SignupFormData>();

    const passwordValue = watch("password", "");

    const handleForm: SubmitHandler<SignupFormData> = async (data) => {
        setIsLoading(true);
        setErrorMessage(null);

        try {
            // On construit signupData directement sans extraire confirmPassword
            const signupData = {
                email: data.email,
                password: data.password,
                firstName: data.firstName,
                lastName: data.lastName,
                // si le champ est rempli → il est ajouté à l'objet. Si il est vide → il est ignoré. C'est tout.
                ...(data.phone && { phone: data.phone }),
                ...(data.address && { address: data.address }),
            };
            await AuthApi.signup(signupData);

            // Inscription réussie — on redirige vers le signin
            // L'utilisateur doit se connecter avec ses nouveaux identifiants
            navigate("/signin");
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                if (status === 409) {
                    // 409 Conflict = email déjà utilisé (ConflictException NestJS)
                    setErrorMessage("Cette adresse email est déjà utilisée.");
                } else if (status === 400) {
                    // 400 Bad Request = validation DTO échouée
                    setErrorMessage("Données invalides. Vérifiez les champs.");
                } else {
                    setErrorMessage("Une erreur est survenue. Réessayez.");
                }
            }
        } finally {
            // finally s'exécute toujours — qu'il y ait erreur ou succès
            setIsLoading(false);
        }
    };

    const getPasswordStrength = () => {
        if (!passwordValue)
            return { val: 0, color: "progress-error", label: "Empty" };
        const criteria = [
            passwordValue.length >= 8,
            /[A-Z]/.test(passwordValue),
            /[0-9]/.test(passwordValue),
            /[@$!%*?&.]/.test(passwordValue),
        ];
        const score = criteria.filter(Boolean).length;
        if (score <= 1)
            return { val: 25, color: "progress-error", label: "Weak" };
        if (score === 2)
            return { val: 50, color: "progress-warning", label: "Medium" };
        if (score === 3)
            return { val: 75, color: "progress-info", label: "Strong" };
        return { val: 100, color: "progress-success", label: "Very Strong" };
    };

    const strength = getPasswordStrength();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 p-4">
            <div className="mb-8">
                <img
                    src={Logo}
                    alt="Logo"
                    className="w-24 h-24 object-contain animate-pulse [animation-duration:4s] scale-125"
                />
            </div>

            <div className="card bg-base-100 w-full max-w-2xl shadow-2xl">
                <div className="card-body">
                    <h2 className="card-title justify-center text-2xl font-bold mb-6">
                        Lockr Register
                    </h2>
                    {/* Message d'erreur global — s'affiche si l'API retourne une erreur */}
                    {errorMessage && (
                        <div className="alert alert-error mb-4">
                            <span>{errorMessage}</span>
                        </div>
                    )}
                    <form onSubmit={handleSubmit(handleForm)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <h3 className="font-semibold opacity-70 border-b pb-2 mb-4">
                                    Personal Info
                                </h3>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">
                                            First Name{" "}
                                            <span className="text-error">
                                                *
                                            </span>
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        className={`input input-bordered ${errors.firstName ? "input-error" : ""}`}
                                        {...register("firstName", {
                                            required: true,
                                        })}
                                    />
                                    {errors.firstName && (
                                        <label className="label">
                                            <span className="label-text-alt text-error">
                                                First name is required
                                            </span>
                                        </label>
                                    )}
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">
                                            Last Name{" "}
                                            <span className="text-error">
                                                *
                                            </span>
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        className={`input input-bordered ${errors.lastName ? "input-error" : ""}`}
                                        {...register("lastName", {
                                            required: true,
                                        })}
                                    />
                                    {errors.lastName && (
                                        <label className="label">
                                            <span className="label-text-alt text-error">
                                                Last name is required
                                            </span>
                                        </label>
                                    )}
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">
                                            Phone Number
                                        </span>
                                    </label>
                                    <input
                                        type="tel"
                                        className="input input-bordered"
                                        {...register("phone")}
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">
                                            Address
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        className="input input-bordered"
                                        {...register("address")}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="font-semibold opacity-70 border-b pb-2 mb-4">
                                    Account Details
                                </h3>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">
                                            Email{" "}
                                            <span className="text-error">
                                                *
                                            </span>
                                        </span>
                                    </label>
                                    <input
                                        type="email"
                                        className={`input input-bordered ${errors.email ? "input-error" : ""}`}
                                        {...register("email", {
                                            required: true,
                                        })}
                                    />
                                    {errors.email && (
                                        <label className="label">
                                            <span className="label-text-alt text-error">
                                                Email is required
                                            </span>
                                        </label>
                                    )}
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">
                                            Password{" "}
                                            <span className="text-error">
                                                *
                                            </span>
                                        </span>
                                    </label>
                                    <input
                                        type="password"
                                        className={`input input-bordered ${errors.password ? "input-error" : ""}`}
                                        {...register("password", {
                                            required: true,
                                            minLength: 8,
                                        })}
                                    />
                                    {errors.password?.type === "required" && (
                                        <label className="label">
                                            <span className="label-text-alt text-error">
                                                Password is required
                                            </span>
                                        </label>
                                    )}
                                    {errors.password?.type === "minLength" && (
                                        <label className="label">
                                            <span className="label-text-alt text-error">
                                                Minimum 8 characters
                                            </span>
                                        </label>
                                    )}
                                    <div className="mt-2 space-y-1 px-1">
                                        <progress
                                            className={`progress ${strength.color} w-full h-1`}
                                            value={strength.val}
                                            max="100"
                                        ></progress>
                                        <div className="flex justify-between text-[10px] uppercase font-bold opacity-70">
                                            <span>Force</span>
                                            <span
                                                className={strength.color.replace(
                                                    "progress-",
                                                    "text-",
                                                )}
                                            >
                                                {strength.label}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">
                                            Confirm Password{" "}
                                            <span className="text-error">
                                                *
                                            </span>
                                        </span>
                                    </label>
                                    <input
                                        type="password"
                                        className={`input input-bordered ${errors.confirmPassword ? "input-error" : ""}`}
                                        {...register("confirmPassword", {
                                            required: true,
                                            validate: (val) =>
                                                val === passwordValue ||
                                                "Les mots de passe ne correspondent pas",
                                        })}
                                    />
                                    {errors.confirmPassword?.type ===
                                        "required" && (
                                        <label className="label">
                                            <span className="label-text-alt text-error">
                                                Password confirmation is
                                                required
                                            </span>
                                        </label>
                                    )}
                                    {errors.confirmPassword?.type ===
                                        "validate" && (
                                        <label className="label">
                                            <span className="label-text-alt text-error">
                                                {errors.confirmPassword.message}
                                            </span>
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full mt-8"
                            disabled={isLoading}
                        >
                            {isLoading ? "Creating account..." : "Register"}
                        </button>
                    </form>

                    <div className="divider text-xs uppercase opacity-50 mt-6">
                        OR
                    </div>
                    <div className="text-center">
                        <Link to="/signin" className="link link-hover text-sm">
                            I already have an account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
