
import React, { useState, useEffect, useCallback, ReactNode, ReactElement } from 'react';
import { Company, Meeting, Task, TaskStatus, View, NotificationItem, Contact, Quotation, Contract, Study, QuotationStatus } from './types';
import { 
  Button, Card, Input, Textarea, Select, Modal, CompanyForm, MeetingForm, TaskForm, GanttChartRenderer, StatCard, UpcomingItemCard 
} from './components';
import { 
  PlusIcon, TrashIcon, PencilIcon, BellIcon, DashboardIcon, ClientsIcon, ChevronDownIcon, CalendarDaysIcon, ListBulletIcon, ChartBarIcon, UserCircleIcon, EnvelopeIcon, PhoneIcon, MapPinIcon, InformationCircleIcon, ClipboardDocumentListIcon, BeakerIcon, CalendarModernIcon, ChevronLeftIcon, ChevronRightIcon, ChartPieIcon, ArrowDownTrayIcon, XMarkIcon, Bars3Icon
} from './icons';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthPage } from './components/auth/AuthPage';
import { LoadingSpinner } from './components/ui/UIComponents';
import { MyPage } from './src/components/profile/MyPage';
import { ClientTableView } from './src/components/clients/ClientTableView';
import { companiesAPI, meetingsAPI, tasksAPI, notificationsAPI } from './services/api';
import * as XLSX from 'xlsx';

// Responsive Hook
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
};

// LocalStorage Keys
const COMPANIES_STORAGE_KEY = 'crm_companies';
const MEETINGS_STORAGE_KEY = 'crm_meetings';
const TASKS_STORAGE_KEY = 'crm_tasks';
const NOTIFICATIONS_STORAGE_KEY = 'crm_notifications';

// Helper to format date for display
const formatDate = (isoDate: string | undefined | Date) => {
  if (!isoDate) return 'N/A';
  try {
    return new Date(isoDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  } catch (e) {
    return 'Invalid Date';
  }
}
const formatDateTime = (isoDate: string | undefined | Date) => {
  if (!isoDate) return 'N/A';
   try {
    return new Date(isoDate).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return 'Invalid Date';
  }
}

// Helper for Client Detail Overview items
interface InfoItemProps {
  icon: ReactElement<{ className?: string }>;
  label:string;
  value?:string | string[] | boolean | number; 
  type?: 'email' | 'tel' | 'text' | 'url' | 'boolean' | 'stringArray';
  options?: {value: string; label: string}[]; // For displaying label from dropdown options
}

const InfoItem: React.FC<InfoItemProps> = ({icon, label, value, type='text', options}) => {
    if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) return null;
    
    let contentValue: ReactNode = String(value);
    if (options && typeof value === 'string') {
        const option = options.find(opt => opt.value === value);
        contentValue = option ? option.label : String(value);
    } else if (type === 'email' && typeof value === 'string') contentValue = <a href={`mailto:${value}`} className="text-brand-primary hover:underline">{value}</a>;
    else if (type === 'tel' && typeof value === 'string') contentValue = <a href={`tel:${value}`} className="text-brand-primary hover:underline">{value}</a>;
    else if (type === 'url' && typeof value === 'string') contentValue = <a href={value.startsWith('http') ? value : `http://${value}`} target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">{value}</a>;
    else if (type === 'boolean') contentValue = value ? 'Yes' : 'No';
    else if (type === 'stringArray' && Array.isArray(value)) contentValue = value.join(', ');


    let iconElement = null;
    if (icon && React.isValidElement(icon)) {
      if (typeof icon.type === 'function' || typeof icon.type === 'string') {
        iconElement = React.cloneElement(icon, { className: "w-5 h-5" });
      } else {
        console.warn("InfoItem: Received an icon that is a valid React element but has an invalid type property.", icon);
      }
    } else if (icon) {
      console.warn("InfoItem: Received an invalid icon prop that is not a React element.", icon);
    }


    return (
        <div className="flex items-start space-x-3">
            <span className="text-brand-accent mt-1">
              {iconElement}
            </span>
            <div>
                <p className="font-semibold text-dark-text">{label}</p>
                <p className="text-medium-text break-all">{contentValue}</p>
            </div>
        </div>
    );
}

const getTaskStatusStyles = (status: TaskStatus): string => {
  switch (status) {
    case TaskStatus.Completed: return 'bg-green-100 text-green-800';
    case TaskStatus.InProgress: return 'bg-blue-100 text-blue-800';
    case TaskStatus.Pending: return 'bg-yellow-100 text-yellow-800';
    case TaskStatus.Delayed: return 'bg-red-100 text-red-800';
    case TaskStatus.OnHold: return 'bg-gray-100 text-gray-800';
    default: return 'bg-slate-100 text-slate-800';
  }
};

