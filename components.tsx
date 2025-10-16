
import React, { useState, ReactNode, ChangeEvent, FormEvent, useEffect, ReactElement } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Cell } from 'recharts';
import { Company, Meeting, Task, TaskStatus, Quotation, Contract, Study, Contact } from './types';
import { TrashIcon, PencilIcon, PlusIcon, CalendarDaysIcon, ListBulletIcon, ChartBarIcon, UserCircleIcon, EnvelopeIcon, PhoneIcon, MapPinIcon, InformationCircleIcon, XMarkIcon } from './icons';

// UI Primitives
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', className = '', leftIcon, rightIcon, ...props }) => {
  const baseStyle = 'font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-150 flex items-center justify-center';
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  const variantStyles = {
    primary: 'bg-brand-primary text-white hover:bg-brand-secondary focus:ring-brand-primary',
    secondary: 'bg-slate-200 text-slate-700 hover:bg-slate-300 focus:ring-slate-400',
    danger: 'bg-danger text-white hover:bg-red-700 focus:ring-danger',
    ghost: 'bg-transparent text-brand-primary hover:bg-blue-50 focus:ring-brand-primary',
  };

  return (
    <button className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`} {...props}>
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, id, error, className, ...props }) => (
  <div className="w-full">
    {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <input 
      id={id}
      className={`block w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary sm:text-sm ${className}`}
      {...props} 
    />
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}
export const Textarea: React.FC<TextareaProps> = ({ label, id, error, className, ...props }) => (
  <div className="w-full">
    {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <textarea 
      id={id}
      rows={3}
      className={`block w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary sm:text-sm ${className}`}
      {...props} 
    />
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string | number; label: string }[];
}
export const Select: React.FC<SelectProps> = ({ label, id, error, options, className, ...props }) => (
  <div className="w-full">
    {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <select
      id={id}
      className={`block w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white ${className}`}
      {...props}
    >
      <option value="">-- Select --</option>
      {options.map(option => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

interface CheckboxGroupProps {
  label: string;
  options: string[];
  selectedOptions: string[];
  onChange: (selected: string[]) => void;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ label, options, selectedOptions, onChange }) => {
  const handleCheckboxChange = (option: string) => {
    const currentIndex = selectedOptions.indexOf(option);
    const newSelectedOptions = [...selectedOptions];

    if (currentIndex === -1) {
      newSelectedOptions.push(option);
    } else {
      newSelectedOptions.splice(currentIndex, 1);
    }
    onChange(newSelectedOptions);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="mt-2 space-y-2">
        {options.map((option) => (
          <label key={option} className="flex items-center space-x-2 text-sm text-gray-700">
            <input
              type="checkbox"
              value={option}
              checked={selectedOptions.includes(option)}
              onChange={() => handleCheckboxChange(option)}
              className="h-4 w-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary"
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};


interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  actions?: ReactNode;
}
export const Card: React.FC<CardProps> = ({ children, className, title, actions }) => (
  <div className={`bg-white shadow-lg rounded-xl p-6 ${className}`}>
    {(title || actions) && (
      <div className="flex justify-between items-center mb-4">
        {title && <h3 className="text-xl font-semibold text-dark-text">{title}</h3>}
        {actions && <div className="flex space-x-2">{actions}</div>}
      </div>
    )}
    {children}
  </div>
);

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}
export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 50); 
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isOpen]);

  if (!isOpen && !showContent) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out">
      <div 
        className={`bg-white rounded-lg shadow-xl m-4 w-full ${sizeClasses[size]} transform transition-all duration-300 ease-in-out ${showContent && isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-dark-text">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
         {children}
        </div>
      </div>
    </div>
  );
};

// Company Components
type CompanyFormTabs = 'clientInfo' | 'quotations' | 'contracts' | 'studies';

