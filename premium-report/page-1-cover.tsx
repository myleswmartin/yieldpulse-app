import svgPaths from "@/imports/svg-1nex6bngih";
import imgNoiseTexture from "figma:asset/b27342f854d11a325f70ec2b46075793b138a7cf.png";
import imgImage2 from "figma:asset/7c59efb5214808195c27d84c56c71dd17e3b3395.png";

function NoiseTexturePlugin() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[1172px] left-[calc(50%+0.5px)] overflow-clip top-[calc(50%-7px)] w-[1440px]" data-name="Noise + texture plugin">
      <div className="absolute h-[1432px] left-[95px] top-[-577px] w-[1067px]">
        <div className="absolute inset-[-55.87%_-74.98%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2667 3032">
            <g filter="url(#filter0_f_711_64)" id="Ellipse 1">
              <path d={svgPaths.pa0f5000} fill="var(--fill-0, #026EE6)" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="3032" id="filter0_f_711_64" width="2667" x="5.90237e-06" y="-3.2541e-06">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                <feGaussianBlur result="effect1_foregroundBlur_711_64" stdDeviation="400" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <div className="absolute flex h-[2547.542px] items-center justify-center left-[-507px] mix-blend-color-burn top-[-816px] w-[2547.9px]" style={{ "--transform-inner-width": "1185", "--transform-inner-height": "154" } as React.CSSProperties}>
        <div className="flex-none rotate-[145.14deg]">
          <div className="h-[1829.35px] relative w-[1830.788px]">
            <div className="absolute inset-[-6.56%_-6.55%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2070.79 2069.35">
                <g filter="url(#filter0_f_711_62)" id="Ellipse 5" style={{ mixBlendMode: "color-burn" }}>
                  <ellipse cx="1035.39" cy="1034.67" fill="url(#paint0_radial_711_62)" rx="915.394" ry="914.675" />
                </g>
                <defs>
                  <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="2069.35" id="filter0_f_711_62" width="2070.79" x="0" y="0">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                    <feGaussianBlur result="effect1_foregroundBlur_711_62" stdDeviation="60" />
                  </filter>
                  <radialGradient cx="0" cy="0" gradientTransform="translate(1040.79 1170.58) rotate(93.1882) scale(821.027 821.672)" gradientUnits="userSpaceOnUse" id="paint0_radial_711_62" r="1">
                    <stop stopColor="#1F2975" />
                    <stop offset="0.734" stopColor="#7EBDEA" />
                    <stop offset="1" stopColor="#D3F2E7" />
                  </radialGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex inset-[-194.28%_0_-188.81%_0] items-center justify-center mix-blend-soft-light">
        <div className="flex-none h-[1440px] rotate-90 w-[5661.752px]">
          <div className="bg-size-[1402px_1402px] bg-top-left size-full" data-name="Noise & Texture" style={{ backgroundImage: `url('${imgNoiseTexture}')` }} />
        </div>
      </div>
    </div>
  );
}

function TrendUp() {
  return (
    <div className="relative shrink-0 size-[28.8px]" data-name="trend up">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28.8 28.8">
        <g id="trend up">
          <path d={svgPaths.p22fec180} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" />
          <path d={svgPaths.p267cd580} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" />
        </g>
      </svg>
    </div>
  );
}

function Icon() {
  return (
    <div className="bg-[#12b9a6] content-stretch flex items-center justify-center relative rounded-[600px] shrink-0 size-[48px]" data-name="Icon">
      <TrendUp />
    </div>
  );
}

function Logo() {
  return (
    <div className="content-stretch flex gap-[11.2px] items-center relative shrink-0" data-name="Logo">
      <Icon />
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[39.2px] not-italic relative shrink-0 text-[33.6px] text-center text-white">YieldPulse</p>
    </div>
  );
}

