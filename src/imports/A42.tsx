import svgPaths from "./svg-gfvwb6115r";
import imgNoiseTexture from "figma:asset/b27342f854d11a325f70ec2b46075793b138a7cf.png";
import imgImage2 from "figma:asset/4c1bd6ff723bd0bf724c0d1bd9e4cc6ab2762023.png";
import imgImage3 from "figma:asset/7c59efb5214808195c27d84c56c71dd17e3b3395.png";
import imgImage4 from "figma:asset/54ef60acd2dcc0d50d282444c388224802119d96.png";

function NoiseTexturePlugin() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[1172px] left-[calc(50%+0.5px)] overflow-clip top-[calc(50%+75px)] w-[1440px]" data-name="Noise + texture plugin">
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
      <div className="absolute flex h-[2547.542px] items-center justify-center left-[-507px] mix-blend-color-burn top-[-816px] w-[2547.9px]" style={{ "--transform-inner-width": "300", "--transform-inner-height": "150" } as React.CSSProperties}>
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

function Text() {
  return (
    <div className="relative shrink-0 w-full" data-name="Text">
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col gap-[8px] items-center not-italic px-[8px] relative text-white w-full whitespace-pre-wrap">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[28px] relative shrink-0 text-[24px] tracking-[-0.48px] w-full">Key Metrics Comparison Summary</p>
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[10px] w-full">Among the three properties, Unnamed Property (YP-002285) consistently outperforms the others across yield, cash flow, and total return metrics, while test 123 (YP-002374) and Unnamed Property (YP-002609) show weaker performance with negative cash flow.</p>
        </div>
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="bg-[#1f2975] relative shrink-0 w-full">
      <div className="flex flex-col items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[24px] items-center justify-center p-[40px] relative w-full">
          <NoiseTexturePlugin />
          <Text />
        </div>
      </div>
    </div>
  );
}

function Frame21() {
  return (
    <div className="bg-[#1f2975] relative rounded-[5px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.12)] border-solid inset-0 pointer-events-none rounded-[5px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[8px] py-[6px] relative w-full">
          <p className="font-['Inter:Medium',sans-serif] font-medium leading-[22px] not-italic relative shrink-0 text-[12px] text-white tracking-[-0.24px]">Property Overview</p>
        </div>
      </div>
    </div>
  );
}

function Frame23() {
  return (
    <div className="relative rounded-[4px] shrink-0 w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[12px] py-[2px] relative w-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] not-italic relative shrink-0 text-[#1e2875] text-[10px] tracking-[-0.3px]">test 123 (YP-002374)</p>
        </div>
      </div>
    </div>
  );
}

function Frame14() {
  return (
    <div className="h-[100px] overflow-clip relative rounded-[4px] shrink-0 w-full">
      <div className="absolute h-[158px] left-[-34px] top-[-30px] w-[237px]" data-name="image 2">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage2} />
      </div>
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] h-[20px] items-center leading-[22px] min-h-px min-w-px not-italic relative text-[#0a1461] text-[8px] tracking-[-0.32px]">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal min-h-px min-w-px relative whitespace-pre-wrap">Purchase Price:</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0">AED 1,500,000</p>
    </div>
  );
}

function Frame24() {
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e4e4e4] border-b-[0.6px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[2px] px-[4px] relative w-full">
          <Frame25 />
        </div>
      </div>
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] h-[20px] items-center leading-[22px] min-h-px min-w-px not-italic relative text-[#0a1461] text-[8px] tracking-[-0.32px]">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal min-h-px min-w-px relative whitespace-pre-wrap">Monthly Rent</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0">AED 8,000</p>
    </div>
  );
}

function Frame26() {
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e4e4e4] border-b-[0.6px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[2px] px-[4px] relative w-full">
          <Frame27 />
        </div>
      </div>
    </div>
  );
}

