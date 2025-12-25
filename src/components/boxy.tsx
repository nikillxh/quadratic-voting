import Image from "next/image"
import { useEffect, useState } from "react";

type ImageCardProps = {
    src: string;
    title: string;
};

export function Boxy({ src, title }: ImageCardProps) {
    const [size, setSize] = useState(300);

    useEffect(() => {
    const w = window.innerWidth;

    if (w < 1024) setSize(240);
    else setSize(300);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center mx-4 my-4 bg-yellow-200/10 rounded-lg p-4 border border-gray-400
        hover:bg-black/20 hover:border-2 transition duration-300 ease-in-out cursor-pointer">
            <Image src={src} alt="PikaPika" width={size} height={size} 
            className="my-auto"/>
            <pre className="pt-2">{title}</pre>
        </div>
    )
}