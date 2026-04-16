import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div tw="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[36px] bg-[#0cc0df] text-black">
        <div tw="absolute inset-0 bg-[#045c6f] opacity-55" />
        <div tw="absolute -left-10 -top-9 h-[128px] w-[128px] rounded-full bg-white opacity-24" />
        <div tw="absolute -bottom-12 -right-10 h-[140px] w-[140px] rounded-full bg-[#0cc0df] opacity-45" />
        <div tw="absolute inset-[8px] rounded-[28px] border border-white opacity-35" />
        <span tw="relative text-[84px] font-black tracking-[-0.08em]">SM</span>
      </div>
    ),
    size,
  );
}
