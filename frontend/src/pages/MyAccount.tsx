import Account from "../components/account/Account";

export default function MyAccount() {
    return (
        <main className="min-w-0 bg-[#0b0f14] text-white">
            <div className="px-4 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-10">
                <div className="max-w-6xl mx-auto">
                    <Account />
                </div>
            </div>
        </main>
    );
}
