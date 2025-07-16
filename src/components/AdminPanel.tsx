
import React, { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '../contexts/AppContext';
import { AuthLevel, SiteContent, ServiceCardData, ThemeOptions, ThemePalette, SocialLink } from '../types';
import { PRESET_THEMES } from '../constants';

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
);
const DevIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);
const ServicesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
);
const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);
const ContactIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
);
const FooterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const ThemeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
);
const ChevronDownIcon = ({ isOpen }: { isOpen: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
);
const TrashCanIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);
const RestoreIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
    </svg>
);
const TrashNavIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
);
const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
);

// --- Admin Panel UI Components & Helpers ---

const Input = ({ label, value, onChange, ...props }: {label: string, value: string | number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, [key:string]: any}) => (
    <div>
      <label className="block text-sm font-medium text-muted-foreground mb-1">{label}</label>
      <input value={value} onChange={onChange} className="w-full p-2 border rounded bg-input text-foreground border-border" {...props}/>
    </div>
);

const Textarea = ({ label, value, onChange }: {label: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void}) => (
    <div>
      <label className="block text-sm font-medium text-muted-foreground mb-1">{label}</label>
      <textarea value={value} onChange={onChange} rows={3} className="w-full p-2 border rounded bg-input text-foreground border-border"/>
    </div>
);

const ColorInput = ({ label, value, onChange }: { label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}) => (
    <div className="flex items-center justify-between mb-2">
      <label className="text-sm text-muted-foreground capitalize">{label.replace(/-/g, ' ')}</label>
      <div className="flex items-center gap-2">
        <input type="text" value={value} onChange={onChange} className="w-24 p-1 text-sm border rounded bg-input text-foreground border-border" />
        <input type="color" value={value || '#000000'} onChange={onChange} className="w-8 h-8 p-0 border-none rounded cursor-pointer bg-transparent" />
      </div>
    </div>
);

const NavLink = ({ tabName, icon, children, activeTab, setActiveTab }: { tabName: string, icon: React.ReactNode, children: React.ReactNode, activeTab: string, setActiveTab: (tab: string) => void }) => (
    <button onClick={() => setActiveTab(tabName)} className={`w-full flex items-center justify-between gap-3 px-4 py-3 font-bold rounded-md transition-colors duration-200 ${activeTab === tabName ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'}`}>
      <div className="flex items-center gap-3">
        {icon}
        <span>{children}</span>
      </div>
    </button>
);

const CollapsibleSection = ({ title, children }: { title: string, children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="border border-border rounded-lg mb-6">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-3 bg-muted/50">
                <h4 className="font-bold text-lg">{title}</h4>
                <ChevronDownIcon isOpen={isOpen} />
            </button>
            {isOpen && <div className="p-4">{children}</div>}
        </div>
    );
};

const ThemeEditor = ({ theme, index, handleThemeNameChange, handleThemePropChange }: { 
    theme: ThemeOptions, 
    index: number, 
    handleThemeNameChange: (index: number, name: string) => void, 
    handleThemePropChange: (index: number, mode: 'light'|'dark', prop: keyof ThemePalette, value: string) => void 
}) => {
    const defaultPalette = PRESET_THEMES.find(t => t.name === 'Default') || PRESET_THEMES[0];
    const fullThemeLight = { ...defaultPalette.light, ...theme.light };
    const fullThemeDark = { ...defaultPalette.dark, ...theme.dark };

    const globalKeys: (keyof ThemePalette)[] = ['background', 'foreground', 'card', 'card-foreground', 'muted', 'muted-foreground', 'primary', 'primary-foreground', 'secondary', 'secondary-foreground', 'accent', 'accent-foreground', 'border', 'input', 'ring'];
    const headerKeys: (keyof ThemePalette)[] = ['header-top-bar-background', 'header-top-bar-foreground', 'header-main-background', 'header-main-foreground'];
    const footerKeys: (keyof ThemePalette)[] = ['footer-background', 'footer-foreground'];
    const heroKeys: (keyof ThemePalette)[] = ['hero-foreground', 'hero-overlay'];

    const renderColorInputs = (keys: (keyof ThemePalette)[], mode: 'light' | 'dark', fullPalette: Partial<ThemePalette>) => (
        <div>
            {keys.map(key => (
                <ColorInput 
                    key={`${mode}-${key}`} 
                    label={key}
                    value={fullPalette[key] || ''}
                    onChange={e => handleThemePropChange(index, mode, key, e.target.value)} 
                />
            ))}
        </div>
    );

    return (
        <div className="bg-muted/50 p-6 rounded-lg border border-border mb-6">
            <div className="space-y-6">
                <Input label="Theme Name" value={theme.name} onChange={e => handleThemeNameChange(index, e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                <div>
                    <h4 className="font-bold text-xl mb-4 text-center">Light Mode</h4>
                    <CollapsibleSection title="Global Palette">{renderColorInputs(globalKeys, 'light', fullThemeLight)}</CollapsibleSection>
                    <CollapsibleSection title="Header">{renderColorInputs(headerKeys, 'light', fullThemeLight)}</CollapsibleSection>
                    <CollapsibleSection title="Footer">{renderColorInputs(footerKeys, 'light', fullThemeLight)}</CollapsibleSection>
                    <CollapsibleSection title="Hero Section">{renderColorInputs(heroKeys, 'light', fullThemeLight)}</CollapsibleSection>
                </div>
                <div>
                    <h4 className="font-bold text-xl mb-4 text-center">Dark Mode</h4>
                    <CollapsibleSection title="Global Palette">{renderColorInputs(globalKeys, 'dark', fullThemeDark)}</CollapsibleSection>
                    <CollapsibleSection title="Header">{renderColorInputs(headerKeys, 'dark', fullThemeDark)}</CollapsibleSection>
                    <CollapsibleSection title="Footer">{renderColorInputs(footerKeys, 'dark', fullThemeDark)}</CollapsibleSection>
                    <CollapsibleSection title="Hero Section">{renderColorInputs(heroKeys, 'dark', fullThemeDark)}</CollapsibleSection>
                </div>
            </div>
        </div>
    );
};

const ThemeCard = ({ theme, isActive, onActivate, onEdit, onDelete, draggable, onDragStart, onDragEnd }: {
    theme: ThemeOptions,
    isActive: boolean,
    onActivate: () => void,
    onEdit: () => void,
    onDelete: () => void,
    draggable: boolean,
    onDragStart: (e: React.DragEvent) => void,
    onDragEnd: (e: React.DragEvent) => void,
}) => {
    const defaultTheme = PRESET_THEMES.find(t => t.name === 'Default') || PRESET_THEMES[0];
    const palette = {
        ...defaultTheme.dark,
        ...theme.dark,
        ...defaultTheme.light,
        ...theme.light,
    };
    const colorsToShow = ['primary', 'secondary', 'accent', 'background', 'foreground'];
    
    return (
        <div 
          className={`relative bg-card p-4 rounded-lg border ${isActive ? 'border-primary ring-2 ring-primary' : 'border-border'} transition-all ${draggable ? 'cursor-grab' : ''}`}
          draggable={draggable}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        >
            <div className="absolute top-2 right-2">
                {!isActive && <button onClick={onDelete} className="text-muted-foreground hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-500/10" aria-label={`Move ${theme.name} theme to trash`}><TrashIcon className="h-4 w-4"/></button>}
            </div>
            <div className="flex justify-between items-start mb-3">
                <h4 className="text-lg font-bold text-card-foreground pr-8">{theme.name}</h4>
                {isActive && <span className="text-xs font-bold bg-primary text-primary-foreground px-2 py-1 rounded-full">ACTIVE</span>}
            </div>
            <div className="flex items-center gap-2 mb-4">
                {colorsToShow.map(colorKey => (
                    <div key={colorKey} title={colorKey} className="w-6 h-6 rounded-full border border-border" style={{ backgroundColor: palette[colorKey as keyof typeof palette] }}></div>
                ))}
            </div>
            <div className="flex justify-end gap-2 items-center">
                <button onClick={onEdit} className="text-blue-400 hover:underline text-sm font-medium">Edit</button>
                <button onClick={onActivate} disabled={isActive} className="bg-primary text-primary-foreground text-sm font-bold px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed">Activate</button>
            </div>
        </div>
    );
};

const AddThemeCard = ({ onAdd }: { onAdd: () => void }) => (
    <button onClick={onAdd} className="bg-card p-4 rounded-lg border-2 border-dashed border-border hover:border-primary transition-all flex flex-col items-center justify-center min-h-[164px] text-muted-foreground hover:text-primary">
        <span className="text-5xl font-thin">+</span>
        <span className="font-bold">Add New Theme</span>
    </button>
);

const highlightNewItem = (id: string, scroll: boolean = true) => {
    setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
            if (scroll) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add('new-item-highlight');
            setTimeout(() => { el.classList.remove('new-item-highlight'); }, 2000);
        }
    }, 100);
};

