import Container from "@/components/Container";
import config from "@/components/config";

export default function Footer() {
    return (
    <footer className="border-t border-gray-500 w-full">
        <div className="flex flex-row justify-between p-4">
            <div className="flex flex-col justify-start footer-content gap-1">
                <p className="text-gray-300 font-mono text-xs">Noah Evers</p>
                <a href="mailto:noah@composition-labs.com" className="text-gray-300 font-mono text-xs">noah@complabs.co</a>
                <a href="https://www.linkedin.com/in/noahevers/" target="_blank" className="text-gray-300 font-mono text-xs">LinkedIn</a>
            </div>
            <div className="flex flex-col justify-end footer-content gap-1 text-right">
                <p className="text-gray-300 font-mono text-xs">Chinmay Shrivastava</p>
                <a href="mailto:chinmay@composition-labs.com" className="text-gray-300 font-mono text-xs">chinmay@complabs.co</a>
                <a href="https://www.linkedin.com/in/chinmay-shrivastava-42815b162/" target="_blank" className="text-gray-300 font-mono text-xs">LinkedIn</a>
            </div>
        </div>
    </footer>
    );
}