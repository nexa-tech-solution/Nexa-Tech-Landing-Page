import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Check, ChevronDown } from "lucide-react";

// --- colour maths (hex <-> HSV), enough for a picker ---------------------------------------

type Hsv = { h: number; s: number; v: number }; // h 0–360, s/v 0–1

const clamp = (n: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, n));

export function isHex(value: string) {
  return /^#[0-9a-f]{6}$/i.test(value);
}

function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((c) => Math.round(clamp(c, 0, 255)).toString(16).padStart(2, "0")).join("")}`;
}

function hexToHsv(hex: string): Hsv {
  const [r, g, b] = hexToRgb(hex).map((c) => c / 255);
  const max = Math.max(r, g, b);
  const d = max - Math.min(r, g, b);
  let h = 0;
  if (d) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
  }
  return { h: (h * 60 + 360) % 360, s: max ? d / max : 0, v: max };
}

function hsvToHex({ h, s, v }: Hsv) {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return (v - v * s * Math.max(0, Math.min(k, 4 - k, 1))) * 255;
  };
  return rgbToHex(f(5), f(3), f(1));
}

function mix(hex: string, with_: string, amount: number) {
  const a = hexToRgb(hex);
  const b = hexToRgb(with_);
  return rgbToHex(...(a.map((c, i) => c + (b[i] - c) * amount) as [number, number, number]));
}

/** Relative luminance, to keep tag text readable on light colours. */
export function luminance(hex: string) {
  const [r, g, b] = hexToRgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** The colour for text in that hue: darkened when the colour itself is too light to read. */
export function readableText(hex: string) {
  const l = luminance(hex);
  return l > 0.35 ? mix(hex, "#000000", 0.45) : l > 0.22 ? mix(hex, "#000000", 0.25) : hex;
}

// --- palette: a grey row, then each hue from light tint to deep shade -----------------------

const HUES = ["#ef4444", "#f97316", "#f59e0b", "#84cc16", "#1a9d5c", "#0d9488", "#0ea5e9", "#3b82f6", "#6c47ff", "#ec4899"];
const GREYS = ["#1f1f24", "#3f3f46", "#52525b", "#71717a", "#a1a1aa", "#d4d4d8", "#e4e4e7", "#f4f4f5", "#64748b", "#94a3b8"];
const PALETTE: string[][] = [
  GREYS,
  HUES.map((c) => mix(c, "#ffffff", 0.75)),
  HUES.map((c) => mix(c, "#ffffff", 0.45)),
  HUES,
  HUES.map((c) => mix(c, "#000000", 0.25)),
  HUES.map((c) => mix(c, "#000000", 0.5)),
];

// --- the picker -----------------------------------------------------------------------------

// A swatch button that opens the palette, with a free picker (saturation/brightness + hue) beside it.
export function ColorPicker({ value, onChange, label = "Chọn màu" }: { value: string; onChange: (hex: string) => void; label?: string }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Hsv>(() => hexToHsv(value));
  const [hex, setHex] = useState(value);

  // Start from the current colour each time it opens.
  useEffect(() => {
    if (open) {
      setDraft(hexToHsv(value));
      setHex(value);
    }
  }, [open, value]);

  const draftHex = hsvToHex(draft);
  const pick = (c: string) => {
    onChange(c);
    setOpen(false);
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-label={label}
          title={label}
          className="flex h-8 shrink-0 items-center gap-1 rounded-lg border border-gray-200 bg-white pl-1.5 pr-1 hover:border-gray-400"
        >
          <span className="h-5 w-5 rounded-md border border-black/10" style={{ background: value }} />
          <ChevronDown size={12} className="text-gray-400" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="end"
          sideOffset={6}
          collisionPadding={12}
          className="z-[60] flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-3 text-[#0d0c22] shadow-2xl sm:flex-row"
        >
          <div>
            <div className="mb-2 text-[11px] font-semibold text-gray-500">Bảng màu</div>
            <div className="grid grid-cols-10 gap-1.5">
              {PALETTE.flat().map((c, i) => {
                const active = c.toLowerCase() === value.toLowerCase();
                return (
                  <button
                    key={`${c}-${i}`}
                    type="button"
                    aria-label={c}
                    title={c}
                    onClick={() => pick(c)}
                    className="grid h-5 w-5 place-items-center rounded-md border border-black/5 transition hover:scale-110"
                    style={{ background: c }}
                  >
                    {active && <Check size={12} strokeWidth={3} color={luminance(c) > 0.5 ? "#1f1f24" : "#ffffff"} />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="w-[200px] border-gray-100 sm:border-l sm:pl-4">
            <div className="mb-2 text-[11px] font-semibold text-gray-500">Tuỳ chỉnh</div>
            <SatValArea hsv={draft} onChange={(next) => (setDraft(next), setHex(hsvToHex(next)))} />
            <HueSlider hue={draft.h} onChange={(h) => (setDraft({ ...draft, h }), setHex(hsvToHex({ ...draft, h })))} />
            <div className="mt-3 flex items-center gap-2">
              <span className="h-7 w-7 shrink-0 rounded-md border border-black/10" style={{ background: draftHex }} />
              <input
                value={hex}
                onChange={(e) => {
                  const next = e.target.value.startsWith("#") ? e.target.value : `#${e.target.value}`;
                  setHex(next);
                  if (isHex(next)) setDraft(hexToHsv(next));
                }}
                maxLength={7}
                spellCheck={false}
                className="min-w-0 flex-1 rounded-lg border border-gray-200 px-2 py-1 font-mono text-xs uppercase outline-none focus:border-gray-400"
              />
            </div>
            <div className="mt-3 flex gap-2">
              <button type="button" onClick={() => setOpen(false)} className="h-8 flex-1 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50">
                Huỷ
              </button>
              <button
                type="button"
                disabled={!isHex(hex)}
                onClick={() => pick(draftHex)}
                className="h-8 flex-1 rounded-lg bg-[#0d0c22] text-xs font-semibold text-white hover:brightness-125 disabled:opacity-40"
              >
                Chọn
              </button>
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

// Drag handler shared by the two areas: reports the pointer position as 0–1 within the element.
function useDrag(onMove: (x: number, y: number) => void) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: { clientX: number; clientY: number }) => {
    const r = ref.current!.getBoundingClientRect();
    onMove(clamp((e.clientX - r.left) / r.width), clamp((e.clientY - r.top) / r.height));
  };
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    move(e);
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) move(e);
  };
  return { ref, onPointerDown, onPointerMove };
}

function SatValArea({ hsv, onChange }: { hsv: Hsv; onChange: (hsv: Hsv) => void }) {
  const drag = useDrag((x, y) => onChange({ ...hsv, s: x, v: 1 - y }));
  return (
    <div
      {...drag}
      className="relative h-32 w-full cursor-crosshair touch-none rounded-lg"
      style={{ background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${hsv.h} 100% 50%))` }}
    >
      <span
        className="pointer-events-none absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
        style={{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%`, background: hsvToHex(hsv) }}
      />
    </div>
  );
}

function HueSlider({ hue, onChange }: { hue: number; onChange: (h: number) => void }) {
  const drag = useDrag((x) => onChange(Math.round(x * 360) % 360));
  return (
    <div
      {...drag}
      className="relative mt-3 h-3 w-full cursor-pointer touch-none rounded-full"
      style={{ background: "linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)" }}
    >
      <span
        className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
        style={{ left: `${(hue / 360) * 100}%`, background: `hsl(${hue} 100% 50%)` }}
      />
    </div>
  );
}
