# Shared UI Component Library

A comprehensive collection of reusable UI components built with React, TypeScript, and Tailwind CSS for the Nexus e-commerce platform.

## Components

### Form Components
- **Button**: Primary, secondary, outline, ghost variants with loading states
- **Input**: Text, email, password, number inputs with validation states
- **Select**: Dropdown select with options
- **Checkbox**: Checkbox with label
- **Radio**: Radio button group
- **Switch**: Toggle switch
- **Textarea**: Multi-line text input
- **FormField**: Wrapper with label, error, and helper text

### Display Components
- **Badge**: Status and count badges
- **Avatar**: User avatar with fallback
- **Card**: Container card component
- **Alert**: Alert messages with variants
- **Skeleton**: Loading skeleton placeholders
- **Spinner**: Loading spinner
- **Progress**: Progress bar

### Interactive Components
- **Modal**: Modal dialog
- **Dropdown**: Dropdown menu
- **Tooltip**: Hover tooltip
- **Popover**: Click popover menu
- **Tabs**: Tabbed interface
- **Accordion**: Collapsible content sections

### Layout Components
- **Container**: Max-width container
- **Grid**: Responsive grid layout
- **Flex**: Flexbox layout
- **Stack**: Vertical/horizontal stack

### Data Components
- **Table**: Data table with sorting
- **Pagination**: Page navigation

## Usage

```typescript
import { Button, Input, Card } from '@/components/ui';

function MyComponent() {
  return (
    <Card>
      <Input placeholder="Enter text" />
      <Button variant="primary">Submit</Button>
    </Card>
  );
}
```

## Styling

All components are styled with Tailwind CSS utility classes and support:
- Responsive design
- Dark mode (where applicable)
- Accessibility features
- Consistent spacing and typography
