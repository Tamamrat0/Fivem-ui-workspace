import {
  useEffect,
  useState,
  type CSSProperties,
  type ComponentType,
} from "react";
import {
  AudioLines,
  GlassWater,
  Hamburger,
  Shield,
  ShieldX,
  WavesLadder,
  Zap,
} from "lucide-react";

type IconType = ComponentType<{ className?: string; style?: CSSProperties }>;

function IconBar({ Icon, value }: { Icon: IconType; value: number }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="relative">
      <Icon className="text-white/20" />
      <Icon
        className="absolute inset-0 text-white transition-[clip-path] duration-500 ease-out"
        style={{ clipPath: `inset(${100 - clamped}% 0 0 0)` }}
      />
    </div>
  );
}

function ArmorBadge({
  level,
  durability,
}: {
  level: number;
  durability: number;
}) {
  const isWearing = level > 0;
  const clamped = Math.max(0, Math.min(100, durability));
  const isBroken = isWearing && clamped <= 0;
  const isCritical = isWearing && clamped > 0 && clamped <= 10;
  const isLow = isWearing && clamped > 10 && clamped < 40;

  const fillColor = !isWearing
    ? "text-white/40"
    : isBroken
      ? "text-red-500"
      : isCritical
        ? "text-red-500"
        : isLow
          ? "text-orange-400"
          : "text-white";

  return (
    <div className="relative inline-flex">
      <Shield className="w-6 h-6 text-white/20" />
      {isBroken ? (
        <ShieldX
          className={`absolute inset-0 w-6 h-6 transition-colors duration-300 ${fillColor}`}
        />
      ) : (
        <>
          <Shield
            className={`absolute inset-0 w-6 h-6 transition-[clip-path,color] duration-500 ease-out ${fillColor}`}
            style={{ clipPath: `inset(${100 - clamped}% 0 0 0)` }}
          />
          <span
            className={`absolute inset-0 flex items-center justify-center text-[10px] font-bold leading-none pt-0.5 transition-colors duration-300 ${fillColor}`}
          >
            {isWearing ? level : "-"}
          </span>
        </>
      )}
    </div>
  );
}

const screenClass = "fixed inset-0 overflow-hidden font-sans text-slate-50";

export default function App() {
  const [stamina, setStamina] = useState(60);
  const [blood, setBlood] = useState(80);
  const [food, setFood] = useState(70);
  const [thirst, setThirst] = useState(70);
  const [voice] = useState(70);
  const [armor, setArmor] = useState(70);
  const [armorLevel] = useState(2);
  const [wearingArmor, setWearingArmor] = useState(true);
  const [energy] = useState(50);
  const [oxygen, setOxygen] = useState<number | null>(70);
  const [playerId] = useState(() =>
    Math.floor(1000 + Math.random() * 9000).toString(),
  );

  // function randomize() {
  //   const r = () => Math.round(Math.random() * 100);
  //   setStamina(r());
  //   setBlood(r());
  //   setFood(r());
  //   setThirst(r());
  //   setVoice(r());
  //   setEnergy(r());
  //   setArmorLevel(1 + Math.floor(Math.random() * 3));
  // }

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log(event);
      const data = event.data;
      console.log(data);
      if (!data || data.action !== "update_hud") return;

      console.log("[status_hud] update_hud", data);

      if (typeof data.hp === "number") setBlood(data.hp);
      if (typeof data.hunger === "number") setFood(data.hunger);
      if (typeof data.thirst === "number") setThirst(data.thirst);
      if (typeof data.armor === "number") {
        setArmor(data.armor);
        setWearingArmor(data.armor > 0);
      }
      if (data.oxygen === null) setOxygen(null);
      else if (typeof data.oxygen === "number") setOxygen(data.oxygen);
      if (typeof data.stamina === "number") setStamina(data.stamina);
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <main className={screenClass}>
      {/* HUD Player Statsu */}
      <div className="absolute bottom-0 left-[0.1vh] w-100 flex flex-col z-20">
        {/* ID Badge */}
        <div className="flex justify-end pb-1">
          <span className="rounded-sm bg-black/50 px-2 py-0.5 text-[11px] font-mono tracking-wider text-white/80">
            ID: {playerId}
          </span>
        </div>

        {/* Status */}
        <div className="w-full flex bg-black/40 rounded-t-sm h-10 p-2 justify-between">
          <div className="flex gap-2 items-center text-white">
            <ArmorBadge
              level={wearingArmor ? armorLevel : 0}
              durability={armor}
            />
            <div className="w-px h-5 bg-white/20" />
            {oxygen !== null && <IconBar Icon={WavesLadder} value={oxygen} />}
            {energy !== null && <IconBar Icon={Zap} value={energy} />}
          </div>
          <div className="flex items-center gap-2 text-white">
            <IconBar Icon={Hamburger} value={food} />
            <IconBar Icon={GlassWater} value={thirst} />
            <IconBar Icon={AudioLines} value={voice} />
          </div>
        </div>

        {/* stamina Status */}
        <div
          className="relative w-full h-1 overflow-hidden"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, rgba(255,255,255,0.08) 0 2px, transparent 2px 6px)",
            backgroundColor: "rgba(255,255,255,0.05)",
          }}
        >
          <div
            className={`h-full bg-orange-500/80 transition-[width] duration-500 ease-out ${
              stamina > 0 && stamina < 20 ? "animate-pulse" : ""
            }`}
            style={{ width: `${stamina}%` }}
          />
        </div>

        {/* Blood */}
        <div
          className="relative w-full h-6 rounded-b-sm overflow-hidden"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, rgba(255,255,255,0.08) 0 2px, transparent 2px 6px)",
            backgroundColor: "rgba(0,0,0,0.4)",
          }}
        >
          <div
            className="h-full bg-blue-500/80 transition-[width] duration-500 ease-out"
            style={{ width: `${blood}%` }}
          />
        </div>

        {/* <div className="mt-4 flex flex-col gap-2 rounded-sm bg-black/40 p-3 text-xs text-white">
          <button
            type="button"
            onClick={randomize}
            className="self-start rounded-sm bg-white/10 px-3 py-1.5 hover:bg-white/20"
          >
            Random
          </button>

          <label className="flex items-center gap-2 select-none">
            <input
              type="checkbox"
              checked={wearingArmor}
              onChange={(e) => {
                const next = e.target.checked;
                setWearingArmor(next);
                if (!next) setArmor(0);
              }}
            />
            <span>ใส่เกราะ</span>
          </label>

          <label className="flex items-center gap-2">
            <span className="w-20 text-white/70">Armor: {armor}%</span>
            <input
              type="range"
              min={0}
              max={100}
              value={armor}
              onChange={(e) => setArmor(Number(e.target.value))}
              disabled={!wearingArmor}
              className="flex-1 disabled:opacity-40"
            />
          </label>
        </div> */}
      </div>
    </main>
  );
}
