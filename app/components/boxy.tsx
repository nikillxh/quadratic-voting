import Image from "next/image"

type ImageCardProps = {
    src: string;
    title: string;
};

export function Boxy({ src, title }: ImageCardProps) {
    return (
        <div className="flex flex-col items-center justify-center mx-4 my-4 bg-yellow-200/10 rounded-lg p-4 border border-gray-400
        hover:bg-black/20 hover:border-2 transition duration-300 ease-in-out cursor-pointer">
            <Image src={src} alt="PikaPika" width={300} height={300} />
            <pre className="pt-2">{title}</pre>
        </div>
    )
}