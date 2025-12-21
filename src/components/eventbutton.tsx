import Link from "next/link";
import { ScrollText } from "lucide-react";

export default function EventsButton() {
    return (
        <div className="flex-1 justify-between px-4">
            <Link
                href="/events">
                <button
                className="w-full mx-auto bg-indigo-700 text-xl font-semibold p-4 rounded-2xl
                disabled:bg-blue-300/30 disabled:cursor-default disabled:text-gray-400
                hover:bg-indigo-500 active:bg-indigo-500 transition-all duration-100 cursor-pointer"
                >
                    <pre className="flex flex-row justify-center items-center gap-2">
                        <ScrollText className="w-5 h-5" />
                        Events
                    </pre>
                    
                </button>
            </Link>
        </div>
    );
}