const TESTING_STANDARDS_OPTIONS = [
  { value: "KGLP", label: "KGLP" },
  { value: "NGLP", label: "NGLP" },
  { value: "OECD GLP", label: "OECD GLP" },
  { value: "ICH", label: "ICH" },
  { value: "FDA GLP", label: "FDA GLP" },
  { value: "ISO 10993", label: "ISO 10993" },
  { value: "Other", label: "기타 (Other)" }
];
const SUBMISSION_PURPOSE_OPTIONS = [
  { value: "MFDS", label: "MFDS (Korea)" },
  { value: "FDA", label: "FDA (US)" },
  { value: "EMA", label: "EMA (Europe)" },
  { value: "PMDA", label: "PMDA (Japan)" },
  { value: "Health Canada", label: "Health Canada" },
  { value: "TGA", label: "TGA (Australia)" },
  { value: "Internal R&D", label: "Internal R&D" },
  { value: "Other", label: "기타 (Other)" }
];
const SUBSTANCE_INFO_OPTIONS = [
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
const PAYMENT_TERMS_OPTIONS = [
    { value: "Net 30", label: "Net 30 days" },
    { value: "Net 60", label: "Net 60 days" },
    { value: "Upfront 30 / Interim 40 / Balance 30", label: "선금 30%, 중도금 40%, 잔금 30%" },
    { value: "On Contract 50 / On Completion 50", label: "계약시 50%, 종료시 50%" },
    { value: "100% Upfront", label: "100% 선금" },
    { value: "Other", label: "기타 (Other)" }
];


interface CompanyFormProps {
  onSubmit: (company: Company) => void;
  onCancel: () => void;
  initialData?: Company | null;
}
export const CompanyForm: React.FC<CompanyFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [activeTab, setActiveTab] = useState<CompanyFormTabs>('clientInfo');

  // Company Info
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companyMainPhoneNumber, setCompanyMainPhoneNumber] = useState('');
  const [companyNotes, setCompanyNotes] = useState('');

  // Contacts
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [currentContact, setCurrentContact] = useState<Partial<Contact>>({ name: '', email: '', phone: '', department: '', fax: '', isPrimary: false });
  
  // Quotations
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [currentQuotation, setCurrentQuotation] = useState<Partial<Quotation>>({ quotationNumber: '', quotationName: '', quotationAmount: '', discountRate: '', paymentTerms: '', contactId: '' });

  // Contracts
  const [contractsArr, setContractsArr] = useState<Contract[]>([]);
  const [currentContract, setCurrentContract] = useState<Partial<Contract>>({ 
    contractNumber: '', contractName: '', contractAmount: '', contractPeriodStart: '', contractPeriodEnd: '', contactId: '',
    contractSigningDate: '', paymentTerms: '', taxInvoiceIssued: false, taxInvoiceIssueDate: ''
  });
  
  // Studies
  const [studies, setStudies] = useState<Study[]>([]);
  const [currentStudy, setCurrentStudy] = useState<Partial<Study>>({ 
    studyNumber: '', studyName: '', studyDirector: '', studyPeriodStart: '', studyPeriodEnd: '', contactId: '',
    testingStandards: '', substanceInfo: '', submissionPurpose: ''
  });

  useEffect(() => {
    if (initialData) {
      setCompanyName(initialData.name || '');
      setCompanyAddress(initialData.address || '');
      setCompanyWebsite(initialData.website || '');
      setCompanyMainPhoneNumber(initialData.mainPhoneNumber || '');
      setCompanyNotes(initialData.notes || '');

      if (initialData.contacts && initialData.contacts.length > 0) {
        setContacts(initialData.contacts);
      } else if ((initialData as any).contactPerson) { 
        const migratedContact: Contact = {
          id: crypto.randomUUID(),
          name: (initialData as any).contactPerson,
          email: (initialData as any).email || '',
          phone: (initialData as any).phone || '',
          isPrimary: true, 
          department: '', 
          fax: '',
        };
        setContacts([migratedContact]);
      } else {
        setContacts([]);
      }
      
      setQuotations(initialData.quotations?.map(q => ({...q, contactId: q.contactId || '', discountRate: q.discountRate || '', paymentTerms: q.paymentTerms || ''})) || []);
      setContractsArr(initialData.contracts?.map(c => ({
        ...c, 
        contactId: c.contactId || '',
        contractSigningDate: c.contractSigningDate || '',
        paymentTerms: c.paymentTerms || '',
        taxInvoiceIssued: c.taxInvoiceIssued || false,
        taxInvoiceIssueDate: c.taxInvoiceIssueDate || ''
      })) || []);
      setStudies(initialData.studies?.map(s => {
        // Handle migration from array to string for testingStandards and submissionPurpose
        const testingStandardsString = Array.isArray(s.testingStandards) ? (s.testingStandards[0] || '') : (s.testingStandards || '');
        const submissionPurposeString = Array.isArray(s.submissionPurpose) ? (s.submissionPurpose[0] || '') : (s.submissionPurpose || '');
        return {
          ...s, 
          contactId: s.contactId || '',
          testingStandards: testingStandardsString,
          substanceInfo: s.substanceInfo || '',
          submissionPurpose: submissionPurposeString
        };
      }) || []);

    } else {
      // Reset all fields for new company
      setCompanyName('');
      setCompanyAddress('');
      setCompanyWebsite('');
      setCompanyMainPhoneNumber('');
      setCompanyNotes('');
      setContacts([]);
      setCurrentContact({ name: '', email: '', phone: '', department: '', fax: '', isPrimary: false });
      
      setQuotations([]);
      setCurrentQuotation({ quotationNumber: '', quotationName: '', quotationAmount: '', discountRate: '', paymentTerms: '', contactId: '' });
      setContractsArr([]);
      setCurrentContract({ contractNumber: '', contractName: '', contractAmount: '', contractPeriodStart: '', contractPeriodEnd: '', contactId: '', contractSigningDate: '', paymentTerms: '', taxInvoiceIssued: false, taxInvoiceIssueDate: '' });
      setStudies([]);
      setCurrentStudy({ studyNumber: '', studyName: '', studyDirector: '', studyPeriodStart: '', studyPeriodEnd: '', contactId: '', testingStandards: '', substanceInfo: '', submissionPurpose: '' });
    }
  }, [initialData]);

  const handleAddContact = () => {
    if (currentContact.name) {
      const newContact: Contact = {
        id: crypto.randomUUID(),
        name: currentContact.name,
        email: currentContact.email || '',
        phone: currentContact.phone || '',
        department: currentContact.department || '',
        fax: currentContact.fax || '',
        isPrimary: contacts.length === 0 ? true : (currentContact.isPrimary || false),
      };
      
      let updatedContacts = [...contacts];
      if (newContact.isPrimary) {
         updatedContacts = updatedContacts.map(c => ({ ...c, isPrimary: false }));
      }
      updatedContacts.push(newContact);
      setContacts(updatedContacts);
      setCurrentContact({ name: '', email: '', phone: '', department: '', fax: '', isPrimary: false });
    } else {
      alert("Contact Name is required.");
    }
  };

  const handleRemoveContact = (id: string) => {
    const contactToRemove = contacts.find(c => c.id === id);
    if (contactToRemove?.isPrimary && contacts.length > 1) {
        alert("Cannot remove the primary contact if other contacts exist. Please set another contact as primary first.");
        return;
    }
    setContacts(contacts.filter(c => c.id !== id));
  };

  const handleSetPrimaryContact = (id: string) => {
    setContacts(contacts.map(c => ({ ...c, isPrimary: c.id === id })));
  };

  const contactOptions = contacts.map(c => ({ value: c.id, label: `${c.name}${c.isPrimary ? ' (Primary)' : ''}` }));
  const getPrimaryContactId = () => contacts.find(c => c.isPrimary)?.id || null;


  const handleAddItem = <T extends Quotation | Contract | Study>(
    itemType: 'quotation' | 'contract' | 'study',
    currentItem: Partial<T>,
    setItems: React.Dispatch<React.SetStateAction<T[]>>,
    setCurrentItemState: React.Dispatch<React.SetStateAction<Partial<T>>>,
    requiredFields: (keyof T)[]
  ) => {
    if (contacts.length === 0) {
      alert("Please add at least one contact person in the 'Client Info' tab before adding items.");
      setActiveTab('clientInfo');
      return;
    }
    if (!currentItem.contactId) {
      alert("Please select a contact person for this item.");
      return;
    }
    const missingField = requiredFields.find(field => !currentItem[field]);
    if (missingField) {
      alert(`${String(missingField)} is required for this ${itemType}.`);
      return;
    }

    const finalItemData: T = { ...currentItem, id: crypto.randomUUID() } as T;
    
    setItems(prev => [...prev, finalItemData]);
    
    if (itemType === 'quotation') setCurrentQuotation({ quotationNumber: '', quotationName: '', quotationAmount: '', discountRate: '', paymentTerms: '', contactId: getPrimaryContactId() || '' });
    if (itemType === 'contract') setCurrentContract({ contractNumber: '', contractName: '', contractAmount: '', contractPeriodStart: '', contractPeriodEnd: '', contactId: getPrimaryContactId() || '', contractSigningDate: '', paymentTerms: '', taxInvoiceIssued: false, taxInvoiceIssueDate: '' });
    if (itemType === 'study') setCurrentStudy({ studyNumber: '', studyName: '', studyDirector: '', studyPeriodStart: '', studyPeriodEnd: '', contactId: getPrimaryContactId() || '', testingStandards: '', substanceInfo: '', submissionPurpose: '' });
  };


  const handleAddQuotation = () => handleAddItem('quotation', currentQuotation, setQuotations, setCurrentQuotation as any, ['quotationNumber', 'quotationName']);
  const handleRemoveQuotation = (id: string) => setQuotations(quotations.filter(q => q.id !== id));

  const handleAddContract = () => handleAddItem('contract', currentContract, setContractsArr, setCurrentContract as any, ['contractNumber', 'contractName']);
  const handleRemoveContract = (id: string) => setContractsArr(contractsArr.filter(c => c.id !== id));

  const handleAddStudy = () => handleAddItem('study', currentStudy, setStudies, setCurrentStudy as any, ['studyNumber', 'studyName']);
  const handleRemoveStudy = (id: string) => setStudies(studies.filter(s => s.id !== id));


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!companyName) {
        alert("Company Name is required.");
        setActiveTab('clientInfo');
        return;
    }
    if (contacts.length === 0) {
        alert("At least one contact person is required. Please add a contact in the 'Client Info' tab.");
        setActiveTab('clientInfo');
        return;
    }
    if (!contacts.some(c => c.isPrimary)) {
        alert("One contact must be marked as primary.");
        setActiveTab('clientInfo');
        return;
    }

    onSubmit({
      id: initialData?.id || crypto.randomUUID(),
      name: companyName,
      address: companyAddress,
      website: companyWebsite,
      mainPhoneNumber: companyMainPhoneNumber,
      notes: companyNotes,
      contacts,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      quotations,
      contracts: contractsArr,
      studies, // testingStandards and submissionPurpose are now strings
    });
  };
  
  const TabButton: React.FC<{tabId: CompanyFormTabs, title: string}> = ({tabId, title}) => (
    <button
      type="button"
      onClick={() => setActiveTab(tabId)}
      className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors focus:outline-none
        ${activeTab === tabId ? 'bg-brand-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
    >
      {title}
    </button>
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4 border-b border-gray-200">
        <nav className="flex space-x-1 -mb-px">
          <TabButton tabId="clientInfo" title="Client Info" />
          <TabButton tabId="quotations" title="Quotations" />
          <TabButton tabId="contracts" title="Contracts" />
          <TabButton tabId="studies" title="Studies" />
        </nav>
      </div>

      <div className="space-y-4 min-h-[400px]">
        {activeTab === 'clientInfo' && (
          <div className="space-y-6">
            <Input label="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
            <Input label="Company Address" value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} />
            <Input label="Company Website" value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} />
            <Input label="Company Main Phone" value={companyMainPhoneNumber} onChange={(e) => setCompanyMainPhoneNumber(e.target.value)} />
            
            <div className="space-y-4 p-4 border border-slate-200 rounded-md">
              <h4 className="text-md font-semibold text-dark-text">Manage Contacts</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                  <Input label="Contact Name" value={currentContact.name || ''} onChange={(e) => setCurrentContact({...currentContact, name: e.target.value})} />
                  <Input label="Contact Email" type="email" value={currentContact.email || ''} onChange={(e) => setCurrentContact({...currentContact, email: e.target.value})} />
                  <Input label="Contact Phone" type="tel" value={currentContact.phone || ''} onChange={(e) => setCurrentContact({...currentContact, phone: e.target.value})} />
                  <Input label="Contact Department" value={currentContact.department || ''} onChange={(e) => setCurrentContact({...currentContact, department: e.target.value})} />
                  <Input label="Contact Fax" value={currentContact.fax || ''} onChange={(e) => setCurrentContact({...currentContact, fax: e.target.value})} />
                  <div className="flex items-center space-x-2 mt-2 md:mt-0 md:col-span-2 md:self-end">
                     <input type="checkbox" id="isPrimaryContact" checked={currentContact.isPrimary || false} onChange={(e) => setCurrentContact({...currentContact, isPrimary: e.target.checked })} className="h-4 w-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary" />
                     <label htmlFor="isPrimaryContact" className="text-sm text-gray-700">Set as Primary</label>
                  </div>
              </div>
              <Button type="button" variant="secondary" size="sm" onClick={handleAddContact} leftIcon={<PlusIcon className="w-4 h-4"/>}>Add Contact Person</Button>
              
              {contacts.length > 0 && <h5 className="text-sm font-semibold text-dark-text border-b pb-1 pt-3">Contact List</h5>}
              <ul className="space-y-2">
                {contacts.map((c) => (
                  <li key={c.id} className="p-3 bg-slate-50 rounded-md shadow-sm text-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-semibold">{c.name} {c.isPrimary && <span className="text-xs text-brand-primary font-bold">(Primary)</span>}</p>
                            {c.email && <p className="text-slate-600">Email: {c.email}</p>}
                            {c.phone && <p className="text-slate-600">Phone: {c.phone}</p>}
                            {c.department && <p className="text-slate-600">Dept: {c.department}</p>}
                            {c.fax && <p className="text-slate-600">Fax: {c.fax}</p>}
                        </div>
                        <div className="flex space-x-1">
                            {!c.isPrimary && <Button type="button" variant="ghost" size="sm" title="Set as primary" onClick={() => handleSetPrimaryContact(c.id)}>Set Primary</Button>}
                            <Button type="button" variant="danger" size="sm" onClick={() => handleRemoveContact(c.id)}><TrashIcon className="w-4 h-4"/></Button>
                        </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <Textarea label="Company Notes" value={companyNotes} onChange={(e) => setCompanyNotes(e.target.value)} />
          </div>
        )}

        {[ 'quotations', 'contracts', 'studies'].includes(activeTab) && contacts.length === 0 && (
             <div className="p-4 my-4 text-sm text-yellow-700 bg-yellow-100 rounded-lg" role="alert">
                <span className="font-medium">Contacts Needed:</span> Please add at least one contact person in the 'Client Info' tab before adding {activeTab}.
            </div>
        )}

        {activeTab === 'quotations' && (
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-dark-text border-b pb-2">Add New Quotation</h4>
            <Select label="Assign to Contact" options={contactOptions} value={currentQuotation.contactId || ''} onChange={(e) => setCurrentQuotation({...currentQuotation, contactId: e.target.value})} required disabled={contacts.length === 0} />
            <Input label="Quotation Number" value={currentQuotation.quotationNumber || ''} onChange={(e) => setCurrentQuotation({...currentQuotation, quotationNumber: e.target.value})} />
            <Input label="Quotation Name" value={currentQuotation.quotationName || ''} onChange={(e) => setCurrentQuotation({...currentQuotation, quotationName: e.target.value})} />
            <Input label="Quotation Amount (e.g., $10,000)" value={currentQuotation.quotationAmount || ''} onChange={(e) => setCurrentQuotation({...currentQuotation, quotationAmount: e.target.value})} />
            <Input label="Discount Rate (%)" value={currentQuotation.discountRate || ''} onChange={(e) => setCurrentQuotation({...currentQuotation, discountRate: e.target.value})} />
            <Select label="Payment Terms" options={PAYMENT_TERMS_OPTIONS} value={currentQuotation.paymentTerms || ''} onChange={(e) => setCurrentQuotation({...currentQuotation, paymentTerms: e.target.value})} />
            <Button type="button" variant="secondary" size="sm" onClick={handleAddQuotation} leftIcon={<PlusIcon className="w-4 h-4"/>} disabled={contacts.length === 0}>Add Quotation to List</Button>
            
            {quotations.length > 0 && <h4 className="text-md font-semibold text-dark-text border-b pb-2 pt-4">Quotation List</h4>}
            <ul className="space-y-2">
              {quotations.map((q) => {
                const contact = contacts.find(c => c.id === q.contactId);
                return (
                    <li key={q.id} className="p-3 bg-slate-50 rounded-md shadow-sm flex justify-between items-center text-sm">
                    <div>
                        <p><strong>#:</strong> {q.quotationNumber} - <strong>Name:</strong> {q.quotationName}</p>
                        <p><strong>Amount:</strong> {q.quotationAmount} {q.discountRate && `(Discount: ${q.discountRate}%)`}</p>
                        {q.paymentTerms && <p><strong>Payment Terms:</strong> {PAYMENT_TERMS_OPTIONS.find(opt => opt.value === q.paymentTerms)?.label || q.paymentTerms}</p>}
                        <p className="text-xs text-slate-500"><strong>Contact:</strong> {contact?.name || 'Unknown'}</p>
                    </div>
                    <Button type="button" variant="danger" size="sm" onClick={() => handleRemoveQuotation(q.id)}><TrashIcon className="w-4 h-4"/></Button>
                    </li>
                );
              })}
            </ul>
          </div>
        )}

        {activeTab === 'contracts' && (
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-dark-text border-b pb-2">Add New Contract</h4>
            <Select label="Assign to Contact" options={contactOptions} value={currentContract.contactId || ''} onChange={(e) => setCurrentContract({...currentContract, contactId: e.target.value})} required disabled={contacts.length === 0} />
            <Input label="Contract Number" value={currentContract.contractNumber || ''} onChange={(e) => setCurrentContract({...currentContract, contractNumber: e.target.value})} />
            <Input label="Contract Name" value={currentContract.contractName || ''} onChange={(e) => setCurrentContract({...currentContract, contractName: e.target.value})} />
            <Input label="Contract Amount" value={currentContract.contractAmount || ''} onChange={(e) => setCurrentContract({...currentContract, contractAmount: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Contract Period Start" type="date" value={currentContract.contractPeriodStart || ''} onChange={(e) => setCurrentContract({...currentContract, contractPeriodStart: e.target.value})} />
              <Input label="Contract Period End" type="date" value={currentContract.contractPeriodEnd || ''} onChange={(e) => setCurrentContract({...currentContract, contractPeriodEnd: e.target.value})} />
            </div>
            <Input label="Contract Signing Date" type="date" value={currentContract.contractSigningDate || ''} onChange={(e) => setCurrentContract({...currentContract, contractSigningDate: e.target.value})} />
            <Input label="Payment Terms (e.g., 선금, 중도금, 잔금)" value={currentContract.paymentTerms || ''} onChange={(e) => setCurrentContract({...currentContract, paymentTerms: e.target.value})} />
            <div className="flex items-center space-x-2">
                <input type="checkbox" id="taxInvoiceIssued" checked={currentContract.taxInvoiceIssued || false} onChange={(e) => setCurrentContract({...currentContract, taxInvoiceIssued: e.target.checked})} className="h-4 w-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary" />
                <label htmlFor="taxInvoiceIssued" className="text-sm text-gray-700">Tax Invoice Issued?</label>
            </div>
            {currentContract.taxInvoiceIssued && (
                <Input label="Tax Invoice Issue Date" type="date" value={currentContract.taxInvoiceIssueDate || ''} onChange={(e) => setCurrentContract({...currentContract, taxInvoiceIssueDate: e.target.value})} />
            )}
            <Button type="button" variant="secondary" size="sm" onClick={handleAddContract} leftIcon={<PlusIcon className="w-4 h-4"/>} disabled={contacts.length === 0}>Add Contract to List</Button>
            
            {contractsArr.length > 0 && <h4 className="text-md font-semibold text-dark-text border-b pb-2 pt-4">Contract List</h4>}
            <ul className="space-y-2">
              {contractsArr.map((c) => {
                const contact = contacts.find(con => con.id === c.contactId);
                return (
                <li key={c.id} className="p-3 bg-slate-50 rounded-md shadow-sm flex justify-between items-center text-sm">
                  <div>
                    <p><strong>#:</strong> {c.contractNumber} - <strong>Name:</strong> {c.contractName}</p>
                    <p><strong>Amount:</strong> {c.contractAmount}</p>
                    <p><strong>Period:</strong> {c.contractPeriodStart ? new Date(c.contractPeriodStart).toLocaleDateString() : 'N/A'} - {c.contractPeriodEnd ? new Date(c.contractPeriodEnd).toLocaleDateString() : 'N/A'}</p>
                    {c.contractSigningDate && <p><strong>Signing Date:</strong> {new Date(c.contractSigningDate).toLocaleDateString()}</p>}
                    {c.paymentTerms && <p><strong>Payment Terms:</strong> {c.paymentTerms}</p>}
                    <p><strong>Tax Invoice:</strong> {c.taxInvoiceIssued ? `Yes (Issued: ${c.taxInvoiceIssueDate ? new Date(c.taxInvoiceIssueDate).toLocaleDateString() : 'N/A'})` : 'No'}</p>
                    <p className="text-xs text-slate-500"><strong>Contact:</strong> {contact?.name || 'Unknown'}</p>
                  </div>
                  <Button type="button" variant="danger" size="sm" onClick={() => handleRemoveContract(c.id)}><TrashIcon className="w-4 h-4"/></Button>
                </li>
                );
              })}
            </ul>
          </div>
        )}

        {activeTab === 'studies' && (
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-dark-text border-b pb-2">Add New Study</h4>
            <Select label="Assign to Contact" options={contactOptions} value={currentStudy.contactId || ''} onChange={(e) => setCurrentStudy({...currentStudy, contactId: e.target.value})} required disabled={contacts.length === 0} />
            <Input label="Study Number" value={currentStudy.studyNumber || ''} onChange={(e) => setCurrentStudy({...currentStudy, studyNumber: e.target.value})} />
            <Input label="Study Name" value={currentStudy.studyName || ''} onChange={(e) => setCurrentStudy({...currentStudy, studyName: e.target.value})} />
            <Input label="Study Director" value={currentStudy.studyDirector || ''} onChange={(e) => setCurrentStudy({...currentStudy, studyDirector: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Study Period Start" type="date" value={currentStudy.studyPeriodStart || ''} onChange={(e) => setCurrentStudy({...currentStudy, studyPeriodStart: e.target.value})} />
              <Input label="Study Period End" type="date" value={currentStudy.studyPeriodEnd || ''} onChange={(e) => setCurrentStudy({...currentStudy, studyPeriodEnd: e.target.value})} />
            </div>
            
            <Select 
              label="Testing Standards"
              options={TESTING_STANDARDS_OPTIONS}
              value={currentStudy.testingStandards || ''}
              onChange={(e) => setCurrentStudy(prev => ({ ...prev, testingStandards: e.target.value }))}
            />
            
            <Select
              label="Substance Information"
              options={SUBSTANCE_INFO_OPTIONS}
              value={currentStudy.substanceInfo || ''}
              onChange={(e) => setCurrentStudy(prev => ({ ...prev, substanceInfo: e.target.value }))}
            />
            
            <Select
              label="Submission Purpose"
              options={SUBMISSION_PURPOSE_OPTIONS}
              value={currentStudy.submissionPurpose || ''}
              onChange={(e) => setCurrentStudy(prev => ({ ...prev, submissionPurpose: e.target.value }))}
            />

            <Button type="button" variant="secondary" size="sm" onClick={handleAddStudy} leftIcon={<PlusIcon className="w-4 h-4"/>} disabled={contacts.length === 0}>Add Study to List</Button>
            
            {studies.length > 0 && <h4 className="text-md font-semibold text-dark-text border-b pb-2 pt-4">Study List</h4>}
            <ul className="space-y-2">
              {studies.map((s) => {
                const contact = contacts.find(con => con.id === s.contactId);
                return (
                <li key={s.id} className="p-3 bg-slate-50 rounded-md shadow-sm flex justify-between items-center text-sm">
                  <div>
                    <p><strong>#:</strong> {s.studyNumber} - <strong>Name:</strong> {s.studyName}</p>
                    <p><strong>Director:</strong> {s.studyDirector}</p>
                    <p><strong>Period:</strong> {s.studyPeriodStart ? new Date(s.studyPeriodStart).toLocaleDateString() : 'N/A'} - {s.studyPeriodEnd ? new Date(s.studyPeriodEnd).toLocaleDateString() : 'N/A'}</p>
                    {s.testingStandards && <p><strong>Standard:</strong> {TESTING_STANDARDS_OPTIONS.find(opt => opt.value === s.testingStandards)?.label || s.testingStandards}</p>}
                    {s.substanceInfo && <p><strong>Substance:</strong> {SUBSTANCE_INFO_OPTIONS.find(opt => opt.value === s.substanceInfo)?.label || s.substanceInfo}</p>}
                    {s.submissionPurpose && <p><strong>Purpose:</strong> {SUBMISSION_PURPOSE_OPTIONS.find(opt => opt.value === s.submissionPurpose)?.label || s.submissionPurpose}</p>}
                    <p className="text-xs text-slate-500"><strong>Contact:</strong> {contact?.name || 'Unknown'}</p>
                  </div>
                  <Button type="button" variant="danger" size="sm" onClick={() => handleRemoveStudy(s.id)}><TrashIcon className="w-4 h-4"/></Button>
                </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{initialData ? 'Update' : 'Create'} Company</Button>
      </div>
    </form>
  );
};

interface MeetingFormProps {
  companyId: string;
  contacts: Contact[]; 
  onSubmit: (meeting: Meeting) => void;
  onCancel: () => void;
  initialData?: Meeting | null;
}

export const MeetingForm: React.FC<MeetingFormProps> = ({ companyId, contacts, onSubmit, onCancel, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [date, setDate] = useState(initialData?.date ? initialData.date.substring(0, 10) : new Date().toISOString().substring(0, 10));
  const [attendees, setAttendees] = useState(initialData?.attendees || '');
  const [summary, setSummary] = useState(initialData?.summary || '');
  const [actionItems, setActionItems] = useState(initialData?.actionItems || '');
  const [contactId, setContactId] = useState(initialData?.contactId || (contacts.find(c=>c.isPrimary)?.id || (contacts.length > 0 ? contacts[0].id : '')));

  const contactOptions = contacts.map(c => ({ value: c.id, label: `${c.name}${c.isPrimary ? ' (Primary)' : ''}` }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: initialData?.id || crypto.randomUUID(),
      companyId,
      contactId: contactId || undefined,
      title,
      date: new Date(date).toISOString(),
      attendees,
      summary,
      actionItems,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Meeting Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      {contacts.length > 0 && <Select label="Related Contact (Optional)" options={contactOptions} value={contactId} onChange={(e) => setContactId(e.target.value)} />}
      <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      <Input label="Attendees (comma-separated)" value={attendees} onChange={(e) => setAttendees(e.target.value)} />
      <Textarea label="Summary" value={summary} onChange={(e) => setSummary(e.target.value)} required />
      <Textarea label="Action Items" value={actionItems} onChange={(e) => setActionItems(e.target.value)} />
      <div className="flex justify-end space-x-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{initialData ? 'Update' : 'Create'} Meeting</Button>
      </div>
    </form>
  );
};

interface TaskFormProps {
  companyId: string;
  contacts: Contact[]; 
  onSubmit: (task: Task) => void;
  onCancel: () => void;
  initialData?: Task | null;
}
export const TaskForm: React.FC<TaskFormProps> = ({ companyId, contacts, onSubmit, onCancel, initialData }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [startDate, setStartDate] = useState(initialData?.startDate ? initialData.startDate.substring(0,10) : new Date().toISOString().substring(0, 10));
  const [endDate, setEndDate] = useState(initialData?.endDate ? initialData.endDate.substring(0,10) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10));
  const [status, setStatus] = useState<TaskStatus>(initialData?.status || TaskStatus.Pending);
  const [assignee, setAssignee] = useState(initialData?.assignee || '');
  const [contactId, setContactId] = useState(initialData?.contactId || (contacts.find(c=>c.isPrimary)?.id || (contacts.length > 0 ? contacts[0].id : '')));

  const contactOptions = contacts.map(c => ({ value: c.id, label: `${c.name}${c.isPrimary ? ' (Primary)' : ''}` }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (new Date(startDate) > new Date(endDate)) {
      alert("End date must be after start date.");
      return;
    }
    onSubmit({
      id: initialData?.id || crypto.randomUUID(),
      companyId,
      contactId: contactId || undefined,
      name,
      description,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      status,
      assignee,
    });
  };
  
  const taskStatusOptions = Object.values(TaskStatus).map(s => ({ value: s, label: s}));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Task Name" value={name} onChange={(e) => setName(e.target.value)} required />
      {contacts.length > 0 && <Select label="Related Contact (Optional)" options={contactOptions} value={contactId} onChange={(e) => setContactId(e.target.value)} />}
      <Textarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Start Date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        <Input label="End Date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
      </div>
      <Select label="Status" options={taskStatusOptions} value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)} />
      <Input label="Assignee (Optional)" value={assignee} onChange={(e) => setAssignee(e.target.value)} />
      <div className="flex justify-end space-x-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{initialData ? 'Update' : 'Create'} Task</Button>
      </div>
    </form>
  );
};


// Gantt Chart Component
interface GanttChartDataPoint {
  name: string;
  id: string;
  companyId: string;
  timeRange: [number, number]; 
  status: TaskStatus;
}

interface GanttChartRendererProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

const getGanttStatusColor = (status: TaskStatus): string => {
  switch (status) {
    case TaskStatus.Completed: return '#28A745'; 
    case TaskStatus.InProgress: return '#007BFF'; 
    case TaskStatus.Pending: return '#FFC107'; 
    case TaskStatus.Delayed: return '#DC3545'; 
    case TaskStatus.OnHold: return '#6C757D'; 
    default: return '#00A3BF'; 
  }
};

export const GanttChartRenderer: React.FC<GanttChartRendererProps> = ({ tasks, onTaskClick }) => {
  if (tasks.length === 0) {
    return <p className="text-center text-gray-500 py-8">No tasks to display in Gantt chart.</p>;
  }

  const chartData: GanttChartDataPoint[] = tasks.map(task => ({
    name: task.name,
    id: task.id,
    companyId: task.companyId,
    timeRange: [new Date(task.startDate).getTime(), new Date(task.endDate).getTime()],
    status: task.status,
  }));

  const allDates = tasks.flatMap(task => [new Date(task.startDate).getTime(), new Date(task.endDate).getTime()]);
  const minDate = Math.min(...allDates);
  const maxDate = Math.max(...allDates);

  const CustomTooltipContent: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data: GanttChartDataPoint = payload[0].payload;
      const task = tasks.find(t => t.id === data.id);
      if (!task) return null;
      return (
        <div className="bg-white p-3 shadow-lg rounded border border-gray-200 text-sm">
          <p className="font-semibold text-dark-text">{task.name}</p>
          <p className="text-medium-text">Start: {new Date(task.startDate).toLocaleDateString()}</p>
          <p className="text-medium-text">End: {new Date(task.endDate).toLocaleDateString()}</p>
          <p className="text-medium-text">Status: <span style={{color: getGanttStatusColor(task.status)}}>{task.status}</span></p>
          {task.assignee && <p className="text-medium-text">Assignee: {task.assignee}</p>}
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="h-[500px] w-full bg-white p-4 rounded-lg shadow">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 20, right: 30, left: 100, bottom: 20 }} 
          barCategoryGap="30%"
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis 
            type="number" 
            domain={[minDate, maxDate]} 
            scale="time"
            tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})} 
            allowDuplicatedCategory={false}
            className="text-xs"
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            width={120} 
            interval={0}
            className="text-xs"
           />
          <Tooltip content={<CustomTooltipContent />} cursor={{fill: 'rgba(200, 200, 200, 0.2)'}}/>
          <Legend formatter={(value, entry) => <span className="text-gray-700">{value}</span>}/>
          <Bar 
            dataKey="timeRange" 
            minPointSize={5}
            onClick={(data) => {
              if (onTaskClick) {
                const task = tasks.find(t => t.id === data.id);
                if (task) onTaskClick(task);
              }
            }}
            cursor={onTaskClick ? "pointer" : undefined}
            >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getGanttStatusColor(entry.status)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Dashboard Components
interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactElement<{ className?: string }>;
  colorClass?: string;
}
export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, colorClass = 'text-brand-primary' }) => {
  let clonedIcon = null;
  if (icon && React.isValidElement(icon)) {
    if (typeof icon.type === 'function' || typeof icon.type === 'string') {
      clonedIcon = React.cloneElement(icon, { className: `w-8 h-8 ${colorClass}` });
    } else {
      console.warn("StatCard: Received an icon that is a valid React element but has an invalid type property.", icon);
    }
  } else if (icon) {
    console.warn("StatCard: Received an invalid icon prop that is not a React element.", icon);
  }

  return (
    <Card className="flex items-center space-x-4">
      <div className={`p-3 rounded-full bg-opacity-10 ${colorClass.replace('text-', 'bg-')}`}>
        {clonedIcon}
      </div>
      <div>
        <p className="text-3xl font-bold text-dark-text">{value}</p>
        <p className="text-sm text-medium-text">{title}</p>
      </div>
    </Card>
  );
};

const getUpcomingItemTaskStatusStyles = (status: TaskStatus): string => {
  switch (status) {
    case TaskStatus.Completed: return 'bg-green-100 text-green-700';
    case TaskStatus.InProgress: return 'bg-blue-100 text-blue-700';
    case TaskStatus.Pending: return 'bg-yellow-100 text-yellow-700';
    case TaskStatus.Delayed: return 'bg-red-100 text-red-700';
    case TaskStatus.OnHold: return 'bg-gray-100 text-gray-700';
    default: return 'bg-slate-100 text-slate-700';
  }
};

interface UpcomingItemProps {
  item: Task | Meeting;
  type: 'task' | 'meeting';
  companyName?: string;
  contactName?: string;
}

export const UpcomingItemCard: React.FC<UpcomingItemProps> = ({ item, type, companyName, contactName }) => {
  const isTask = type === 'task';
  const taskItem = item as Task;
  const meetingItem = item as Meeting;

  const date = isTask ? new Date(taskItem.endDate) : new Date(meetingItem.date);
  const title = isTask ? taskItem.name : meetingItem.title;
  const status = isTask ? taskItem.status : undefined;
  
  const daysRemaining = Math.ceil((date.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
  let urgencyColor = 'text-green-500';
  if (daysRemaining <= 0 && (!isTask || taskItem.status !== TaskStatus.Completed)) urgencyColor = 'text-red-500';
  else if (daysRemaining <= 3) urgencyColor = 'text-yellow-500';

  const statusBadgeStyles = isTask && status ? getUpcomingItemTaskStatusStyles(status) : 'bg-blue-100 text-blue-700';


  return (
    <div className="p-3 bg-slate-50 rounded-md shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <h4 className="font-semibold text-dark-text text-sm">{title}</h4>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusBadgeStyles}`}>
          {isTask ? status : 'Meeting'}
        </span>
      </div>
      {companyName && (
        <p className="text-xs text-brand-primary mt-1">{companyName}</p>
      )}
      {contactName && isTask && ( 
        <p className="text-xs text-slate-600 mt-0.5">Contact: {contactName}</p>
      )}
      <p className="text-xs text-medium-text mt-1">
        <CalendarDaysIcon className="inline w-3 h-3 mr-1" />
        {date.toLocaleDateString()}
        {daysRemaining <= 7 && daysRemaining > -30 && ( 
          <span className={`ml-2 font-semibold ${urgencyColor}`}>
            ({daysRemaining <= 0 && (!isTask || taskItem.status !== TaskStatus.Completed) 
              ? `Overdue by ${Math.abs(daysRemaining)}d` 
              : `${daysRemaining}d left`})
          </span>
        )}
      </p>
      {isTask && taskItem.assignee && <p className="text-xs text-light-text mt-0.5">Assignee: {taskItem.assignee}</p>}
    </div>
  );
};