function Frame28() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] h-[20px] items-center leading-[22px] min-h-px min-w-px not-italic relative text-[#0a1461] text-[8px] tracking-[-0.32px]">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal min-h-px min-w-px relative whitespace-pre-wrap">Gross Yield:</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0">8.40%</p>
    </div>
  );
}

function Frame30() {
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e4e4e4] border-b-[0.6px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[2px] px-[4px] relative w-full">
          <Frame28 />
        </div>
      </div>
    </div>
  );
}

function Frame32() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] h-[20px] items-center leading-[22px] min-h-px min-w-px not-italic relative text-[#0a1461] text-[8px] tracking-[-0.32px]">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal min-h-px min-w-px relative whitespace-pre-wrap">Net Yield:</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0">3.76%</p>
    </div>
  );
}

function Frame31() {
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e4e4e4] border-b-[0.6px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[2px] px-[4px] relative w-full">
          <Frame32 />
        </div>
      </div>
    </div>
  );
}

function Frame35() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] h-[20px] items-center leading-[22px] min-h-px min-w-px not-italic relative text-[#0a1461] text-[8px] tracking-[-0.32px]">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal min-h-px min-w-px relative whitespace-pre-wrap">Monthly Cash Flow:</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0">– AED 2,669</p>
    </div>
  );
}

function Frame33() {
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e4e4e4] border-b-[0.6px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[2px] px-[4px] relative w-full">
          <Frame35 />
        </div>
      </div>
    </div>
  );
}

function Frame38() {
  return (
    <div className="bg-[#f8fafc] content-stretch flex flex-[1_0_0] gap-[8px] h-[20px] items-center leading-[22px] min-h-px min-w-px not-italic relative text-[8px] tracking-[-0.32px]">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal min-h-px min-w-px relative text-[#0a1461] whitespace-pre-wrap">Cash on Cash Return:</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0 text-[#ef4444]">–8.11%</p>
    </div>
  );
}

function Frame36() {
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e4e4e4] border-b-[0.6px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[2px] px-[4px] relative w-full">
          <Frame38 />
        </div>
      </div>
    </div>
  );
}

function Frame40() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] h-[20px] items-center leading-[22px] min-h-px min-w-px not-italic relative text-[8px] tracking-[-0.32px]">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal min-h-px min-w-px relative text-[#0a1461] whitespace-pre-wrap">Year 5 Total Return:</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0 text-[#f05b5b]">AED 278,175</p>
    </div>
  );
}

function Frame39() {
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e4e4e4] border-b-[0.6px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[2px] px-[4px] relative w-full">
          <Frame40 />
        </div>
      </div>
    </div>
  );
}

function Frame42() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] h-[20px] items-center leading-[22px] min-h-px min-w-px not-italic relative text-[#0a1461] text-[8px] tracking-[-0.32px]">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal min-h-px min-w-px relative whitespace-pre-wrap">5-Year ROI:</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0">70.4%</p>
    </div>
  );
}

function Frame41() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[2px] px-[4px] relative w-full">
          <Frame42 />
        </div>
      </div>
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame24 />
      <Frame26 />
      <Frame30 />
      <Frame31 />
      <Frame33 />
      <Frame36 />
      <Frame39 />
      <Frame41 />
    </div>
  );
}

function Frame18() {
  return (
    <div className="bg-[#f8fafc] relative rounded-[6px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#eef0f2] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start px-[8px] py-[4px] relative w-full">
        <Frame23 />
        <Frame14 />
        <Frame29 />
      </div>
    </div>
  );
}

function Frame34() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px relative">
      <Frame18 />
    </div>
  );
}

function Frame44() {
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

function Frame15() {
  return (
    <div className="h-[100px] overflow-clip relative rounded-[4px] shrink-0 w-full">
      <div className="absolute h-[116px] left-[-2px] top-0 w-[173px]" data-name="image 2">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage3} />
      </div>
    </div>
  );
}

