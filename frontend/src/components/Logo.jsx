import { Link } from "react-router-dom";
import { Rocket } from "lucide-react";

export default function Logo({ variant = "dark", className = "" }) {
  const textColor = variant === "dark" ? "text-[#07111F]" : "text-white";
  return (
    <Link to="/" data-testid="logo-link" className={`group inline-flex items-center gap-2.5 ${className}`}>
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563EB] to-[#22D3EE] shadow-lg shadow-[#2563EB]/30">
        <Rocket className="h-5 w-5 text-white" strokeWidth={2.5} />
        <span className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#22D3EE] opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-60" />
      </span>
      <span className="flex flex-col leading-none">
        <span className={`font-heading text-lg font-extrabold tracking-tight ${textColor}`}>Dijital Roket</span>
        <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#22D3EE]">DR AI System</span>
      </span>
    </Link>
  );
}
