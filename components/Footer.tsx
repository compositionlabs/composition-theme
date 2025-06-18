import Container from "@/components/Container";
import config from "@/components/config";

export default function Footer() {
    return (
    <footer className="border-t border-gray-200 w-full">
        <div className="flex flex-row justify-between pt-4">
            <div className="flex flex-col justify-start footer-content gap-1">
                <p className="text-gray-500 font-mono text-[0.8em]">Noah Evers</p>
                <a href="mailto:noah@complabs.com" className="text-gray-500 font-mono text-[0.8em]">noah@complabs.com</a>
                <a href="https://www.linkedin.com/in/noahevers/" target="_blank" className="text-gray-500 font-mono text-[0.8em]">LinkedIn</a>
            </div>
            <div className="flex flex-col justify-end footer-content gap-1 text-right">
                <p className="text-gray-500 font-mono text-[0.8em]">Chinmay Shrivastava</p>
                <a href="mailto:chinmay@complabs.com" className="text-gray-500 font-mono text-[0.8em]">chinmay@complabs.com</a>
                <a href="https://www.linkedin.com/in/chinmay-shrivastava-42815b162/" target="_blank" className="text-gray-500 font-mono text-[0.8em]">LinkedIn</a>
            </div>
        </div>
    </footer>
    );
}