function Frame47() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] h-[20px] items-center leading-[22px] min-h-px min-w-px not-italic relative text-[#0a1461] text-[8px] tracking-[-0.32px]">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal min-h-px min-w-px relative whitespace-pre-wrap">Purchase Price:</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0">AED 1,500,000</p>
    </div>
  );
}

function Frame46() {
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e4e4e4] border-b-[0.6px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[2px] px-[4px] relative w-full">
          <Frame47 />
        </div>
      </div>
    </div>
  );
}

function Frame49() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] h-[20px] items-center leading-[22px] min-h-px min-w-px not-italic relative text-[#0a1461] text-[8px] tracking-[-0.32px]">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal min-h-px min-w-px relative whitespace-pre-wrap">Monthly Rent</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0">AED 28,000</p>
    </div>
  );
}

function Frame48() {
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e4e4e4] border-b-[0.6px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[2px] px-[4px] relative w-full">
          <Frame49 />
        </div>
      </div>
    </div>
  );
}

function Frame51() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] h-[20px] items-center leading-[22px] min-h-px min-w-px not-italic relative text-[#0a1461] text-[8px] tracking-[-0.32px]">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal min-h-px min-w-px relative whitespace-pre-wrap">Gross Yield:</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0">22.4%</p>
    </div>
  );
}

function Frame50() {
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e4e4e4] border-b-[0.6px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[2px] px-[4px] relative w-full">
          <Frame51 />
        </div>
      </div>
    </div>
  );
}

function Frame53() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] h-[20px] items-center leading-[22px] min-h-px min-w-px not-italic relative text-[#0a1461] text-[8px] tracking-[-0.32px]">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal min-h-px min-w-px relative whitespace-pre-wrap">Net Yield:</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0">18.2%</p>
    </div>
  );
}

function Frame52() {
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e4e4e4] border-b-[0.6px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[2px] px-[4px] relative w-full">
          <Frame53 />
        </div>
      </div>
    </div>
  );
}

function Frame55() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] h-[20px] items-center leading-[22px] min-h-px min-w-px not-italic relative text-[#0a1461] text-[8px] tracking-[-0.32px]">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal min-h-px min-w-px relative whitespace-pre-wrap">Monthly Cash Flow:</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0">AED 15,331</p>
    </div>
  );
}

function Frame54() {
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e4e4e4] border-b-[0.6px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[2px] px-[4px] relative w-full">
          <Frame55 />
        </div>
      </div>
    </div>
  );
}

function Frame57() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] h-[20px] items-center leading-[22px] min-h-px min-w-px not-italic relative text-[8px] tracking-[-0.32px]">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal min-h-px min-w-px relative text-[#0a1461] whitespace-pre-wrap">Cash on Cash Return:</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0 text-[#15b8a6]">46.6%</p>
    </div>
  );
}

function Frame56() {
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e4e4e4] border-b-[0.6px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[2px] px-[4px] relative w-full">
          <Frame57 />
        </div>
      </div>
    </div>
  );
}

function Frame59() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] h-[20px] items-center leading-[22px] min-h-px min-w-px not-italic relative text-[8px] tracking-[-0.32px]">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal min-h-px min-w-px relative text-[#0a1461] whitespace-pre-wrap">Year 5 Total Return:</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0 text-[#15b8a6]">AED 1,459,351</p>
    </div>
  );
}

function Frame58() {
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e4e4e4] border-b-[0.6px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[2px] px-[4px] relative w-full">
          <Frame59 />
        </div>
      </div>
    </div>
  );
}

function Frame61() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] h-[20px] items-center leading-[22px] min-h-px min-w-px not-italic relative text-[#0a1461] text-[8px] tracking-[-0.32px]">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal min-h-px min-w-px relative whitespace-pre-wrap">5-Year ROI:</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0">368.5%</p>
    </div>
  );
}

function Frame60() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[2px] px-[4px] relative w-full">
          <Frame61 />
        </div>
      </div>
    </div>
  );
}

