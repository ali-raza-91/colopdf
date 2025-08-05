// "use client";
// import Link from 'next/link';
// import { useState } from 'react';
// import { ArrowRight } from 'lucide-react';
// import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

// const GenericSectionComponent = ({
//     title,
//     description,
//     tabs,
//     toolsData,
//     primaryColor,
//     iconComponent: IconComponent,
//     initialVisibleCount = 20,
//     Arrow = ArrowRight
// }) => {
//     const [activeTab, setActiveTab] = useState(Object.keys(toolsData)[0]);
//     const [showAllCategory, setShowAllCategory] = useState(false);
//     const [showAllTools, setShowAllTools] = useState(true);

//     // // Color configuration
//     // const colorClasses = {
//     //     blue: {
//     //         bg: 'bg-gradient-to-r from-cyan-600 to-purple-600',
//     //         hover: 'hover:from-cyan-700 hover:to-purple-700',
//     //         border: 'border-cyan-500/30',
//     //         text: 'text-cyan-400',
//     //         lightBg: 'bg-gray-800',
//     //         iconColor: 'text-cyan-400'
//     //     },
//     // };

//     // const colors = colorClasses[primaryColor] || colorClasses.blue;

//     // Get tools to display based on current state
//     const getVisibleTools = () => {
//         if (showAllTools) {
//             return Object.values(toolsData).flat();
//         }
//         if (showAllCategory) {
//             return toolsData[activeTab];
//         }
//         return toolsData[activeTab].slice(0, initialVisibleCount);
//     };

//     const visibleTools = getVisibleTools();

//     // Format tab name for display
//     const formatTabName = (tab) => {
//         return tab.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
//     };

//     return (
//         <section className="bg-gradient-to-br from-gray-900 to-gray-800 py-16 px-4 sm:px-6 lg:px-8">
//             <div className="max-w-7xl mx-auto">
//                 {/* Section Header */}
//                 {/* <div className="text-center mb-12">
//                     <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 mb-4">
//                         {title}
//                     </h2>
//                     <p className="text-lg text-gray-300 max-w-3xl mx-auto">
//                         {description}
//                     </p>
//                 </div> */}

//                 {/* Category Tabs */}
//                 <div className="flex flex-wrap justify-center gap-3 mb-8">
//                     {tabs.map((tab) => (
//                         <button
//                             key={tab}
//                             onClick={() => {
//                                 setActiveTab(tab);
//                                 setShowAllCategory(false);
//                                 setShowAllTools(false);
//                             }}
//                             className={`px-4 py-2 rounded-md capitalize font-medium transition-all ${activeTab === tab && !showAllTools
//                                     ? `${colors.bg} text-white shadow-lg`
//                                     : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
//                                 }`}
//                         >
//                             {formatTabName(tab)}
//                         </button>
//                     ))}

//                     {/* Show All Tools Button */}
//                     <button
//                         onClick={() => {
//                             setShowAllTools(!showAllTools);
//                             setShowAllCategory(false);
//                         }}
//                         className={`px-4 py-2 rounded-md font-medium transition-all ${showAllTools
//                                 ? `${colors.bg} text-white shadow-lg`
//                                 : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
//                             }`}
//                     >
//                         All {title} Tools
//                     </button>
//                 </div>

//                 {/* Tools Grid */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 my-8">
//                     {visibleTools.map((tool, index) => (
//                         <div
//                             key={index}
//                             className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:shadow-lg transition-all hover:border-cyan-500/30 hover:bg-gray-800/70`}
//                         >
//                             <div className="flex flex-col h-full">
//                                 {/* Tool Icon */}
//                                 <div className={`mb-4 p-3 ${colors.lightBg} rounded-lg w-fit border border-gray-700`}>
//                                     {tool.icon || <IconComponent className={`${colors.iconColor} text-3xl`} />}
//                                 </div>

//                                 {/* Tool Info */}
//                                 <h3 className="text-xl font-bold text-white mt-3 mb-1">{tool.title}</h3>
//                                 <p className="text-gray-400 mb-4 text-[15px] flex-grow">{tool.description}</p>

//                                 {/* CTA Button */}
//                                 <Link
//                                     href={tool.link || '#'}
//                                     className={`mt-auto w-fit text-center flex justify-center items-center gap-2 ${colors.bg} ${colors.hover} text-white py-2 px-4 rounded-md font-medium transition-all shadow-lg hover:shadow-cyan-500/30`}
//                                 >
//                                     Try Now <Arrow size={20} />
//                                 </Link>
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 {/* Show More/Less Buttons */}
//                 <div className="flex justify-center gap-4">
//                     {/* Show All in Category Button */}
//                     {!showAllTools && toolsData[activeTab].length > initialVisibleCount && (
//                         <button
//                             onClick={() => setShowAllCategory(!showAllCategory)}
//                             className={`inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md ${colors.bg} ${colors.hover} text-white shadow-lg`}
//                         >
//                             {showAllCategory ? (
//                                 <>
//                                     <FaChevronUp className="mr-2" />
//                                     Show Fewer {formatTabName(activeTab)} Tools
//                                 </>
//                             ) : (
//                                 <>
//                                     <FaChevronDown className="mr-2" />
//                                     Show All {toolsData[activeTab].length} {formatTabName(activeTab)} Tools
//                                 </>
//                             )}
//                         </button>
//                     )}

//                     {/* Show Less Button when showing all tools */}
//                     {showAllTools && (
//                         <button
//                             onClick={() => setShowAllTools(false)}
//                             className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-lg ${colors.bg} ${colors.hover} text-white`}
//                         >
//                             <FaChevronUp className="mr-2" />
//                             Show Categories Instead
//                         </button>
//                     )}
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default GenericSectionComponent;


//-----------------------
//-----------------------
//-----------------------
//-----------------------

'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function GenericSectionComponent({
    title,
    tabs,
    toolsData,
    iconComponent: IconComponent
}) {
    const [activeTab, setActiveTab] = useState(tabs[0]);
    const [showAllTools, setShowAllTools] = useState(true);

    const visibleTools = showAllTools 
        ? Object.values(toolsData).flat()
        : toolsData[activeTab];

    return (
        <section className="bg-gradient-to-br from-gray-900 to-gray-800 py-16 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => {
                                setActiveTab(tab);
                                setShowAllTools(false);
                            }}
                            className={`px-4 py-2 rounded-md ${activeTab === tab && !showAllTools
                                ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white'
                                : 'bg-gray-800 text-gray-300'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}

                    <button
                        onClick={() => setShowAllTools(!showAllTools)}
                        className={`px-4 py-2 rounded-md ${
                            showAllTools 
                                ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white'
                                : 'bg-gray-800 text-gray-300'
                        }`}
                    >
                        All {title} Tools
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 my-8">
                    {visibleTools.map((tool, index) => (
                        <div
                            key={index}
                            className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-cyan-500/30 transition-colors"
                        >
                            <div className="flex flex-col h-full">
                                <div className="mb-4 p-3 bg-gray-800 rounded-lg w-fit border border-gray-700">
                                    {tool.icon || <IconComponent className="text-cyan-400 text-3xl" />}
                                </div>

                                <h3 className="text-xl font-bold text-white mt-3 mb-1">
                                    {tool.title}
                                </h3>
                                <p className="text-gray-400 mb-4">
                                    {tool.description}
                                </p>

                                <Link
                                    href={tool.link || '#'}
                                    className="mt-auto w-fit flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-purple-700 text-white py-2 px-4 rounded-md hover:from-cyan-700 hover:to-purple-700 transition-colors"
                                >
                                    Try Now <ArrowRight size={20} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}