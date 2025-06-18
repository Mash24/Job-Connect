# Custom Report Builder

## Overview

The Custom Report Builder is a comprehensive, investor-grade reporting system that enables administrators to create professional reports with drag-and-drop functionality, multiple export formats, and scheduled delivery. This component transforms your admin dashboard into a complete business intelligence platform.

## Features

### 🎨 Drag-and-Drop Interface
- Intuitive chart placement and resizing
- Real-time layout preview
- Grid and single-column layout options
- Responsive design for all screen sizes

### 📊 Chart Library
- **Bar Charts**: Compare categories with vertical bars
- **Line Charts**: Show trends over time
- **Pie Charts**: Display proportions of a whole
- **Area Charts**: Show cumulative data over time
- **Data Tables**: Display raw data in table format
- **Metric Cards**: Show key performance indicators

### 🎯 Data Sources
- **Users**: User registration, roles, activity metrics
- **Jobs**: Job postings, categories, application rates
- **Applications**: Application trends, conversion rates
- **Analytics**: Platform usage, engagement metrics

### 📤 Export Options
- **PDF**: High-quality print format with vector graphics
- **Excel**: Interactive spreadsheet with raw data
- **CSV**: Comma-separated values for data analysis
- **Image**: High-resolution PNG/JPEG for presentations

### ⏰ Scheduled Delivery
- **Daily**: Every day at specified time
- **Weekly**: Every week on specified day
- **Monthly**: First day of each month
- Email delivery to multiple recipients
- Password protection and expiration dates

## Component Structure

```
CustomReportBuilder/
├── CustomReportBuilder.jsx      # Main component
├── ReportCanvas.jsx             # Chart rendering and layout
├── ChartLibrary.jsx             # Chart selection interface
├── ReportSettings.jsx           # Report configuration
├── ExportPanel.jsx              # Export options and formats
├── ScheduledReports.jsx         # Automated delivery management
└── ReportCard.jsx               # Saved reports display
```

## Usage

### Basic Implementation

```jsx
import CustomReportBuilder from './components/admin/reports/CustomReportBuilder';

function AdminReportsPage() {
  return (
    <div className="admin-reports">
      <CustomReportBuilder />
    </div>
  );
}
```

### Integration with Admin Dashboard

```jsx
import React, { useState } from 'react';
import CustomReportBuilder from './components/admin/reports/CustomReportBuilder';

function AdminReports() {
  const [activeView, setActiveView] = useState('builder');

  return (
    <div className="admin-reports">
      {/* View Toggle */}
      <div className="view-tabs">
        <button 
          className={activeView === 'builder' ? 'active' : ''}
          onClick={() => setActiveView('builder')}
        >
          Report Builder
        </button>
        <button 
          className={activeView === 'saved' ? 'active' : ''}
          onClick={() => setActiveView('saved')}
        >
          Saved Reports
        </button>
        <button 
          className={activeView === 'scheduled' ? 'active' : ''}
          onClick={() => setActiveView('scheduled')}
        >
          Scheduled Reports
        </button>
      </div>

      {/* Content */}
      {activeView === 'builder' && <CustomReportBuilder />}
      {activeView === 'saved' && <SavedReportsList />}
      {activeView === 'scheduled' && <ScheduledReportsManager />}
    </div>
  );
}
```

## Props

