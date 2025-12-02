// components/NavBar.jsx
'use client';

// Define the IDs for the sections you want to scroll to
const sectionIds = {
  shortcuts: 'create-shortcuts-section',
  textEditor: 'text-editor-section',
  jsonParser: 'json-parser-section',
};

const NavBar = () => {
  // NOTE: In a real-world app, you would also track the current active section 
  // (e.g., using Intersection Observer) to highlight the active link.
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Smooth scroll to the element
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    // 1. Elevated Bar: Darker background, deeper shadow, sticky for persistent access
    <nav className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-lg shadow-gray-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center h-14 space-x-2 sm:space-x-8">
          
          {/* Section 1: Shortcuts */}
          <NavItem 
            id={sectionIds.shortcuts} 
            label="Create Shortcuts" 
            icon="⌨️"
            onClick={scrollToSection}
          />
          
          {/* Section 2: Text Editor */}
          <NavItem 
            id={sectionIds.textEditor} 
            label="Text Editor" 
            icon="📝"
            onClick={scrollToSection}
          />

          {/* Section 3: JSON Formatter */}
          <NavItem 
            id={sectionIds.jsonParser} 
            label="JSON Formatter" 
            icon="⚙️"
            onClick={scrollToSection}
          />
        </div>
      </div>
    </nav>
  );
};

// Extracted NavItem for cleaner rendering and reusable styling
const NavItem = ({ id, label, icon, onClick }: { id: string, label: string, icon: string, onClick: (id: string) => void }) => (
  <button
    onClick={() => onClick(id)}
    // 2. Modern Styles: Use neutral gray for base, professional blue for hover/active.
    // Use focus ring for accessibility.
    className="
      inline-flex items-center 
      px-2 pt-1 border-b-2 
      text-sm font-medium leading-5 
      text-gray-600 
      border-transparent 
      transition duration-150 ease-in-out
      hover:text-indigo-600 hover:border-indigo-500
      focus:outline-none focus:text-indigo-700 focus:border-indigo-700
      
      // Optional: Add a subtle active class if you implement state tracking
      // aria-current={isActive ? 'page' : undefined} 
      // ${isActive ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500'}
    "
    role="tab" // Semantically appropriate for navigation within a single page
  >
    <span className="mr-2 text-lg">{icon}</span> {/* Adjusted icon size */}
    {label}
  </button>
);

export default NavBar;