const confirmAction = (message: string): boolean => {
    return window.confirm(message);
}

// --- Main AdminPanel Component ---

const AdminPanel: React.FC = () => {
    const context = useContext(AppContext);
    const [password, setPassword] = useState('');
    const [devPassword, setDevPassword] = useState('');
    const [error, setError] = useState('');
    const [showDevLogin, setShowDevLogin] = useState(false);
    
    const [editedContent, setEditedContent] = useState<SiteContent | null>(null);
    const [newAdminPassword, setNewAdminPassword] = useState('');
    const [newMasterPassword, setNewMasterPassword] = useState('');
    const [newTimeout, setNewTimeout] = useState(0);

    const [activeTab, setActiveTab] = useState('general');
    const [newImageUrl, setNewImageUrl] = useState<{ [key: number]: string }>({});
    const [isDirty, setIsDirty] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    
    const [editingThemeIndex, setEditingThemeIndex] = useState<number | null>(null);

    const newlyAddedItemId = useRef<{type: string, id: number} | null>(null);
    const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const themeEditorRef = useRef<HTMLDivElement>(null);

    const [isDragging, setIsDragging] = useState(false);
    const [isOverTrash, setIsOverTrash] = useState(false);
    const [currentTime, setCurrentTime] = useState(() => Date.now());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (context?.content) {
            setEditedContent(JSON.parse(JSON.stringify(context.content)));
            setIsDirty(false);
        }
    }, [context?.content]);
    
    useEffect(() => {
      if (context?.inactivityTimeout) {
        setNewTimeout(context.inactivityTimeout);
      }
    }, [context?.inactivityTimeout]);

    useEffect(() => {
      return () => {
        if (successTimerRef.current) clearTimeout(successTimerRef.current);
      }
    }, []);

    useEffect(() => {
        if (editingThemeIndex !== null) {
            setTimeout(() => themeEditorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
        }
    }, [editingThemeIndex]);

    useEffect(() => {
        if (!newlyAddedItemId.current) return;

        const { type, id } = newlyAddedItemId.current;
        let elementId = '';
        let tab = '';

        if (type === 'service') {
            elementId = `service-admin-card-${id}`;
            tab = 'services';
        } else if (type === 'social') {
            elementId = `social-admin-card-${id}`;
            tab = 'contact';
        }

        if (activeTab === tab && elementId) {
            highlightNewItem(elementId);
            newlyAddedItemId.current = null;
        }
    }, [activeTab, editedContent]);

    if (!context) return null;
    const { 
      authLevel, login, devLogin, logout, setShowAdminPanel, 
      isDefaultAdminPassword, updateAdminPassword, updateContent,
      content, updateMasterPassword,
      setInactivityTimeout, resetAdminPassword,
      moveItemToTrash, restoreItemFromTrash, permanentlyDeleteItemFromTrash
    } = context;

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (login(password)) {
            setError('');
            setPassword('');
        } else {
            setError('Invalid password.');
        }
    };
    const handleDevLogin = (e: React.FormEvent) => { e.preventDefault(); if (!devLogin(devPassword)) { setError('Invalid master password.'); } else { setError(''); setDevPassword(''); }};
    const handleClose = () => { setShowAdminPanel(false); };

    const handleSave = () => {
        if(editedContent && isDirty) {
          updateContent(editedContent);
          if (newTimeout !== context.inactivityTimeout) {
            setInactivityTimeout(newTimeout);
          }
          setIsDirty(false);
          if(successTimerRef.current) clearTimeout(successTimerRef.current);
          setShowSuccessMessage(true);
          successTimerRef.current = setTimeout(() => { setShowSuccessMessage(false); }, 3000);
        }
    };
    
    const handleTrashAction = (
        action: 'move' | 'restore' | 'delete', 
        itemType: 'service' | 'theme' | 'social' | 'galleryImage', 
        ids: any, 
        itemName: string
    ) => {
      let message = '';
      let performAction = () => {};

      switch(action) {
        case 'move':
          message = `Are you sure you want to move ${itemName} to the trash? This is a temporary action and can be undone from the trash.`;
          performAction = () => moveItemToTrash(itemType, ids);
          break;
        case 'restore':
          // No confirmation needed for restore
          restoreItemFromTrash(itemType, ids);
          return;
        case 'delete':
          message = `This action is permanent and cannot be undone. Are you sure you want to delete ${itemName} forever?`;
          performAction = () => permanentlyDeleteItemFromTrash(itemType, ids);
          break;
      }
      
      if (confirmAction(message)) {
        performAction();
      }
    };

    const handleContentChange = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => {
      setEditedContent(prev => prev ? { ...prev, [key]: value } : null);
      setIsDirty(true);
    };

    const handleNestedContentChange = <K extends keyof SiteContent, NK extends keyof SiteContent[K]>(key: K, nestedKey: NK, value: SiteContent[K][NK]) => {
      setEditedContent(prev => {
        if (!prev) return null;
        const originalObject = prev[key];
        if (typeof originalObject === 'object' && originalObject !== null && !Array.isArray(originalObject)) { return { ...prev, [key]: { ...originalObject, [nestedKey]: value } }; }
        return prev;
      });
      setIsDirty(true);
    };

    const handleServiceChange = (id: number, field: keyof Omit<ServiceCardData, 'id' | 'gallery' | 'deletedOn' | 'deletedGallery'>, value: string) => {
        setEditedContent(prev => {
            if (!prev) return null;
            const newServices = prev.services.map(s => s.id === id ? { ...s, [field]: value } : s);
            return { ...prev, services: newServices };
        });
        setIsDirty(true);
    };

    const handleSocialChange = (id: number, field: keyof Omit<SocialLink, 'id' | 'deletedOn'>, value: string) => {
        setEditedContent(prev => {
            if (!prev) return null;
            const newSocials = prev.socials.map(s => s.id === id ? { ...s, [field]: value } : s);
            return { ...prev, socials: newSocials };
        });
        setIsDirty(true);
    };
    
    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, mode: 'light' | 'dark') => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => { handleNestedContentChange('logo', mode, reader.result as string); };
        reader.readAsDataURL(file);
    };

    const handleAddService = () => {
      if (!editedContent) return;
      const newId = (editedContent.services.length > 0 ? Math.max(...editedContent.services.map(s => s.id)) : 0) + 1;
      newlyAddedItemId.current = {type: 'service', id: newId};
      const newService: ServiceCardData = { id: newId, title: 'New Service', description: 'A short description.', longDescription: 'A more detailed description.', image: `https://picsum.photos/400/300?random=${newId}`, gallery: [], };
      setEditedContent(prev => prev ? { ...prev, services: [...prev.services, newService] } : null);
      setIsDirty(true);
    };

    const handleAddImageFromUrl = (serviceId: number) => {
        const urlsText = newImageUrl[serviceId]; if (!urlsText || urlsText.trim() === '') return;
        const urls = urlsText.split('\n').map(url => url.trim()).filter(url => url.length > 0 && (url.startsWith('http') || url.startsWith('data:image')));
        if (urls.length > 0) { 
            setEditedContent(prev => {
                if (!prev) return null;
                return { ...prev, services: prev.services.map(s => s.id === serviceId ? { ...s, gallery: [...s.gallery, ...urls] } : s) };
            });
            setNewImageUrl(prevUrlState => ({...prevUrlState, [serviceId]: '' }));
            setIsDirty(true);
        }
    };

    const handleImageUpload = (serviceId: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files; if (!files || files.length === 0) return;
        const filePromises = Array.from(files).map(file => new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onloadend = () => resolve(reader.result as string); reader.onerror = reject; reader.readAsDataURL(file); }));
        Promise.all(filePromises).then(base64Strings => { 
            setEditedContent(prev => {
                if (!prev) return null;
                return { ...prev, services: prev.services.map(s => s.id === serviceId ? { ...s, gallery: [...s.gallery, ...base64Strings] } : s) };
            });
            setIsDirty(true);
        }).catch(error => { console.error("Error reading files:", error); alert("An error occurred while uploading images."); });
    };

    const handleThemePropChange = (index: number, mode: 'light'|'dark', prop: keyof ThemePalette, value: string) => {
        setEditedContent(prev => {
            if (!prev) return null;
            const newThemes = [...prev.themes];
            newThemes[index] = { ...newThemes[index], [mode]: { ...newThemes[index][mode], [prop]: value } };
            return { ...prev, themes: newThemes };
        });
        setIsDirty(true);
    };

    const handleThemeNameChange = (index: number, name: string) => { 
        setEditedContent(prev => {
            if (!prev) return null;
            const newThemes = [...prev.themes];
            const oldName = newThemes[index].name;
            newThemes[index] = { ...newThemes[index], name };
            if (prev.activeTheme === oldName) {
                return { ...prev, themes: newThemes, activeTheme: name };
            }
            return { ...prev, themes: newThemes };
        });
        setIsDirty(true);
    };

    const handleAddNewTheme = () => {
        if (!editedContent) return;
        const newThemeName = `New Theme ${editedContent.themes.length + 1}`;
        const newTheme: ThemeOptions = { name: newThemeName, light: {}, dark: {} };
        const newIndex = editedContent.themes.length;
        setEditedContent(prev => prev ? { ...prev, themes: [...prev.themes, newTheme] } : null);
        setEditingThemeIndex(newIndex);
        setIsDirty(true);
    };

    const handleEditTheme = (index: number) => { setEditingThemeIndex(index); };
    
    const handleSocialIconUpload = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > 1024 * 100) { alert('File is too large. Please upload an icon smaller than 100KB.'); return; }
      const reader = new FileReader();
      reader.onloadend = () => { handleSocialChange(id, 'iconUrl', reader.result as string) };
      reader.readAsDataURL(file);
      e.target.value = '';
    };

    const handleAddSocialLink = () => {
        if (!editedContent) return;
        const newId = (editedContent.socials.length > 0 ? Math.max(...editedContent.socials.map(s => s.id)) : 0) + 1;
        newlyAddedItemId.current = {type: 'social', id: newId};
        const defaultIcon = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>`;
        const newLink: SocialLink = { id: newId, name: 'New Social', url: 'https://', iconUrl: defaultIcon };
        setEditedContent(prev => prev ? { ...prev, socials: [...prev.socials, newLink] } : null);
        setIsDirty(true);
    };
    
    const handleDragStart = (e: React.DragEvent, itemType: string, ids: object) => {
        e.dataTransfer.setData('application/json', JSON.stringify({ itemType, ...ids }));
        setIsDragging(true);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
        setIsOverTrash(false);
    };
    
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const data = JSON.parse(e.dataTransfer.getData('application/json'));
        if (!content) return;
        const { itemType } = data;
        let itemName = 'this item';
        if (itemType === 'theme') {
            const theme = content.themes[data.themeIndex];
            if (theme.name === content.activeTheme) { alert("You cannot delete the currently active theme."); setIsOverTrash(false); setIsDragging(false); return; }
            itemName = `the theme "${theme.name}"`;
        } else if (itemType === 'service') {
            const service = content.services.find(s => s.id === data.itemId);
            if (service) itemName = `the service "${service.title}"`;
        } else if (itemType === 'social') {
            const social = content.socials.find(s => s.id === data.itemId);
            if(social) itemName = `the social link "${social.name}"`;
        } else if (itemType === 'galleryImage') {
            itemName = 'this gallery image';
        }
        handleTrashAction('move', itemType, data, itemName);
        setIsOverTrash(false);
        setIsDragging(false);
    };
    
    const formatTimeLeft = (deletedOn: number) => {
        const AUTO_DELETE_DURATION = 30 * 24 * 60 * 60 * 1000;
        const timeLeftMs = (deletedOn + AUTO_DELETE_DURATION) - currentTime;
        if (timeLeftMs <= 0) return "Expired";
        const days = Math.floor(timeLeftMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeftMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        if (days > 0) return `${days}d ${hours}h left`;
        const minutes = Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60));
        if (hours > 0) return `${hours}h ${minutes}m left`;
        if (minutes > 0) return `${minutes}m left`;
        return "less than 1m left";
    };

    if (!editedContent) return <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center text-white">Loading Editor...</div>;
    
    const trashedItemsCount = (content.services?.filter(s => s.deletedOn).length || 0) +
                           (content.themes?.filter(t => t.deletedOn).length || 0) +
                           (content.socials?.filter(s => s.deletedOn).length || 0) +
                           (content.services?.reduce((acc, s) => acc + (s.deletedGallery?.length || 0), 0) || 0);

    if (authLevel === AuthLevel.NONE) return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center animate-fade-in">
            <div className="bg-card p-8 rounded-lg shadow-2xl w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-center text-card-foreground">Admin Login</h2>
                <form onSubmit={handleLogin}>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full p-2 border rounded mb-4 bg-muted text-muted-foreground border-border" />
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <button type="submit" className="w-full bg-primary text-primary-foreground py-2 rounded hover:bg-opacity-90">Login</button>
                </form>
                <button onClick={() => setShowAdminPanel(false)} className="w-full mt-2 text-sm text-muted-foreground hover:underline">Cancel</button>
            </div>
        </div>
    );
    
    if (isDefaultAdminPassword && authLevel === AuthLevel.ADMIN) return (
         <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center animate-fade-in">
            <div className="bg-card p-8 rounded-lg shadow-2xl w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-2 text-center text-card-foreground">Change Password</h2>
                <p className="text-center text-sm mb-6 text-muted-foreground">You must change the default password.</p>
                <form onSubmit={(e) => { e.preventDefault(); updateAdminPassword(newAdminPassword); setNewAdminPassword(''); alert('Password updated!'); }}>
                    <input type="password" value={newAdminPassword} onChange={(e) => setNewAdminPassword(e.target.value)} placeholder="New Password" className="w-full p-2 border rounded mb-4 bg-muted text-muted-foreground border-border"/>
                    <button type="submit" className="w-full bg-primary text-primary-foreground py-2 rounded hover:bg-opacity-90">Set New Password</button>
                </form>
            </div>
        </div>
    )

    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex p-4 font-sans">
        <div className="relative bg-[#0F172A] text-white w-full max-w-7xl mx-auto rounded-lg shadow-2xl flex flex-col overflow-hidden">
          <header className="bg-secondary p-4 flex justify-between items-center flex-shrink-0 border-b border-border">
            <h2 className="text-xl font-bold font-heading text-secondary-foreground">{authLevel === AuthLevel.DEV ? 'Developer Panel' : 'Admin Panel'} - {content.companyName}</h2>
            <div>
             {authLevel === AuthLevel.ADMIN && ( <button onClick={() => setShowDevLogin(p => !p)} className="text-muted-foreground hover:text-white inline-block mr-4" title="Developer Login"><DevIcon /></button> )}
             <button onClick={logout} className="bg-primary text-primary-foreground py-1 px-3 rounded text-sm mr-4">Logout</button>
             <button onClick={handleClose} className="text-muted-foreground hover:text-white text-2xl leading-none">&times;</button>
            </div>
          </header>
          
          <div className="flex flex-1 overflow-hidden">
            <aside className="w-64 bg-[#0d1525] flex flex-col flex-shrink-0 p-4">
                <nav className="flex-1 space-y-2">
                    <NavLink tabName="general" icon={<SettingsIcon/>} activeTab={activeTab} setActiveTab={setActiveTab}>General</NavLink>
                    <NavLink tabName="theme" icon={<ThemeIcon/>} activeTab={activeTab} setActiveTab={setActiveTab}>Theme</NavLink>
                    <NavLink tabName="services" icon={<ServicesIcon/>} activeTab={activeTab} setActiveTab={setActiveTab}>Services</NavLink>
                    <NavLink tabName="contact" icon={<ContactIcon/>} activeTab={activeTab} setActiveTab={setActiveTab}>Contact</NavLink>
                    <NavLink tabName="footer" icon={<FooterIcon/>} activeTab={activeTab} setActiveTab={setActiveTab}>Footer</NavLink>
                    <button onClick={() => setActiveTab('trash')} className={`w-full flex items-center justify-between gap-3 px-4 py-3 font-bold rounded-md transition-colors duration-200 ${activeTab === 'trash' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'}`}>
                      <div className="flex items-center gap-3">
                        <TrashNavIcon/>
                        <span>Trash</span>
                      </div>
                      {trashedItemsCount > 0 && <span className="bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">{trashedItemsCount}</span>}
                    </button>
                    {authLevel === AuthLevel.DEV && (
                        <NavLink tabName="developer" icon={<DevIcon/>} activeTab={activeTab} setActiveTab={setActiveTab}>Developer</NavLink>
                    )}
                </nav>
            </aside>
            
            <main className="flex-1 overflow-y-auto p-6 bg-background text-foreground">
                {activeTab === 'general' && (
                    <div className="animate-fade-in space-y-8">
                        <div className="bg-card p-6 rounded-lg border border-border shadow-md">
                           <h3 className="text-xl font-bold text-card-foreground border-b border-border pb-3 mb-6">Brand Identity</h3>
                           <div className="space-y-6">
                             <Input label="Company Name" value={editedContent.companyName} onChange={e => handleContentChange('companyName', e.target.value)} />
                             <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">Logos</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <p className="text-sm font-semibold text-center mb-1">Light Mode Logo</p>
                                        {editedContent.logo.light && <img src={editedContent.logo.light} alt="Light Logo Preview" className="h-20 w-full bg-muted p-2 rounded-md mb-2 object-contain" />}
                                        <Input label="URL" value={editedContent.logo.light} onChange={e => handleNestedContentChange('logo', 'light', e.target.value)} placeholder="URL or upload"/>
                                        <label className="w-full mt-2 flex items-center justify-center px-4 py-2 bg-input text-foreground rounded-lg cursor-pointer hover:bg-accent hover:text-accent-foreground text-sm"><UploadIcon /><span>Upload</span><input type='file' className="hidden" accept="image/*" onChange={e => handleLogoUpload(e, 'light')} /></label>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm font-semibold text-center mb-1">Dark Mode Logo</p>
                                        {editedContent.logo.dark && <img src={editedContent.logo.dark} alt="Dark Logo Preview" className="h-20 w-full bg-muted p-2 rounded-md mb-2 object-contain" />}
                                        <Input label="URL" value={editedContent.logo.dark} onChange={e => handleNestedContentChange('logo', 'dark', e.target.value)} placeholder="URL or upload"/>
                                        <label className="w-full mt-2 flex items-center justify-center px-4 py-2 bg-input text-foreground rounded-lg cursor-pointer hover:bg-accent hover:text-accent-foreground text-sm"><UploadIcon /><span>Upload</span><input type='file' className="hidden" accept="image/*" onChange={e => handleLogoUpload(e, 'dark')} /></label>
                                    </div>
                                </div>
                            </div>
                           </div>
                        </div>
                         <div className="bg-card p-6 rounded-lg border border-border shadow-md">
                           <h3 className="text-xl font-bold text-card-foreground border-b border-border pb-3 mb-6">Hero Section</h3>
                           <div className="space-y-6">
                             <Input label="Hero Image URL" value={editedContent.hero.image} onChange={e => handleNestedContentChange('hero', 'image', e.target.value)} />
                             <Input label="Hero Heading" value={editedContent.hero.heading} onChange={e => handleNestedContentChange('hero', 'heading', e.target.value)} />
                             <Textarea label="Hero Subheading" value={editedContent.hero.subheading} onChange={e => handleNestedContentChange('hero', 'subheading', e.target.value)} />
                           </div>
                        </div>
                    </div>
                )}
                {activeTab === 'theme' && (
                    <div className="animate-fade-in">
                        <div className="bg-card p-6 rounded-lg border border-border shadow-md">
                            <h3 className="text-xl font-bold text-card-foreground border-b border-border pb-3 mb-6">Theme Management</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {editedContent.themes.filter(t => !t.deletedOn).map((theme, index) => (
                                    <ThemeCard
                                        key={`${index}-${theme.name}`}
                                        theme={theme}
                                        isActive={theme.name === editedContent.activeTheme}
                                        onActivate={() => handleContentChange('activeTheme', theme.name)}
                                        onEdit={() => handleEditTheme(index)}
                                        onDelete={() => handleTrashAction('move', 'theme', { themeIndex: index }, `the "${theme.name}" theme`)}
                                        draggable={theme.name !== editedContent.activeTheme}
                                        onDragStart={(e) => handleDragStart(e, 'theme', { themeIndex: index })}
                                        onDragEnd={handleDragEnd}
                                    />
                                ))}
                                <AddThemeCard onAdd={handleAddNewTheme} />
                            </div>
                        </div>
                        {editingThemeIndex !== null && editedContent.themes[editingThemeIndex] && (
                            <div ref={themeEditorRef} className="mt-8 animate-fade-in">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-2xl font-bold">Editing: <span className="text-accent">{editedContent.themes[editingThemeIndex].name}</span></h3>
                                    <button onClick={() => setEditingThemeIndex(null)} className="text-muted-foreground hover:text-white text-2xl leading-none">&times;</button>
                                </div>
                                <ThemeEditor 
                                    theme={editedContent.themes[editingThemeIndex]} 
                                    index={editingThemeIndex} 
                                    handleThemeNameChange={handleThemeNameChange}
                                    handleThemePropChange={handleThemePropChange}
                                />
                            </div>
                        )}
                    </div>
                )}
                 {activeTab === 'contact' && (
                    <div className="animate-fade-in space-y-8">
                        <div className="bg-card p-6 rounded-lg border border-border shadow-md">
                            <h3 className="text-xl font-bold text-card-foreground border-b border-border pb-3 mb-6">Contact Information</h3>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input label="Phone Number" value={editedContent.contact.phone} onChange={e => handleNestedContentChange('contact', 'phone', e.target.value)} />
                                    <Input label="Email Address" value={editedContent.contact.email} onChange={e => handleNestedContentChange('contact', 'email', e.target.value)} />
                                </div>
                                <Input label="Physical Address" value={editedContent.contact.address} onChange={e => handleNestedContentChange('contact', 'address', e.target.value)} />
                            </div>
                        </div>

                        <div className="bg-card p-6 rounded-lg border border-border shadow-md">
                            <div className="flex justify-between items-center border-b border-border pb-3 mb-6">
                                <h3 className="text-xl font-bold text-card-foreground">Social Media Links</h3>
                                <button onClick={handleAddSocialLink} className="bg-primary text-primary-foreground text-sm font-bold py-1 px-3 rounded hover:bg-opacity-90">Add New</button>
                            </div>
                            <div className="space-y-6">
                                {editedContent.socials.filter(s => !s.deletedOn).map((social) => (
                                    <div 
                                      key={social.id} 
                                      id={`social-admin-card-${social.id}`} 
                                      draggable 
                                      onDragStart={(e) => handleDragStart(e, 'social', { itemId: social.id })}
                                      onDragEnd={handleDragEnd}
                                      className="relative bg-muted p-4 rounded-lg border border-border/50 transition-colors duration-2000 cursor-grab"
                                    >
                                        <button
                                            onClick={() => handleTrashAction('move', 'social', { itemId: social.id }, `"${social.name}"`)}
                                            className="absolute top-2 right-2 text-muted-foreground hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-500/10"
                                            aria-label={`Move ${social.name} to trash`}
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Input label="Name" value={social.name} onChange={e => handleSocialChange(social.id, 'name', e.target.value)} />
                                            <Input label="URL" value={social.url} onChange={e => handleSocialChange(social.id, 'url', e.target.value)} />
                                        </div>
                                        <div className="mt-4">
                                          <label className="block text-sm font-medium text-muted-foreground mb-1">Icon (URL or Upload)</label>
                                          <div className="flex items-center gap-2">
                                              <input type="text" placeholder="Enter image URL or upload file" className="w-full p-2 border rounded bg-input text-foreground border-border" value={social.iconUrl} onChange={e => handleSocialChange(social.id, 'iconUrl', e.target.value)} />
                                              <label className="flex-shrink-0 px-3 py-2 bg-input text-foreground rounded-lg cursor-pointer hover:bg-accent hover:text-accent-foreground text-sm font-medium">
                                                  <span>Upload</span>
                                                  <input type='file' className="hidden" accept="image/svg+xml,image/png,image/jpeg" onChange={e => handleSocialIconUpload(e, social.id)} />
                                              </label>
                                              {social.iconUrl && (
                                                  <div className="flex-shrink-0 w-8 h-8 p-1 bg-card border border-border rounded">
                                                      <div className="w-full h-full bg-foreground" style={{ maskImage: `url("${social.iconUrl}")`, WebkitMaskImage: `url("${social.iconUrl}")`, maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }} />
                                                  </div>
                                              )}
                                          </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                 {activeTab === 'footer' && (
                    <div className="animate-fade-in">
                        <div className="bg-card p-6 rounded-lg border border-border shadow-md">
                           <h3 className="text-xl font-bold text-card-foreground border-b border-border pb-3 mb-6">Footer Content</h3>
                           <Textarea label="About Us Column" value={editedContent.footer.about} onChange={e => handleNestedContentChange('footer', 'about', e.target.value)} />
                        </div>
                    </div>
                )}
                {activeTab === 'developer' && authLevel === AuthLevel.DEV && (
                    <div className="animate-fade-in space-y-8">
                        <div className="bg-card p-6 rounded-lg border border-border shadow-md">
                            <h3 className="text-xl font-bold text-card-foreground border-b border-border pb-3 mb-6">Footer Credit</h3>
                            <div className="space-y-6">
                               <Input label="Footer Credit Text" value={editedContent.footer.credit} onChange={e => handleNestedContentChange('footer', 'credit', e.target.value)} />
                               <Input label="Footer Credit Link (URL)" value={editedContent.footer.creditLink || ''} onChange={e => handleNestedContentChange('footer', 'creditLink', e.target.value)} placeholder="https://example.com"/>
                            </div>
                        </div>
                        <div className="bg-card p-6 rounded-lg border border-red-500/50 shadow-md">
                            <h3 className="text-xl font-bold text-card-foreground border-b border-border pb-3 mb-6">Security & Settings (Danger Zone)</h3>
                            <div className="space-y-8 divide-y divide-border/50">
                                <form onSubmit={e => {e.preventDefault(); if(newAdminPassword) {updateAdminPassword(newAdminPassword); setNewAdminPassword(''); alert('Admin password updated!')}}} className="pt-4 first:pt-0">
                                    <div className="space-y-4">
                                       <Input label="Change Admin Password" type="password" placeholder="New Admin Password" value={newAdminPassword} onChange={e => setNewAdminPassword(e.target.value)} />
                                       <button type="submit" className="bg-accent/80 text-accent-foreground px-4 py-1 text-sm rounded">Update Password</button>
                                    </div>
                                </form>
                                <form onSubmit={e => {e.preventDefault(); if(newMasterPassword) {updateMasterPassword(newMasterPassword); setNewMasterPassword(''); alert('Master password updated!')}}} className="pt-8">
                                    <div className="space-y-4">
                                       <Input label="Change Master Password" type="password" placeholder="New Master Password" value={newMasterPassword} onChange={e => setNewMasterPassword(e.target.value)} />
                                       <button type="submit" className="bg-red-500 text-white px-4 py-1 text-sm rounded">Update Master Password</button>
                                    </div>
                                </form>
                                <div className="pt-8">
                                    <div className="space-y-2">
                                       <Input label="Inactivity Timeout (seconds)" type="number" value={newTimeout} onChange={e => { setNewTimeout(Number(e.target.value)); setIsDirty(true); }} />
                                       <p className="text-xs text-muted-foreground">Changes to timeout are applied on "Save All Changes".</p>
                                    </div>
                                </div>
                                <div className="pt-8">
                                    <div className="space-y-2">
                                       <p className="text-sm font-medium text-muted-foreground">Force Admin Password Reset</p>
                                       <button onClick={() => {if(confirmAction('Are you sure?')){resetAdminPassword(); alert("Admin password has been reset to default.")}}} className="bg-red-500 text-white px-4 py-1 text-sm rounded">Reset Admin Password</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'services' && (
                <div className="animate-fade-in">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold">Manage Services</h3>
                        <button onClick={handleAddService} className="bg-primary text-primary-foreground py-2 px-4 rounded font-bold">Add New Service</button>
                    </div>
                    <div className="space-y-8">
                    {editedContent.services.filter(s => !s.deletedOn).map(service => (
                        <div 
                            key={service.id} 
                            id={`service-admin-card-${service.id}`} 
                            className="relative bg-card p-6 rounded-lg border border-border shadow-md transition-colors duration-2000 cursor-grab"
                            draggable
                            onDragStart={(e) => handleDragStart(e, 'service', { itemId: service.id })}
                            onDragEnd={handleDragEnd}
                        >
                            <button
                                onClick={() => handleTrashAction('move', 'service', { itemId: service.id }, `the "${service.title}" service`)}
                                className="absolute top-4 right-4 text-muted-foreground hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-500/10"
                                aria-label={`Move ${service.title} to trash`}
                            >
                                <TrashIcon className="h-5 w-5" />
                            </button>
                            <h4 className="text-2xl font-bold text-accent mb-4">{service.title}</h4>
                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                                <div className="lg:col-span-3 space-y-6">
                                    <h5 className="text-lg font-semibold text-muted-foreground -mb-2">Service Details</h5>
                                    <Input label="Title" value={service.title} onChange={e => handleServiceChange(service.id, 'title', e.target.value)} />
                                    <Input label="Card Image URL" value={service.image} onChange={e => handleServiceChange(service.id, 'image', e.target.value)} />
                                    <Textarea label="Short Description (Card)" value={service.description} onChange={e => handleServiceChange(service.id, 'description', e.target.value)} />
                                    <Textarea label="Long Description (Detail Page)" value={service.longDescription} onChange={e => handleServiceChange(service.id, 'longDescription', e.target.value)} />
                                </div>
                                <div className="lg:col-span-2 space-y-4">
                                    <h5 className="text-lg font-semibold text-muted-foreground">Image Gallery</h5>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-60 overflow-y-auto p-2 bg-muted rounded">
                                        {service.gallery.map((imgSrc, index) => (
                                        <div 
                                            key={`${service.id}-${index}`} 
                                            className="relative group cursor-grab"
                                            draggable
                                            onDragStart={(e) => { e.stopPropagation(); handleDragStart(e, 'galleryImage', { serviceId: service.id, imageIndex: index }) }}
                                            onDragEnd={handleDragEnd}
                                        >
                                            <img src={imgSrc} alt="" className="w-full h-20 object-cover rounded" />
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleTrashAction('move', 'galleryImage', { serviceId: service.id, imageIndex: index }, 'this gallery image')}}
                                                className="absolute top-1 right-1 bg-black/50 text-white hover:bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                aria-label="Move image to trash"
                                            >
                                                <TrashIcon className="h-3 w-3"/>
                                            </button>
                                        </div>
                                        ))}
                                    </div>
                                    <div className="space-y-2">
                                        <textarea placeholder="Add image URLs, one per line" rows={3} className="w-full p-2 border rounded bg-input text-foreground border-border" value={newImageUrl[service.id] || ''} onChange={e => setNewImageUrl(prev => ({...prev, [service.id]: e.target.value}))}/>
                                        <button onClick={() => handleAddImageFromUrl(service.id)} className="w-full bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-500 text-sm font-bold">Add from URLs</button>
                                    </div>
                                    <label className="w-full flex items-center justify-center px-4 py-2 bg-input text-foreground rounded-lg cursor-pointer hover:bg-accent hover:text-accent-foreground text-sm"><UploadIcon /><span>Upload Image(s)</span><input type='file' multiple className="hidden" accept="image/*" onChange={e => handleImageUpload(service.id, e)} /></label>
                                </div>
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
                )}
                {activeTab === 'trash' && (
                  <div className="animate-fade-in">
                    <h3 className="text-2xl font-bold mb-6">Trash</h3>
                    <p className="text-muted-foreground mb-6">Items in the trash are available for 30 days before being removed. You can also drag items from other tabs to the trash icon to delete them.</p>
                    {trashedItemsCount === 0 ? (
                        <div className="text-center py-16 border-2 border-dashed border-border rounded-lg">
                            <TrashCanIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4"/>
                            <p className="text-muted-foreground font-bold">Trash is empty</p>
                        </div>
                    ) : (
                      <div className="space-y-4">
                        {content.services.filter(s => s.deletedOn).map(item => {
                          const elapsedMs = currentTime - item.deletedOn!;
                          const isDeletable = elapsedMs > 30000;
                          const secondsLeft = Math.ceil((30000 - elapsedMs) / 1000);
                          return (
                            <div key={`s-${item.id}`} className="flex items-center justify-between bg-muted p-3 rounded-lg border border-border">
                                <div className="flex items-center gap-3">
                                    <ServicesIcon/>
                                    <div>
                                        <p className="font-bold">{item.title}</p>
                                        <p className="text-xs text-muted-foreground">Service | Expires in: {formatTimeLeft(item.deletedOn!)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button onClick={() => handleTrashAction('restore', 'service', { itemId: item.id }, '')} className="flex items-center gap-1 text-sm text-green-400 hover:underline"><RestoreIcon className="h-4 w-4"/> Restore</button>
                                    <button onClick={() => handleTrashAction('delete', 'service', { itemId: item.id }, `the "${item.title}" service`)} disabled={!isDeletable} className="flex items-center gap-1 text-sm text-red-400 hover:underline disabled:text-gray-500 disabled:no-underline disabled:cursor-wait"><TrashIcon className="h-4 w-4"/> {isDeletable ? 'Delete Forever' : `Wait ${secondsLeft}s`}</button>
                                </div>
                            </div>
                          );
                        })}
                        {content.themes.map((item, index) => item.deletedOn ? (() => {
                          const elapsedMs = currentTime - item.deletedOn!;
                          const isDeletable = elapsedMs > 30000;
                          const secondsLeft = Math.ceil((30000 - elapsedMs) / 1000);
                          return (
                            <div key={`t-${index}`} className="flex items-center justify-between bg-muted p-3 rounded-lg border border-border">
                                <div className="flex items-center gap-3">
                                    <ThemeIcon/>
                                    <div>
                                        <p className="font-bold">{item.name}</p>
                                        <p className="text-xs text-muted-foreground">Theme | Expires in: {formatTimeLeft(item.deletedOn!)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button onClick={() => handleTrashAction('restore', 'theme', { themeIndex: index }, '')} className="flex items-center gap-1 text-sm text-green-400 hover:underline"><RestoreIcon className="h-4 w-4"/> Restore</button>
                                    <button onClick={() => handleTrashAction('delete', 'theme', { themeIndex: index }, `the "${item.name}" theme`)} disabled={!isDeletable} className="flex items-center gap-1 text-sm text-red-400 hover:underline disabled:text-gray-500 disabled:no-underline disabled:cursor-wait"><TrashIcon className="h-4 w-4"/> {isDeletable ? 'Delete Forever' : `Wait ${secondsLeft}s`}</button>
                                </div>
                            </div>
                          );
                        })() : null)}
                        {content.socials.filter(s => s.deletedOn).map(item => {
                          const elapsedMs = currentTime - item.deletedOn!;
                          const isDeletable = elapsedMs > 30000;
                          const secondsLeft = Math.ceil((30000 - elapsedMs) / 1000);
                          return (
                           <div key={`so-${item.id}`} className="flex items-center justify-between bg-muted p-3 rounded-lg border border-border">
                                <div className="flex items-center gap-3">
                                    <ContactIcon/>
                                    <div>
                                        <p className="font-bold">{item.name}</p>
                                        <p className="text-xs text-muted-foreground">Social Link | Expires in: {formatTimeLeft(item.deletedOn!)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button onClick={() => handleTrashAction('restore', 'social', { itemId: item.id }, '')} className="flex items-center gap-1 text-sm text-green-400 hover:underline"><RestoreIcon className="h-4 w-4"/> Restore</button>
                                    <button onClick={() => handleTrashAction('delete', 'social', { itemId: item.id }, `the "${item.name}" link`)} disabled={!isDeletable} className="flex items-center gap-1 text-sm text-red-400 hover:underline disabled:text-gray-500 disabled:no-underline disabled:cursor-wait"><TrashIcon className="h-4 w-4"/> {isDeletable ? 'Delete Forever' : `Wait ${secondsLeft}s`}</button>
                                </div>
                            </div>
                          );
                        })}
                        {content.services.flatMap(service => (service.deletedGallery || []).map((item, index) => {
                          const elapsedMs = currentTime - item.deletedOn!;
                          const isDeletable = elapsedMs > 30000;
                          const secondsLeft = Math.ceil((30000 - elapsedMs) / 1000);
                          return (
                            <div key={`g-${service.id}-${index}`} className="flex items-center justify-between bg-muted p-3 rounded-lg border border-border">
                                <div className="flex items-center gap-3">
                                    <img src={item.url} alt="" className="w-10 h-10 object-cover rounded"/>
                                    <div>
                                        <p className="font-bold">Gallery Image</p>
                                        <p className="text-xs text-muted-foreground">From: {service.title} | Expires in: {formatTimeLeft(item.deletedOn!)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button onClick={() => handleTrashAction('restore', 'galleryImage', { serviceId: service.id, imageIndex: index }, '')} className="flex items-center gap-1 text-sm text-green-400 hover:underline"><RestoreIcon className="h-4 w-4"/> Restore</button>
                                    <button onClick={() => handleTrashAction('delete', 'galleryImage', { serviceId: service.id, imageIndex: index }, 'this image')} disabled={!isDeletable} className="flex items-center gap-1 text-sm text-red-400 hover:underline disabled:text-gray-500 disabled:no-underline disabled:cursor-wait"><TrashIcon className="h-4 w-4"/> {isDeletable ? 'Delete Forever' : `Wait ${secondsLeft}s`}</button>
                                </div>
                            </div>
                          );
                        }))}
                      </div>
                    )}
                  </div>
                )}
            </main>
          </div>
          
          <footer className="bg-secondary p-4 flex-shrink-0 flex justify-between items-center border-t border-border">
            <button onClick={handleSave} disabled={!isDirty} className="bg-primary text-primary-foreground py-2 px-6 rounded font-bold transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed enabled:hover:bg-opacity-80"> Save All Changes </button>
          </footer>
          
          {showSuccessMessage && ( <div className="animate-fade-in-out absolute bottom-5 right-5 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg font-bold"> Changes saved successfully! </div> )}
        </div>
        
        <div 
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsOverTrash(true); }}
          onDragLeave={() => setIsOverTrash(false)}
          className={`fixed bottom-8 right-8 w-28 h-28 rounded-full flex items-center justify-center border-4 border-dashed transition-all duration-300 transform ${isDragging ? 'scale-100 opacity-100' : 'scale-0 opacity-0'} ${isOverTrash ? 'bg-red-500/30 border-red-500' : 'bg-card border-border'}`}
        >
          <TrashCanIcon className={`w-14 h-14 transition-colors ${isOverTrash ? 'text-red-500' : 'text-muted-foreground'}`} />
        </div>

        {showDevLogin && authLevel === AuthLevel.ADMIN && (
             <div className="absolute inset-0 bg-black/70 z-10 flex items-center justify-center">
                <div className="bg-card border border-accent p-8 rounded-lg shadow-2xl w-full max-w-sm">
                    <h2 className="text-2xl font-bold mb-6 text-center text-card-foreground">Developer Login</h2>
                    <form onSubmit={handleDevLogin}>
                        <input type="password" value={devPassword} onChange={(e) => setDevPassword(e.target.value)} placeholder="Master Password" className="w-full p-2 border rounded mb-4 bg-muted text-muted-foreground border-border" />
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        <button type="submit" className="w-full bg-accent text-accent-foreground font-bold py-2 rounded hover:bg-opacity-90">Unlock</button>
                    </form>
                    <button onClick={() => {setShowDevLogin(false); setError('');}} className="w-full mt-2 text-sm text-muted-foreground hover:underline">Cancel</button>
                </div>
            </div>
        )}
      </div>
    );
};

export default AdminPanel;
