import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div tw="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#0cc0df] text-black">
        <div tw="absolute inset-0 bg-[#045c6f] opacity-55" />
        <div tw="absolute -left-24 -top-20 h-[340px] w-[340px] rounded-full bg-white opacity-25" />
        <div tw="absolute -bottom-24 -right-20 h-[360px] w-[360px] rounded-full bg-[#0cc0df] opacity-45" />
        <div tw="absolute inset-[20px] rounded-[56px] border border-white opacity-35" />
        <span tw="relative text-[236px] font-black tracking-[-0.08em]">SM</span>
      </div>
    ),
    size,
  );
}
