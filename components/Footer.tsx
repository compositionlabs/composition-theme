import Container from "@/components/Container";
import config from "@/components/config";

export default function Footer() {
    return (
        <footer className="w-full flex flex-col justify-center items-center h-24 bg-secondary">
            <div className="w-full bg-primary h-96">
                <Container>
                    <p className="text-white text-lg">{config.footerText}</p>
                </Container>
            </div>
        </footer>
    );
}