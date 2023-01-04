export default function BouncingArrow() {
    return (
        <div class="animate-bounce bg-white dark:bg-slate-800 p-2 w-10 h-10 ring-1 mt-28 ring-slate-900/5 dark:ring-slate-200/20 shadow-lg rounded-full flex items-center justify-center cursor-pointer">
            <svg class="w-6 h-6 text-blue-500 hover:text-blue-700" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
        </div>
    )
}