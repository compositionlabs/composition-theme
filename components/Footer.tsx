import Container from "@/components/Container";
import config from "@/components/config";

export default function Footer() {
    return (
        <footer className="w-full flex flex-col justify-center items-center bg-background mt-24">
            <div className="w-full h-64">
                <Container>
                    <div className="flex flex-col gap-4">
                        <p className="text-primary text-lg">{config.footerText}</p>
                        {/* add link to privacy policy */}
                        <a href="/privacy.html" className="text-blue-500 underline text-md">Privacy Policy</a>
                    </div>
                </Container>
            </div>
        </footer>
    );
}