const EXCEL_MOCK_DATA_SOURCE = [
    {견적번호:"25-01-DL-0001",견적날짜:"2025-01-02",계약번호:null,시험기준:"NGLP",견적명:"임상병리검사",의뢰기관:"성균관대학교",의뢰담당자:"오지은",의뢰자연락처:"010-5053-4201",의뢰자EMAIL:"Martia96@gmail.com",제출용도:"-",시험물질:null,담당자:"임정모",견적금액:"950,000",계약금액:null},
    {견적번호:"25-02-DL-0002",견적날짜:"2025-02-07",계약번호:"25-053",시험기준:"NGLP",견적명:"설치류 4주 투여 DRF 시험",의뢰기관:"인바이오",의뢰담당자:"김택수",의뢰자연락처:"010-6344-8531",의뢰자EMAIL:"tskim@enbiomix.co.kr",제출용도:"-",시험물질:"화학물질",담당자:"임정모",견적금액:"19,000,000",계약금액:"19,000,000"},
    {견적번호:"25-02-DL-0003",견적날짜:"2025-02-17",계약번호:null,시험기준:"NGLP",견적명:"인간 PMBC를 이용한 융합단백질의 Immunegonciti test",의뢰기관:"메디맵바이오",의뢰담당자:"김은주",의뢰자연락처:"010-8717-6521",의뢰자EMAIL:null,제출용도:"-",시험물질:"융합단백질",담당자:"임정모",견적금액:"84,000,000",계약금액:null},
    {견적번호:"25-02-DL-0004",견적날짜:"2025-02-20",계약번호:null,시험기준:"KGLP",견적명:"의약품 정책 투여_4주DRF_13주반복2주회복_TK_약리_광독성",의뢰기관:"펄스인마이어스",의뢰담당자:"백승일",의뢰자연락처:"010-5466-7321",의뢰자EMAIL:"si.baek@pearlsinmires.com",제출용도:"FDA, MFDS 제출",시험물질:"의약품",담당자:"임정모",견적금액:"978,651,000",계약금액:null},
    {견적번호:"25-02-DL-0005",견적날짜:"2025-02-19",계약번호:null,시험기준:"NGLP",견적명:"프로젠_내부 DIO모델링 검증을 위한 Dexa 측정_25'0219_김인선생님",의뢰기관:"프로젠",의뢰담당자:"김인성",의뢰자연락처:"010-7197-4931",의뢰자EMAIL:null,제출용도:"-",시험물질:null,담당자:"임정모",견적금액:"700,000",계약금액:null},
    {견적번호:"25-03-DL-0006",견적날짜:"2025-03-05",계약번호:null,시험기준:"KGLP",견적명:"의약품 정책 투여_2주DRF_8주반복2주회복_TK_광독",의뢰기관:"펄스인마이어스",의뢰담당자:"백승일",의뢰자연락처:"010-5466-7321",의뢰자EMAIL:"si.baek@pearlsinmires.com",제출용도:"FDA, MFDS 제출",시험물질:"의약품",담당자:"임정모",견적금액:"655,052,500",계약금액:null},
    {견적번호:"25-03-DL-0007",견적날짜:"2025-03-06",계약번호:null,시험기준:"NGLP",견적명:"인바이오(주)_화학물질_급성경구독성시험_TG423_25'0306",의뢰기관:"인바이오",의뢰담당자:"김택수",의뢰자연락처:"010-6344-8531",의뢰자EMAIL:"tskim@enbiomix.co.kr",제출용도:"-",시험물질:"화학물질",담당자:"임정모",견적금액:"6,000,000",계약금액:null},
    {견적번호:"25-03-DL-0008",견적날짜:"2025-03-10",계약번호:null,시험기준:"NGLP",견적명:"조직병리검사",의뢰기관:"식약처",의뢰담당자:"배예지",의뢰자연락처:"010-5932-0396",의뢰자EMAIL:"yeji0124@korea.kr",제출용도:"-",시험물질:"의약품",담당자:"임정모",견적금액:"38,000,000",계약금액:null},
    {견적번호:"25-03-DL-0009",견적날짜:"2025-03-10",계약번호:null,시험기준:"NGLP",견적명:"임상병리검사",의뢰기관:"식약처",의뢰담당자:"배예지",의뢰자연락처:"010-5932-0396",의뢰자EMAIL:"yeji0124@korea.kr",제출용도:"-",시험물질:"의약품",담당자:"임정모",견적금액:"47,215,000",계약금액:null},
    {견적번호:"25-03-DL-0010",견적날짜:"2025-03-11",계약번호:null,시험기준:"NGLP",견적명:"임상병리검사",의뢰기관:"성균관대학교",의뢰담당자:"이정진",의뢰자연락처:"010-7184-6210",의뢰자EMAIL:"wjdwlslee0204@gmail.com",제출용도:"-",시험물질:null,담당자:"임정모",견적금액:"2,600,000",계약금액:null},
    {견적번호:"25-03-DL-0010-1",견적날짜:"2025-03-13",계약번호:null,시험기준:"NGLP",견적명:"임상병리검사",의뢰기관:"성균관대학교",의뢰담당자:"이정진",의뢰자연락처:"010-7184-6210",의뢰자EMAIL:"wjdwlslee0204@gmail.com",제출용도:"-",시험물질:null,담당자:"임정모",견적금액:"1,640,000",계약금액:null},
    {견적번호:"25-03-DL-0006-1",견적날짜:"2025-03-05",계약번호:null,시험기준:"KGLP",견적명:"(주)펄스인마이어스_의약품 정책투여_DC범위_2주DRF_8주반복2주회복_TK_광독_독성_25.0319",의뢰기관:"펄스인마이어스",의뢰담당자:"백승일",의뢰자연락처:"010-5466-7321",의뢰자EMAIL:"si.baek@pearlsinmires.com",제출용도:"FDA, MFDS 제출",시험물질:"의약품",담당자:"임정모",견적금액:"33,280,000",계약금액:null},
    {견적번호:"25-03-DL-0011",견적날짜:"2025-03-27",계약번호:null,시험기준:"NGLP",견적명:"HepG2 Cell xenograft model",의뢰기관:"앱타머사이언스",의뢰담당자:"김정민",의뢰자연락처:"010-9456-9504",의뢰자EMAIL:"mserk@aptsci.com",제출용도:"-",시험물질:null,담당자:"임정모",견적금액:"3,000,000",계약금액:null},
    {견적번호:"25-04-DL-0012",견적날짜:"2025-04-01",계약번호:null,시험기준:"KGLP",견적명:"19-RR-0021 랫드 13주 영역 번역",의뢰기관:"메디톡스",의뢰담당자:"류동욱",의뢰자연락처:"010-47256556",의뢰자EMAIL:"dwryu@medytox.com",제출용도:"-",시험물질:null,담당자:"임정모",견적금액:"2,500,000",계약금액:null},
    {견적번호:"25-04-DL-0013",견적날짜:"2025-04-03",계약번호:null,시험기준:"KGLP",견적명:"19-RR-0690, 0961 CTD",의뢰기관:"경동제약",의뢰담당자:"이보민",의뢰자연락처:"010-7191-1704",의뢰자EMAIL:"bmlee@kdpharma.co.kr",제출용도:"-",시험물질:null,담당자:"임정모",견적금액:"3,100,000",계약금액:"3,100,000"},
    {견적번호:"25-04-DL-0013-1",견적날짜:"2025-04-03",계약번호:null,시험기준:"KGLP",견적명:"19-RR-0690~0693 CTD",의뢰기관:"경동제약",의뢰담당자:"이보민",의뢰자연락처:"010-7191-1704",의뢰자EMAIL:"bmlee@kdpharma.co.kr",제출용도:"-",시험물질:null,담당자:"임정모",견적금액:"618,516,000",계약금액:"618,516,000"},
    {견적번호:"25-03-DL-0006-3",견적날짜:"2025-04-09",계약번호:null,시험기준:"KGLP",견적명:"(주)펄스인마이어스_의약품 정책투여_DC범위_2주DRF_8주반복2주회복_TK_광독_독성_25.0319",의뢰기관:"펄스인마이어스",의뢰담당자:"백승일",의뢰자연락처:"010-5466-7321",의뢰자EMAIL:"si.baek@pearlsinmires.com",제출용도:"FDA, MFDS 제출",시험물질:"의약품",담당자:"임정모",견적금액:"38,220,000",계약금액:null},
    {견적번호:"25-04-DL-0015",견적날짜:"2025-04-18",계약번호:null,시험기준:"NGLP",견적명:"엠틱스바이오_Caco2_Xenograft model_암세포 피하주입_in vivo_25_0424", 의뢰기관:"엠틱스바이오",의뢰담당자:"안효상",의뢰자연락처:"010-4696-4602",의뢰자EMAIL:"hsahn@amtixbio.com",제출용도:"-",시험물질:null,담당자:"임정모",견적금액:"31,500,000",계약금액:null},
    {견적번호:"25-04-DL-0016",견적날짜:"2025-04-18",계약번호:null,시험기준:"NGLP",견적명:"엠틱스바이오_모델형성_in vivo_25_0424", 의뢰기관:"엠틱스바이오",의뢰담당자:"안효상",의뢰자연락처:"010-4696-4602",의뢰자EMAIL:"hsahn@amtixbio.com",제출용도:"-",시험물질:null,담당자:"임정모",견적금액:"18,000,000",계약금액:null},
    {견적번호:"25-04-DL-0017",견적날짜:"2025-04-21",계약번호:null,시험기준:"KGLP",견적명:"19-RR-0021, 18-RR-0792, 18-MG-0795, 19-RR-0021 보험증명서 영역 번역",의뢰기관:"메디톡스",의뢰담당자:"류동욱",의뢰자연락처:"010-4725-6556",의뢰자EMAIL:"dwryu@medytox.com",제출용도:"-",시험물질:null,담당자:"임정모",견적금액:"4,000,000",계약금액:null},
    {견적번호:"25-04-DL-0018",견적날짜:"2025-04-22",계약번호:null,시험기준:"NGLP",견적명:"아테온바이오_MC38_Syngeneicmodel_암세포 피하주입_in vivo_25_0422",의뢰기관:"아테온바이오",의뢰담당자:"전윤재",의뢰자연락처:"010-5445-2509",의뢰자EMAIL:"yjeon@atheonbio.com",제출용도:"-",시험물질:null,담당자:"임정모",견적금액:"31,400,000",계약금액:null},
    {견적번호:"25-05-DL-0019",견적날짜:"2025-05-07",계약번호:null,시험기준:"NGLP",견적명:"임상병리검사",의뢰기관:"보훈의학연구소",의뢰담당자:"김길환",의뢰자연락처:"02-2225-3922",의뢰자EMAIL:"kimkhshep@naver.com",제출용도:"일반의뢰용",시험물질:null,담당자:"임정모",견적금액:"800,000",계약금액:null},
    {견적번호:"25-05-DL-0020",견적날짜:"2025-05-12",계약번호:null,시험기준:"NGLP",견적명:"일반의약품_SD Rat_PK_5,7,9Point)25'0512",의뢰기관:"디에이징월드",의뢰담당자:"전혜준",의뢰자연락처:"010-3523-7797",의뢰자EMAIL:"hyejoon.ajeon@gmail.com",제출용도:"-",시험물질:"일반의약품",담당자:"임정모",견적금액:null,계약금액:null}, // 견적금액 없음
    {견적번호:"25-05-DL-0021",견적날짜:"2025-05-27",계약번호:null,시험기준:"KGLP",견적명:"의약품_경구투여_안전성약리_25'0527",의뢰기관:"JW C&C 신약연구소",의뢰담당자:"고선호",의뢰자연락처:"010-6731-0316",의뢰자EMAIL:"shkoh@jwhealthcare.com",제출용도:"MFDS 제출",시험물질:"의약품",담당자:"임정모",견적금액:"91,840,000",계약금액:null},
    {견적번호:"25-05-DL-0022",견적날짜:"2025-05-27",계약번호:null,시험기준:"NGLP",견적명:"mRNA-LNP_IVIS_exvivo_qPCR_25'0527",의뢰기관:"멥스젠",의뢰담당자:"김혁",의뢰자연락처:"010-3824-2959",의뢰자EMAIL:"hkim@mepsgen.com",제출용도:"-",시험물질:null,담당자:"임정모",견적금액:"18,810,000",계약금액:null},
    {견적번호:"25-06-DL-0023",견적날짜:"2025-06-05",계약번호:null,시험기준:"NGLP",견적명:"대웅테라퓨틱스_ADC_단회투여_조직병리_랫_25_0605",의뢰기관:"대웅테라퓨틱스",의뢰담당자:"문지영",의뢰자연락처:"010-8725-2294",의뢰자EMAIL:"moonji20@daewoongrx.co.kr",제출용도:"-",시험물질:null,담당자:"임정모",견적금액:"21,350,000",계약금액:null},
    {견적번호:"25-06-DL-0024",견적날짜:"2025-06-10",계약번호:null,시험기준:"NGLP",견적명:"종근당효종연구소_퇴조직직시냅스가소성바이오마커분석_25'0610",의뢰기관:"종근당효종연구소",의뢰담당자:"김혜정",의뢰자연락처:"010-6511-3154",의뢰자EMAIL:"hyejeong.kim@ckdpharm.com",제출용도:"MFDS 제출",시험물질:"건기식",담당자:"임정모",견적금액:"125,000,000",계약금액:null},
    {견적번호:"25-06-DL-0025",견적날짜:"2025-06-16",계약번호:null,시험기준:"KGLP",견적명:"중앙미생물연구소_4주DRF_13주반복_4주회복_김영선팀장님_25'0616",의뢰기관:"중앙미생물연구소",의뢰담당자:"김영선",의뢰자연락처:"010-6252-2607",의뢰자EMAIL:"sirius2247@naver.com",제출용도:"MFDS 제출",시험물질:"건기식",담당자:"임정모",견적금액:"22,000,000",계약금액:null},
    {견적번호:"25-06-DL-0026",견적날짜:"2025-06-18",계약번호:null,시험기준:"NGLP",견적명:"NVPHEALTHCARE_설치류_일반의약품_PK_10~12point_IV_PO_25'0618", 의뢰기관:"엔비피헬스케어",의뢰담당자:"전용감",의뢰자연락처:"010-6559-7508",의뢰자EMAIL:"bravechun@nvp-healthcare.com",제출용도:"MFDS 제출",시험물질:"의약품",담당자:"임정모",견적금액:"76,000,000",계약금액:null},
    {견적번호:"25-06-DL-0027",견적날짜:"2025-06-18",계약번호:null,시험기준:"NGLP",견적명:"NVPHEALTHCARE_비설치류_일반의약품_PK_10~12point_IV_PO_25'0618", 의뢰기관:"엔비피헬스케어",의뢰담당자:"전용감",의뢰자연락처:"010-6559-7508",의뢰자EMAIL:"bravechun@nvp-healthcare.com",제출용도:"MFDS 제출",시험물질:"의약품",담당자:"임정모",견적금액:null,계약금액:null}, // 견적금액 없음
    {견적번호:"25-06-DL-0028",견적날짜:null,계약번호:null,시험기준:null,견적명:null,의뢰기관:"충남대학교",의뢰담당자:null,의뢰자연락처:null,의뢰자EMAIL:null,제출용도:null,시험물질:null,담당자:null,견적금액:null,계약금액:null}, // 데이터 부족
    {견적번호:"25-06-DL-0029",견적날짜:"2025-06-24",계약번호:null,시험기준:"NGLP",견적명:"비글견의 전혈 채혈 및 공급",의뢰기관:"레드진",의뢰담당자:"박정은",의뢰자연락처:"010-5458-2957",의뢰자EMAIL:"jepark@red-gene.com",제출용도:"-",시험물질:null,담당자:"임정모",견적금액:"21,530,000",계약금액:null},
    {견적번호:"25-06-DL-0030",견적날짜:"2025-06-24",계약번호:null,시험기준:"NGLP",견적명:"비글견의 전혈 채혈 및 공급",의뢰기관:"레드진",의뢰담당자:"박정은",의뢰자연락처:"010-5458-2957",의뢰자EMAIL:"jepark@red-gene.com",제출용도:"-",시험물질:null,담당자:"임정모",견적금액:"15,590,000",계약금액:null},
];

// Options for mapping (should match those in components.tsx for consistency if possible)
const TESTING_STANDARDS_MOCK_OPTIONS = [ "KGLP", "NGLP", "OECD GLP", "ICH", "FDA GLP", "ISO 10993", "Other" ];
const SUBMISSION_PURPOSE_MOCK_OPTIONS = [ "MFDS", "FDA", "EMA", "PMDA", "Health Canada", "TGA", "Internal R&D", "Other" ];
const SUBSTANCE_INFO_MOCK_OPTIONS = [ "Small molecule", "Peptide / Protein", "Antibody", "Cell therapy", "Gene therapy", "Vaccine", "Medical device", "Combination product", "Other" ];

function mapExcelValueToOption(value: string | null, options: string[], isPurposeField: boolean = false): string {
    if (!value || value.trim() === "-") return ''; // Return empty for "-" or null
    
    // For submission purpose, handle comma separated values by taking the first one that matches
    if (isPurposeField && value.includes(',')) {
        const parts = value.split(',').map(p => p.trim());
        for (const part of parts) {
            const directMatch = options.find(opt => opt.toLowerCase() === part.toLowerCase());
            if (directMatch) return directMatch;
        }
    } else {
        const directMatch = options.find(opt => opt.toLowerCase() === value.toLowerCase());
        if (directMatch) return directMatch;
    }
    
    // Fuzzy matching for some common cases
    if (value.toLowerCase().includes("fda")) return "FDA";
    if (value.toLowerCase().includes("mfds")) return "MFDS";
    if (value.toLowerCase().includes("kglp")) return "KGLP";
    if (value.toLowerCase().includes("nglp")) return "NGLP";
    
    const otherOption = options.find(opt => opt.toLowerCase().includes("other") || opt.toLowerCase().includes("기타"));
    return otherOption || value; // Fallback to raw value if no "Other" or specific match
}


