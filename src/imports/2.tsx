import svgPaths from "./svg-2a365f420m";
import imgNoiseTexture from "figma:asset/b27342f854d11a325f70ec2b46075793b138a7cf.png";

function NoiseTexturePlugin() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[1172px] left-[calc(50%+0.5px)] overflow-clip top-[calc(50%-7px)] w-[1440px]" data-name="Noise + texture plugin">
      <div className="absolute h-[1432px] left-[95px] top-[-577px] w-[1067px]">
        <div className="absolute inset-[-55.87%_-74.98%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2667 3032">
            <g filter="url(#filter0_f_669_701)" id="Ellipse 1">
              <path d={svgPaths.pa0f5000} fill="var(--fill-0, #026EE6)" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="3032" id="filter0_f_669_701" width="2667" x="5.90237e-06" y="-3.2541e-06">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                <feGaussianBlur result="effect1_foregroundBlur_669_701" stdDeviation="400" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <div className="absolute flex h-[2547.542px] items-center justify-center left-[-507px] mix-blend-color-burn top-[-816px] w-[2547.9px]" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[145.14deg]">
          <div className="h-[1829.35px] relative w-[1830.788px]">
            <div className="absolute inset-[-6.56%_-6.55%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2070.79 2069.35">
                <g filter="url(#filter0_f_669_693)" id="Ellipse 5" style={{ mixBlendMode: "color-burn" }}>
                  <ellipse cx="1035.39" cy="1034.67" fill="url(#paint0_radial_669_693)" rx="915.394" ry="914.675" />
                </g>
                <defs>
                  <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="2069.35" id="filter0_f_669_693" width="2070.79" x="0" y="0">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                    <feGaussianBlur result="effect1_foregroundBlur_669_693" stdDeviation="60" />
                  </filter>
                  <radialGradient cx="0" cy="0" gradientTransform="translate(1040.79 1170.58) rotate(93.1882) scale(821.027 821.672)" gradientUnits="userSpaceOnUse" id="paint0_radial_669_693" r="1">
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
    <div className="relative shrink-0 size-[19.2px]" data-name="trend up">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.2 19.2">
        <g id="trend up">
          <path d={svgPaths.pcfdfd00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
          <path d={svgPaths.p369d7880} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
        </g>
      </svg>
    </div>
  );
}

function Icon() {
  return (
    <div className="bg-[#12b9a6] content-stretch flex items-center justify-center relative rounded-[400px] shrink-0 size-[32px]" data-name="Icon">
      <TrendUp />
    </div>
  );
}

function Logo() {
  return (
    <div className="content-stretch flex gap-[7.467px] items-center relative shrink-0" data-name="Logo">
      <Icon />
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[26.133px] not-italic relative shrink-0 text-[22.4px] text-center text-white">YieldPulse</p>
    </div>
  );
}

function Text() {
  return (
    <div className="content-stretch flex flex-col items-center not-italic relative shrink-0 text-white tracking-[-0.4px] w-full whitespace-pre-wrap" data-name="Text">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[36px] relative shrink-0 text-[20px] w-full">{`Property Details & Financing Terms`}</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[22px] relative shrink-0 text-[10px] w-full">In depth analysis of a single property’s investment performance, cash flow and risk profile</p>
    </div>
  );
}

function Cover() {
  return (
    <div className="bg-[#1f2975] relative shrink-0 w-full" data-name="Cover">
      <div className="flex flex-col justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[16px] items-start justify-center px-[24px] py-[40px] relative w-full">
          <NoiseTexturePlugin />
          <Logo />
          <div className="h-0 relative shrink-0 w-full" data-name="Line">
            <div className="absolute inset-[-0.5px_0]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 547 1">
                <path d="M0 0.5H547" id="Line" stroke="var(--stroke-0, white)" strokeOpacity="0.2" />
              </svg>
            </div>
          </div>
          <Text />
        </div>
      </div>
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] h-[20px] items-center leading-[24px] min-h-px min-w-px not-italic relative text-[#0a1461] text-[10px] tracking-[-0.4px]">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal min-h-px min-w-px relative whitespace-pre-wrap">Purchase Price:</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0">AED 1,200,000</p>
    </div>
  );
}

function Frame14() {
  return (
    <div className="h-[28px] relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e4e4e4] border-b-[0.6px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[2px] px-[4px] relative size-full">
          <Frame15 />
        </div>
      </div>
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] h-[20px] items-center leading-[24px] min-h-px min-w-px not-italic relative text-[#0a1461] text-[10px] tracking-[-0.4px]">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal min-h-px min-w-px relative whitespace-pre-wrap">Expected Rent:</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0">AED 8,000/mo</p>
    </div>
  );
}