function Frame45() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame46 />
      <Frame48 />
      <Frame50 />
      <Frame52 />
      <Frame54 />
      <Frame56 />
      <Frame58 />
      <Frame60 />
    </div>
  );
}

function Frame19() {
  return (
    <div className="bg-[#f8fafc] relative rounded-[6px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#eef0f2] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start px-[8px] py-[4px] relative w-full">
        <Frame44 />
        <Frame15 />
        <Frame45 />
      </div>
    </div>
  );
}

function Frame43() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative">
      <Frame19 />
    </div>
  );
}

function Frame63() {
  return (
    <div className="relative rounded-[4px] shrink-0 w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[12px] py-[2px] relative w-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] not-italic relative shrink-0 text-[#1e2875] text-[10px] tracking-[-0.3px]">Unnamed Property (YP-002609)</p>
        </div>
      </div>
    </div>
  );
}

function Frame16() {
  return (
    <div className="h-[100px] overflow-clip relative rounded-[4px] shrink-0 w-full">
      <div className="absolute h-[128px] left-[-12px] top-[-6px] w-[192px]" data-name="image 2">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage4} />
      </div>
    </div>
  );
}

function Frame66() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] h-[20px] items-center leading-[22px] min-h-px min-w-px not-italic relative text-[#0a1461] text-[8px] tracking-[-0.32px]">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal min-h-px min-w-px relative whitespace-pre-wrap">Purchase Price:</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0">AED 1,500,000</p>
    </div>
  );
}

function Frame65() {
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e4e4e4] border-b-[0.6px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[2px] px-[4px] relative w-full">
          <Frame66 />
        </div>
      </div>
    </div>
  );
}

function Frame68() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] h-[20px] items-center leading-[22px] min-h-px min-w-px not-italic relative text-[#0a1461] text-[8px] tracking-[-0.32px]">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal min-h-px min-w-px relative whitespace-pre-wrap">Monthly Rent</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0">AED 8,000</p>
    </div>
  );
}

function Frame67() {
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e4e4e4] border-b-[0.6px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[2px] px-[4px] relative w-full">
          <Frame68 />
        </div>
      </div>
    </div>
  );
}

function Frame70() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] h-[20px] items-center leading-[22px] min-h-px min-w-px not-italic relative text-[#0a1461] text-[8px] tracking-[-0.32px]">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal min-h-px min-w-px relative whitespace-pre-wrap">Gross Yield:</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0">8.40%</p>
    </div>
  );
}

function Frame69() {
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e4e4e4] border-b-[0.6px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[2px] px-[4px] relative w-full">
          <Frame70 />
        </div>
      </div>
    </div>
  );
}

function Frame72() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] h-[20px] items-center leading-[22px] min-h-px min-w-px not-italic relative text-[#0a1461] text-[8px] tracking-[-0.32px]">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal min-h-px min-w-px relative whitespace-pre-wrap">Net Yield:</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0">3.76%</p>
    </div>
  );
}

function Frame71() {
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e4e4e4] border-b-[0.6px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[2px] px-[4px] relative w-full">
          <Frame72 />
        </div>
      </div>
    </div>
  );
}

function Frame74() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] h-[20px] items-center leading-[22px] min-h-px min-w-px not-italic relative text-[#0a1461] text-[8px] tracking-[-0.32px]">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal min-h-px min-w-px relative whitespace-pre-wrap">Monthly Cash Flow:</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0">AED 2,669</p>
    </div>
  );
}

function Frame73() {
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e4e4e4] border-b-[0.6px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[2px] px-[4px] relative w-full">
          <Frame74 />
        </div>
      </div>
    </div>
  );
}

function Frame76() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] h-[20px] items-center leading-[22px] min-h-px min-w-px not-italic relative text-[#0a1461] text-[8px] tracking-[-0.32px]">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal min-h-px min-w-px relative whitespace-pre-wrap">Cash on Cash Return:</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0">–8.11%</p>
    </div>
  );
}

