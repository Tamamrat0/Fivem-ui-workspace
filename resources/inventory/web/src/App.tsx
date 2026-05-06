import {
  useEffect,
  useState,
  type CSSProperties,
  type ComponentType,
} from "react";
import { Button } from "@fivem/ui";
import {
  AudioLines,
  GlassWater,
  Hamburger,
  Shield,
  ShieldX,
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

function VestIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="24"
      height="24"
    >
      <path d="M7 3 L10 4 L12 6 L14 4 L17 3 L20 6 L20 9 L17 10 L17 21 L7 21 L7 10 L4 9 L4 6 Z" />
    </svg>
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
  const isLow = isWearing && clamped > 0 && clamped < 40;

  const fillColor = !isWearing
    ? "text-white/40"
    : isBroken
      ? "text-red-500"
      : isLow
        ? "text-orange-400"
        : "text-white";

  if (isBroken) {
    return (
      <div className="relative inline-flex">
        <ShieldX className="w-6 h-6 text-red-500" />
      </div>
    );
  }

  return (
    <div className="relative inline-flex">
      <Shield className="w-6 h-6 text-white/20" />
      <Shield
        className={`absolute inset-0 w-6 h-6 transition-[clip-path,color] duration-500 ease-out ${fillColor}`}
        style={{ clipPath: `inset(${100 - clamped}% 0 0 0)` }}
      />
      <span
        className={`absolute inset-0 flex items-center justify-center text-[10px] font-bold leading-none pt-1 transition-colors duration-300 ${fillColor}`}
      >
        {isWearing ? level : "-"}
      </span>
    </div>
  );
}

type ModalPhase = "open" | "closing" | "closed";

const DESIGN_WIDTH = 520;
const DESIGN_HEIGHT = 320;
const SAFE_PADDING = 32;
const MODAL_ANIMATION_MS = 180;
const BACKGROUND_IMAGE =
  "https://c4.wallpaperflare.com/wallpaper/294/874/398/grand-theft-auto-v-sunset-sea-city-wallpaper-preview.jpg";

const screenClass =
  "fixed inset-0 overflow-hidden bg-[#050807] font-sans text-slate-50";

const backgroundClass =
  "absolute inset-0 bg-cover bg-center transition-[filter,brightness] duration-300 ease-out z-10";

const viewportClass = "relative z-10 grid h-full w-full place-items-center p-8";

const modalPanelClass = [
  "relative flex flex-col justify-between overflow-hidden rounded-md bg-black/80",
  "backdrop-blur-sm",
  "transition-[opacity,transform] duration-200 ease-out",
].join(" ");

const modalHeaderClass =
  "relative flex h-14.5 items-center gap-2.5 border-b border-white/10 px-6";

const modalBodyClass = "relative px-8 pb-4.5 pt-5.5";
const modalTextClass = "m-0 max-w-97.5 text-[15px] leading-7 text-slate-200/70";
const modalActionsClass = "relative flex justify-end gap-2.5 px-6 pb-6 pt-5.5";

function getViewportScale() {
  const widthScale = (window.innerWidth - SAFE_PADDING * 2) / DESIGN_WIDTH;
  const heightScale = (window.innerHeight - SAFE_PADDING * 2) / DESIGN_HEIGHT;

  return Math.min(1, widthScale, heightScale);
}