function Frame16() {
  return (
    <div className="h-[28px] relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e4e4e4] border-b-[0.6px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[2px] px-[4px] relative size-full">
          <Frame17 />
        </div>
      </div>
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] h-[20px] items-center leading-[24px] min-h-px min-w-px not-italic relative text-[#0a1461] text-[10px] tracking-[-0.4px]">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal min-h-px min-w-px relative whitespace-pre-wrap">Down Payment:</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0">30.0%</p>
    </div>
  );
}

function Frame21() {
  return (
    <div className="h-[28px] relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e4e4e4] border-b-[0.6px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[2px] px-[4px] relative size-full">
          <Frame18 />
        </div>
      </div>
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] h-[20px] items-center leading-[24px] min-h-px min-w-px not-italic relative text-[#0a1461] text-[10px] tracking-[-0.4px]">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal min-h-px min-w-px relative whitespace-pre-wrap">Interest Rate:</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0">5.00%</p>
    </div>
  );
}

function Frame22() {
  return (
    <div className="h-[28px] relative shrink-0 w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[4px] relative size-full">
          <Frame19 />
        </div>
      </div>
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame14 />
      <Frame16 />
      <Frame21 />
      <Frame22 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="bg-[#f8fafc] flex-[1_0_0] min-h-px min-w-px relative rounded-[6px]">
      <div aria-hidden="true" className="absolute border-[#eef0f2] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="content-stretch flex flex-col items-start px-[8px] py-[4px] relative w-full">
        <Frame20 />
      </div>
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] h-[20px] items-center leading-[24px] min-h-px min-w-px not-italic relative text-[#0a1461] text-[10px] tracking-[-0.4px]">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal min-h-px min-w-px relative whitespace-pre-wrap">{`Loan Term: `}</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0">25 years</p>
    </div>
  );
}

function Frame24() {
  return (
    <div className="h-[28px] relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e4e4e4] border-b-[0.6px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[2px] px-[4px] relative size-full">
          <Frame26 />
        </div>
      </div>
    </div>
  );
}

function Frame28() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] h-[20px] items-center leading-[24px] min-h-px min-w-px not-italic relative text-[#0a1461] text-[10px] tracking-[-0.4px]">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal min-h-px min-w-px relative whitespace-pre-wrap">Holding Period:</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0">5 years</p>
    </div>
  );
}

function Frame27() {
  return (
    <div className="h-[28px] relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e4e4e4] border-b-[0.6px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[2px] px-[4px] relative size-full">
          <Frame28 />
        </div>
      </div>
    </div>
  );
}

function Frame30() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] h-[20px] items-center leading-[24px] min-h-px min-w-px not-italic relative text-[#0a1461] text-[10px] tracking-[-0.4px]">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal min-h-px min-w-px relative whitespace-pre-wrap">{`Capital Growth: `}</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0">2.00%/yr</p>
    </div>
  );
}

function Frame29() {
  return (
    <div className="h-[28px] relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e4e4e4] border-b-[0.6px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[2px] px-[4px] relative size-full">
          <Frame30 />
        </div>
      </div>
    </div>
  );
}

function Frame32() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] h-[20px] items-center leading-[24px] min-h-px min-w-px not-italic relative text-[#0a1461] text-[10px] tracking-[-0.4px]">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal min-h-px min-w-px relative whitespace-pre-wrap">{`Rent Growth: `}</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0">2.00%/yr</p>
    </div>
  );
}

function Frame31() {
  return (
    <div className="h-[28px] relative shrink-0 w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[4px] relative size-full">
          <Frame32 />
        </div>
      </div>
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame24 />
      <Frame27 />
      <Frame29 />
      <Frame31 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="bg-[#f8fafc] flex-[1_0_0] min-h-px min-w-px relative rounded-[6px]">
      <div aria-hidden="true" className="absolute border-[#eef0f2] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="content-stretch flex flex-col items-start px-[8px] py-[4px] relative w-full">
        <Frame23 />
      </div>
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
      <Frame11 />
      <Frame12 />
    </div>
  );
}

function Frame41() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center justify-center p-[8px] relative rounded-[4px] shrink-0 size-[20px]">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[14px] justify-center leading-[0] not-italic relative shrink-0 text-[#0a1461] text-[8px] text-center tracking-[-0.16px] w-[11px]">
        <p className="leading-[22px] whitespace-pre-wrap">01</p>
      </div>
    </div>
  );
}

function Frame13() {
  return (
    <div className="bg-[#1f2975] relative rounded-[5px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.12)] border-solid inset-0 pointer-events-none rounded-[5px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[6px] pr-[8px] py-[6px] relative w-full">
          <Frame41 />
          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[16px] not-italic relative shrink-0 text-[12px] text-white w-[352px] whitespace-pre-wrap">Executive Summary</p>
        </div>
      </div>
    </div>
  );
}

