# BpmnCmmnDmnPrototype

A modern web-based demonstration application showcasing integrated business process modeling using **BPMN**, **CMMN**, and **DMN** standards in a unified tri-view interface.

## 🎯 Project Overview

This project demonstrates how to create a comprehensive business process modeling environment that combines three key OMG (Object Management Group) standards:

- **BPMN (Business Process Model and Notation)** - for workflow processes
- **CMMN (Case Management Model and Notation)** - for case management
- **DMN (Decision Model and Notation)** - for decision modeling

The application provides a modern, responsive web interface where users can view, edit, and interact with all three types of diagrams in a single integrated environment.

## ✨ Features

### Core Functionality
- **Tri-View Interface**: Switch seamlessly between BPMN, CMMN, and DMN views using tabs
- **Interactive Diagram Editing**: Full modeler capabilities for all three diagram types
- **Properties Panel**: Real-time property inspection when clicking on diagram elements
- **File Import/Export**: Support for importing and exporting XML files for each diagram type
- **Token Simulation**: BPMN token animation to visualize process flow
- **Responsive Design**: Modern CSS-based layout that works across devices

### Technical Features
- **Robust DMN Initialization**: Handles various DMN library loading scenarios
- **Cross-Diagram Linking**: Extension elements enable jumps between diagram types
- **Zoom Controls**: Fit-to-viewport functionality for optimal diagram viewing
- **Real-time Updates**: Live property inspection and diagram interaction

## 🛠️ Technology Stack

