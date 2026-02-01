import svgPaths from "./svg-rnm5pdtatl";
import imgNoiseTexture from "figma:asset/b27342f854d11a325f70ec2b46075793b138a7cf.png";

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

function Text() {
  return (
    <div className="relative shrink-0 w-full" data-name="Text">
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col gap-[8px] items-center not-italic px-[8px] relative text-white w-full whitespace-pre-wrap">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[28px] relative shrink-0 text-[24px] tracking-[-0.48px] w-full">Investment Decision Helper</p>
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[10px] w-full">Higher scores represent lower risk exposure. This radar chart compares properties across key risk factors, revealing stability, volatility, relative investment safety, and long-term portfolio confidence for informed decision making.</p>
        </div>
      </div>
    </div>
  );
}

function Frame8() {
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

function Frame() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Frame">
          <path d={svgPaths.p3a21e900} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="1.25" />
          <path d="M10 1.66667V18.3333" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Frame14() {
  return (
    <div className="bg-[#12b981] content-stretch flex items-center p-[4px] relative rounded-[8px] shrink-0">
      <Frame />
    </div>
  );
}

function Text1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Text">
      <Frame14 />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] not-italic relative shrink-0 text-[#0e172b] text-[12px] tracking-[-0.24px]">Best for Cash Flow</p>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start not-italic relative shrink-0 w-full whitespace-pre-wrap">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[10px] text-[rgba(14,23,43,0.5)] tracking-[-0.2px] w-full">Property 2</p>
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[28px] relative shrink-0 text-[#12b981] text-[20px] w-full">AED 15,331/month</p>
    </div>
  );
}

function Card() {
  return (
    <div className="bg-[#f8fafc] flex-[1_0_0] min-h-px min-w-px relative rounded-[10px]" data-name="Card">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[24px] items-start p-[16px] relative w-full">
          <Text1 />
          <Frame9 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#eef0f2] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function TrendUp() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="trend up">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="trend up">
          <path d={svgPaths.p18d01f80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p1b2fa380} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Frame13() {
  return (
    <div className="bg-[#20bbaa] content-stretch flex items-center p-[4px] relative rounded-[8px] shrink-0">
      <TrendUp />
    </div>
  );
}

function Text2() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Text">
      <Frame13 />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] not-italic relative shrink-0 text-[#0e172b] text-[12px] tracking-[-0.24px]">Best 5-Year Return</p>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start not-italic relative shrink-0 w-full whitespace-pre-wrap">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[10px] text-[rgba(14,23,43,0.5)] tracking-[-0.2px] w-full">Property 2</p>
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[28px] relative shrink-0 text-[#15b8a6] text-[20px] w-full">AED 1,459,351</p>
    </div>
  );
}

function Card1() {
  return (
    <div className="bg-[#f8fafc] flex-[1_0_0] min-h-px min-w-px relative rounded-[10px]" data-name="Card">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[24px] items-start p-[16px] relative w-full">
          <Text2 />
          <Frame10 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#eef0f2] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Cards() {
  return (
    <div className="content-stretch flex gap-[8px] items-start overflow-clip relative rounded-[8px] shrink-0 w-full" data-name="Cards">
      <Card />
      <Card1 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Frame">
          <path d={svgPaths.p187b5100} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="1.25" />
          <path d={svgPaths.p118f8a00} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Frame16() {
  return (
    <div className="bg-[#1e2875] content-stretch flex items-center p-[4px] relative rounded-[8px] shrink-0">
      <Frame1 />
    </div>
  );
}

function Text3() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Text">
      <Frame16 />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] not-italic relative shrink-0 text-[#0e172b] text-[12px] tracking-[-0.24px]">Lowest Entry Cost</p>
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start not-italic relative shrink-0 w-full whitespace-pre-wrap">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[10px] text-[rgba(14,23,43,0.5)] tracking-[-0.2px] w-full">test 123</p>
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[28px] relative shrink-0 text-[#1e2875] text-[20px] w-full">AED 395,000</p>
    </div>
  );
}

function Card2() {
  return (
    <div className="bg-[#f8fafc] flex-[1_0_0] min-h-px min-w-px relative rounded-[10px]" data-name="Card">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[24px] items-start p-[16px] relative w-full">
          <Text3 />
          <Frame11 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#eef0f2] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function VerticalBarChart() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Vertical Bar chart">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Vertical Bar chart">
          <path d="M11.0514 11.9376V6.9918" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          <path d="M14.8694 11.937V4.24492" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          <path d="M7.23486 11.9389V9.73944" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          <path d={svgPaths.p38829a00} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
        </g>
      </svg>
    </div>
  );
}

function Frame15() {
  return (
    <div className="bg-[#f59e0c] content-stretch flex items-center p-[4px] relative rounded-[8px] shrink-0">
      <VerticalBarChart />
    </div>
  );
}

function Text4() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Text">
      <Frame15 />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] not-italic relative shrink-0 text-[#0e172b] text-[12px] tracking-[-0.24px]">Best Net Yield</p>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start not-italic relative shrink-0 w-full whitespace-pre-wrap">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[10px] text-[rgba(14,23,43,0.5)] tracking-[-0.2px] w-full">Property 2</p>
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[28px] relative shrink-0 text-[#f59e0c] text-[20px] w-full">18.2%</p>
    </div>
  );
}

function Card3() {
  return (
    <div className="bg-[#f8fafc] flex-[1_0_0] min-h-px min-w-px relative rounded-[10px]" data-name="Card">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[24px] items-start p-[16px] relative w-full">
          <Text4 />
          <Frame12 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#eef0f2] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Cards1() {
  return (
    <div className="content-stretch flex gap-[8px] items-start overflow-clip relative rounded-[8px] shrink-0 w-full" data-name="Cards">
      <Card2 />
      <Card3 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Cards />
      <Cards1 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="bg-[#fffbea] relative rounded-[12px] shrink-0 w-full">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start p-[12px] relative w-full">
          <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[0] min-h-px min-w-px not-italic relative text-[#7b3306] text-[0px] text-[10px] tracking-[-0.2px] whitespace-pre-wrap">
            <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px]">Remember:</span>
            <span className="leading-[16px]">{` The "best" property depends on your investment goals. If you need monthly income, prioritize cash flow. If you're focused on long-term wealth, consider total return and appreciation. Always factor in your risk tolerance and liquidity needs.`}</span>
          </p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#fee685] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-start min-h-px min-w-px relative">
      <Frame17 />
      <Frame2 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start px-[24px] relative w-full">
          <Frame3 />
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

function Frame5() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch flex items-start justify-between px-[24px] relative w-full">
        <Logo />
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#0e172b] text-[8px]">Page 5</p>
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-between min-h-px min-w-px relative w-full">
      <Frame6 />
      <Frame5 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[24px] h-[842px] items-center left-0 pb-[24px] top-0 w-[595px]">
      <Frame8 />
      <Frame7 />
    </div>
  );
}

export default function A() {
  return (
    <div className="bg-white relative size-full" data-name="A4 - 6">
      <Frame4 />
    </div>
  );
}