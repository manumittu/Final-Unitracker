# Visual Reference - Chart Types Implemented

This document provides a text-based representation of the visualizations implemented.

## Quiz Module - Result View

```
┌─────────────────────────────────────────────────────────┐
│  Quiz Result - Enhanced with Visualizations             │
├─────────────────────────────────────────────────────────┤
│                                                          │
│            ╔══════════════════════════════╗             │
│            ║   Quiz Completed!            ║             │
│            ║                              ║             │
│            ║        8 / 10                ║             │
│            ║      Score: 80%              ║             │
│            ╚══════════════════════════════╝             │
│                                                          │
│  ┌─────────────────────┐  ┌──────────────────────────┐ │
│  │ Overall Performance │  │ Question-wise Performance│ │
│  ├─────────────────────┤  ├──────────────────────────┤ │
│  │                     │  │                          │ │
│  │     ╱───────╲       │  │  █   █       █   █   █  │ │
│  │   ╱  80%    ╲      │  │  █   █   ▄   █   █   █  │ │
│  │  │  Correct  │      │  │  █   █   █   █   █   █  │ │
│  │  │           │      │  │  █   █   █   █   █   █  │ │
│  │   ╲  20%    ╱       │  │ Q1  Q2  Q3  Q4  Q5  Q6  │ │
│  │    ╲Incorrect      │  │                          │ │
│  │      ───────        │  │ Green = Correct (1)      │ │
│  │                     │  │ Red = Incorrect (0)      │ │
│  └─────────────────────┘  └──────────────────────────┘ │
│                                                          │
│           [Back to Quizzes]                             │
└─────────────────────────────────────────────────────────┘
```

**Features**:
- Pie chart shows 80% correct (green), 20% incorrect (red)
- Bar chart shows each question: tall green bar = correct, short red bar = incorrect
- Responsive: Stacks vertically on mobile

---

## Courses Module - Statistics and Charts

```
┌──────────────────────────────────────────────────────────────┐
│  Course Management                                            │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                    │
│  │Total │  │Total │  │Depts │  │Avg   │                    │
│  │Cours │  │Cred  │  │      │  │Cred  │                    │
│  │ 24   │  │ 72   │  │  6   │  │ 3.0  │                    │
│  └──────┘  └──────┘  └──────┘  └──────┘                    │
│  Blue      Green     Purple    Orange                        │
│                                                               │
│  ┌─────────────────────┐  ┌──────────────────────────────┐ │
│  │Credits Distribution │  │ Courses per Department       │ │
│  │by Department        │  │                              │ │
│  ├─────────────────────┤  ├──────────────────────────────┤ │
│  │                     │  │                              │ │
│  │     ╱CS: 24\        │  │   ██  ██  ██  ██  ██  ██    │ │
│  │   ╱ (33%) ╲        │  │   ██  ██  ██  ██  ██  ██    │ │
│  │  │   EE    │        │  │   ██  ██  ██  ██  ██  ██    │ │
│  │  │  (28%)  │        │  │   ██  ██  ██  ██  ██  ██    │ │
│  │   ╲  ME   ╱         │  │   ██  ██  ██  ██  ██  ██    │ │
│  │    ╲(22%)╱          │  │   ██  ██  ██  ██  ██  ██    │ │
│  │     ──────           │  │   CS  EE  ME  CE  IT  EC    │ │
│  │   + Others          │  │    6   4   4   3   4   3    │ │
│  │                     │  │                              │ │
│  └─────────────────────┘  └──────────────────────────────┘ │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Features**:
- 4 statistics cards at the top showing key metrics
- Pie chart shows credit distribution by department with percentages
- Bar chart shows course count per department
- Multiple colors for visual distinction

---

## Projects Module - Status Tracking

```
┌─────────────────────────────────────────────────────┐
│  Project Ideas                                       │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────┐  ┌──────┐  ┌──────┐                      │
│  │Total │  │Appro │  │Pend  │                      │
│  │Proj  │  │ved   │  │ing   │                      │
│  │ 15   │  │  8   │  │  5   │                      │
│  └──────┘  └──────┘  └──────┘                      │
│  Blue      Green     Yellow                          │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ Project Status Distribution                    │ │
│  ├────────────────────────────────────────────────┤ │
│  │                                                │ │
│  │              ╱─────────╲                       │ │
│  │            ╱  Approved  ╲                      │ │
│  │          ╱      8        ╲                     │ │
│  │         │    (53%)        │                    │ │
│  │         │                 │                    │ │
│  │          ╲   Pending     ╱                     │ │
│  │           ╲      5      ╱                      │ │
│  │            ╲   (33%)   ╱                       │ │
│  │              ────────                          │ │
│  │             Rejected: 2 (13%)                  │ │
│  │                                                │ │
│  │  Legend:                                       │ │
│  │  ■ Approved (Green)                            │ │
│  │  ■ Pending (Yellow)                            │ │
│  │  ■ Rejected (Red)                              │ │
│  │                                                │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
└─────────────────────────────────────────────────────┘
```

**Features**:
- 3 statistics cards showing total, approved, and pending counts
- Pie chart shows distribution of all three statuses
- Color-coded by status for quick recognition
- Only shows segments that have data (smart filtering)

---

## Chart Components Used

### 1. Pie Chart
- **Library**: recharts `<PieChart>`
- **Data binding**: Array of `{name, value}` objects
- **Customization**: 
  - Custom labels with percentages
  - Color cells for each segment
  - Interactive tooltips
  - Responsive container

### 2. Bar Chart  
- **Library**: recharts `<BarChart>`
- **Data binding**: Array of `{name, value}` objects
- **Customization**:
  - X-axis with category labels
  - Y-axis with numeric scale
  - Custom bar colors
  - Interactive tooltips
  - Legend support

### 3. Statistics Cards
- **Component**: Custom Card from UI library
- **Layout**: CSS Grid (responsive)
- **Content**: 
  - Title (small text)
  - Value (large bold number)
  - Color accent (top border or background)

---

## Responsive Behavior

### Desktop (>1024px)
```
[Card] [Card] [Card] [Card]
[Chart 50%    ] [Chart 50%    ]
```

### Tablet (768px - 1024px)
```
[Card] [Card] [Card]
[Chart 100%        ]
[Chart 100%        ]
```

### Mobile (<768px)
```
[Card]
[Card]
[Card]
[Chart]
[Chart]
```

All charts maintain their aspect ratio and readability across devices.

---

## Color Palette

### Quiz Module
- Success (Correct): `#4caf50` - Material Green 500
- Error (Incorrect): `#f44336` - Material Red 500

