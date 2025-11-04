import Container from "@/components/Container";
import config from "@/components/config";

export default function Footer() {
    return (
    <footer className="w-full py-4">
        <Container type="footer">
            <div className="flex flex-row justify-between">
                <p className="text-white text-sm">{config.footerText}</p>
            </div>
        </Container>
    </footer>
    );
}