### CustomReportBuilder

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onReportSave` | `function` | - | Callback when report is saved |
| `onReportExport` | `function` | - | Callback when report is exported |
| `onScheduleCreate` | `function` | - | Callback when schedule is created |

### ReportCanvas

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `reportData` | `object` | `{}` | Report configuration and charts |
| `isEditing` | `boolean` | `true` | Whether in edit or preview mode |
| `selectedChart` | `string` | `null` | ID of currently selected chart |
| `onChartSelect` | `function` | - | Callback when chart is selected |
| `onChartUpdate` | `function` | - | Callback when chart is updated |
| `onChartRemove` | `function` | - | Callback when chart is removed |
| `onReportUpdate` | `function` | - | Callback when report is updated |

## Data Structure

### Report Data Object

```javascript
const reportData = {
  title: 'Custom Report',
  description: 'Report description',
  layout: 'grid', // 'grid', 'single', 'dashboard'
  theme: 'light', // 'light', 'dark', 'blue', 'green'
  charts: [
    {
      id: 'chart_1',
      type: 'bar',
      title: 'Chart Title',
      data: [...],
      position: { x: 0, y: 0 },
      size: { width: 400, height: 300 },
      config: {
        colors: ['#3b82f6', '#10b981'],
        showLegend: true,
        showGrid: true,
        animate: true
      },
      visible: true,
      filters: []
    }
  ],
  metrics: [],
  filters: []
};
```

### Chart Configuration

```javascript
const chartConfig = {
  // Bar Chart
  bar: {
    orientation: 'vertical', // 'vertical', 'horizontal'
    colors: ['#3b82f6'],
    showLegend: true,
    showGrid: true,
    animate: true
  },
  
  // Line Chart
  line: {
    showPoints: true,
    smooth: true,
    colors: ['#3b82f6'],
    showLegend: true,
    showGrid: true,
    animate: true
  },
  
  // Pie Chart
  pie: {
    showLabels: true,
    donut: false,
    colors: ['#3b82f6', '#10b981', '#f59e0b'],
    showLegend: true,
    animate: true
  },
  
  // Area Chart
  area: {
    fillOpacity: 0.3,
    colors: ['#3b82f6'],
    showLegend: true,
    showGrid: true,
    animate: true
  }
};
```

## Chart Types

### Bar Chart
```javascript
const barChartData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 }
];
```

### Line Chart
```javascript
const lineChartData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 }
];
```

### Pie Chart
```javascript
const pieChartData = [
  { name: 'Job Seekers', value: 45 },
  { name: 'Employers', value: 30 },
  { name: 'Admins', value: 25 }
];
```

### Metric Card
```javascript
const metricData = {
  value: 1234,
  label: 'Total Users',
  change: '+12%'
};
```

### Data Table
```javascript
const tableData = [
  { id: 1, name: 'John Doe', role: 'Job Seeker', status: 'Active' },
  { id: 2, name: 'Jane Smith', role: 'Employer', status: 'Active' }
];
```

## Export Formats

### PDF Export
- High-quality vector graphics
- Professional layout
- Print-ready format
- Customizable headers and footers

### Excel Export
- Interactive charts
- Raw data included
- Editable format
- Multiple worksheets

### CSV Export
- Data-only format
- Import-friendly
- Lightweight
- Universal compatibility

### Image Export
- High-resolution output
- PNG/JPEG formats
- Presentation-ready
- Universal format

## Scheduled Reports

### Frequency Options
- **Daily**: Every day at specified time
- **Weekly**: Every week on specified day
- **Monthly**: First day of each month

### Delivery Options
- Email delivery
- Multiple recipients
- Password protection
- Expiration dates
- Custom subject lines

### Example Schedule
```javascript
const schedule = {
  name: 'Weekly User Report',
  description: 'Weekly user registration summary',
  frequency: 'weekly',
  dayOfWeek: 'monday',
  time: '09:00',
  recipients: ['stakeholder@company.com'],
  reportId: 'report_123',
  format: 'pdf',
  active: true
};
```

## Styling

### Theme Options
- **Light**: Clean, professional appearance
- **Dark**: Modern, high-contrast design
- **Blue**: Corporate, trustworthy feel
- **Green**: Growth, success-oriented

### Custom CSS Classes
```css
/* Report Builder Container */
.custom-report-builder {
  @apply min-h-screen bg-gray-50;
}

/* Chart Canvas */
.report-canvas {
  @apply bg-white rounded-lg shadow-sm border border-gray-200;
}

/* Chart Library */
.chart-library {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-4;
}

