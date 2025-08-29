# Pages Manager

A comprehensive landing page management system built with Vue.js and Tailwind CSS.

## Features

### 📊 Dashboard Overview
- **Total Pages**: Shows the total number of pages in the system
- **Total Views**: Aggregated view count across all pages
- **Total Leads**: Combined lead count from all pages
- **Total Clicks**: Total click count across all pages

### 📋 Data Table
The Pages Manager uses a responsive data table with the following columns:
- **Title**: Page title
- **Slug**: URL slug
- **Status**: Page status (Published, Draft, Archived)
- **Views**: Number of page views
- **Leads**: Number of leads generated
- **Clicks**: Total clicks on the page
- **Published**: Publication date
- **Active**: Whether the page is currently active

### 🔍 Search & Filtering
- **Search Bar**: Search through pages by title, content, or other fields
- **Pagination**: Navigate through large datasets
- **Items Per Page**: Choose how many items to display (5, 10, 15, 20, 25, 30, 50)

### ✅ Bulk Operations
- **Select All**: Checkbox to select all visible pages
- **Bulk Activate**: Activate multiple pages at once
- **Bulk Deactivate**: Deactivate multiple pages at once
- **Bulk Delete**: Delete multiple pages at once

### 🎯 Individual Page Actions
- **View**: View page details
- **Edit**: Edit page content and settings
- **Toggle Status**: Activate/deactivate individual pages
- **Delete**: Remove individual pages

## API Integration

The Pages Manager integrates with a RESTful API that provides:

```json
{
  "success": true,
  "message": "Pages retrieved successfully",
  "data": [
    {
      "id": 1,
      "title": "New Landing Page",
      "slug": "new-landing-page",
      "status": "published",
      "views": 1,
      "leads_count": 1,
      "total_clicks": 0,
      "publish_at": "2025-08-10T05:57:57.000000Z",
      "is_active": true
    }
  ],
  "pagination": {
    "current_page": 1,
    "last_page": 1,
    "per_page": 15,
    "total": 1
  }
}
```

## File Structure

```
src/
├── pages/
│   └── Pages.vue              # Main Pages Manager component
├── services/
│   └── pagesService.js        # API service for pages
├── components/
│   └── Datatable.vue          # Reusable data table component
└── routes/
    └── index.js               # Routing configuration
```

## Usage

### Navigation
Access the Pages Manager by navigating to `/pages` in your application.

### Creating Pages
Click the "Create New Page" button to add new landing pages.

### Managing Pages
- Use the search bar to find specific pages
- Select multiple pages using checkboxes for bulk operations
- Use pagination controls to navigate through large datasets
- Adjust the number of items displayed per page

### Responsive Design
The Pages Manager is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices

## Customization

### Adding New Columns
To add new columns to the table, modify the `columns` array in `Pages.vue`:

```javascript
const columns = [
  { key: 'title', label: 'Title' },
  { key: 'new_field', label: 'New Field' }, // Add new column
  // ... existing columns
]
```

### Modifying Actions
Customize the action buttons by editing the template slot in `Pages.vue`:

```vue
<template #actions="{ row }">
  <!-- Custom action buttons -->
  <button @click="customAction(row)">
    Custom Action
  </button>
</template>
```

### API Endpoints
Modify the API endpoints in `pagesService.js` to match your backend:

```javascript
const API_BASE_URL = 'https://your-api-domain.com/api'
```

## Dependencies

- **Vue.js 3**: Frontend framework
- **Tailwind CSS**: Utility-first CSS framework
- **Font Awesome**: Icon library
- **Vue Router**: Client-side routing

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Running Locally
```bash
npm install
npm run dev
```

### Building for Production
```bash
npm run build
```

### Code Quality
The code follows Vue.js best practices and includes:
- Proper error handling
- Loading states
- Responsive design
- Accessibility features
- Dark mode support 