### Courses Module
- Primary Stats: `#3B82F6` (Blue)
- Secondary Stats: `#10B981` (Green), `#8B5CF6` (Purple), `#F97316` (Orange)
- Chart Colors: 7-color palette for department variety

### Projects Module
- Approved: `#4caf50` (Green)
- Pending: `#ffc658` (Yellow)
- Rejected: `#f44336` (Red)
- Stats: `#3B82F6` (Blue), `#10B981` (Green), `#F59E0B` (Yellow)

---

## Interaction Features

### Tooltips
- Appear on hover over chart elements
- Show exact values and labels
- Formatted based on data type
- Custom messages (e.g., "Correct" vs "1")

### Legends
- Automatically generated from data
- Shows color coding
- Clickable to filter (if enabled)
- Positioned below or beside charts

### Responsive Containers
- Charts automatically resize with viewport
- Maintain aspect ratios
- Smooth transitions during resize
- No horizontal scrolling needed

---

## Data Flow

### Quiz Module
```
Submit Quiz → API Response → Calculate Stats → Render Charts
                              ↓
                    {score, total, answers}
                              ↓
                    pieData + barData
```

### Courses Module
```
Load Courses → Group by Department → Calculate Metrics → Render Charts
                                      ↓
                    {courses, credits, departments}
                                      ↓
                    Statistics + pieData + barData
```

### Projects Module
```
Load Projects → Filter by Status → Count Each → Render Charts
                                    ↓
              {approved, pending, rejected}
                                    ↓
                  Statistics + pieData
```

---

## Performance Considerations

- **Lazy Loading**: Charts only render when data is available
- **Conditional Rendering**: Empty states don't show charts
- **Memoization**: Could be added for large datasets (not implemented)
- **Bundle Size**: Recharts adds ~200KB to bundle (acceptable for features gained)

---

This text-based visualization gives an idea of the layout and functionality. The actual implementation uses the recharts library for smooth, interactive, and professional-looking charts.
