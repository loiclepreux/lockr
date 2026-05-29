import { useState } from "react";
import {
    Calendar,
    Lock,
    Mail,
    MapPin,
    Pencil,
    Phone,
    ShieldCheck,
    Trash2,
    User,
} from "lucide-react";
import foto from "../../assets/images/photo.png";
import EditProfileModal from "./ModalProfile";
import ChangePasswordModal from "./ModalPassword";
import ChangePhotoModal from "./ModalPhoto";
import ConfirmAlert from "./ModalDelete";
import { useQuery } from "@tanstack/react-query";
import { AuthApi } from "../../api/auth.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserApi } from "../../api/user.api";

export default function Account() {
    const queryClient = useQueryClient();

    const { data: meResponse, isLoading } = useQuery({
        queryKey: ["me"],
        queryFn: AuthApi.me,
    });

    const user = meResponse?.data;
    const profile = user?.profile;

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isPasswordOpen, setIsPasswordOpen] = useState(false);
    const [isPhotoOpen, setIsPhotoOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const updateUserMutation = useMutation({
        mutationFn: (data: {
            email: string;
            phoneNumber: string;
            address: string;
        }) => {
            if (!user?.id) {
                throw new Error("Utilisateur introuvable");
            }

            return UserApi.updateUser(user.id, data);
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["me"],
            });
        },
    });

    const uploadPhotoMutation = useMutation({
        mutationFn: UserApi.uploadPhoto,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["me"],
            });

            setIsPhotoOpen(false);
        },
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full text-white">
                Chargement du profil...
            </div>
        );
    }

    const handleChangePhoto = () => {
        setIsPhotoOpen(true);
    };

    const API_URL = import.meta.env.VITE_API_URL.replace(/\/$/, "");

    const profileImage = profile?.imgUrl
        ? `${API_URL}${profile.imgUrl}?v=${user?.updatedAt ?? ""}`
        : foto;

    return (
        <section className="w-full h-full">
            <div className="w-full h-full bg-[#0f1115] border border-cyan-500/10 rounded-2xl shadow-[0_0_30px_rgba(0,255,255,0.04)] p-6 md:p-8">
                {/* Header du compte */}
                <div className="flex justify-between items-center border-b border-white/5 pb-6 mb-6">
                    <div>
                        <h2 className="text-3xl font-bold tracking-wide text-white">
                            Mon compte
                        </h2>
                        <p className="text-sm text-gray-400 mt-2">
                            Consultez et gérez vos informations personnelles.
                        </p>
                    </div>

                    <div className="flex flex-col items-center lg:items-start">
                        <div className="relative w-32 h-32">
                            <img
                                src={profileImage}
                                alt="Photo de profil"
                                className="w-full h-full rounded-full object-cover border-2 border-cyan-400"
                            />

                            <button
                                onClick={handleChangePhoto}
                                className="absolute bottom-1 right-2 w-8 h-8 bg-cyan-500 border-2 border-[#0f1115] rounded-full flex items-center justify-center text-black font-bold shadow-lg hover:bg-cyan-400 transition cursor-pointer"
                            >
                                +
                            </button>
                        </div>

                        {/* Modale dédié a la modification de la photo*/}
                        <ChangePhotoModal
                            isOpen={isPhotoOpen}
                            onClose={() => setIsPhotoOpen(false)}
                            onSubmit={(file) => {
                                if (!file) return;

                                uploadPhotoMutation.mutate(file);
                            }}
                        />

                        <div className="mt-4 text-center lg:text-left">
                            <h3 className="text-2xl font-bold text-white">
                                {profile?.firstName ?? "Prénom"}{" "}
                                {profile?.lastName ?? "Nom"}
                            </h3>
                            <p className="text-sm text-cyan-400 mt-1">
                                Espace personnel Lockr
                            </p>
                        </div>
                    </div>
                </div>

                {/* information utilisateur */}
                <div className="flex flex-col lg:flex-row gap-8 mb-8">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Carte: Nom */}
                        <div className="rounded-xl border border-white/5 bg-white/200 p-4">
                            <div className="flex items-center justify-between mb-2 text-cyan-400">
                                <div className="flex items-center gap-3">
                                    <User size={20} />
                                    <span className="text-sm font-semibold">
                                        Nom
                                    </span>
                                </div>
                                <Lock size={18} className="text-gray-500" />
                            </div>
                            <p className="text-white">
                                {profile?.lastName ?? "Non renseigné"}
                            </p>
                        </div>

                        {/* Carte: Prénom */}
                        <div className="rounded-xl border border-white/5 bg-white/200 p-4">
                            <div className="flex items-center justify-between mb-2 text-cyan-400">
                                <div className="flex items-center gap-3">
                                    <User size={20} />
                                    <span className="text-sm font-semibold">
                                        Prénom
                                    </span>
                                </div>
                                <Lock size={18} className="text-gray-500" />
                            </div>
                            <p className="text-white">
                                {profile?.firstName ?? "Non renseigné"}
                            </p>
                        </div>

                        {/* Carte: Email */}
                        <div className="rounded-xl border border-white/5 bg-white/200 p-4">
                            <div className="flex items-center gap-3 mb-2 text-cyan-400">
                                <Mail size={20} />
                                <span className="text-sm font-semibold">
                                    Email
                                </span>
                            </div>
                            <p className="text-white break-all">
                                {user?.email ?? "Non renseigné"}
                            </p>
                        </div>

                        {/* Carte: Téléphone */}
                        <div className="rounded-xl border border-white/5 bg-white/200 p-4">
                            <div className="flex items-center gap-3 mb-2 text-cyan-400">
                                <Phone size={20} />
                                <span className="text-sm font-semibold">
                                    Téléphone
                                </span>
                            </div>
                            <p className="text-white">
                                {profile?.phoneNumber ?? "Non renseigné"}
                            </p>
                        </div>

                        {/* Carte: Adresse */}
                        <div className="rounded-xl border border-white/5 bg-white/200 p-4 md:col-span-2">
                            <div className="flex items-center gap-3 mb-2 text-cyan-400">
                                <MapPin size={20} />
                                <span className="text-sm font-semibold">
                                    Adresse
                                </span>
                            </div>
                            <p className="text-white">
                                {profile?.address ?? "Non renseignée"}
                            </p>
                        </div>

                        {/* Carte: mot de passe */}
                        <div className="rounded-xl border border-white/5 bg-white/200 p-4 md:col-span-2">
                            <div className="flex items-center justify-between mb-2 text-cyan-400">
                                <div className="flex items-center gap-3">
                                    <Lock size={20} />
                                    <span className="text-sm font-semibold">
                                        Mot de passe
                                    </span>
                                </div>
                                <Pencil
                                    size={20}
                                    onClick={() => setIsPasswordOpen(true)}
                                    className="cursor-pointer hover:text-cyan-300 transition"
                                />
                            </div>

                            {/* Modale de modification de mot de passe */}
                            <ChangePasswordModal
                                isOpen={isPasswordOpen}
                                onClose={() => setIsPasswordOpen(false)}
                                onSubmit={(data) => {
                                    console.log("Mot de passe modifié :", data);
                                }}
                            />
                            <p className="text-white tracking-widest">
                                **************
                            </p>
                        </div>

                        {/* Carte: Date de creation du compte */}
                        <div className="rounded-xl border border-white/5 bg-white/200 p-4 md:col-span-2">
                            <div className="flex items-center justify-between mb-2 text-cyan-400">
                                <div className="flex items-center gap-3">
                                    <Calendar size={20} />
                                    <span className="text-sm font-semibold">
                                        Date de création du compte
                                    </span>
                                </div>
                                <Lock
                                    size={18}
                                    className="text-gray-500 opacity-70"
                                />
                            </div>
                            <p className="text-white">
                                {user?.createdAt
                                    ? new Date(
                                          user.createdAt,
                                      ).toLocaleDateString("fr-FR")
                                    : "Non renseignée"}
                            </p>
                        </div>

                        {/* Carte: Status d'authentification a 2 facteurs */}
                        <div className="rounded-xl border border-white/5 bg-white/200 p-4 md:col-span-2">
                            <div className="flex items-center justify-between mb-2 text-cyan-400">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck size={20} />
                                    <span className="text-sm font-semibold">
                                        Authentification à deux facteurs
                                    </span>
                                </div>
                                <Lock
                                    size={18}
                                    className="text-gray-500 opacity-70"
                                />
                            </div>
                            <p
                                className={`${user.twoFactorEnabled ? "text-green-400" : "text-red-400"}`}
                            >
                                {user.twoFactorEnabled
                                    ? "Activée"
                                    : "Désactivée"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Actions Principales*/}
                <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row gap-4 sm:justify-end">
                    {/* Action : modifier le profil */}
                    <button
                        onClick={() => setIsEditOpen(true)}
                        className="inline-flex items-center justify-center gap-3 rounded-xl px-5 py-3 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300 transition-all duration-300"
                    >
                        <Pencil size={20} />
                        <span>Modifier le profil</span>
                    </button>

                    {/* Modale de modification des informations personnelles */}
                    {isEditOpen && user && (
                        <EditProfileModal
                            user={user}
                            onClose={() => setIsEditOpen(false)}
                            onSubmit={(data) => {
                                updateUserMutation.mutate({
                                    email: data.email,
                                    phoneNumber: data.telephone,
                                    address: data.adresse,
                                });
                            }}
                        />
                    )}

                    {/* Action : supprimer le profil */}
                    <button
                        onClick={() => setConfirmOpen(true)}
                        className="inline-flex items-center justify-center gap-3 rounded-xl px-5 py-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-300"
                    >
                        <Trash2 size={20} />
                        <span>Supprimer le profil</span>
                    </button>

                    {/* Confirmation avant suppression définitive du profil */}
                    <ConfirmAlert
                        isOpen={confirmOpen}
                        onClose={() => setConfirmOpen(false)}
                        onConfirm={() => {
                            console.log("Profil supprimé");
                            setConfirmOpen(false);
                        }}
                        title="Supprimer le profil"
                        message="Cette action est irréversible. Êtes-vous sûr ?"
                    />
                </div>
            </div>
        </section>
    );
}
