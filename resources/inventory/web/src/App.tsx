import { useEffect, useState } from "react";
import { Button } from "@fivem/ui";

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
  "absolute inset-0 bg-cover bg-center transition-[filter,brightness] duration-300 ease-out";

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
          isModalVisible ? "blur-sm brightness-75" : "blur-0 brightness-100",
        ].join(" ")}
        style={{
          backgroundImage: `linear-gradient(rgba(2,6,5,0.2),rgba(2,6,5,0.5)), url(${BACKGROUND_IMAGE})`,
        }}
      />

      <div className={viewportClass}>
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
      </div>
    </main>
  );
}