export default function App() {
  const [modalPhase, setModalPhase] = useState<ModalPhase>("open");
  const [scale, setScale] = useState(() => getViewportScale());
  const [stamina, setStamina] = useState(60);
  const [blood, setBlood] = useState(80);
  const [food, setFood] = useState(70);
  const [thirst, setThirst] = useState(70);
  const [voice, setVoice] = useState(70);
  const [armor, setArmor] = useState(70);
  const [armorLevel, setArmorLevel] = useState(2);
  const [wearingArmor, setWearingArmor] = useState(true);
  const [energy, setEnergy] = useState(70);
  const [playerId] = useState(() =>
    Math.floor(1000 + Math.random() * 9000).toString(),
  );

  function randomize() {
    const r = () => Math.round(Math.random() * 100);
    setStamina(r());
    setBlood(r());
    setFood(r());
    setThirst(r());
    setVoice(r());
    setEnergy(r());
    setArmorLevel(1 + Math.floor(Math.random() * 3));
  }

  const isModalVisible = modalPhase !== "closed";
  const isModalAnimatingOut = modalPhase === "closing";

  useEffect(() => {
    const updateScale = () => setScale(getViewportScale());

    updateScale();
    window.addEventListener("resize", updateScale);

    return () => window.removeEventListener("resize", updateScale);
  }, []);

  function openModal() {
    setModalPhase("open");
  }

  function closeModal() {
    setModalPhase("closing");
    window.setTimeout(() => setModalPhase("closed"), MODAL_ANIMATION_MS);
  }

  return (
    <main className={screenClass}>
      <div
        className={[
          backgroundClass,
          // isModalVisible ? "blur-sm brightness-75" : "blur-0 brightness-100",
        ].join(" ")}
        style={{
          backgroundImage: `url(${BACKGROUND_IMAGE})`,
        }}
      />

      {/* HUD Player Statsu */}
      <div className="relative w-100 flex flex-col z-20 m-4">
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
            <IconBar Icon={Zap} value={energy} />
          </div>
          <div className="flex items-center gap-2 text-white">
            <IconBar Icon={Hamburger} value={food} />
            <IconBar Icon={GlassWater} value={thirst} />
            <IconBar Icon={AudioLines} value={voice} />
          </div>
        </div>

        {/* Run Status */}
        <div
          className="relative w-full h-1 overflow-hidden"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, rgba(255,255,255,0.08) 0 2px, transparent 2px 6px)",
            backgroundColor: "rgba(255,255,255,0.05)",
          }}
        >
          <div
            className="h-full bg-orange-500/80 transition-[width] duration-500 ease-out"
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

        <div className="mt-4 flex flex-col gap-2 rounded-sm bg-black/40 p-3 text-xs text-white">
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
              onChange={(e) => setWearingArmor(e.target.checked)}
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
        </div>
      </div>
      {/* <div className={viewportClass}>
        {isModalVisible ? (
          <div
            className="origin-center"
            style={{ transform: `scale(${scale})` }}
          >
            <section
              className={[
                modalPanelClass,
                isModalAnimatingOut
                  ? "translate-y-3 scale-95 opacity-0"
                  : "translate-y-0 scale-100 opacity-100",
              ].join(" ")}
              style={{
                width: DESIGN_WIDTH,
                height: DESIGN_HEIGHT,
              }}
            >
              <div className={modalHeaderClass}>
                <span className="h-2.25 w-2.25 rounded-full bg-primary shadow-[0_0_18px_rgba(20,180,100,0.85)]" />
                <span className="text-[13px] font-medium text-slate-200/70">
                  FiveM Workspace
                </span>
              </div>

              <div className={modalBodyClass}>
                <h1 className="m-0 mb-2.5 text-[34px] font-semibold leading-[1.18] tracking-normal text-slate-50">
                  Inventory UI
                </h1>
                <p className={modalTextClass}>
                  Modal sample with a blurred background layer for FiveM NUI.
                </p>
                <p className={modalTextClass}>
                  ตัวอย่าง modal ที่มีพื้นหลังเบลอสำหรับ FiveM NUI
                </p>
              </div>

              <div className={modalActionsClass}>
                <Button variant="ghost" type="button" onClick={closeModal}>
                  Close
                </Button>
                <Button variant="primary" type="button">
                  Confirm
                </Button>
              </div>
            </section>
          </div>
        ) : (
          <Button variant="primary" type="button" onClick={openModal}>
            Open Modal
          </Button>
        )}
      </div> */}
    </main>
  );
}