function Frame33() {
  return (
    <div className="bg-[#f8fafc] flex-[1_0_0] min-h-px min-w-px relative rounded-[8px]">
      <div aria-hidden="true" className="absolute border-[#eef0f2] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col justify-end size-full">
        <div className="content-stretch flex flex-col items-start justify-end not-italic p-[12px] relative w-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[28px] min-w-full relative shrink-0 text-[#0e172b] text-[16px] w-[min-content] whitespace-pre-wrap">8.00%</p>
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[10px] text-[rgba(14,23,43,0.5)] tracking-[-0.2px]">Gross Yield</p>
        </div>
      </div>
    </div>
  );
}

function Frame34() {
  return (
    <div className="bg-[#f8fafc] flex-[1_0_0] min-h-px min-w-px relative rounded-[8px]">
      <div aria-hidden="true" className="absolute border-[#eef0f2] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col justify-end size-full">
        <div className="content-stretch flex flex-col items-start justify-end not-italic p-[12px] relative w-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[28px] min-w-full relative shrink-0 text-[#0e172b] text-[16px] w-[min-content] whitespace-pre-wrap">5.58%</p>
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[10px] text-[rgba(14,23,43,0.5)] tracking-[-0.2px]">Net Yield</p>
        </div>
      </div>
    </div>
  );
}

function Frame35() {
  return (
    <div className="bg-[#f8fafc] flex-[1_0_0] min-h-px min-w-px relative rounded-[8px]">
      <div aria-hidden="true" className="absolute border-[#eef0f2] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col justify-end size-full">
        <div className="content-stretch flex flex-col items-start justify-end not-italic p-[12px] relative w-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[28px] min-w-full relative shrink-0 text-[#0e172b] text-[16px] w-[min-content] whitespace-pre-wrap">1.82%</p>
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[10px] text-[rgba(14,23,43,0.5)] tracking-[-0.2px]">Cash on Cash Return</p>
        </div>
      </div>
    </div>
  );
}

function Frame36() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
      <Frame33 />
      <Frame34 />
      <Frame35 />
    </div>
  );
}

function Frame38() {
  return (
    <div className="bg-[#f8fafc] flex-[1_0_0] min-h-px min-w-px relative rounded-[8px]">
      <div aria-hidden="true" className="absolute border-[#eef0f2] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col justify-end size-full">
        <div className="content-stretch flex flex-col items-start justify-end not-italic p-[12px] relative w-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[28px] min-w-full relative shrink-0 text-[#0e172b] text-[16px] w-[min-content] whitespace-pre-wrap">AED 664</p>
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[10px] text-[rgba(14,23,43,0.5)] tracking-[-0.2px]">Monthly Cash Flow</p>
        </div>
      </div>
    </div>
  );
}

function Frame39() {
  return (
    <div className="bg-[#f8fafc] flex-[1_0_0] min-h-px min-w-px relative rounded-[8px]">
      <div aria-hidden="true" className="absolute border-[#eef0f2] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col justify-end size-full">
        <div className="content-stretch flex flex-col items-start justify-end not-italic p-[12px] relative w-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[28px] min-w-full relative shrink-0 text-[#0e172b] text-[16px] w-[min-content] whitespace-pre-wrap">AED 7,973</p>
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[10px] text-[rgba(14,23,43,0.5)] tracking-[-0.2px]">Annual Cash Flow</p>
        </div>
      </div>
    </div>
  );
}

function Frame40() {
  return (
    <div className="bg-[#f8fafc] flex-[1_0_0] min-h-px min-w-px relative rounded-[8px]">
      <div aria-hidden="true" className="absolute border-[#eef0f2] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col justify-end size-full">
        <div className="content-stretch flex flex-col items-start justify-end not-italic p-[12px] relative w-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[28px] min-w-full relative shrink-0 text-[#0e172b] text-[16px] w-[min-content] whitespace-pre-wrap">5.58%</p>
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[10px] text-[rgba(14,23,43,0.5)] tracking-[-0.2px]">Cap Rate</p>
        </div>
      </div>
    </div>
  );
}

function Frame37() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
      <Frame38 />
      <Frame39 />
      <Frame40 />
    </div>
  );
}

function Frame45() {
  return (
    <div className="bg-[#f8fafc] flex-[1_0_0] min-h-px min-w-px relative rounded-[8px]">
      <div aria-hidden="true" className="absolute border-[#eef0f2] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col justify-end size-full">
        <div className="content-stretch flex flex-col items-start justify-end not-italic p-[12px] relative w-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[28px] min-w-full relative shrink-0 text-[#0e172b] text-[16px] w-[min-content] whitespace-pre-wrap">AED 437,000</p>
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[10px] text-[rgba(14,23,43,0.5)] tracking-[-0.2px]">Initial Investment</p>
        </div>
      </div>
    </div>
  );
}