/* Export Panel */
.export-panel {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}
```

## Performance Optimization

### Lazy Loading
- Charts load only when visible
- Data fetching on demand
- Optimized re-renders

### Caching
- Chart configurations cached
- Data source caching
- Export format caching

### Bundle Optimization
- Code splitting for chart types
- Dynamic imports for heavy components
- Tree shaking for unused features

## Testing

### Unit Tests
```bash
npm test CustomReportBuilder.test.jsx
npm test ReportCanvas.test.jsx
npm test ChartLibrary.test.jsx
```

### Integration Tests
```bash
npm test CustomReportBuilder.integration.test.jsx
```

### E2E Tests
```bash
npm run test:e2e -- --spec "custom-report-builder.cy.js"
```

## Accessibility

### ARIA Labels
- Proper chart descriptions
- Interactive element labels
- Screen reader support

### Keyboard Navigation
- Tab navigation through charts
- Enter/Space for interactions
- Escape for modal closing

### Color Contrast
- WCAG AA compliant
- High contrast mode support
- Color-blind friendly palettes

## Error Handling

### Data Fetching Errors
```javascript
try {
  const data = await fetchChartData();
  setChartData(data);
} catch (error) {
  console.error('Error fetching chart data:', error);
  showErrorMessage('Failed to load chart data');
}
```

### Export Errors
```javascript
try {
  await exportReport(format);
  showSuccessMessage('Report exported successfully');
} catch (error) {
  console.error('Export failed:', error);
  showErrorMessage('Failed to export report');
}
```

### Validation
```javascript
const validateReportData = (data) => {
  if (!data.title) {
    throw new Error('Report title is required');
  }
  if (!data.charts || data.charts.length === 0) {
    throw new Error('At least one chart is required');
  }
  return true;
};
```

## Best Practices

### Chart Design
1. **Keep it Simple**: Don't overload charts with too much data
2. **Use Appropriate Types**: Choose chart types that best represent your data
3. **Consistent Colors**: Use a consistent color palette throughout
4. **Clear Labels**: Ensure all axes and data points are clearly labeled

### Performance
1. **Limit Chart Count**: Don't exceed 10-15 charts per report
2. **Optimize Data**: Use aggregated data when possible
3. **Lazy Load**: Load charts only when needed
4. **Cache Results**: Cache frequently accessed data

### User Experience
1. **Intuitive Interface**: Make the builder easy to use
2. **Preview Mode**: Always show what the final report will look like
3. **Save Progress**: Auto-save draft reports
4. **Export Options**: Provide multiple export formats

## Troubleshooting

### Common Issues

**Charts not rendering**
- Check if data is properly formatted
- Verify chart type is supported
- Ensure Recharts library is loaded

**Export failing**
- Check file permissions
- Verify export format is supported
- Ensure sufficient memory for large reports

**Scheduled reports not sending**
- Check email configuration
- Verify recipient addresses
- Ensure schedule is active

### Debug Mode
```javascript
// Enable debug logging
localStorage.setItem('reportBuilderDebug', 'true');

// Check console for detailed logs
console.log('Report Builder Debug Mode Enabled');
```

## Future Enhancements

### Planned Features
- **Advanced Filtering**: Multi-dimensional data filtering
- **Custom Themes**: User-defined color schemes
- **Real-time Data**: Live data integration
- **Collaboration**: Multi-user report editing
- **Templates**: Pre-built report templates
- **API Integration**: External data source connectors

### Roadmap
- **Q1 2024**: Advanced filtering and custom themes
- **Q2 2024**: Real-time data and collaboration features
- **Q3 2024**: Templates and API integration
- **Q4 2024**: AI-powered chart recommendations

## Support

For technical support or feature requests, please contact:
- **Email**: support@jobconnect.com
- **Documentation**: [docs.jobconnect.com](https://docs.jobconnect.com)
- **GitHub**: [github.com/jobconnect/reports](https://github.com/jobconnect/reports) 