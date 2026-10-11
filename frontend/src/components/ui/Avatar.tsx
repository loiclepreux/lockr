type AvatarProps = {
    src?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    alt?: string;
    className?: string; // taille, bordure... (ex : "w-14 h-14 border-2 border-cyan-400")
    textClassName?: string; // taille des initiales (ex : "text-lg")
};

// Photo de profil, ou les initiales de la personne si elle n'a pas encore mis de photo
export default function Avatar({
    src,
    firstName,
    lastName,
    alt = "Photo de profil",
    className = "",
    textClassName = "text-lg",
}: AvatarProps) {
    if (src) {
        return <img src={src} alt={alt} className={`rounded-full object-cover ${className}`} />;
    }

    const initials =
        `${firstName?.trim()?.[0] ?? ""}${lastName?.trim()?.[0] ?? ""}`.toUpperCase() || "?";

    return (
        <div
            className={`flex items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 font-bold text-white select-none ${className}`}
            role="img"
            aria-label={alt}
        >
            <span className={textClassName}>{initials}</span>
        </div>
    );
}
