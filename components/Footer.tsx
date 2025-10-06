import Container from "@/components/Container";
import config from "@/components/config";

export default function Footer() {
    return (
    <footer className="w-full">
        <Container type="footer">
            <div className="flex flex-row justify-between">
                <p className="text-gray-400 text-sm">{config.footerText}</p>
            </div>
        </Container>
    </footer>
    );
}