function Cover() {
  return (
    <div className="bg-[#1f2975] relative shrink-0 w-full" data-name="Cover">
      <div className="flex flex-col justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[24px] items-start justify-center px-[40px] py-[80px] relative w-full">
          <NoiseTexturePlugin />
          <Logo />
          <div className="h-0 relative shrink-0 w-full" data-name="Line">
            <div className="absolute inset-[-0.5px_0]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 515 1">
                <path d="M0 0.5H515" id="Line" stroke="var(--stroke-0, white)" strokeOpacity="0.2" />
              </svg>
            </div>
          </div>
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[36px] min-w-full not-italic relative shrink-0 text-[20px] text-white tracking-[-0.4px] w-[min-content] whitespace-pre-wrap">Premium Investment Report</p>
        </div>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="relative rounded-[4px] shrink-0 w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[12px] py-[2px] relative w-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] not-italic relative shrink-0 text-[#1e2875] text-[10px] tracking-[-0.3px]">Unnamed Property (YP-002285)</p>
        </div>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="h-[192px] overflow-clip relative rounded-[4px] shrink-0 w-full">
      <div className="-translate-y-1/2 absolute h-[334px] left-[-2px] top-1/2 w-[501px]" data-name="image 2">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage2} />
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] h-[20px] items-center leading-[22px] min-h-px min-w-px not-italic relative text-[#0a1461] text-[8px] tracking-[-0.32px]">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal min-h-px min-w-px relative whitespace-pre-wrap">Purchase Price</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0">AED 1,500,000</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e4e4e4] border-b-[0.6px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[2px] px-[4px] relative w-full">
          <Frame5 />
        </div>
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] h-[20px] items-center leading-[22px] min-h-px min-w-px not-italic relative text-[#0a1461] text-[8px] tracking-[-0.32px]">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal min-h-px min-w-px relative whitespace-pre-wrap">Expected Rent</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0">AED 8,000/month</p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e4e4e4] border-b-[0.6px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[2px] px-[4px] relative w-full">
          <Frame7 />
        </div>
      </div>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] h-[20px] items-center leading-[22px] min-h-px min-w-px not-italic relative text-[#0a1461] text-[8px] tracking-[-0.32px]">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal min-h-px min-w-px relative whitespace-pre-wrap">Down Payment</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0">30.0%</p>
    </div>
  );
}

function Frame11() {
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e4e4e4] border-b-[0.6px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[2px] px-[4px] relative w-full">
          <Frame8 />
        </div>
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] h-[20px] items-center leading-[22px] min-h-px min-w-px not-italic relative text-[#0a1461] text-[8px] tracking-[-0.32px]">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal min-h-px min-w-px relative whitespace-pre-wrap">Interest Rate</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0">5.00%</p>
    </div>
  );
}

function Frame12() {
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e4e4e4] border-b-[0.6px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[2px] px-[4px] relative w-full">
          <Frame9 />
        </div>
      </div>
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] h-[20px] items-center leading-[22px] min-h-px min-w-px not-italic relative text-[#0a1461] text-[8px] tracking-[-0.32px]">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal min-h-px min-w-px relative whitespace-pre-wrap">Holding Period</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0">5 years</p>
    </div>
  );
}

function Frame13() {
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e4e4e4] border-b-[0.6px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[2px] px-[4px] relative w-full">
          <Frame14 />
        </div>
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame4 />
      <Frame6 />
      <Frame11 />
      <Frame12 />
      <Frame13 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="bg-[#f8fafc] relative rounded-[6px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#eef0f2] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start px-[8px] py-[4px] relative w-full">
        <Frame3 />
        <Frame1 />
        <Frame10 />
      </div>
    </div>
  );
}

function Frame15() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch flex flex-col items-start px-[40px] relative w-full">
        <Frame2 />
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[24px] h-[842px] items-center left-0 pb-[24px] top-0 w-[595px]">
      <Cover />
      <Frame15 />
    </div>
  );
}

export default function PremiumReportPage1Cover() {
  return (
    <div className="bg-white relative size-full" data-name="Premium Report Page 1 - Cover">
      <Frame />
    </div>
  );
}
