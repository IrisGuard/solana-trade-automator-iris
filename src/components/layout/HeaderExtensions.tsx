
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { WalletButton } from "@/components/wallet/WalletButton";
import { Link } from "@/components/ui/link";

export function HeaderExtensions() {
  return (
    <div className="flex items-center gap-2">
      <Link href="/wallet" className="mr-2">
        <WalletButton />
      </Link>
      <ThemeToggle />
    </div>
  );
}
