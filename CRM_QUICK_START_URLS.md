# CRM System - Quick Start URLs

## 🔗 All CRM URLs

### Main CRM Pages
| Page | URL | Description |
|------|-----|-------------|
| CRM Hub | `/merchant/crm` | Main CRM landing page |
| CRM Dashboard | `/merchant/crm-dashboard` | Overview dashboard |
| CRM Marketplace | `/merchant/crm-marketplace` | View CRM tier information |
| CRM Integration | `/merchant/crm-integration` | Integration settings |

### Contact Management
| Page | URL | Description |
|------|-----|-------------|
| Contacts List | `/merchant/crm/contacts` | View all contacts |
| New Contact | `/merchant/crm/contacts/new` | Add new contact |
| Contact Detail | `/merchant/crm/contacts/:id` | View/edit contact (replace :id with actual ID) |

### Sales & Pipeline
| Page | URL | Description |
|------|-----|-------------|
| Pipeline | `/merchant/crm/pipeline` | Kanban board for deals |

### Task Management
| Page | URL | Description |
|------|-----|-------------|
| Tasks | `/merchant/crm/tasks` | View and manage tasks |

### Analytics
| Page | URL | Description |
|------|-----|-------------|
| Reports | `/merchant/crm/reports` | Analytics and reporting |

---

## 🚀 Quick Test URLs (After Login as Merchant)

1. **View Contacts**: `https://yoursite.com/merchant/crm/contacts`
2. **Create Contact**: `https://yoursite.com/merchant/crm/contacts/new`
3. **View Pipeline**: `https://yoursite.com/merchant/crm/pipeline`
4. **View Tasks**: `https://yoursite.com/merchant/crm/tasks`
5. **View Reports**: `https://yoursite.com/merchant/crm/reports`

---

## 🔧 Edge Function Endpoints

### Base URL
```
https://[PROJECT_ID].supabase.co/functions/v1/
```

### Available Functions

| Function | Endpoint | Method | Auth Required |
|----------|----------|--------|---------------|
| Create Contact | `/crm-create-contact` | POST | Yes (JWT) |
| Update Contact | `/crm-update-contact` | POST | Yes (JWT) |
| Log Activity | `/crm-log-activity` | POST | Yes (JWT) |
| Manage Task | `/crm-manage-task` | POST | Yes (JWT) |

---

## 📋 Testing Checklist

### Contacts
- [ ] Visit `/merchant/crm/contacts`
- [ ] Search for a contact
- [ ] Filter by status
- [ ] Filter by priority
- [ ] Click "Add Contact"
- [ ] Fill form and save
- [ ] Click on a contact
- [ ] Edit contact details
- [ ] Log an activity
- [ ] Create a task

### Pipeline
- [ ] Visit `/merchant/crm/pipeline`
- [ ] View all deal stages
- [ ] Drag a deal to new stage
- [ ] Click on a deal card
- [ ] View pipeline statistics

### Tasks
- [ ] Visit `/merchant/crm/tasks`
- [ ] Create new task
- [ ] Mark task complete
- [ ] Filter by status
- [ ] Filter by priority

### Reports
- [ ] Visit `/merchant/crm/reports`
- [ ] View key metrics
- [ ] Check lead source breakdown
- [ ] Review status distribution
- [ ] Check priority distribution

---

## 💡 Pro Tips

1. **Start with Pipeline**: The visual kanban board at `/merchant/crm/pipeline` gives the best overview
2. **Use Search**: On contacts page, search works across name, email, and company
3. **Priority Colors**: Red = Hot, Yellow = Warm, Blue = Cold
4. **Drag & Drop**: Simply drag deal cards between columns to update status
5. **Activity Log**: Log every customer interaction for complete history
6. **Task Reminders**: Set due dates for automatic overdue indicators

---

## 🎯 User Flows

### Flow 1: Add New Lead
1. Go to `/merchant/crm/contacts`
2. Click "Add Contact"
3. Fill in details
4. Save
5. View in contacts list
6. Access from pipeline view

### Flow 2: Move Deal Through Pipeline
1. Go to `/merchant/crm/pipeline`
2. Find deal in current stage
3. Drag to next stage
4. Drop to update status
5. Click to view details

### Flow 3: Complete Follow-up Task
1. Go to `/merchant/crm/tasks`
2. Find task in list
3. Check box to mark complete
4. View updated in contact timeline

### Flow 4: Review Performance
1. Go to `/merchant/crm/reports`
2. Check conversion rate
3. Review lead sources
4. Analyze pipeline value
5. Make data-driven decisions

---

## 📱 Mobile Access

All CRM pages are responsive and work on mobile devices. The interface adapts to smaller screens with:
- Stacked layouts instead of side-by-side
- Touch-friendly buttons and inputs
- Horizontal scrolling for pipeline
- Collapsible sections for details

---

## 🔐 Access Requirements

**Required**:
- User must be logged in
- User role must be `merchant`
- User must have active merchant account

**Permissions**:
- Merchants only see their own data
- Row Level Security enforces data isolation
- All queries are merchant-scoped

---

## 🆘 Troubleshooting

### Can't see contacts
- Ensure you're logged in as merchant
- Check that merchant account is active
- Verify you have merchant_id in database

### Can't create contact
- Check all required fields are filled
- Ensure you have merchant account linked
- Verify database connection

### Pipeline not updating
- Check browser console for errors
- Verify drag-and-drop is working
- Try manual status update in contact detail

### Tasks not showing
- Ensure tasks table has data
- Check merchant_id matches
- Verify RLS policies are active

---

Ready to use! Visit `/merchant/crm/contacts` to get started.
