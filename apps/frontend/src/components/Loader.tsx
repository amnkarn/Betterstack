

export default function Loader() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950 select-none">

            <div className="relative flex flex-col items-center">
                <div className="h-10 w-10 rounded-lg bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)] animate-bounce [animation-duration:0.8s] flex items-center justify-center">
                    <div className="flex space-x-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-zinc-950 animate-pulse"></div>
                        <div className="h-1.5 w-1.5 rounded-full bg-zinc-950 animate-pulse"></div>
                    </div>
                </div>

                <div className="mt-2 h-1 w-6 rounded-full bg-emerald-950/60 blur-[1px] animate-pulse [animation-duration:0.8s]"></div>
            </div>

            <span className="mt-4 text-xs font-semibold tracking-[0.3em] uppercase text-emerald-400 pl-[0.3em] animate-pulse">
                Loading
            </span>

        </div>



    )
}