function Frame75() {
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e4e4e4] border-b-[0.6px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[2px] px-[4px] relative w-full">
          <Frame76 />
        </div>
      </div>
    </div>
  );
}

function Frame78() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] h-[20px] items-center leading-[22px] min-h-px min-w-px not-italic relative text-[#0a1461] text-[8px] tracking-[-0.32px]">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal min-h-px min-w-px relative whitespace-pre-wrap">Year 5 Total Return:</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0">AED 278,175</p>
    </div>
  );
}

function Frame77() {
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e4e4e4] border-b-[0.6px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[2px] px-[4px] relative w-full">
          <Frame78 />
        </div>
      </div>
    </div>
  );
}

function Frame80() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] h-[20px] items-center leading-[22px] min-h-px min-w-px not-italic relative text-[#0a1461] text-[8px] tracking-[-0.32px]">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal min-h-px min-w-px relative whitespace-pre-wrap">5-Year ROI:</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0">70.4%</p>
    </div>
  );
}

function Frame79() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[2px] px-[4px] relative w-full">
          <Frame80 />
        </div>
      </div>
    </div>
  );
}

function Frame64() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame65 />
      <Frame67 />
      <Frame69 />
      <Frame71 />
      <Frame73 />
      <Frame75 />
      <Frame77 />
      <Frame79 />
    </div>
  );
}

function Frame20() {
  return (
    <div className="bg-[#f8fafc] relative rounded-[6px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#eef0f2] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start px-[8px] py-[4px] relative w-full">
        <Frame63 />
        <Frame16 />
        <Frame64 />
      </div>
    </div>
  );
}

function Frame62() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative">
      <Frame20 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
      <Frame34 />
      <Frame43 />
      <Frame62 />
    </div>
  );
}

function TrendUp() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="trend up">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="trend up">
          <path d={svgPaths.p36dbc00} id="Vector" stroke="var(--stroke-0, #12B981)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
          <path d={svgPaths.p393d2d00} id="Vector_2" stroke="var(--stroke-0, #12B981)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
        </g>
      </svg>
    </div>
  );
}

function Frame() {
  return (
    <div className="bg-[#f8fafc] h-[32px] relative rounded-[6px] shrink-0 w-full" data-name="Frame">
      <div aria-hidden="true" className="absolute border-[#eef0f2] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center px-[8px] py-[4px] relative size-full">
          <TrendUp />
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#0e172b] text-[0px] text-[10px] tracking-[-0.2px]">
            <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] text-[#12b981]">Green</span>
            <span className="leading-[20px]">{` indicates the best performer, `}</span>
            <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] text-[#ef4444]">Red</span>
            <span className="leading-[20px]">{` indicates the worst performer in each category.`}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative">
      <Frame21 />
      <Frame17 />
      <Frame />
    </div>
  );
}

function Frame13() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start px-[24px] relative w-full">
          <Frame22 />
        </div>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="relative shrink-0 size-[10px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
        <g id="Frame 8">
          <rect height="9.4" rx="4.7" stroke="var(--stroke-0, #000065)" strokeOpacity="0.4" strokeWidth="0.6" width="9.4" x="0.3" y="0.3" />
          <circle cx="5" cy="5" fill="var(--fill-0, #000064)" id="Ellipse 8" r="3" />
        </g>
      </svg>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[8px] h-[18px] items-center py-[2px] relative shrink-0 w-full">
      <Frame2 />
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#0e172b] text-[10px] w-[118px] whitespace-pre-wrap">{`Best Overall Performer: `}</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#0e172b] text-[10px]">Unnamed Property (YP-002285)</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="relative shrink-0 size-[10px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
        <g id="Frame 8">
          <rect height="9.4" rx="4.7" stroke="var(--stroke-0, #000065)" strokeOpacity="0.4" strokeWidth="0.6" width="9.4" x="0.3" y="0.3" />
          <circle cx="5" cy="5" fill="var(--fill-0, #000064)" id="Ellipse 8" r="3" />
        </g>
      </svg>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex gap-[8px] h-[18px] items-center py-[2px] relative shrink-0 w-full">
      <Frame5 />
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#0e172b] text-[10px] w-[118px] whitespace-pre-wrap">Best Cash Flow:</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#0e172b] text-[10px]">Unnamed Property (YP-002285)</p>
    </div>
  );
}