function processExcelMockData(rawData: typeof EXCEL_MOCK_DATA_SOURCE): { companies: Company[] } {
    const companiesMap = new Map<string, Company>();

    rawData.forEach(row => {
        if (!row.의뢰기관) return; // Skip rows without a client organization

        let company = companiesMap.get(row.의뢰기관);
        if (!company) {
            company = {
                id: crypto.randomUUID(),
                name: row.의뢰기관,
                address: '', // Excel data does not provide address
                contacts: [],
                notes: '',
                createdAt: row.견적날짜 ? new Date(row.견적날짜).toISOString() : new Date().toISOString(),
                quotations: [],
                contracts: [],
                studies: [],
                website: '',
                mainPhoneNumber: ''
            };
        }

        let contact: Contact | undefined = company.contacts.find(c => c.name === row.의뢰담당자);
        if (!contact && row.의뢰담당자) {
            contact = {
                id: crypto.randomUUID(),
                name: row.의뢰담당자,
                email: row.의뢰자EMAIL || '',
                phone: row.의뢰자연락처 || '',
                isPrimary: company.contacts.length === 0, // First contact is primary
                department: '', 
                fax: ''
            };
            company.contacts.push(contact);
        } else if (contact && company.contacts.length === 1 && !contact.isPrimary) {
             // If there's only one contact and it wasn't marked primary, mark it now.
            contact.isPrimary = true;
        }


        const contactIdForItems = contact?.id || company.contacts.find(c => c.isPrimary)?.id || (company.contacts.length > 0 ? company.contacts[0].id : crypto.randomUUID()); // Fallback for items

        if (row.견적번호 && row.견적명) {
            const study: Study = {
                id: crypto.randomUUID(),
                contactId: contactIdForItems,
                studyNumber: row.견적번호,
                studyName: row.견적명,
                studyDirector: row.담당자 || '',
                studyPeriodStart: row.견적날짜 ? new Date(row.견적날짜).toISOString() : new Date().toISOString(),
                studyPeriodEnd: row.견적날짜 ? new Date(new Date(row.견적날짜).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString() : new Date().toISOString(), // Default end date 30 days later
                testingStandards: mapExcelValueToOption(row.시험기준, TESTING_STANDARDS_MOCK_OPTIONS),
                substanceInfo: mapExcelValueToOption(row.시험물질, SUBSTANCE_INFO_MOCK_OPTIONS),
                submissionPurpose: mapExcelValueToOption(row.제출용도, SUBMISSION_PURPOSE_MOCK_OPTIONS, true)
            };
            company.studies = [...(company.studies || []), study];

            if (row.견적금액) {
                 const quotation: Quotation = {
                    id: crypto.randomUUID(),
                    contactId: contactIdForItems,
                    quotationNumber: row.견적번호,
                    quotationName: row.견적명,
                    quotationAmount: `${row.견적금액.replace(/,/g, "")} KRW`, // Store as string with currency
                    // discountRate, paymentTerms can be added if available or defaulted
                };
                company.quotations = [...(company.quotations || []), quotation];
            }
        }

        if (row.계약번호 && row.계약금액 && row.견적번호 && row.견적명) {
            const contract: Contract = {
                id: crypto.randomUUID(),
                contactId: contactIdForItems,
                contractNumber: row.계약번호,
                contractName: `Contract for ${row.견적명}`,
                contractAmount: `${row.계약금액.replace(/,/g, "")} KRW`,
                contractPeriodStart: row.견적날짜 ? new Date(row.견적날짜).toISOString() : new Date().toISOString(),
                contractPeriodEnd: row.견적날짜 ? new Date(new Date(row.견적날짜).getTime() + 90 * 24 * 60 * 60 * 1000).toISOString() : new Date().toISOString(), // Default end date 90 days later
                // contractSigningDate, paymentTerms, taxInvoiceIssued, taxInvoiceIssueDate can be added
            };
            company.contracts = [...(company.contracts || []), contract];
        }
        
        companiesMap.set(company.name, company);
    });
    return { companies: Array.from(companiesMap.values()) };
}


// Main App Component with Authentication
const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  
  const [currentView, setCurrentView] = useState<View>({ type: 'dashboard' });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modals state
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [currentCompanyIdForModal, setCurrentCompanyIdForModal] = useState<string | null>(null);
  const [contactsForModal, setContactsForModal] = useState<Contact[]>([]);


  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] = useState(false);

  // TEMPORARY: Load data from localStorage instead of API
  useEffect(() => {
    const loadData = () => {
      setIsLoading(true);
      try {
        // Load from localStorage
        const storedCompanies = localStorage.getItem(COMPANIES_STORAGE_KEY);
        const storedMeetings = localStorage.getItem(MEETINGS_STORAGE_KEY);
        const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
        const storedNotifications = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);

        if (storedCompanies) setCompanies(JSON.parse(storedCompanies));
        if (storedMeetings) setMeetings(JSON.parse(storedMeetings));
        if (storedTasks) setTasks(JSON.parse(storedTasks));
        if (storedNotifications) setNotifications(JSON.parse(storedNotifications));
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Save data to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(COMPANIES_STORAGE_KEY, JSON.stringify(companies));
    }
  }, [companies, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(MEETINGS_STORAGE_KEY, JSON.stringify(meetings));
    }
  }, [meetings, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
    }
  }, [notifications, isLoading]);


  // Remove localStorage saving effects since we're using API now

  const generateNotifications = useCallback(() => {
    const newNotifications: NotificationItem[] = [];
    tasks.forEach(task => {
      const dueDate = new Date(task.endDate);
      const today = new Date();
      today.setHours(0,0,0,0); // Compare dates only
      dueDate.setHours(0,0,0,0);

      if (task.status !== TaskStatus.Completed && dueDate < today) {
        const existingNotification = notifications.find(n => n.relatedId === task.id && n.type === 'warning' && n.message.includes("is overdue"));
        if (!existingNotification) {
          newNotifications.push({
            id: crypto.randomUUID(),
            message: `Task "${task.name}" is overdue.`,
            type: 'warning',
            relatedId: task.id,
            isRead: false,
            createdAt: new Date().toISOString(),
          });
        }
      }
    });
    if(newNotifications.length > 0) {
      const currentTaskIds = new Set(tasks.map(t => t.id));
      const relevantPrevNotifications = notifications.filter(n => {
        if (n.relatedId && n.message.includes("is overdue")) { 
          return currentTaskIds.has(n.relatedId);
        }
        return true;
      });

      const combinedNotifications = [...relevantPrevNotifications];
      newNotifications.forEach(nn => {
        if (!combinedNotifications.some(cn => cn.relatedId === nn.relatedId && cn.message === nn.message)) {
          combinedNotifications.push(nn);
        }
      });
      setNotifications(combinedNotifications);
    }
  }, [tasks, notifications]); 

  useEffect(() => {
    if (!isLoading) {
      generateNotifications();
    }
  }, [tasks, isLoading, generateNotifications]);

  // CRUD Operations
  const handleSaveCompany = (company: Company) => {
    const isUpdating = companies.some(c => c.id === company.id);

    setCompanies(prev => {
      if (isUpdating) {
        return prev.map(c => (c.id === company.id ? company : c));
      }
      return [...prev, company];
    });
    
    setIsCompanyModalOpen(false);
    setEditingCompany(null);
  };

  const handleDeleteCompany = (companyId: string) => {
    if (window.confirm("Are you sure you want to delete this company and all related data?")) {
      setCompanies(prev => prev.filter(c => c.id !== companyId));
      setMeetings(prev => prev.filter(m => m.companyId !== companyId));
      setTasks(prev => prev.filter(t => t.companyId !== companyId));
      if (currentView.type === 'clientDetail' && currentView.clientId === companyId) {
        setCurrentView({ type: 'clientList' });
      }
    }
  };

  const handleSaveMeeting = (meeting: Meeting) => {
    setMeetings(prev => {
      const existing = prev.find(m => m.id === meeting.id);
      if (existing) return prev.map(m => m.id === meeting.id ? meeting : m);
      return [...prev, meeting];
    });
    setIsMeetingModalOpen(false);
    setEditingMeeting(null);
  };

  const handleDeleteMeeting = (meetingId: string) => {
    setMeetings(prev => prev.filter(m => m.id !== meetingId));
  };

  const handleSaveTask = (task: Task) => {
    setTasks(prev => {
      const existing = prev.find(t => t.id === task.id);
      if (existing) return prev.map(t => t.id === task.id ? task : t);
      return [...prev, task];
    });
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };
  
  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? {...n, isRead: true} : n));
  };
  
  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  const renderView = () => {
    switch (currentView.type) {
      case 'dashboard':
        return <DashboardView companies={companies} meetings={meetings} tasks={tasks} onViewTask={(task) => {
          setCurrentView({type: 'clientDetail', clientId: task.companyId});
        }} onViewMeeting={(meeting) => {
          setCurrentView({type: 'clientDetail', clientId: meeting.companyId});
        }} />;
      case 'clientList':
        return <ClientListView 
                  companies={companies} 
                  onAddCompany={() => { setEditingCompany(null); setIsCompanyModalOpen(true); }}
                  onEditCompany={(company) => { setEditingCompany(company); setIsCompanyModalOpen(true); }}
                  onDeleteCompany={handleDeleteCompany}
                  onSelectCompany={(companyId) => setCurrentView({ type: 'clientDetail', clientId: companyId })}
                />;
      case 'clientDetail':
        const company = companies.find(c => c.id === currentView.clientId);
        if (!company) {
          setCurrentView({ type: 'clientList' }); 
          return null;
        }
        return <ClientDetailView 
                  company={company}
                  meetings={meetings.filter(m => m.companyId === company.id)}
                  tasks={tasks.filter(t => t.companyId === company.id)}
                  onAddMeeting={() => { setCurrentCompanyIdForModal(company.id); setContactsForModal(company.contacts || []); setEditingMeeting(null); setIsMeetingModalOpen(true);}}
                  onEditMeeting={(meeting) => { setCurrentCompanyIdForModal(company.id); setContactsForModal(company.contacts || []); setEditingMeeting(meeting); setIsMeetingModalOpen(true); }}
                  onDeleteMeeting={handleDeleteMeeting}
                  onAddTask={() => { setCurrentCompanyIdForModal(company.id); setContactsForModal(company.contacts || []); setEditingTask(null); setIsTaskModalOpen(true);}}
                  onEditTask={(task) => { setCurrentCompanyIdForModal(company.id); setContactsForModal(company.contacts || []); setEditingTask(task); setIsTaskModalOpen(true); }}
                  onDeleteTask={handleDeleteTask}
                  onEditCompanyDetails={() => { setEditingCompany(company); setIsCompanyModalOpen(true); }}
                />;
      case 'calendar':
        return <CalendarView allTasks={tasks} allMeetings={meetings} companies={companies} />;
      case 'analytics':
        return <AnalyticsView companies={companies} />;
      case 'dataExport':
        return <DataExportView companies={companies} onImportData={(importedCompanies) => {
          setCompanies(prev => [...prev, ...importedCompanies]);
        }} />;
      case 'myPage':
        return <MyPage />;
      default:
        return <DashboardView companies={companies} meetings={meetings} tasks={tasks} onViewTask={() => {}} onViewMeeting={() => {}} />;
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen text-xl text-brand-primary">Loading Client Hub...</div>;
  }

  const getHeaderTitle = () => {
    switch(currentView.type) {
      case 'dashboard': return 'Dashboard Overview';
      case 'clientList': return 'Client Companies';
      case 'clientDetail': 
        const company = companies.find(c=>c.id === currentView.clientId);
        return company ? `${company.name} Details` : 'Client Details';
      case 'calendar': return 'Monthly Calendar';
      case 'analytics': return 'Analytics Dashboard';
      case 'dataExport': return 'Data Export';
      case 'settings': return 'Settings';
      case 'myPage': return '마이페이지';
      default: 
        const _exhaustiveCheck: never = currentView; 
        return 'CRO Client Hub';
    }
  }

  const handleNavClick = (view: View) => {
    setCurrentView(view);
    setIsMobileSidebarOpen(false);
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden"> {/* Added overflow-hidden to parent */}
      {/* Sidebar */}
      <nav className={`fixed inset-y-0 left-0 z-40 w-64 bg-dark-text text-slate-100 p-5 space-y-2 flex flex-col shadow-lg transform transition-transform duration-300 ease-in-out ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:static md:translate-x-0 md:shadow-lg md:flex-shrink-0`}>
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-center text-brand-accent mb-6">CRO Hub</h1>
            <Button variant="ghost" className="md:hidden text-white p-0 -mt-6" onClick={() => setIsMobileSidebarOpen(false)} aria-label="Close sidebar">
                <XMarkIcon className="w-6 h-6" />
            </Button>
        </div>
        
        <Button variant="ghost" className={`w-full justify-start text-lg ${currentView.type === 'dashboard' ? 'bg-brand-primary/20 text-white' : 'hover:bg-brand-primary/10 hover:text-white'}`} onClick={() => handleNavClick({ type: 'dashboard' })} leftIcon={<DashboardIcon />}>Dashboard</Button>
        <Button variant="ghost" className={`w-full justify-start text-lg ${currentView.type === 'clientList' || currentView.type === 'clientDetail' ? 'bg-brand-primary/20 text-white' : 'hover:bg-brand-primary/10 hover:text-white'}`} onClick={() => handleNavClick({ type: 'clientList' })} leftIcon={<ClientsIcon />}>Clients</Button>
        <Button variant="ghost" className={`w-full justify-start text-lg ${currentView.type === 'calendar' ? 'bg-brand-primary/20 text-white' : 'hover:bg-brand-primary/10 hover:text-white'}`} onClick={() => handleNavClick({ type: 'calendar' })} leftIcon={<CalendarModernIcon />}>Calendar</Button>
        <Button variant="ghost" className={`w-full justify-start text-lg ${currentView.type === 'analytics' ? 'bg-brand-primary/20 text-white' : 'hover:bg-brand-primary/10 hover:text-white'}`} onClick={() => handleNavClick({ type: 'analytics' })} leftIcon={<ChartPieIcon />}>Analytics</Button>
        <Button variant="ghost" className={`w-full justify-start text-lg ${currentView.type === 'dataExport' ? 'bg-brand-primary/20 text-white' : 'hover:bg-brand-primary/10 hover:text-white'}`} onClick={() => handleNavClick({ type: 'dataExport' })} leftIcon={<ArrowDownTrayIcon />}>Data Export</Button>
        <div className="mt-auto space-y-2">
            <Button variant="ghost" className={`w-full justify-start text-lg ${currentView.type === 'myPage' ? 'bg-brand-primary/20 text-white' : 'hover:bg-brand-primary/10 hover:text-white'}`} onClick={() => handleNavClick({ type: 'myPage' })} leftIcon={<UserCircleIcon />}>마이페이지</Button>
            <p className="text-xs text-slate-400 text-center pt-2">&copy; {new Date().getFullYear()} CRO Consulting</p>
        </div>
      </nav>

      {/* Overlay for mobile sidebar */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden"> {/* This will take up space next to static sidebar on md+, and full width under fixed sidebar on sm */}
        {/* Header */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center">
            <Button variant="ghost" className="md:hidden mr-2 p-1" onClick={() => setIsMobileSidebarOpen(true)} aria-label="Open sidebar">
                <Bars3Icon className="w-6 h-6 text-slate-600" />
            </Button>
            <h2 className="text-xl sm:text-2xl font-semibold text-dark-text truncate">
                {getHeaderTitle()}
            </h2>
          </div>
          
          <div className="relative">
            <Button variant="ghost" onClick={() => setIsNotificationsPanelOpen(prev => !prev)} className="relative p-1">
              <BellIcon className="w-6 h-6 text-slate-600" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500" />
              )}
            </Button>
            {isNotificationsPanelOpen && (
              <Card className="absolute right-0 mt-2 w-72 sm:w-80 z-20 max-h-96 overflow-y-auto">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-dark-text">Notifications</h3>
                  {unreadNotificationsCount > 0 && <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">{unreadNotificationsCount} New</span>}
                </div>
                {notifications.length === 0 ? (
                  <p className="text-sm text-center text-gray-500 py-4">No notifications.</p>
                ) : (
                  <ul className="space-y-2">
                    {notifications
                      .slice() 
                      .sort((a,b) => {
                        if (a.isRead !== b.isRead) {
                          return a.isRead ? 1 : -1; 
                        }
                        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); 
                      })
                      .map(n => (
                      <li key={n.id} className={`p-2 rounded ${n.isRead ? 'bg-slate-100 opacity-70' : 'bg-yellow-50'} border-l-4 ${n.type === 'warning' ? 'border-yellow-400' : 'border-blue-400'}`}>
                        <p className="text-sm text-medium-text">{n.message}</p>
                        {!n.isRead && (
                          <Button size="sm" variant="ghost" className="text-xs mt-1" onClick={() => markNotificationAsRead(n.id)}>Mark as read</Button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto bg-light-bg">
          {renderView()}
        </main>
      </div>

      {/* Modals */}
      <Modal 
        isOpen={isCompanyModalOpen} 
        onClose={() => {setIsCompanyModalOpen(false); setEditingCompany(null);}} 
        title={editingCompany ? 'Edit Company' : 'Add New Company'}
        size="2xl"
      >
        <CompanyForm 
          onSubmit={handleSaveCompany} 
          onCancel={() => {setIsCompanyModalOpen(false); setEditingCompany(null);}}
          initialData={editingCompany} 
        />
      </Modal>

      {currentCompanyIdForModal && (
        <Modal isOpen={isMeetingModalOpen} onClose={() => {setIsMeetingModalOpen(false); setEditingMeeting(null);}} title={editingMeeting ? 'Edit Meeting' : 'Add New Meeting'}>
          <MeetingForm 
            companyId={currentCompanyIdForModal}
            contacts={contactsForModal}
            onSubmit={handleSaveMeeting} 
            onCancel={() => {setIsMeetingModalOpen(false); setEditingMeeting(null);}}
            initialData={editingMeeting} 
          />
        </Modal>
      )}
      
      {currentCompanyIdForModal && (
        <Modal isOpen={isTaskModalOpen} onClose={() => {setIsTaskModalOpen(false); setEditingTask(null);}} title={editingTask ? 'Edit Task' : 'Add New Task'}>
          <TaskForm 
            companyId={currentCompanyIdForModal}
            contacts={contactsForModal}
            onSubmit={handleSaveTask} 
            onCancel={() => {setIsTaskModalOpen(false); setEditingTask(null);}}
            initialData={editingTask} 
          />
        </Modal>
      )}
    </div>
  );
};

// Calendar View Component
interface CalendarViewProps {
  allTasks: Task[];
  allMeetings: Meeting[];
  companies: Company[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ allTasks, allMeetings, companies }) => {
  const [currentDisplayMonth, setCurrentDisplayMonth] = useState(new Date());
  const [selectedDateDetails, setSelectedDateDetails] = useState<{ date: Date; items: (Task | Meeting)[] } | null>(null);
  const [isDateDetailModalOpen, setIsDateDetailModalOpen] = useState(false);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay(); 

  const goToPreviousMonth = () => {
    setCurrentDisplayMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDisplayMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDisplayMonth(new Date());
  };

  const getItemsForDate = (date: Date): (Task | Meeting)[] => {
    const items: (Task | Meeting)[] = [];
    const targetDateStr = date.toISOString().split('T')[0];

    allMeetings.forEach(meeting => {
      if (meeting.date.split('T')[0] === targetDateStr) {
        items.push(meeting);
      }
    });

    allTasks.forEach(task => {
      const startDate = new Date(task.startDate);
      const endDate = new Date(task.endDate);
      startDate.setHours(0,0,0,0);
      endDate.setHours(0,0,0,0);
      const target = new Date(date); 
      target.setHours(0,0,0,0);

      if (target >= startDate && target <= endDate) {
        items.push(task);
      }
    });
    return items;
  };

  const handleDayClick = (day: number) => {
    if (day <= 0) return; 
    const clickedDate = new Date(currentDisplayMonth.getFullYear(), currentDisplayMonth.getMonth(), day);
    const items = getItemsForDate(clickedDate);
    setSelectedDateDetails({ date: clickedDate, items });
    setIsDateDetailModalOpen(true);
  };

  const renderCalendarGrid = () => {
    const year = currentDisplayMonth.getFullYear();
    const month = currentDisplayMonth.getMonth();
    const daysInCurrentMonth = getDaysInMonth(year, month);
    const firstDayIndex = getFirstDayOfMonth(year, month); 

    const calendarDays = [];
    const prevMonth = new Date(year, month, 0); 
    const daysInPrevMonth = prevMonth.getDate();

    for (let i = 0; i < firstDayIndex; i++) {
      calendarDays.push({ day: daysInPrevMonth - firstDayIndex + 1 + i, isCurrentMonth: false, items: [] });
    }

    for (let day = 1; day <= daysInCurrentMonth; day++) {
      const dateForItems = new Date(year, month, day);
      calendarDays.push({ day, isCurrentMonth: true, items: getItemsForDate(dateForItems) });
    }

    const remainingCells = 7 - (calendarDays.length % 7);
    if (remainingCells < 7) { 
        for (let i = 1; i <= remainingCells; i++) {
            calendarDays.push({ day: i, isCurrentMonth: false, items: [] });
        }
    }
    

    const today = new Date();
    const isToday = (day: number) => 
        day === today.getDate() && 
        month === today.getMonth() && 
        year === today.getFullYear();

    return calendarDays.map((calDay, index) => (
      <div
        key={`day-${index}`}
        className={`p-2 border border-slate-200 h-28 md:h-32 flex flex-col items-start 
                    ${calDay.isCurrentMonth ? 'bg-white hover:bg-slate-50 cursor-pointer' : 'bg-slate-100 text-slate-400'}
                    ${calDay.isCurrentMonth && isToday(calDay.day) ? 'ring-2 ring-brand-primary' : ''}`}
        onClick={() => calDay.isCurrentMonth && handleDayClick(calDay.day)}
        role={calDay.isCurrentMonth ? "button" : undefined}
        tabIndex={calDay.isCurrentMonth ? 0 : -1}
        aria-label={calDay.isCurrentMonth ? `Events for ${formatDate(new Date(year, month, calDay.day))}` : `Day ${calDay.day} of other month`}
      >
        <span className={`font-medium ${calDay.isCurrentMonth && isToday(calDay.day) ? 'text-brand-primary font-bold' : (calDay.isCurrentMonth ? 'text-dark-text' : 'text-slate-400')}`}>
          {calDay.day}
        </span>
        {calDay.isCurrentMonth && calDay.items.length > 0 && (
          <div className="mt-1 space-y-0.5 overflow-y-auto max-h-20 w-full text-xs">
            {calDay.items.slice(0, 3).map(item => ( 
              <div key={item.id} className={`p-0.5 rounded-sm truncate ${'startDate' in item ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                {'startDate' in item ? (item as Task).name : (item as Meeting).title}
              </div>
            ))}
            {calDay.items.length > 3 && <div className="text-slate-500 text-center text-[10px]">+ {calDay.items.length - 3} more</div>}
          </div>
        )}
      </div>
    ));
  };


  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-dark-text">
            {currentDisplayMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="space-x-1 sm:space-x-2 mt-2 sm:mt-0">
            <Button onClick={goToPreviousMonth} variant="secondary" size="sm" leftIcon={<ChevronLeftIcon />} aria-label="Previous month">Prev</Button>
            <Button onClick={goToToday} variant="secondary" size="sm" aria-label="Go to today">Today</Button>
            <Button onClick={goToNextMonth} variant="secondary" size="sm" rightIcon={<ChevronRightIcon />} aria-label="Next month">Next</Button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-px bg-slate-200 border border-slate-200">
          {daysOfWeek.map(day => (
            <div key={day} className="p-1 sm:p-2 text-center font-medium text-xs sm:text-sm text-slate-600 bg-slate-100">
              {day}
            </div>
          ))}
          {renderCalendarGrid()}
        </div>
      </Card>
      
      {selectedDateDetails && (
        <Modal 
          isOpen={isDateDetailModalOpen} 
          onClose={() => {setIsDateDetailModalOpen(false); setSelectedDateDetails(null);}}
          title={`Events for ${formatDate(selectedDateDetails.date)}`}
          size="lg"
        >
          {selectedDateDetails.items.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No events scheduled for this day.</p>
          ) : (
            <ul className="space-y-3 max-h-[60vh] overflow-y-auto">
              {selectedDateDetails.items.map(item => {
                const isTask = 'startDate' in item;
                const company = companies.find(c => c.id === item.companyId);
                return (
                  <li key={item.id} className={`p-3 rounded-lg shadow-sm border-l-4 ${isTask ? 'border-blue-500 bg-blue-50' : 'border-green-500 bg-green-50'}`}>
                    <h4 className="font-semibold text-dark-text">{isTask ? (item as Task).name : (item as Meeting).title}</h4>
                    <p className="text-xs text-medium-text">Type: {isTask ? 'Task' : 'Meeting'}</p>
                    {company && <p className="text-xs text-medium-text">Client: {company.name}</p>}
                    {isTask && <p className="text-xs text-medium-text">Status: {(item as Task).status}</p>}
                    {isTask && <p className="text-xs text-medium-text">Period: {formatDate((item as Task).startDate)} - {formatDate((item as Task).endDate)}</p>}
                    {!isTask && <p className="text-xs text-medium-text">Time: {formatDateTime((item as Meeting).date)}</p>}
                  </li>
                );
              })}
            </ul>
          )}
        </Modal>
      )}
    </div>
  );
};


// Dashboard View Component
interface DashboardViewProps {
  companies: Company[];
  meetings: Meeting[];
  tasks: Task[];
  onViewTask: (task: Task) => void;
  onViewMeeting: (meeting: Meeting) => void;
}
const DashboardView: React.FC<DashboardViewProps> = ({ companies, meetings, tasks, onViewTask, onViewMeeting }) => {
  
  const getTaskDisplayInfo = (task: Task) => {
    const company = companies.find(c => c.id === task.companyId);
    const contact = company?.contacts?.find(con => con.id === task.contactId);
    return {
      companyName: company?.name,
      contactName: contact?.name,
    };
  };

  const upcomingTasks = tasks
    .filter(task => task.status !== TaskStatus.Completed && new Date(task.endDate) >= new Date())
    .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
    .slice(0, 5);

  const overdueTasks = tasks
    .filter(task => task.status !== TaskStatus.Completed && new Date(task.endDate) < new Date())
    .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
    .slice(0, 5);
  
  const upcomingMeetings = meetings
    .filter(meeting => new Date(meeting.date) >= new Date())
    .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0,5);

  const totalActiveTasks = tasks.filter(t => t.status === TaskStatus.InProgress || t.status === TaskStatus.Pending).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Clients" value={companies.length} icon={<ClientsIcon />} colorClass="text-brand-primary" />
        <StatCard title="Total Meetings" value={meetings.length} icon={<CalendarDaysIcon />} colorClass="text-brand-accent" />
        <StatCard title="Active Tasks" value={totalActiveTasks} icon={<ListBulletIcon />} colorClass="text-yellow-500" />
        <StatCard title="Completed Tasks" value={tasks.filter(t => t.status === TaskStatus.Completed).length} icon={<ChartBarIcon />} colorClass="text-green-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Upcoming Tasks" className="lg:col-span-1">
          {upcomingTasks.length > 0 ? (
            <div className="space-y-3">
              {upcomingTasks.map(task => {
                const { companyName, contactName } = getTaskDisplayInfo(task);
                return (
                  <div key={task.id} onClick={() => onViewTask(task)} className="cursor-pointer">
                    <UpcomingItemCard item={task} type="task" companyName={companyName} contactName={contactName} />
                  </div>
                );
              })}
            </div>
          ) : <p className="text-sm text-gray-500">No upcoming tasks.</p>}
        </Card>
        
        <Card title="Overdue Tasks" className="lg:col-span-1">
          {overdueTasks.length > 0 ? (
            <div className="space-y-3">
              {overdueTasks.map(task => {
                 const { companyName, contactName } = getTaskDisplayInfo(task);
                return (
                  <div key={task.id} onClick={() => onViewTask(task)} className="cursor-pointer">
                    <UpcomingItemCard item={task} type="task" companyName={companyName} contactName={contactName} />
                  </div>
                );
              })}
            </div>
          ) : <p className="text-sm text-gray-500">No overdue tasks.</p>}
        </Card>

        <Card title="Upcoming Meetings" className="lg:col-span-1">
          {upcomingMeetings.length > 0 ? (
             <div className="space-y-3">
              {upcomingMeetings.map(meeting => {
                const company = companies.find(c => c.id === meeting.companyId);
                const contact = company?.contacts?.find(con => con.id === meeting.contactId);
                return (
                  <div key={meeting.id} onClick={() => onViewMeeting(meeting)} className="cursor-pointer">
                    <UpcomingItemCard item={meeting} type="meeting" companyName={company?.name} contactName={contact?.name} />
                  </div>
                );
              })}
            </div>
          ) : <p className="text-sm text-gray-500">No upcoming meetings.</p>}
        </Card>
      </div>

      <Card title="Recent Activity (All Tasks Overview)">
         {tasks.length > 0 ? <GanttChartRenderer tasks={tasks.sort((a,b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime()).slice(0,15)} onTaskClick={onViewTask} /> : <p className="text-sm text-gray-500">No tasks to display.</p>}
      </Card>
    </div>
  );
};


// Client List View Component
interface ClientListViewProps {
  companies: Company[];
  onAddCompany: () => void;
  onEditCompany: (company: Company) => void;
  onDeleteCompany: (companyId: string) => void;
  onSelectCompany: (companyId: string) => void;
}
const ClientListView: React.FC<ClientListViewProps> = ({ companies, onAddCompany, onEditCompany, onDeleteCompany, onSelectCompany }) => {
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState<'card' | 'table'>(() => {
    return (localStorage.getItem('clientViewMode') as 'card' | 'table') || 'card';
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDirector, setFilterDirector] = useState('');
  const [filterStandard, setFilterStandard] = useState('');

  // Get unique directors and standards for filters
  const allDirectors = Array.from(new Set(companies.flatMap(c => c.studies?.map(s => s.studyDirector) || []).filter(Boolean)));
  const allStandards = Array.from(new Set(companies.flatMap(c => c.studies?.map(s => s.testingStandards) || []).filter(Boolean)));

  // Filter companies
  const filteredCompanies = companies.filter(company => {
    const matchesSearch = searchTerm === '' || 
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.contacts?.some(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDirector = filterDirector === '' || 
      company.studies?.some(s => s.studyDirector === filterDirector);
    
    const matchesStandard = filterStandard === '' || 
      company.studies?.some(s => s.testingStandards === filterStandard);
    
    return matchesSearch && matchesDirector && matchesStandard;
  });

  const handleViewModeChange = (mode: 'card' | 'table') => {
    setViewMode(mode);
    localStorage.setItem('clientViewMode', mode);
  };

  // 테이블 뷰 모드일 때
  if (viewMode === 'table' && !isMobile) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-dark-text">Client Companies</h2>
          <div className="flex items-center space-x-2">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => handleViewModeChange('card')}
                className="px-3 py-1 rounded text-sm transition"
              >
                📇 카드
              </button>
              <button
                onClick={() => handleViewModeChange('table')}
                className="px-3 py-1 rounded text-sm bg-white shadow transition"
              >
                📊 표
              </button>
            </div>
            <Button onClick={onAddCompany} leftIcon={<PlusIcon className="w-5 h-5"/>}>Add Company</Button>
          </div>
        </div>
        <ClientTableView
          companies={filteredCompanies}
          onEditCompany={onEditCompany}
          onDeleteCompany={onDeleteCompany}
          onSelectCompany={onSelectCompany}
        />
      </div>
    );
  }

  return (
    <Card title="Client Companies" actions={
      <div className="flex items-center space-x-2">
        {!isMobile && (
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => handleViewModeChange('card')}
              className="px-3 py-1 rounded text-sm bg-white shadow transition"
            >
              📇 카드
            </button>
            <button
              onClick={() => handleViewModeChange('table')}
              className="px-3 py-1 rounded text-sm transition"
            >
              📊 표
            </button>
          </div>
        )}
        <Button onClick={onAddCompany} leftIcon={<PlusIcon className="w-5 h-5"/>}>Add Company</Button>
      </div>
    }>
      {/* Search and Filter Section */}
      <div className="mb-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input
            placeholder="🔍 Search by company or contact name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            value={filterDirector}
            onChange={(e) => setFilterDirector(e.target.value)}
            options={allDirectors.map(d => ({ value: d, label: d }))}
          >
            <option value="">All Directors</option>
            {allDirectors.map(d => <option key={d} value={d}>{d}</option>)}
          </Select>
          <Select
            value={filterStandard}
            onChange={(e) => setFilterStandard(e.target.value)}
            options={allStandards.map(s => ({ value: s, label: s }))}
          >
            <option value="">All Standards</option>
            {allStandards.map(s => <option key={s} value={s}>{s}</option>)}
          </Select>
        </div>
        {(searchTerm || filterDirector || filterStandard) && (
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Showing {filteredCompanies.length} of {companies.length} companies</span>
            <button 
              onClick={() => { setSearchTerm(''); setFilterDirector(''); setFilterStandard(''); }}
              className="text-brand-primary hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {filteredCompanies.length === 0 ? (
        <p className="text-center text-gray-500 py-8">
          {companies.length === 0 ? 'No companies added yet. Click "Add Company" to get started.' : 'No companies match your filters.'}
        </p>
      ) : isMobile ? (
        /* Mobile Card View */
        <div className="space-y-3">
          {filteredCompanies.sort((a,b) => a.name.localeCompare(b.name)).map((company) => {
            const primaryContact = company.contacts?.find(c => c.isPrimary);
            const quotationCount = company.quotations?.length || 0;
            const contractCount = company.contracts?.length || 0;
            
            return (
              <div 
                key={company.id} 
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onSelectCompany(company.id)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-base">{company.name}</h3>
                    {primaryContact && (
                      <p className="text-sm text-gray-500 mt-1">{primaryContact.name}</p>
                    )}
                  </div>
                  <div className="flex space-x-2 ml-2" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => onEditCompany(company)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                      title="Edit"
                    >
                      <PencilIcon className="w-5 h-5 text-blue-600"/>
                    </button>
                    <button 
                      onClick={() => onDeleteCompany(company.id)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                      title="Delete"
                    >
                      <TrashIcon className="w-5 h-5 text-red-600"/>
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm" onClick={(e) => e.stopPropagation()}>
                  {primaryContact?.email && (
                    <a href={`mailto:${primaryContact.email}`} className="flex items-center text-gray-600 hover:text-brand-primary">
                      <EnvelopeIcon className="w-4 h-4 mr-2" />
                      <span className="truncate">{primaryContact.email}</span>
                    </a>
                  )}
                  {primaryContact?.phone && (
                    <a href={`tel:${primaryContact.phone}`} className="flex items-center text-gray-600 hover:text-brand-primary">
                      <PhoneIcon className="w-4 h-4 mr-2" />
                      <span>{primaryContact.phone}</span>
                    </a>
                  )}
                </div>
                
                <div className="flex space-x-4 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                  <span>📋 {quotationCount} Quotations</span>
                  <span>📄 {contractCount} Contracts</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Desktop Table View */
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Primary Contact</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Phone</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCompanies.sort((a,b) => a.name.localeCompare(b.name)).map((company) => {
                const primaryContact = company.contacts?.find(c => c.isPrimary);
                return (
                  <tr key={company.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-primary cursor-pointer hover:underline" onClick={() => onSelectCompany(company.id)}>{company.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">{primaryContact?.name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                      {primaryContact?.email ? (
                        <a href={`mailto:${primaryContact.email}`} className="text-brand-primary hover:underline">
                          {primaryContact.email}
                        </a>
                      ) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                      {primaryContact?.phone ? (
                        <a href={`tel:${primaryContact.phone}`} className="text-brand-primary hover:underline">
                          {primaryContact.phone}
                        </a>
                      ) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-1 sm:space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => onEditCompany(company)} title="Edit Company"><PencilIcon className="w-4 h-4 text-blue-600"/></Button>
                      <Button variant="ghost" size="sm" onClick={() => onDeleteCompany(company.id)} title="Delete Company"><TrashIcon className="w-4 h-4 text-red-600"/></Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};


// Client Detail View Component
interface ClientDetailViewProps {
  company: Company;
  meetings: Meeting[];
  tasks: Task[];
  onAddMeeting: () => void;
  onEditMeeting: (meeting: Meeting) => void;
  onDeleteMeeting: (meetingId: string) => void;
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onEditCompanyDetails: () => void;
}
const ClientDetailView: React.FC<ClientDetailViewProps> = ({ 
  company, meetings, tasks, 
  onAddMeeting, onEditMeeting, onDeleteMeeting, 
  onAddTask, onEditTask, onDeleteTask,
  onEditCompanyDetails
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'meetings' | 'schedule' | 'financials' | 'studies'>('overview');
  const primaryContact = company.contacts?.find(c => c.isPrimary);

  // Define display options locally for InfoItem usage
  const TESTING_STANDARDS_DISPLAY_OPTIONS = [ { value: "KGLP", label: "KGLP" }, { value: "NGLP", label: "NGLP" }, { value: "OECD GLP", label: "OECD GLP" }, { value: "ICH", label: "ICH" }, { value: "FDA GLP", label: "FDA GLP" }, { value: "ISO 10993", label: "ISO 10993" }, { value: "Other", label: "기타 (Other)" }];
  const SUBMISSION_PURPOSE_DISPLAY_OPTIONS = [ { value: "MFDS", label: "MFDS (Korea)" }, { value: "FDA", label: "FDA (US)" }, { value: "EMA", label: "EMA (Europe)" }, { value: "PMDA", label: "PMDA (Japan)" }, { value: "Health Canada", label: "Health Canada" }, { value: "TGA", label: "TGA (Australia)" }, { value: "Internal R&D", label: "Internal R&D" }, { value: "Other", label: "기타 (Other)" }];
  const SUBSTANCE_INFO_DISPLAY_OPTIONS = [ { value: "Small molecule", label: "Small molecule" }, { value: "Peptide / Protein", label: "Peptide / Protein" }, { value: "Antibody", label: "Antibody" }, { value: "Cell therapy", label: "Cell therapy" }, { value: "Gene therapy", label: "Gene therapy" }, { value: "Vaccine", label: "Vaccine" }, { value: "Medical device", label: "Medical device" }, { value: "Combination product", label: "Combination product" }, { value: "Other", label: "기타 (Other)" }];
  const PAYMENT_TERMS_DISPLAY_OPTIONS = [ { value: "Net 30", label: "Net 30 days" }, { value: "Net 60", label: "Net 60 days" }, { value: "Upfront 30 / Interim 40 / Balance 30", label: "선금 30%, 중도금 40%, 잔금 30%" }, { value: "On Contract 50 / On Completion 50", label: "계약시 50%, 종료시 50%" }, { value: "100% Upfront", label: "100% 선금" }, { value: "Other", label: "기타 (Other)" }];


  const TabButton: React.FC<{tabName: typeof activeTab, label: string, icon: ReactNode}> = ({tabName, label, icon}) => (
    <button 
      onClick={() => setActiveTab(tabName)}
      className={`flex items-center space-x-2 px-3 py-3 text-sm font-medium rounded-t-lg transition-colors
        ${activeTab === tabName 
          ? 'border-b-2 border-brand-primary text-brand-primary bg-white' 
          : 'text-slate-500 hover:text-brand-primary hover:bg-slate-100'}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
  
  const renderFinancialsOrStudies = (type: 'quotations' | 'contracts' | 'studies') => {
    const itemsSource: Quotation[] | Contract[] | Study[] = 
      type === 'quotations' ? (company.quotations || []) :
      type === 'contracts' ? (company.contracts || []) :
      (company.studies || []);

    const financialsByContact: Record<string, { contact: Contact | { id: string, name: string, isPrimary: boolean }, items: any[] }> = {};

    (company.contacts || []).forEach(contact => {
      financialsByContact[contact.id] = {
        contact,
        items: itemsSource.filter(item => item.contactId === contact.id)
      };
    });

    const unassignedItems = itemsSource.filter(item => !item.contactId || !(company.contacts || []).find(con => con.id === item.contactId));
    if (unassignedItems.length > 0) {
      financialsByContact['unassigned'] = {
        contact: { id: 'unassigned', name: 'Unassigned / Company General', isPrimary: false },
        items: unassignedItems
      };
    }

    const orderedContactIds = [
      primaryContact?.id,
      ...((company.contacts || []).map(c => c.id).filter(id => id !== primaryContact?.id)),
      (unassignedItems.length > 0 ? 'unassigned' : undefined)
    ].filter(Boolean) as string[];

    let foundItems = false;

    const renderedSections = orderedContactIds.map(contactId => {
      const group = financialsByContact[contactId];
      if (!group || group.items.length === 0) return null;
      foundItems = true;

      return (
        <section key={contactId} className="mb-6">
          <h4 className="text-lg font-semibold text-dark-text mb-3 border-b border-slate-200 pb-2">
            For Contact: {group.contact.name}
            {group.contact.isPrimary && " (Primary)"}
          </h4>
          <ul className="space-y-3">
            {group.items.map((item: any) => (
              <li key={item.id} className="p-3 bg-slate-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                {type === 'quotations' && (
                  <>
                    <p className="text-sm"><strong>Number:</strong> <span className="text-medium-text">{item.quotationNumber}</span></p>
                    <p className="text-sm"><strong>Name:</strong> <span className="text-medium-text">{item.quotationName}</span></p>
                    <p className="text-sm"><strong>Amount:</strong> <span className="text-medium-text">{item.quotationAmount || 'N/A'}</span></p>
                    {item.discountRate && <p className="text-sm"><strong>Discount:</strong> <span className="text-medium-text">{item.discountRate}%</span></p>}
                    {item.paymentTerms && <InfoItem icon={<InformationCircleIcon/>} label="Payment Terms" value={item.paymentTerms} options={PAYMENT_TERMS_DISPLAY_OPTIONS}/>}
                  </>
                )}
                {type === 'contracts' && (
                   <>
                    <p className="text-sm"><strong>Number:</strong> <span className="text-medium-text">{item.contractNumber}</span></p>
                    <p className="text-sm"><strong>Name:</strong> <span className="text-medium-text">{item.contractName}</span></p>
                    <p className="text-sm"><strong>Amount:</strong> <span className="text-medium-text">{item.contractAmount || 'N/A'}</span></p>
                    <p className="text-sm"><strong>Period:</strong> <span className="text-medium-text">{formatDate(item.contractPeriodStart)} - {formatDate(item.contractPeriodEnd)}</span></p>
                    {item.contractSigningDate && <p className="text-sm"><strong>Signing Date:</strong> <span className="text-medium-text">{formatDate(item.contractSigningDate)}</span></p>}
                    {item.paymentTerms && <p className="text-sm"><strong>Payment Terms:</strong> <span className="text-medium-text">{item.paymentTerms}</span></p>}
                    <p className="text-sm"><strong>Tax Invoice:</strong> <span className="text-medium-text">{item.taxInvoiceIssued ? `Yes (Issued: ${item.taxInvoiceIssueDate ? formatDate(item.taxInvoiceIssueDate) : 'N/A'})` : 'No'}</span></p>
                  </>
                )}
                {type === 'studies' && (
                   <>
                    <p className="text-sm"><strong>Number:</strong> <span className="text-medium-text">{item.studyNumber}</span></p>
                    <p className="text-sm"><strong>Name:</strong> <span className="text-medium-text">{item.studyName}</span></p>
                    <p className="text-sm"><strong>Director:</strong> <span className="text-medium-text">{item.studyDirector || 'N/A'}</span></p>
                    <p className="text-sm"><strong>Period:</strong> <span className="text-medium-text">{formatDate(item.studyPeriodStart)} - {formatDate(item.studyPeriodEnd)}</span></p>
                    {item.testingStandards && <InfoItem icon={<InformationCircleIcon/>} label="Testing Standard" value={item.testingStandards} options={TESTING_STANDARDS_DISPLAY_OPTIONS} />}
                    {item.substanceInfo && <InfoItem icon={<BeakerIcon/>} label="Substance Info" value={item.substanceInfo} options={SUBSTANCE_INFO_DISPLAY_OPTIONS} />}
                    {item.submissionPurpose && <InfoItem icon={<InformationCircleIcon/>} label="Submission Purpose" value={item.submissionPurpose} options={SUBMISSION_PURPOSE_DISPLAY_OPTIONS} />}
                  </>
                )}
              </li>
            ))}
          </ul>
        </section>
      );
    });

    return (
      <div className="space-y-6">
        {renderedSections}
        {!foundItems && <p className="text-sm text-gray-500 py-4">No {type} recorded for this client.</p>}
      </div>
    );
  };


  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-dark-text">{company.name}</h2>
                <p className="text-medium-text text-sm sm:text-base">Client since {formatDate(company.createdAt)}</p>
            </div>
            <Button onClick={onEditCompanyDetails} variant="secondary" leftIcon={<PencilIcon className="w-4 h-4"/>} className="mt-4 sm:mt-0">Edit Details</Button>
        </div>
        
        <div className="mt-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-1 overflow-x-auto" aria-label="Tabs">
            <TabButton tabName="overview" label="Overview" icon={<InformationCircleIcon className="w-5 h-5" />} />
            <TabButton tabName="meetings" label="Meetings" icon={<CalendarDaysIcon className="w-5 h-5" />} />
            <TabButton tabName="schedule" label="Schedule & Tasks" icon={<ChartBarIcon className="w-5 h-5" />} />
            <TabButton tabName="financials" label="Financials" icon={<ClipboardDocumentListIcon className="w-5 h-5" />} />
            <TabButton tabName="studies" label="Studies" icon={<BeakerIcon className="w-5 h-5" />} />
          </nav>
        </div>
      </Card>

      <div className="mt-2">
        {activeTab === 'overview' && (
          <Card title="Client Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-sm">
                <InfoItem icon={<MapPinIcon />} label="Company Address" value={company.address} />
                <InfoItem icon={<ClientsIcon />} label="Website" value={company.website} type="url" />
                <InfoItem icon={<PhoneIcon />} label="Main Phone" value={company.mainPhoneNumber} type="tel" />
                 {primaryContact && (
                    <>
                        <InfoItem icon={<UserCircleIcon />} label="Primary Contact" value={primaryContact.name} />
                        <InfoItem icon={<EnvelopeIcon />} label="Primary Contact Email" value={primaryContact.email} type="email" />
                        <InfoItem icon={<PhoneIcon />} label="Primary Contact Phone" value={primaryContact.phone} type="tel" />
                        <InfoItem icon={<InformationCircleIcon />} label="Primary Contact Dept." value={primaryContact.department} />
                        <InfoItem icon={<InformationCircleIcon />} label="Primary Contact Fax" value={primaryContact.fax} />
                    </>
                 )}
            </div>
            {company.notes && (
                <div className="mt-6">
                    <h4 className="font-semibold text-dark-text mb-1">Company Notes:</h4>
                    <p className="text-sm text-medium-text whitespace-pre-wrap p-3 bg-slate-50 rounded-md">{company.notes}</p>
                </div>
            )}
            {(company.contacts?.filter(c => !c.isPrimary).length || 0) > 0 && (
                 <div className="mt-6">
                    <h4 className="font-semibold text-dark-text mb-2">Other Contacts:</h4>
                    <ul className="space-y-2">
                    {company.contacts?.filter(c => !c.isPrimary).map(contact => (
                        <li key={contact.id} className="text-sm p-3 bg-slate-50 rounded-md shadow-sm">
                            <p className="font-medium text-dark-text">{contact.name}</p>
                            {contact.email && <InfoItem icon={<EnvelopeIcon />} label="Email" value={contact.email} type="email" />}
                            {contact.phone && <InfoItem icon={<PhoneIcon />} label="Phone" value={contact.phone} type="tel" />}
                            {contact.department && <InfoItem icon={<InformationCircleIcon />} label="Department" value={contact.department} />}
                            {contact.fax && <InfoItem icon={<InformationCircleIcon />} label="Fax" value={contact.fax} />}
                        </li>
                    ))}
                    </ul>
                 </div>
            )}
          </Card>
        )}

        {activeTab === 'meetings' && (
          <Card title="Meeting Records" actions={<Button onClick={onAddMeeting} leftIcon={<PlusIcon className="w-5 h-5"/>}>Log Meeting</Button>}>
            {meetings.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No meetings logged for this client yet.</p>
            ) : (
              <div className="space-y-4">
                {meetings.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(meeting => {
                  const contact = company.contacts?.find(c => c.id === meeting.contactId);
                  return (
                  <Card key={meeting.id} className="bg-slate-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-brand-primary text-lg">{meeting.title}</h4>
                        <p className="text-xs text-medium-text"><CalendarDaysIcon className="inline w-3 h-3 mr-1"/>{formatDateTime(meeting.date)}</p>
                        {contact && <p className="text-xs text-slate-500 mt-1">Related Contact: {contact.name}</p>}
                      </div>
                      <div className="space-x-1 sm:space-x-2 flex-shrink-0">
                        <Button variant="ghost" size="sm" onClick={() => onEditMeeting(meeting)} title="Edit Meeting"><PencilIcon className="w-4 h-4 text-blue-600"/></Button>
                        <Button variant="ghost" size="sm" onClick={() => onDeleteMeeting(meeting.id)} title="Delete Meeting"><TrashIcon className="w-4 h-4 text-red-600"/></Button>
                      </div>
                    </div>
                    <div className="mt-3 text-sm space-y-2">
                      {meeting.attendees && <p><strong className="text-dark-text">Attendees:</strong> {meeting.attendees}</p>}
                      <p><strong className="text-dark-text">Summary:</strong></p>
                      <p className="whitespace-pre-wrap text-medium-text pl-2 border-l-2 border-slate-200">{meeting.summary}</p>
                      {meeting.actionItems && 
                        <>
                          <p><strong className="text-dark-text">Action Items:</strong></p>
                          <p className="whitespace-pre-wrap text-medium-text pl-2 border-l-2 border-slate-200">{meeting.actionItems}</p>
                        </>
                      }
                    </div>
                  </Card>
                  );
                })}
              </div>
            )}
          </Card>
        )}

        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <Card title="Project Schedule (Gantt Chart)" actions={<Button onClick={onAddTask} leftIcon={<PlusIcon className="w-5 h-5"/>}>Add Task</Button>}>
              <GanttChartRenderer tasks={tasks} onTaskClick={onEditTask} />
            </Card>
            <Card title="Task List">
            {tasks.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No tasks created for this client yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Related Contact</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Start</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">End</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Assignee</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                  {tasks.sort((a,b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()).map(task => {
                    const contact = company.contacts?.find(c => c.id === task.contactId);
                    return (
                    <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-dark-text">{task.name}</td>
                       <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">{contact?.name || '-'}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">{formatDate(task.startDate)}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">{formatDate(task.endDate)}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTaskStatusStyles(task.status)}`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">{task.assignee || '-'}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => onEditTask(task)} title="Edit Task"><PencilIcon className="w-4 h-4 text-blue-600"/></Button>
                        <Button variant="ghost" size="sm" onClick={() => onDeleteTask(task.id)} title="Delete Task"><TrashIcon className="w-4 h-4 text-red-600"/></Button>
                      </td>
                    </tr>
                    );
                  })}
                  </tbody>
                </table>
              </div>
            )}
            </Card>
          </div>
        )}
        {activeTab === 'financials' && (
          <Card title="Financial Information">
            <div className="mb-6">
                <h3 className="text-xl font-semibold text-dark-text mb-4 border-b pb-2">Quotations</h3>
                {renderFinancialsOrStudies('quotations')}
            </div>
            <div>
                <h3 className="text-xl font-semibold text-dark-text mb-4 border-b pb-2">Contracts</h3>
                {renderFinancialsOrStudies('contracts')}
            </div>
          </Card>
        )}
        {activeTab === 'studies' && (
          <Card title="Study Information">
             {renderFinancialsOrStudies('studies')}
          </Card>
        )}
      </div>
    </div>
  );
};

// Analytics View Component
interface AnalyticsViewProps {
  companies: Company[];
}
const AnalyticsView: React.FC<AnalyticsViewProps> = ({ companies }) => {
  const totalQuotationsCount = companies.reduce((sum, company) => sum + (company.quotations?.length || 0), 0);
  const totalContractsCount = companies.reduce((sum, company) => sum + (company.contracts?.length || 0), 0);
  
  const ANALYTICS_SUBSTANCE_DISPLAY_OPTIONS = [ 
    { value: "Small molecule", label: "Small molecule" },
    { value: "Peptide / Protein", label: "Peptide / Protein" },
    { value: "Antibody", label: "Antibody" },
    { value: "Cell therapy", label: "Cell therapy" },
    { value: "Gene therapy", label: "Gene therapy" },
    { value: "Vaccine", label: "Vaccine" },
    { value: "Medical device", label: "Medical device" },
    { value: "Combination product", label: "Combination product" },
    { value: "Other", label: "기타 (Other)" }
  ];


  const parseAmount = (amountStr: string | undefined): number => {
    if (!amountStr) return 0;
    const numStr = amountStr.replace(/[^\d.-]/g, '');
    return parseFloat(numStr) || 0;
  };

  const totalQuotationAmount = companies.reduce((sum, company) => {
    return sum + (company.quotations?.reduce((qSum, q) => qSum + parseAmount(q.quotationAmount), 0) || 0);
  }, 0);

  const totalContractAmount = companies.reduce((sum, company) => {
    return sum + (company.contracts?.reduce((cSum, c) => cSum + parseAmount(c.contractAmount), 0) || 0);
  }, 0);

  const studiesBySubstance: Record<string, number> = {};
  companies.forEach(company => {
    company.studies?.forEach(study => {
      const substance = study.substanceInfo || "Unknown";
      studiesBySubstance[substance] = (studiesBySubstance[substance] || 0) + 1;
    });
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Quotations Issued" value={totalQuotationsCount} icon={<ClipboardDocumentListIcon />} colorClass="text-blue-500" />
        <StatCard title="Total Contracts Signed" value={totalContractsCount} icon={<ClipboardDocumentListIcon />} colorClass="text-green-500" />
        <StatCard title="Total Quotation Amount" value={`${totalQuotationAmount.toLocaleString()} KRW`} icon={<ChartBarIcon />} colorClass="text-blue-500" />
        <StatCard title="Total Contract Amount" value={`${totalContractAmount.toLocaleString()} KRW`} icon={<ChartBarIcon />} colorClass="text-green-500" />
      </div>
      <Card title="Studies by Substance Type">
        {Object.keys(studiesBySubstance).length > 0 ? (
          <ul className="space-y-2">
            {Object.entries(studiesBySubstance)
              .sort(([, countA], [, countB]) => countB - countA) 
              .map(([substance, count]) => {
                const substanceLabel = ANALYTICS_SUBSTANCE_DISPLAY_OPTIONS.find(opt => opt.value === substance)?.label || substance;
                const studiesText = `${count} ${count === 1 ? 'study' : 'studies'}`;
                
                return (
                  <li key={substance} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                    <span className="text-sm font-medium text-dark-text">{substanceLabel}</span>
                    <span className="text-sm text-brand-primary font-semibold">{studiesText}</span>
                  </li>
                );
              })}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No study data available to analyze by substance type.</p>
        )}
      </Card>
    </div>
  );
};

// Data Export View Component
interface DataExportViewProps {
  companies: Company[];
  onImportData: (importedCompanies: Company[]) => void;
}
const DataExportView: React.FC<DataExportViewProps> = ({ companies, onImportData }) => {
  const convertToCSV = (data: Company[]): string => {
    const headers = [
      "Company ID", "Company Name", "Address", "Website", "Main Phone", "Notes", "Created At",
      "Primary Contact Name", "Primary Contact Email", "Primary Contact Phone", "Primary Contact Department", "Primary Contact Fax"
    ];
    const rows = data.map(company => {
      const primaryContact = company.contacts?.find(c => c.isPrimary);
      return [
        company.id,
        company.name,
        company.address,
        company.website || '',
        company.mainPhoneNumber || '',
        company.notes?.replace(/"/g, '""').replace(/\n/g, ' ') || '', 
        formatDate(company.createdAt),
        primaryContact?.name || '',
        primaryContact?.email || '',
        primaryContact?.phone || '',
        primaryContact?.department || '',
        primaryContact?.fax || ''
      ].map(field => `"${String(field === null || field === undefined ? '' : field).replace(/"/g, '""')}"`).join(','); 
    });
    return [headers.join(','), ...rows].join('\n');
  };

  const downloadCSV = (csvData: string, filename: string) => {
    const blob = new Blob(['\uFEFF' + csvData], { type: 'text/csv;charset=utf-8;' }); // Add BOM for Excel UTF-8 compatibility
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleExportCompanies = () => {
    if (companies.length === 0) {
      alert("No company data to export.");
      return;
    }
    const csvData = convertToCSV(companies);
    downloadCSV(csvData, 'companies_export.csv');
  };

  // Excel Import Function - Supports both CSV and Excel files
  const handleImportExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Helper function to convert Excel serial date to JavaScript Date
    const excelDateToJSDate = (serial: number): Date => {
      // Excel stores dates as days since 1900-01-01 (with a bug for 1900 being a leap year)
      const utc_days = Math.floor(serial - 25569);
      const utc_value = utc_days * 86400;
      const date_info = new Date(utc_value * 1000);
      return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate());
    };

    // Helper function to check if value is Excel date serial number
    const isExcelDate = (value: any): boolean => {
      return typeof value === 'number' && value > 1 && value < 100000;
    };

    const reader = new FileReader();
    
    // Check file type
    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
    
    reader.onload = (e) => {
      try {
        let headers: string[] = [];
        let dataRows: string[][] = [];

        if (isExcel) {
          // Parse Excel file
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as string[][];
          
          if (jsonData.length < 2) {
            alert('파일에 데이터가 없습니다.');
            return;
          }
          
          headers = jsonData[0].map(h => String(h || '').trim());
          dataRows = jsonData.slice(1).filter(row => row.some(cell => cell));
        } else {
          // Parse CSV file
          const text = e.target?.result as string;
          const lines = text.split('\n').filter(line => line.trim());
          
          if (lines.length < 2) {
            alert('파일에 데이터가 없습니다.');
            return;
          }

          const parseCSVLine = (line: string): string[] => {
            const result: string[] = [];
            let current = '';
            let inQuotes = false;
            
            for (let i = 0; i < line.length; i++) {
              const char = line[i];
              if (char === '"') {
                inQuotes = !inQuotes;
              } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
              } else {
                current += char;
              }
            }
            result.push(current.trim());
            return result;
          };

          headers = parseCSVLine(lines[0]);
          dataRows = lines.slice(1).map(line => parseCSVLine(line));
        }

        // Debug: Log headers and data
        console.log('Headers:', headers);
        console.log('Data rows count:', dataRows.length);
        console.log('First data row:', dataRows[0]);

        // Map Excel columns to system fields
        const columnMap: { [key: string]: number } = {};
        headers.forEach((header, index) => {
          const normalized = header.toLowerCase().trim();
          if (normalized.includes('견적') && normalized.includes('날짜')) columnMap['quotationDate'] = index;
          else if (normalized.includes('견적서') && normalized.includes('번호')) columnMap['quotationNumber'] = index;
          else if (normalized.includes('계약번호')) columnMap['contractNumber'] = index;
          else if (normalized.includes('시험기준')) columnMap['testingStandards'] = index;
          else if (normalized.includes('견적명')) columnMap['quotationName'] = index;
          else if (normalized.includes('의뢰기관')) columnMap['companyName'] = index;
          else if (normalized.includes('의뢰자') && !normalized.includes('연락') && !normalized.includes('e-mail')) columnMap['contactName'] = index;
          else if (normalized.includes('연락처')) columnMap['contactPhone'] = index;
          else if (normalized.includes('e-mail') || normalized.includes('email')) columnMap['contactEmail'] = index;
          else if (normalized.includes('제출용도')) columnMap['submissionPurpose'] = index;
          else if (normalized.includes('물질')) columnMap['substanceInfo'] = index;
          else if (normalized.includes('담당자')) columnMap['studyDirector'] = index;
          else if (normalized.includes('견적금액')) columnMap['quotationAmount'] = index;
          else if (normalized.includes('할인율')) columnMap['discountRate'] = index;
          else if (normalized.includes('계약금액')) columnMap['contractAmount'] = index;
          else if (normalized.includes('결론')) columnMap['conclusion'] = index;
        });

        console.log('Column mapping:', columnMap);

        // Group by company
        const companiesMap = new Map<string, Company>();

        dataRows.forEach(row => {
          const getValue = (key: string, isDateField: boolean = false) => {
            const val = row[columnMap[key]];
            if (val === undefined || val === null) return '';
            
            // Handle Excel date serial numbers
            if (isDateField && isExcelDate(val)) {
              const date = excelDateToJSDate(Number(val));
              return date.toISOString();
            }
            
            return String(val).trim();
          };

          const companyName = getValue('companyName');
          if (!companyName) return;

          let company = companiesMap.get(companyName);
          if (!company) {
            company = {
              id: crypto.randomUUID(),
              name: companyName,
              address: '',
              website: '',
              mainPhoneNumber: '',
              contacts: [],
              notes: getValue('conclusion'),
              createdAt: new Date().toISOString(),
              quotations: [],
              contracts: [],
              studies: []
            };
            companiesMap.set(companyName, company);
          }

          // Add contact if not exists
          const contactName = getValue('contactName');
          if (contactName && !company.contacts.find(c => c.name === contactName)) {
            company.contacts.push({
              id: crypto.randomUUID(),
              name: contactName,
              email: getValue('contactEmail'),
              phone: getValue('contactPhone'),
              isPrimary: company.contacts.length === 0,
              department: '',
              fax: ''
            });
          }

          const contactId = company.contacts.find(c => c.name === contactName)?.id || company.contacts[0]?.id;

          // Add quotation
          const quotationNumber = getValue('quotationNumber');
          const quotationName = getValue('quotationName');
          if (quotationNumber && quotationName) {
            company.quotations = company.quotations || [];
            company.quotations.push({
              id: crypto.randomUUID(),
              contactId: contactId || '',
              quotationNumber,
              quotationName,
              quotationAmount: getValue('quotationAmount'),
              discountRate: getValue('discountRate'),
              paymentTerms: ''
            });
          }

          // Add contract
          const contractNumber = getValue('contractNumber');
          const contractAmount = getValue('contractAmount');
          if (contractNumber && contractAmount) {
            company.contracts = company.contracts || [];
            company.contracts.push({
              id: crypto.randomUUID(),
              contactId: contactId || '',
              contractNumber,
              contractName: `Contract for ${quotationName || contractNumber}`,
              contractAmount,
              contractPeriodStart: new Date().toISOString(),
              contractPeriodEnd: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
              contractSigningDate: '',
              paymentTerms: '',
              taxInvoiceIssued: false,
              taxInvoiceIssueDate: ''
            });
          }

          // Add study
          if (quotationNumber && quotationName) {
            company.studies = company.studies || [];
            const quotationDate = getValue('quotationDate', true); // true = date field
            company.studies.push({
              id: crypto.randomUUID(),
              contactId: contactId || '',
              studyNumber: quotationNumber,
              studyName: quotationName,
              studyDirector: getValue('studyDirector'),
              studyPeriodStart: quotationDate || new Date().toISOString(),
              studyPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              testingStandards: getValue('testingStandards'),
              substanceInfo: getValue('substanceInfo'),
              submissionPurpose: getValue('submissionPurpose')
            });
          }
        });

        const importedCompanies = Array.from(companiesMap.values());
        
        console.log('Imported companies:', importedCompanies);
        
        if (importedCompanies.length === 0) {
          alert('가져올 데이터가 없습니다.\n\n디버그 정보:\n- 헤더 수: ' + headers.length + '\n- 데이터 행 수: ' + dataRows.length + '\n\n브라우저 콘솔(F12)에서 자세한 정보를 확인하세요.');
          return;
        }

        if (window.confirm(`${importedCompanies.length}개의 고객사 데이터를 가져오시겠습니까?`)) {
          onImportData(importedCompanies);
          alert(`${importedCompanies.length}개의 고객사가 성공적으로 추가되었습니다!`);
        }

      } catch (error) {
        console.error('Import error:', error);
        alert('파일을 읽는 중 오류가 발생했습니다. 파일 형식을 확인해주세요.');
      }
    };

    // Read file based on type
    if (isExcel) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file, 'UTF-8');
    }
    
    event.target.value = ''; // Reset input
  };

  return (
    <Card title="Data Import & Export">
      <div className="space-y-6">
        {/* Import Section */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold text-dark-text mb-2">📥 Import Data</h3>
          <p className="text-sm text-medium-text mb-3">
            Excel 파일(.xlsx, .xls) 또는 CSV 파일을 업로드하여 고객사 데이터를 자동으로 추가할 수 있습니다.
          </p>
          <div className="bg-green-50 p-2 rounded-md mb-3">
            <p className="text-xs text-green-800">
              ✅ <strong>지원 형식:</strong> Excel (.xlsx, .xls), CSV (.csv)
            </p>
          </div>
          <div className="bg-blue-50 p-3 rounded-md mb-3">
            <p className="text-xs text-blue-800 font-semibold mb-1">필수 컬럼:</p>
            <p className="text-xs text-blue-700">
              견적 송부 날짜, 견적서 번호, 계약번호, 시험기준, 견적명, 의뢰기관, 의뢰자, 
              의뢰자연락처, 의뢰자 e-mail, 제출용도, 물질종류, 담당자, 견적금액, 할인율, 계약금액, 결론
            </p>
          </div>
          <div>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleImportExcel}
              className="hidden"
              id="excel-upload-input"
            />
            <label htmlFor="excel-upload-input" className="inline-block">
              <div className="cursor-pointer inline-flex items-center justify-center px-4 py-2 text-base font-medium rounded-md bg-slate-200 text-slate-700 hover:bg-slate-300 focus:ring-2 focus:ring-opacity-50 focus:ring-slate-400 transition-colors duration-150">
                <PlusIcon className="w-5 h-5 mr-2" />
                Excel/CSV 파일 업로드
              </div>
            </label>
          </div>
        </div>

        {/* Export Section */}
        <div>
          <h3 className="text-lg font-semibold text-dark-text mb-2">📤 Export Data</h3>
          <p className="text-sm text-medium-text mb-3">
            Export your client data to a CSV file for backup or use in other applications.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleExportCompanies} leftIcon={<ArrowDownTrayIcon className="w-5 h-5"/>}>
              Export All Companies to CSV
            </Button>
            <Button onClick={() => {
              const template = '견적 송부 날짜,견적서 번호,계약번호,시험기준,견적명,의뢰기관,의뢰자,의뢰자연락처,의뢰자 e-mail,제출용도,물질종류,담당자,견적금액,할인율,계약금액,결론\n2025-01-02,25-01-DL-0001,,NGLP,임상병리검사,성균관대학교,오지은,010-5053-4201,test@gmail.com,-,,임정모,950000,,,진행중';
              downloadCSV(template, 'template_sample.csv');
            }} variant="secondary" leftIcon={<ArrowDownTrayIcon className="w-5 h-5"/>}>
              Download Excel Template
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Wrapper component that handles authentication
const AppWrapper: React.FC = () => {
  const { isLoading: authLoading, isAuthenticated } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return <AppContent />;
};

// User Menu Component
const UserMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      >
        <UserCircleIcon className="w-6 h-6" />
        <span className="hidden md:block text-sm font-medium">
          {user?.profile?.firstName || user?.username}
        </span>
        <ChevronDownIcon className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          <div className="px-4 py-2 text-sm text-gray-700 border-b">
            <div className="font-medium">{user?.username}</div>
            <div className="text-gray-500">{user?.email}</div>
          </div>
          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
};

// Sidebar Content Component
interface SidebarContentProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  unreadNotificationsCount: number;
  onCloseMobileSidebar: () => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ 
  currentView, 
  setCurrentView, 
  unreadNotificationsCount,
  onCloseMobileSidebar 
}) => {
  // TEMPORARY: Skip authentication
  // const { user } = useAuth();
  const user = { username: 'Test User', profile: { firstName: 'Test' } };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon, view: { type: 'dashboard' as const } },
    { id: 'clients', label: 'Clients', icon: ClientsIcon, view: { type: 'clientList' as const } },
    { id: 'calendar', label: 'Calendar', icon: CalendarDaysIcon, view: { type: 'calendar' as const } },
    { id: 'analytics', label: 'Analytics', icon: ChartBarIcon, view: { type: 'analytics' as const } },
    { id: 'export', label: 'Data Export', icon: ArrowDownTrayIcon, view: { type: 'dataExport' as const } },
  ];

  const handleMenuClick = (view: View) => {
    setCurrentView(view);
    onCloseMobileSidebar();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">CRO Management</h2>
        <p className="text-sm text-gray-600 mt-1">
          Welcome, {user?.profile?.firstName || user?.username}
        </p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView.type === item.view.type;
          
          return (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.view)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                isActive 
                  ? 'bg-brand-primary text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
              {item.id === 'notifications' && unreadNotificationsCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

// Notifications Panel Component
interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead
}) => {
  if (!isOpen) return null;

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const recentNotifications = notifications.slice(0, 10);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <button
                onClick={onClose}
                className="p-1 rounded-md text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            {unreadNotifications.length > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                {unreadNotifications.length} unread notifications
              </p>
            )}
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {recentNotifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications yet
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {recentNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 ${
                      !notification.isRead ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                        notification.type === 'error' ? 'bg-red-500' :
                        notification.type === 'warning' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDateTime(notification.createdAt)}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <button
                          onClick={() => onMarkAsRead(notification.id)}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get view title
const getViewTitle = (view: View): string => {
  switch (view.type) {
    case 'dashboard': return 'Dashboard';
    case 'clientList': return 'Client List';
    case 'clientDetail': return 'Client Details';
    case 'calendar': return 'Calendar';
    case 'analytics': return 'Analytics';
    case 'dataExport': return 'Data Export';
    case 'settings': return 'Settings';
    default: return 'CRO Management';
  }
};

// Main App Component with Auth Provider
const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppWrapper />
    </AuthProvider>
  );
};

export default App;
