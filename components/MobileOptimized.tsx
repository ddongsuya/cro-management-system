import React from 'react';

// Mobile-optimized Card component
interface MobileCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  onClick?: () => void;
}

export const MobileCard: React.FC<MobileCardProps> = ({ 
  title, 
  subtitle, 
  children, 
  actions,
  onClick 
}) => {
  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-4 mb-3 ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-base">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {actions && <div className="ml-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
};

// Mobile-optimized List Item
interface MobileListItemProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  value?: string;
  onClick?: () => void;
  rightElement?: React.ReactNode;
}

export const MobileListItem: React.FC<MobileListItemProps> = ({
  icon,
  title,
  subtitle,
  value,
  onClick,
  rightElement
}) => {
  return (
    <div 
      className={`flex items-center py-3 px-4 border-b border-gray-100 ${onClick ? 'cursor-pointer hover:bg-gray-50 active:bg-gray-100' : ''}`}
      onClick={onClick}
    >
      {icon && <div className="mr-3 text-gray-400">{icon}</div>}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
        {subtitle && <p className="text-xs text-gray-500 truncate">{subtitle}</p>}
      </div>
      {value && <span className="ml-2 text-sm font-semibold text-gray-700">{value}</span>}
      {rightElement && <div className="ml-2">{rightElement}</div>}
    </div>
  );
};

// Mobile Bottom Sheet
interface MobileBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const MobileBottomSheet: React.FC<MobileBottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 max-h-[80vh] overflow-y-auto lg:hidden">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </>
  );
};

// Mobile Tabs
interface MobileTabsProps {
  tabs: { id: string; label: string; icon?: React.ReactNode }[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

export const MobileTabs: React.FC<MobileTabsProps> = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="flex overflow-x-auto hide-scrollbar border-b border-gray-200 bg-white sticky top-0 z-10">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex-shrink-0 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
            activeTab === tab.id
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center space-x-2">
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

// Mobile Action Button (FAB)
interface MobileFABProps {
  icon: React.ReactNode;
  onClick: () => void;
  label?: string;
}

export const MobileFAB: React.FC<MobileFABProps> = ({ icon, onClick, label }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 active:bg-blue-800 transition-colors z-30 lg:hidden"
      style={{ width: '56px', height: '56px' }}
      aria-label={label}
    >
      {icon}
    </button>
  );
};

// Mobile Search Bar
interface MobileSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export const MobileSearchBar: React.FC<MobileSearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  onClear
}) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
        placeholder={placeholder}
      />
      {value && onClear && (
        <button
          onClick={onClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

// Hide scrollbar utility
const style = document.createElement('style');
style.textContent = `
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;
document.head.appendChild(style);
