export function SiteBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-void" />
      <div className="absolute -top-[28rem] left-1/2 h-[54rem] w-[80rem] -translate-x-1/2 rounded-full bg-signal/[0.09] blur-[140px]" />
      <div className="absolute -right-40 top-[22%] h-[34rem] w-[34rem] rounded-full bg-iris/[0.06] blur-[120px]" />
      <div className="absolute -left-48 top-[55%] h-[30rem] w-[30rem] rounded-full bg-aqua/[0.045] blur-[120px]" />
      <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_75%_55%_at_50%_0%,black_10%,transparent_85%)]" />
      <div className="noise-overlay absolute inset-0" />
    </div>
  );
}
