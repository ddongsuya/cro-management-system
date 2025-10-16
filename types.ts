
export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  isPrimary: boolean;
  department?: string; // 의뢰자부서
  fax?: string; // 팩스번호
}

export interface Company {
  id: string;
  name: string;
  address: string; 
  contacts: Contact[]; 
  notes?: string;
  createdAt: string; 
  quotations?: Quotation[];
  contracts?: Contract[];
  studies?: Study[];
  website?: string; // 기업정보 - 홈페이지
  mainPhoneNumber?: string; // 기업정보 - 대표번호
}

export enum QuotationStatus {
  Pending = 'Pending',
  InProgress = 'In Progress',
  Contracted = 'Contracted',
  Rejected = 'Rejected',
  OnHold = 'On Hold'
}

export interface Quotation {
  id: string; 
  contactId: string;
  quotationNumber: string;
  quotationName: string;
  quotationAmount: string; 
  discountRate?: string; // 견적정보 - 할인율
  paymentTerms?: string; // 견적 지급 조건
  status?: QuotationStatus; // 견적 상태
  statusNote?: string; // 상태 메모 (결론)
}

export interface Contract {
  id: string; 
  contactId: string;
  contractNumber: string;
  contractName: string;
  contractAmount: string;
  contractPeriodStart: string; 
  contractPeriodEnd: string; 
  contractSigningDate?: string; // 계약정보 - 계약체결일
  paymentTerms?: string; // 비용처리정보 - 금액 지급 조건 (선금, 중도금, 잔금)
  taxInvoiceIssued?: boolean; // 비용처리정보 - 세금계산서발행유무
  taxInvoiceIssueDate?: string; // 비용처리정보 - 세금계산서 발행일
}

export interface Study {
  id: string; 
  contactId: string;
  studyNumber: string;
  studyName: string;
  studyDirector: string; 
  studyPeriodStart: string; 
  studyPeriodEnd: string; 
  testingStandards?: string; // 의뢰정보 - 시험기준 (KGLP, NGLP 등) - 단일 선택
  substanceInfo?: string; // 의뢰정보 - 물질정보 - 단일 선택
  submissionPurpose?: string; // 의뢰정보 - 제출목적 (MFDS, OECD, FDA 등) - 단일 선택
}


export interface Meeting {
  id: string;
  companyId: string;
  contactId?: string; 
  title: string;
  date: string; 
  attendees: string; 
  summary: string;
  actionItems?: string;
}

export enum TaskStatus {
  Pending = 'Pending',
  InProgress = 'In Progress',
  Completed = 'Completed',
  Delayed = 'Delayed',
  OnHold = 'On Hold'
}

export interface Task {
  id:string;
  companyId: string;
  contactId?: string; 
  name: string;
  description?: string;
  startDate: string; 
  endDate: string; 
  status: TaskStatus;
  assignee?: string;
}

export type View = 
  | { type: 'dashboard' }
  | { type: 'clientList' }
  | { type: 'clientDetail'; clientId: string }
  | { type: 'calendar' } 
  | { type: 'analytics' }
  | { type: 'dataExport' }
  | { type: 'settings' }; 

export interface NotificationItem {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'error';
  relatedId?: string; 
  isRead: boolean;
  createdAt: string; 
}