function Frame46() {
  return (
    <div className="bg-[#f8fafc] flex-[1_0_0] min-h-px min-w-px relative rounded-[8px]">
      <div aria-hidden="true" className="absolute border-[#eef0f2] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col justify-end size-full">
        <div className="content-stretch flex flex-col items-start justify-end not-italic p-[12px] relative w-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[28px] min-w-full relative shrink-0 text-[#0e172b] text-[16px] w-[min-content] whitespace-pre-wrap">AED 1,600</p>
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[10px] text-[rgba(14,23,43,0.5)] tracking-[-0.2px]">Cost per Sq Ft</p>
        </div>
      </div>
    </div>
  );
}

function Frame47() {
  return (
    <div className="bg-[#f8fafc] flex-[1_0_0] min-h-px min-w-px relative rounded-[8px]">
      <div aria-hidden="true" className="absolute border-[#eef0f2] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col justify-end size-full">
        <div className="content-stretch flex flex-col items-start justify-end not-italic p-[12px] relative w-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[28px] min-w-full relative shrink-0 text-[#0e172b] text-[16px] w-[min-content] whitespace-pre-wrap">AED 128</p>
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[10px] text-[rgba(14,23,43,0.5)] tracking-[-0.2px]">Rent per Sq Ft (Annual)</p>
        </div>
      </div>
    </div>
  );
}

function Frame44() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
      <Frame45 />
      <Frame46 />
      <Frame47 />
    </div>
  );
}

function Frame43() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Frame36 />
      <Frame37 />
      <Frame44 />
    </div>
  );
}

function Frame42() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
      <Frame13 />
      <Frame43 />
    </div>
  );
}

function Frame() {
  return (
    <div className="bg-[#f8fafc] relative rounded-[8px] shrink-0 w-full">
      <div className="flex flex-col justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[2px] items-start justify-center not-italic px-[12px] py-[8px] relative w-full whitespace-pre-wrap">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] relative shrink-0 text-[#0a1461] text-[10px] tracking-[-0.2px] w-full">Insight</p>
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[0] relative shrink-0 text-[0px] text-[8px] text-[rgba(14,23,43,0.5)] tracking-[-0.16px] w-full">
            <span className="leading-[14px]">{`This property generates `}</span>
            <span className="font-['Inter:Medium',sans-serif] font-medium leading-[14px] text-[#0e172b]">8.00% gross rental yield</span>
            <span className="leading-[14px]">{` and 5`}</span>
            <span className="font-['Inter:Medium',sans-serif] font-medium leading-[14px] text-[#0e172b]">{`.58% net yield `}</span>
            <span className="leading-[14px]">after operating expenses and vacancy. Your</span>
            <span className="font-['Inter:Medium',sans-serif] font-medium leading-[14px] text-[#0e172b]">{` AED 437,000 initial investment`}</span>
            <span className="leading-[14px]">{` produces `}</span>
            <span className="font-['Inter:Medium',sans-serif] font-medium leading-[14px] text-[#0e172b]">AED 7,973 annual cash flow (AED 664/month</span>
            <span className="leading-[14px]">{`), representing `}</span>
            <span className="font-['Inter:Medium',sans-serif] font-medium leading-[14px] text-[#0e172b]">1.82% cash-on-cash return.</span>
          </p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#eef0f2] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Text1() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Text">
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col gap-[24px] items-start justify-center px-[8px] relative w-full">
          <Frame25 />
          <Frame42 />
          <Frame />
        </div>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex items-center py-[8px] relative shrink-0 w-full">
      <Text1 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[8px] items-center leading-[16px] not-italic relative shrink-0 text-[10px] w-full">
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0 text-black">Report Date:</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[#0e172b]">27 Jan 2026</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <Frame2 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[8px] items-center leading-[16px] not-italic relative shrink-0 text-[10px] w-full">
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0 text-black">Prepared by:</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[#0e172b]">YieldPulse Platform</p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <Frame3 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[16px] not-italic relative shrink-0 text-[10px] text-black">Confidential Investment Report</p>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <Frame4 />
    </div>
  );
}

function Text2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Text">
      <div className="content-stretch flex items-start justify-between px-[8px] relative w-full">
        <Frame5 />
        <Frame6 />
        <Frame7 />
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Text2 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-full">
      <div className="content-stretch flex flex-col items-start justify-between px-[24px] relative size-full">
        <Frame1 />
        <Frame10 />
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[24px] h-[842px] items-center left-0 pb-[24px] top-0 w-[595px]">
      <Cover />
      <Frame8 />
    </div>
  );
}

export default function Component() {
  return (
    <div className="bg-white relative size-full" data-name="2">
      <Frame9 />
    </div>
  );
}