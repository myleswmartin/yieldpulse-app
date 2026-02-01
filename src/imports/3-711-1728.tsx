import svgPaths from "./svg-9iknwo2fx8";
import imgNoiseTexture from "figma:asset/b27342f854d11a325f70ec2b46075793b138a7cf.png";

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

function Frame22() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center justify-center p-[8px] relative rounded-[4px] shrink-0 size-[20px]">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[14px] justify-center leading-[0] not-italic relative shrink-0 text-[#0a1461] text-[8px] text-center tracking-[-0.16px] w-[11px]">
        <p className="leading-[22px] whitespace-pre-wrap">02</p>
      </div>
    </div>
  );
}

function Frame19() {
  return (
    <div className="bg-[#1f2975] relative rounded-[5px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.12)] border-solid inset-0 pointer-events-none rounded-[5px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[6px] pr-[8px] py-[6px] relative w-full">
          <Frame22 />
          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[16px] not-italic relative shrink-0 text-[12px] text-white w-[352px] whitespace-pre-wrap">Executive Summary</p>
        </div>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="-translate-y-1/2 absolute content-stretch flex items-end justify-between left-0 rounded-[4px] top-[calc(50%-37px)] w-[531px]">
      <div className="bg-[#15b8a6] h-[92px] rounded-[4px] shrink-0 w-[56px]" />
      <div className="bg-[#15b8a6] h-[16px] opacity-0 shrink-0 w-[56px]" />
      <div className="bg-[#15b8a6] h-[63px] rounded-[4px] shrink-0 w-[56px]" />
      <div className="bg-[#15b8a6] h-[80px] opacity-0 shrink-0 w-[56px]" />
      <div className="bg-[#15b8a6] h-[80px] opacity-0 shrink-0 w-[56px]" />
      <div className="bg-[#15b8a6] h-[80px] opacity-0 shrink-0 w-[56px]" />
      <div className="bg-[#15b8a6] h-[46px] rounded-[4px] shrink-0 w-[56px]" />
      <div className="bg-[#15b8a6] h-[80px] opacity-0 shrink-0 w-[56px]" />
      <div className="bg-[#15b8a6] h-[27px] rounded-[4px] shrink-0 w-[56px]" />
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-[28px] not-italic text-[8px] text-center text-white top-[41px] tracking-[-0.16px] w-[32px] whitespace-pre-wrap">96K</p>
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-[147px] not-italic text-[8px] text-center text-white top-[56px] tracking-[-0.16px] w-[32px] whitespace-pre-wrap">91K</p>
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-[384px] not-italic text-[8px] text-center text-white top-[64px] tracking-[-0.16px] w-[32px] whitespace-pre-wrap">67K</p>
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-[503px] not-italic text-[8px] text-center text-white top-[74px] tracking-[-0.16px] w-[32px] whitespace-pre-wrap">8K</p>
    </div>
  );
}

