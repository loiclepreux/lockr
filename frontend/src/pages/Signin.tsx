import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../assets/images/logo.png";
import { AuthApi } from "../api/auth.api";
import { useAuthStore } from "../stores/useAuthStore";

interface ISigninInput {
    email: string;
    password: string;
}

const Signin = () => {
    const navigate = useNavigate();
    // login n'existe plus — on utilise setAccessToken et setUser séparément
    const setAccessToken = useAuthStore((state) => state.setAccessToken);
    const setUser = useAuthStore((state) => state.setUser);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ISigninInput>();

    const onSubmit: SubmitHandler<ISigninInput> = async (formData) => {
        try {
            const response = await AuthApi.signin({
                email: formData.email,
                password: formData.password,
            });

            // response.data contient { accessToken, user } via IResponse<AuthPayload>
            const { accessToken, user } = response.data;

            // On met à jour le store en deux étapes — plus de login() centralisé
            setAccessToken(accessToken);
            setUser(user);

            navigate("/dashboard");
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message || "Identifiants invalides";
                alert(message);
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 p-4">
            <div className="mb-8">
                <img
                    src={Logo}
                    alt="Logo"
                    className="w-24 h-24 object-contain animate-pulse [animation-duration:4s] scale-125"
                />
            </div>

            <div className="card bg-base-100 w-full max-w-sm shadow-2xl">
                <div className="card-body">
                    <h2 className="card-title justify-center text-2xl font-bold mb-4">
                        Lockr Login
                    </h2>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Email <span className="text-error">*</span>
                                </span>
                            </label>
                            <input
                                type="email"
                                placeholder="Email"
                                className={`input input-bordered ${errors.email ? "input-error" : ""}`}
                                {...register("email", { required: true })}
                            />
                            {errors.email?.type === "required" && (
                                <label className="label">
                                    <span className="label-text-alt text-error">
                                        Email is required
                                    </span>
                                </label>
                            )}
                        </div>

                        <div className="form-control mt-2">
                            <label className="label">
                                <span className="label-text">
                                    Password{" "}
                                    <span className="text-error">*</span>
                                </span>
                            </label>
                            <input
                                type="password"
                                placeholder="Password"
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
                        </div>

                        <div className="mt-2 text-sm">
                            <button
                                type="button"
                                className="link link-hover text-alt opacity-70"
                            >
                                Forgot password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary mt-6 w-full"
                        >
                            Login
                        </button>
                    </form>

                    <div className="divider text-xs uppercase opacity-50">
                        OR
                    </div>

                    <div className="text-center">
                        <Link to="/signup" className="link link-hover text-sm">
                            Create Account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signin;