function Frame81() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
      <Frame3 />
      <Frame4 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="relative shrink-0 size-[10px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
        <g id="Frame 8">
          <rect height="9.4" rx="4.7" stroke="var(--stroke-0, #000065)" strokeOpacity="0.4" strokeWidth="0.6" width="9.4" x="0.3" y="0.3" />
          <circle cx="5" cy="5" fill="var(--fill-0, #000064)" id="Ellipse 8" r="3" />
        </g>
      </svg>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex gap-[8px] h-[18px] items-center py-[2px] relative shrink-0 w-full">
      <Frame8 />
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#0e172b] text-[10px] w-[118px] whitespace-pre-wrap">Best ROI (5-Year):</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#0e172b] text-[10px]">Unnamed Property (YP-002285)</p>
    </div>
  );
}

function Frame12() {
  return (
    <div className="relative shrink-0 size-[10px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
        <g id="Frame 8">
          <rect height="9.4" rx="4.7" stroke="var(--stroke-0, #000065)" strokeOpacity="0.4" strokeWidth="0.6" width="9.4" x="0.3" y="0.3" />
          <circle cx="5" cy="5" fill="var(--fill-0, #000064)" id="Ellipse 8" r="3" />
        </g>
      </svg>
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex gap-[8px] h-[18px] items-center py-[2px] relative shrink-0 w-full">
      <Frame12 />
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#0e172b] text-[10px] w-[118px] whitespace-pre-wrap">Worst Cash Flow:</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#0e172b] text-[10px]">Worst Cash Flow:</p>
    </div>
  );
}

function Frame82() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
      <Frame7 />
      <Frame11 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
      <Frame81 />
      <Frame82 />
    </div>
  );
}

function Text1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-center min-h-px min-w-px relative" data-name="Text">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#0e172b] text-[12px] w-full whitespace-pre-wrap">Key Highlights</p>
      <Frame6 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[24px] relative w-full">
          <Text1 />
        </div>
      </div>
    </div>
  );
}

function TrendUp1() {
  return (
    <div className="relative shrink-0 size-[8.4px]" data-name="trend up">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.4 8.4">
        <g id="trend up">
          <path d={svgPaths.p3eb8b140} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.7" />
          <path d={svgPaths.p346a7ae0} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.7" />
        </g>
      </svg>
    </div>
  );
}

function Icon() {
  return (
    <div className="bg-[#12b9a6] content-stretch flex items-center justify-center relative rounded-[175px] shrink-0 size-[14px]" data-name="Icon">
      <TrendUp1 />
    </div>
  );
}

function Logo() {
  return (
    <div className="content-stretch flex gap-[3.267px] items-center relative shrink-0" data-name="Logo">
      <Icon />
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[11.433px] not-italic relative shrink-0 text-[#0a0a0a] text-[9.8px] text-center">YieldPulse</p>
    </div>
  );
}

function Frame83() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch flex items-start justify-between px-[24px] relative w-full">
        <Logo />
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#0e172b] text-[8px]">Page 1</p>
      </div>
    </div>
  );
}

function Frame37() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-between min-h-px min-w-px relative w-full">
      <Frame13 />
      <Frame1 />
      <Frame83 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[24px] h-[842px] items-center left-0 pb-[24px] top-0 w-[595px]">
      <Frame9 />
      <Frame37 />
    </div>
  );
}

export default function A() {
  return (
    <div className="bg-white relative size-full" data-name="A4 - 2">
      <Frame10 />
    </div>
  );
}