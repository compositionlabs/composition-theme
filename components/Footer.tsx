import Container from "@/components/Container";
import config from "@/components/config";

export default function Footer() {
    return (
    <footer className="border-t border-gray-200 w-full py-4">
        <Container type="primary">
            <div className="flex flex-row justify-between pt-4">
                <p className="text-gray-400 text-sm">{config.footerText}</p>
            </div>
        </Container>
    </footer>
    );
}