export function BetaBanner() {
  return (
    <div className="overflow-x-hidden border-b border-accent/20 bg-gradient-to-r from-accent-soft/80 to-cream-100 px-4 py-2 text-center text-xs font-medium leading-snug text-navy-900 sm:text-sm">
      <span className="mr-2 inline-flex rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
        Beta
      </span>
      Beta sürüm — güvenliğiniz için kapora göndermeden önce ilan sahibini doğrulayın.
    </div>
  );
}