### Frontend Libraries
- **[bpmn-js](https://github.com/bpmn-io/bpmn-js)** v10.1.0 - BPMN modeling toolkit
- **[cmmn-js](https://github.com/bpmn-io/cmmn-js)** v0.20.0 - CMMN modeling toolkit
- **[dmn-js](https://github.com/bpmn-io/dmn-js)** v17.4.0 - DMN modeling toolkit
- **[diagram-js](https://github.com/bpmn-io/diagram-js)** v11.12.0 - Core diagramming framework

### Architecture
- Pure vanilla JavaScript (ES6+)
- CDN-based library loading for easy deployment
- CSS Grid and Flexbox for responsive layout
- DOM-based event handling and state management

## 📁 Project Structure

```
BpmnCmmnDmnPrototype/
├── index.html          # Main HTML file with tri-view layout
├── app.js              # Core application logic and diagram initialization
├── styles.css          # Modern CSS styling and responsive layout
├── package.json        # Project configuration and dependencies
├── models/             # Sample diagram files
│   ├── process.bpmn    # Sample BPMN process diagram
│   ├── case.cmmn       # Sample CMMN case diagram
│   └── policy.dmn      # Sample DMN decision diagram
└── assets/             # Additional project assets
    └── README.md       # Asset documentation
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser with ES6+ support
- Web server (for local development) or static hosting service

### Installation & Running

#### Option 1: Local Development Server
```bash
# Clone the repository
git clone https://github.com/Outcomtix/BpnmCmmnDmnPrototype.git
cd BpnmCmmnDmnPrototype

# Install dependencies (optional, for development)
npm install

# Serve using any static file server
# Python 3
python -m http.server 8000

# Node.js (if you have http-server installed)
npx http-server

# Open browser to http://localhost:8000
```

#### Option 2: Direct Browser Opening
Simply open `index.html` in your web browser. Note that some features may require a web server due to CORS restrictions.

## 📊 Sample Data

The project includes three interconnected sample diagrams:

### BPMN Process (`models/process.bpmn`)
- **Review Complaint Flow**: A business process demonstrating complaint handling
- Contains extension elements that link to DMN decisions
- Includes start events, user tasks, and sequence flows

### CMMN Case (`models/case.cmmn`)
- **Case management model**: Demonstrates adaptive case management scenarios
- Shows case stages, milestones, and discretionary items

### DMN Decision (`models/policy.dmn`)
- **Decision modeling**: Business rules and decision logic
- Can be referenced from BPMN processes for decision automation

## 🎮 Usage Guide

### Basic Navigation
1. **Switch Views**: Click the tabs (CMMN, BPMN, DMN) to switch between diagram types
2. **Inspect Elements**: Click any shape or element to view its properties in the side panel
3. **Zoom Controls**: Use the "Reset View" button to fit diagrams to viewport

### Import/Export Functionality
1. **Import**: Click "Import [Type]" buttons to load your own diagram files
2. **Export**: Click "Export XML" to download the current diagram as XML

### BPMN Token Simulation
1. Switch to the BPMN view
2. Click "Run Token" to watch a token animate through the process flow
3. Observe how the token moves along sequence flows

### Cross-Diagram Integration
- BPMN processes can reference DMN decisions via extension elements
- Look for `oa:jump decisionRef` elements in the sample BPMN file

## 🔧 Development

### Key Components

#### `app.js` - Core Logic
- **Modeler Initialization**: Robust DMN constructor detection and fallback handling
- **Tab Management**: View switching and canvas activation
- **Property Rendering**: Dynamic property panel population
- **Event Handling**: File import/export and user interactions

#### `index.html` - Structure
- **Responsive Layout**: CSS Grid-based tri-view interface
- **Library Loading**: CDN-based script inclusion with proper defer attributes
- **Semantic HTML**: Accessible structure with proper ARIA considerations

#### `styles.css` - Presentation
- **Modern Design**: Contemporary UI with clean typography
- **Responsive Grid**: Flexible layout that adapts to screen sizes
- **Component Styling**: Consistent button, panel, and navigation styles

### Extending the Application

#### Adding New Diagram Types
1. Include the appropriate library CDN in `index.html`
2. Add a new tab and canvas section
3. Initialize the modeler in `app.js`
4. Update the tab switching logic

#### Custom Properties
1. Extend the `renderProps()` function in `app.js`
2. Add custom property extraction logic for specific element types
3. Update the property panel styling in `styles.css`

## 🤝 Integration Patterns

### OutcomeAI Schema Extensions
The project demonstrates custom schema extensions (`xmlns:oa="https://outcome.ai/schema/oa"`) for:
- Cross-diagram navigation (`oa:jump`)
- Decision integration points
- Custom process annotations

### Extension Points
- **Custom Properties**: Add domain-specific properties to diagram elements
- **Validation Rules**: Implement business rule validation
- **Export Formats**: Support for additional output formats beyond XML

## 📋 Browser Compatibility

- **Chrome/Edge**: Full support (recommended)
- **Firefox**: Full support
- **Safari**: Full support with ES6+ enabled
- **Mobile**: Responsive design works on tablets and phones

## 🐛 Troubleshooting

### Common Issues

#### DMN Library Loading
If DMN diagrams don't load:
1. Check browser console for DMN constructor errors
2. Verify CDN availability for dmn-js library
3. Ensure proper script loading order (defer attributes)

#### File Import Issues
If file import fails:
1. Ensure files are valid XML format
2. Check file extensions (.bpmn, .cmmn, .dmn)
3. Verify CORS settings if running locally

#### Display Issues
If diagrams don't render properly:
1. Check CSS loading order
2. Verify container dimensions
3. Try the "Reset View" button

## 📈 Future Enhancements

### Planned Features
- **Collaborative Editing**: Multi-user diagram editing
- **Version Control**: Diagram versioning and history
- **Process Execution**: Runtime process engine integration
- **Advanced Validation**: Cross-diagram consistency checking
- **Export Options**: PNG, SVG, and PDF export capabilities

### Integration Opportunities
- **Business Rules Engines**: DMN execution environment
- **Workflow Engines**: BPMN runtime execution
- **Case Management Systems**: CMMN-based case handling
- **Analytics Dashboard**: Process performance metrics

## 👨‍💻 Author

**Jim Deane** - *OutcomeAI*

## 📄 License

This project is licensed under the ISC License - see the package.json file for details.

## 🙏 Acknowledgments

- **bpmn.io Team** - For the excellent modeling toolkits
- **OMG** - For the BPMN, CMMN, and DMN specifications
- **OutcomeAI Community** - For business process modeling insights

---

*This project demonstrates modern web-based business process modeling capabilities and serves as a foundation for building comprehensive process management applications.*