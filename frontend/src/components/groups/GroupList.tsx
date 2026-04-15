import GroupCard from "./GroupCard";
import type { IGroup } from "../../types/IGroup";

interface GroupListProps {
    title: string;
    groups: IGroup[];
}

export default function GroupList({ title, groups }: GroupListProps) {
    return (
        <section className="flex flex-col gap-5">
            <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-4">
                <h2 className="text-white font-semibold text-xl tracking-wide">
                    {title}
                </h2>

                <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/20">
                    {groups.length} groupe{groups.length > 1 ? "s" : ""}
                </span>
            </div>

            {groups.length === 0 ? (
                <div className="rounded-2xl border border-white/5 bg-[#0f1115] p-6 text-center">
                    <p className="text-sm text-gray-400">
                        Aucun groupe pour le moment.
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {groups.map((group) => (
                        <GroupCard
                            key={group.id}
                            id={group.id}
                            name={group.name}
                            description={group.description}
                            membersCount={group.membersCount}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
