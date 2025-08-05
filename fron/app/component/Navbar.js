"use client";

import { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Menu, 
  X,
  FileText,
  Lock,
  Edit,
  FileInput,
  FileOutput,
  FileSpreadsheet,
  FileImage,
  Presentation,
  Image,
  Merge,
  Split,
  Shrink,
  Shield,
  Unlock,
  Droplets
} from 'lucide-react';

export default function Navbar() {
    const [openDropdown, setOpenDropdown] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdown(null);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = (dropdownName) => {
        setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Searching for:', searchQuery);
        // Add your search functionality here
    };

    const dropdownItems = [
        {
            name: 'PDF Convert',
            icon: <Edit className="w-4 h-4" />,
            items: [
                { name: 'Pdf to Word', icon: <FileOutput className="w-4 h-4" /> },
                { name: 'Pdf to Excel', icon: <FileSpreadsheet className="w-4 h-4" /> },
                { name: 'Pdf to Powerpoint', icon: <Presentation className="w-4 h-4" /> },
                { name: 'Pdf to Image', icon: <Image className="w-4 h-4" /> },
                { name: 'Word to pdf', icon: <FileInput className="w-4 h-4" /> },
                { name: 'Excel to pdf', icon: <FileSpreadsheet className="w-4 h-4" /> },
                { name: 'Powerpoint to Pdf', icon: <Presentation className="w-4 h-4" /> },
                { name: 'Image to pdf', icon: <FileImage className="w-4 h-4" /> }
            ]
        },
        {
            name: 'PDF Security',
            icon: <Shield className="w-4 h-4" />,
            items: [
                { name: 'Lock pdf', icon: <Lock className="w-4 h-4" /> },
                { name: 'Unlock pdf', icon: <Unlock className="w-4 h-4" /> },
                { name: 'Watermark', icon: <Droplets className="w-4 h-4" /> }
            ]
        },
        {
            name: 'PDF Edit',
            icon: <Edit className="w-4 h-4" />,
            items: [
                { name: 'Merge pdf', icon: <Merge className="w-4 h-4" /> },
                { name: 'Split pdf', icon: <Split className="w-4 h-4" /> },
                { name: 'Compress pdf', icon: <Shrink className="w-4 h-4" /> }
            ]
        },
    ];

    return (
        <nav className="bg-gradient-to-r from-gray-900 to-gray-800 text-gray-200 p-4 sticky top-0 z-50 border-b border-gray-700 backdrop-blur-sm">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex justify-between items-center max-w-7xl mx-auto">
                <div className="font-bold text-2xl flex items-center gap-2">
                    <FileText className="w-6 h-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">miniPDF</span>
                </div>

                <div className="flex gap-8" ref={dropdownRef}>
                    {dropdownItems.map((dropdown) => (
                        <div key={dropdown.name} className="relative">
                            <button
                                onClick={() => toggleDropdown(dropdown.name)}
                                className="flex items-center gap-2 hover:text-cyan-400 transition-colors font-medium group"
                            >
                                <span className="text-cyan-400 group-hover:text-purple-400 transition-colors">
                                    {dropdown.icon}
                                </span>
                                {dropdown.name}
                                {openDropdown === dropdown.name ? (
                                    <ChevronUp className="w-4 h-4 text-purple-400" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
                                )}
                            </button>

                            {openDropdown === dropdown.name && (
                                <div className="absolute top-full left-0 mt-2 bg-gray-800 rounded-md min-w-[240px] border border-gray-700 shadow-lg py-2 z-10 backdrop-blur-lg">
                                    {dropdown.items.map((item) => (
                                        <a
                                            key={item.name}
                                            href="#"
                                            className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-700/50 hover:text-cyan-300 rounded transition-colors"
                                        >
                                            <span className="text-purple-400">
                                                {item.icon}
                                            </span>
                                            {item.name}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSearch} className="flex items-center">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="search"
                            placeholder="Search tools..."
                            className="pl-10 pr-4 py-2 rounded-l-lg border border-gray-700 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 w-64 shadow-sm text-white placeholder-gray-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-gradient-to-r from-cyan-600 to-purple-600 text-white px-4 py-2 rounded-r-lg font-medium hover:from-cyan-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-cyan-500/30 flex items-center gap-2"
                    >
                        Search
                    </button>
                </form>
            </div>

            {/* Mobile Navigation */}
            <div className="lg:hidden flex flex-col">
                <div className="flex justify-between items-center">
                    <div className="font-bold text-2xl flex items-center gap-2">
                        <FileText className="w-6 h-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">miniPDF</span>
                    </div>
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 rounded-md text-gray-300 hover:text-white"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {mobileMenuOpen && (
                    <div className="mt-4 space-y-4">
                        <form onSubmit={handleSearch} className="flex gap-0">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="search"
                                    placeholder="Search tools..."
                                    className="w-full flex-1 pl-10 pr-4 py-2 rounded-l-lg border border-gray-700 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 text-white placeholder-gray-400"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-20 bg-gradient-to-r from-cyan-600 to-purple-600 text-white px-4 py-2 rounded-r-lg font-medium hover:from-cyan-700 hover:to-purple-700 transition-all shadow-lg flex justify-center items-center"
                            >
                                <Search className="w-4 h-4" />
                            </button>
                        </form>

                        <div className="space-y-4 pt-2">
                            {dropdownItems.map((dropdown) => (
                                <div key={dropdown.name} className="space-y-2">
                                    <h3 className="font-semibold text-lg px-2 flex items-center gap-3 text-cyan-400">
                                        {dropdown.icon}
                                        {dropdown.name}
                                    </h3>
                                    <div className="grid grid-cols-1 gap-2">
                                        {dropdown.items.map((item) => (
                                            <a
                                                key={item.name}
                                                href="#"
                                                className="flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-700/70 rounded-lg transition-colors text-sm border border-gray-700"
                                            >
                                                <span className="text-purple-400">
                                                    {item.icon}
                                                </span>
                                                {item.name}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}