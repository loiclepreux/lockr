interface GroupCardProps {
    name: string;
    description: string;
    membersCount: number;
}

export default function GroupCard({
    name,
    description,
    membersCount,
}: GroupCardProps) {
    return (
        <div className="group rounded-2xl border border-white/5 bg-[#0f1115] p-4 flex items-center justify-between hover:border-cyan-500/20 hover:bg-cyan-500/[0.03] hover:shadow-[0_0_25px_rgba(0,255,255,0.04)] transition-all duration-200 cursor-pointer">
            <div className="flex items-center gap-4 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-lg shrink-0 transition group-hover:bg-cyan-500/15">
                    {name.charAt(0).toUpperCase()}
                </div>

                <div className="flex flex-col min-w-0">
                    <span className="text-white font-medium text-sm truncate">
                        {name}
                    </span>
                    <span className="text-gray-400 text-xs truncate">
                        {description}
                    </span>
                </div>
            </div>

            <span className="ml-4 px-3 py-1 rounded-full bg-white/[0.03] border border-white/5 text-gray-400 text-xs shrink-0">
                {membersCount} {membersCount > 1 ? "membres" : "membre"}
            </span>
        </div>
    );
}
