import { BrandLogo } from "@/components/global/brand-logo";
import { Button } from "@/components/global/button";
import { Container } from "@/components/global/container";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-white/85 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between gap-4">
        <BrandLogo href="/#top" />

        <nav className="hidden items-center gap-2 md:flex">
          <Button href="#how" variant="ghost">
            How it works
          </Button>
          <Button href="#features" variant="ghost">
            Features
          </Button>
          <Button href="#engine" variant="ghost">
            AI Engine
          </Button>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            href="/login?view=employee"
            variant="secondary"
            className="hidden sm:inline-flex"
          >
            Log in as employee
          </Button>
          <Button href="/signup">Sign up or sign in as employer</Button>
        </div>
      </Container>
    </header>
  );
}
