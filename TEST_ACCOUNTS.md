# 🧪 Test Accounts for Arise HRM

This document provides information about the test accounts available for testing different user roles in the Arise HRM system.

## 🚀 NEW: Super Admin User Creation Tool

**Enhanced User Management**: The system now includes a powerful Super Admin User Creation tool for rapidly generating test users!

### Quick Setup Options:
1. **Minimal Setup**: 1 Super Admin + 2 HR Managers (3 users)
2. **Standard Setup**: Complete hierarchy with employees (28 users) 
3. **Comprehensive Setup**: All templates including test scenarios (46 users)

### Access Methods:
1. **Web Interface**: Navigate to `/admin/users` in the application
2. **Command Line**: Run `npm run create-super-admin-users`

### Features:
- 📈 **Bulk User Creation**: Create dozens of users in seconds
- 🔐 **Secure Password Generation**: 12-character secure passwords
- 📥 **Credential Export**: Export user credentials to CSV
- 🎯 **Role-based Templates**: Predefined templates for different roles
- 📄 **Batch Management**: Track and manage user creation batches

## Prerequisites

1. Node.js and npm installed
2. Supabase project set up with the required tables
3. Environment variables configured in `.env` file:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

## Setting Up Test Users

1. Install dependencies:
   ```bash
   npm install @supabase/supabase-js dotenv
   ```

2. Initialize the database:
   ```bash
   npx tsx scripts/init-test-users.ts
   ```

3. Create comprehensive test users (RECOMMENDED):
   ```bash
   npm run create-super-admin-users
   ```

4. (Optional) Generate test leave data:
   ```bash
   npx tsx scripts/init-test-leave-data.ts
   ```

## Available Test Accounts

### Default System Accounts

| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| Super Admin | superadmin@arisehrm.test | Test@1234 | Full system access |
| HR Manager | hr.manager@arisehrm.test | Hr@1234 | Employee management, leave approval |
| Department Head | dept.manager@arisehrm.test | Dept@1234 | Team management, leave approval |
| Team Lead | team.lead@arisehrm.test | Lead@1234 | Team view, leave approval |
| Employee | employee@arisehrm.test | Emp@1234 | Leave requests, attendance |
| Contractor | contractor@arisehrm.test | Contract@123 | Timesheet submission |
| Intern | intern@arisehrm.test | Intern@123 | Limited access |

### Generated Test User Patterns

**Note**: The Super Admin User Creation tool generates additional users with these patterns:

| Role | Email Pattern | Count | Department | Position |
|------|---------------|-------|------------|----------|
| Super Admin | `superadmin{n}@arisehrm.com` | 1 | IT | System Administrator |
| HR Manager | `hrmanager{n}@arisehrm.com` | 2 | Human Resources | HR Manager |
| Manager | `manager{n}@arisehrm.com` | 3-5 | Multiple | Department Manager |
| Team Lead | `teamlead{n}@arisehrm.com` | 5-8 | Multiple | Team Lead |
| Employee | `employee{n}@arisehrm.com` | 10-20 | Multiple | Various Positions |
| Test User | `testuser{n}@arisehrm.com` | 10 | QA | Test Engineer |

**Password Security**: All generated users have secure, randomly generated 12-character passwords displayed during creation.

## Test Data

The test data script creates:
- Sample departments and positions
- Leave types (Annual, Sick, Personal)
- Leave balances for all users
- Sample leave requests with different statuses

## Testing Different Scenarios

### 1. Leave Management
- **Employee**: Submit leave requests, view balance
- **Team Lead**: Approve/reject team member requests
- **HR Manager**: Manage all leave requests, generate reports

### 2. Attendance
- **Employee**: Clock in/out, view attendance history
- **Manager**: View team attendance, approve timesheets

### 3. Employee Management
- **HR Manager**: Add/edit employee records
- **Department Head**: View team members, performance

## Resetting Test Data

To reset the test data, you can either:
1. Manually delete test users through the Supabase dashboard
2. Or truncate the relevant tables and re-run the setup scripts

## Security Note

- These are test accounts with simple passwords
- Do not use these credentials in production
- Change passwords if used in a publicly accessible environment