function Frame16() {
  return (
    <div className="h-[182px] overflow-clip relative rounded-[4px] shrink-0 w-full">
      <Frame1 />
      <div className="absolute bg-[#ef4444] h-[16px] left-[59px] rounded-[4px] top-[108px] w-[56.333px]" />
      <div className="absolute bg-[#ef4444] h-[34px] left-[178px] rounded-[4px] top-[108px] w-[56px]" />
      <div className="absolute bg-[#ef4444] h-[25px] left-[297px] rounded-[4px] top-[108px] w-[56px]" />
      <div className="absolute bg-[#ef4444] h-[66px] left-[416px] rounded-[4px] top-[108px] w-[56px]" />
      <div className="absolute bg-[#ef4444] h-[55px] left-[237px] rounded-[4px] top-[108px] w-[56px]" />
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[28px] not-italic text-[#64748b] text-[8px] text-center top-[108px] tracking-[-0.16px] w-[32px] whitespace-pre-wrap">Gross Income</p>
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[147px] not-italic text-[#64748b] text-[8px] text-center top-[108px] tracking-[-0.16px] w-[32px] whitespace-pre-wrap">Effective Income</p>
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[384px] not-italic text-[#64748b] text-[8px] text-center top-[108px] tracking-[-0.16px] w-[32px] whitespace-pre-wrap">Net Op. Income</p>
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[503px] not-italic text-[#64748b] text-[8px] text-center top-[108px] tracking-[-0.16px] w-[32px] whitespace-pre-wrap">Cash Flow</p>
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[87px] not-italic text-[#64748b] text-[8px] text-center top-[80px] tracking-[-0.16px] w-[32px] whitespace-pre-wrap">Vacancy Loss</p>
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[206px] not-italic text-[#64748b] text-[8px] text-center top-[80px] tracking-[-0.16px] w-[32px] whitespace-pre-wrap">Service Change</p>
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[265px] not-italic text-[#64748b] text-[8px] text-center top-[80px] tracking-[-0.16px] w-[32px] whitespace-pre-wrap">Maintennance</p>
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[325px] not-italic text-[#64748b] text-[8px] text-center top-[80px] tracking-[-0.16px] w-[32px] whitespace-pre-wrap">Mgmt Fee</p>
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[443.5px] not-italic text-[#64748b] text-[8px] text-center top-[80px] tracking-[-0.16px] w-[41px] whitespace-pre-wrap">Mortgage Payment</p>
    </div>
  );
}

function Frame17() {
  return (
    <div className="bg-[#f8fafc] relative rounded-[6px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#eef0f2] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start p-[8px] relative w-full">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] min-w-full not-italic relative shrink-0 text-[#0e172b] text-[12px] w-[min-content] whitespace-pre-wrap">{`Income & Expense`}</p>
        <Frame16 />
        <p className="font-['Inter:Italic',sans-serif] font-normal italic leading-[20px] opacity-50 relative shrink-0 text-[#0e172b] text-[10px] tracking-[-0.2px]">Bridge from gross rental income to net cash flow after all expenses and debt service.</p>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="relative shrink-0 w-full" data-name="Frame">
      <div aria-hidden="true" className="absolute border-[#e4e4e4] border-b-[0.6px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex font-['Inter:Semi_Bold',sans-serif] font-semibold gap-[8px] items-center justify-center leading-[20px] not-italic pb-[2px] px-[8px] relative text-[10px] w-full whitespace-pre-wrap">
          <p className="flex-[1_0_0] min-h-px min-w-px relative text-[#0e172b]">Category</p>
          <p className="flex-[1_0_0] min-h-px min-w-px relative text-[#1e2875] text-right">Annual Cost</p>
          <p className="flex-[1_0_0] min-h-px min-w-px relative text-[#1e2875] text-right">% of Effective Income</p>
        </div>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Frame">
      <div aria-hidden="true" className="absolute border-[#e4e4e4] border-b-[0.6px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex font-['Inter:Regular',sans-serif] font-normal gap-[8px] items-center justify-center leading-[20px] not-italic pb-[2px] px-[8px] relative text-[#0e172b] text-[8px] tracking-[-0.16px] w-full whitespace-pre-wrap">
          <p className="flex-[1_0_0] min-h-px min-w-px relative">Service Charge</p>
          <p className="flex-[1_0_0] min-h-px min-w-px relative text-right">AED 7,500</p>
          <p className="flex-[1_0_0] min-h-px min-w-px relative text-right">8.22%</p>
        </div>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Frame">
      <div aria-hidden="true" className="absolute border-[#e4e4e4] border-b-[0.6px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex font-['Inter:Regular',sans-serif] font-normal gap-[8px] items-center justify-center leading-[20px] not-italic pb-[2px] px-[8px] relative text-[#0e172b] text-[8px] tracking-[-0.16px] w-full whitespace-pre-wrap">
          <p className="flex-[1_0_0] min-h-px min-w-px relative">Maintenance Cost</p>
          <p className="flex-[1_0_0] min-h-px min-w-px relative text-right">AED 12,000</p>
          <p className="flex-[1_0_0] min-h-px min-w-px relative text-right">13.2%</p>
        </div>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Frame">
      <div aria-hidden="true" className="absolute border-[#e4e4e4] border-b-[0.6px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex font-['Inter:Regular',sans-serif] font-normal gap-[8px] items-center justify-center leading-[20px] not-italic pb-[2px] px-[8px] relative text-[#0e172b] text-[8px] tracking-[-0.16px] w-full whitespace-pre-wrap">
          <p className="flex-[1_0_0] min-h-px min-w-px relative">Property Management</p>
          <p className="flex-[1_0_0] min-h-px min-w-px relative text-right">AED 4,800</p>
          <p className="flex-[1_0_0] min-h-px min-w-px relative text-right">5.26%</p>
        </div>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Frame">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex font-['Inter:Bold',sans-serif] font-bold gap-[8px] items-center justify-center leading-[20px] not-italic pb-[2px] px-[8px] relative text-[#0e172b] text-[8px] tracking-[-0.16px] w-full whitespace-pre-wrap">
          <p className="flex-[1_0_0] min-h-px min-w-px relative">Total Experience Expenses</p>
          <p className="flex-[1_0_0] min-h-px min-w-px relative text-right">AED 24,300</p>
          <p className="flex-[1_0_0] min-h-px min-w-px relative text-right">26.6%</p>
        </div>
      </div>
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
      <Frame2 />
      <Frame3 />
      <Frame4 />
      <Frame5 />
    </div>
  );
}

function Table() {
  return (
    <div className="bg-[#f8fafc] relative rounded-[8px] shrink-0 w-full" data-name="Table">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[12px] items-start p-[8px] relative w-full">
          <Frame />
          <Frame21 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#eef0f2] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame6() {
  return (
    <div className="bg-[#f8fafc] relative rounded-[8px] shrink-0 w-full">
      <div className="flex flex-col justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[2px] items-start justify-center not-italic px-[12px] py-[8px] relative w-full whitespace-pre-wrap">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] relative shrink-0 text-[#15b8a6] text-[10px] tracking-[-0.2px] w-full">Insight</p>
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[8px] text-[rgba(14,23,43,0.5)] tracking-[-0.16px] w-full">Vacancy reduces gross income by 5.00% (AED 4,800). Operating expenses consume 26.6% of effective income, leaving AED 66,900 NOI. Mortgage payments of AED 58,927 (88.1% of NOI) result in AED 7,973 annual cash flow.</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#eef0f2] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative">
      <Frame19 />
      <Frame17 />
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#0e172b] text-[12px] w-full whitespace-pre-wrap">Operating Expense Breakdown</p>
      <Table />
      <Frame6 />
    </div>
  );
}

function Frame15() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start px-[24px] relative w-full">
          <Frame18 />
        </div>
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex gap-[8px] items-center leading-[16px] not-italic relative shrink-0 text-[10px] w-full">
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0 text-black">Report Date:</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[#0e172b]">27 Jan 2026</p>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <Frame7 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex gap-[8px] items-center leading-[16px] not-italic relative shrink-0 text-[10px] w-full">
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0 text-black">Prepared by:</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[#0e172b]">YieldPulse Platform</p>
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <Frame8 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[16px] not-italic relative shrink-0 text-[10px] text-black">Confidential Investment Report</p>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <Frame9 />
    </div>
  );
}

function Text1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Text">
      <div className="content-stretch flex items-start justify-between px-[8px] relative w-full">
        <Frame10 />
        <Frame11 />
        <Frame12 />
      </div>
    </div>
  );
}

function Frame14() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch flex flex-col items-start px-[16px] relative w-full">
        <Text1 />
      </div>
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-between min-h-px min-w-px relative w-full">
      <Frame15 />
      <Frame14 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[24px] h-[842px] items-center left-0 pb-[24px] top-0 w-[595px]">
      <Cover />
      <Frame20 />
    </div>
  );
}

export default function Component() {
  return (
    <div className="bg-white relative size-full" data-name="3">
      <Frame13 />
    </div>
  );
}