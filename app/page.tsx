import Link from "next/link";

export default function Home() {
  return (
    <main className="w-full h-full items-center justify-center p-20">
     <Link href='/auth/login'>Log In</Link>
    </main>
  );
}