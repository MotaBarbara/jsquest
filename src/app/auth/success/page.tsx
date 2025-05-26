import Button from "@/src/components/button";

export default function AccountCreatedPage() {
  return (
    <main className="h-[100dvh]">
      <div className="h-[100%] flex flex-col items-center justify-center text-center">
        <h1 className="mb-6">Signup Successful</h1>
        <Button href="/" className="max-w-60!">
          Start your Journey
        </Button>
      </div>
    </main>
  );
}
