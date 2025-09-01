import { render, screen, fireEvent, waitFor, within } from '@/__tests__/test-utils';
import LeaveManagementPage from '@/app/leave/page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';

// Mock data
const mockLeaveRequests = [
  {
    id: '1',
    requestNumber: 'LR-2025-001',
    employee: {
      id: 'emp1',
      firstName: 'John',
      lastName: 'Doe',
      department: 'Engineering',
    },
    leaveType: {
      id: 'annual',
      name: 'Annual Leave',
      colorCode: '#4f46e5',
    },
    startDate: '2025-03-01',
    endDate: '2025-03-05',
    status: 'pending',
    reason: 'Vacation',
    createdAt: '2025-02-20T10:00:00Z',
  },
];

const mockLeaveBalances = [
  {
    id: '1',
    leaveType: {
      id: 'annual',
      name: 'Annual Leave',
      colorCode: '#4f46e5',
      icon: 'beach_access',
    },
    currentBalance: 10,
    usedBalance: 5,
    pendingBalance: 2,
    availableBalance: 3,
  },
];

const mockLeaveTypes = [
  {
    id: 'annual',
    name: 'Annual Leave',
    description: 'Paid time off work granted by employers to employees',
    maxDaysPerYear: 20,
    colorCode: '#4f46e5',
  },
];

// Mock API calls
vi.mock('@/services/leaveService', () => ({
  fetchLeaveRequests: vi.fn().mockResolvedValue(mockLeaveRequests),
  fetchLeaveBalances: vi.fn().mockResolvedValue(mockLeaveBalances),
  fetchLeaveTypes: vi.fn().mockResolvedValue(mockLeaveTypes),
  createLeaveRequest: vi.fn().mockResolvedValue({ id: 'new-request' }),
}));

describe('Leave Management Integration', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  const renderPage = () => {
    render(
      <QueryClientProvider client={queryClient}>
        <LeaveManagementPage />
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    queryClient.clear();
    vi.clearAllMocks();
  });

  it('loads and displays leave management page', async () => {
    renderPage();
    
    // Check if the main sections are rendered
    expect(screen.getByText(/leave management/i)).toBeInTheDocument();
    expect(screen.getByText(/my leave balance/i)).toBeInTheDocument();
    expect(screen.getByText(/my leave requests/i)).toBeInTheDocument();
    
    // Check if the leave balance cards are loaded
    await waitFor(() => {
      expect(screen.getByText('Annual Leave')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument(); // Total balance
    });
    
    // Check if the leave requests table is loaded
    expect(await screen.findByText('LR-2025-001')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Mar 1 - 5, 2025')).toBeInTheDocument();
  });

  it('allows creating a new leave request', async () => {
    renderPage();
    
    // Click the "New Request" button
    const newRequestButton = await screen.findByRole('button', { name: /new request/i });
    fireEvent.click(newRequestButton);
    
    // Fill out the leave request form
    const leaveTypeInput = screen.getByLabelText(/leave type/i);
    fireEvent.mouseDown(within(leaveTypeInput).getByRole('combobox'));
    fireEvent.click(screen.getByText(/annual leave/i));
    
    const startDateInput = screen.getByLabelText(/start date/i);
    fireEvent.change(startDateInput, { target: { value: '2025-04-01' } });
    
    const endDateInput = screen.getByLabelText(/end date/i);
    fireEvent.change(endDateInput, { target: { value: '2025-04-03' } });
    
    const reasonInput = screen.getByLabelText(/reason/i);
    fireEvent.change(reasonInput, { target: { value: 'Family vacation' } });
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);
    
    // Verify the API was called with the correct data
    await waitFor(() => {
      expect(createLeaveRequest).toHaveBeenCalledWith({
        leaveTypeId: 'annual',
        startDate: '2025-04-01',
        endDate: '2025-04-03',
        reason: 'Family vacation',
        emergencyRequest: false,
      });
    });
    
    // Verify the success message is shown
    expect(await screen.findByText(/leave request submitted successfully/i)).toBeInTheDocument();
  });

  it('allows filtering leave requests by status', async () => {
    renderPage();
    
    // Wait for the page to load
    await screen.findByText('LR-2025-001');
    
    // Open the status filter dropdown
    const statusFilter = screen.getByLabelText(/filter by status/i);
    fireEvent.mouseDown(statusFilter);
    
    // Select 'Approved' filter
    fireEvent.click(screen.getByText(/approved/i));
    
    // Verify the table is updated (in a real app, this would trigger a new API call)
    // For now, we'll just check that the filter UI is updated
    expect(await screen.findByText(/no leave requests found/i)).toBeInTheDocument();
  });

  it('shows leave request details when a row is clicked', async () => {
    renderPage();
    
    // Wait for the page to load
    const requestRow = await screen.findByText('LR-2025-001').closest('tr');
    
    if (requestRow) {
      fireEvent.click(requestRow);
      
      // Verify the details panel is shown
      expect(await screen.findByText(/request details/i)).toBeInTheDocument();
      expect(screen.getByText(/vacation/i)).toBeInTheDocument();
      expect(screen.getByText(/march 1, 2025/i)).toBeInTheDocument();
      expect(screen.getByText(/march 5, 2025/i)).toBeInTheDocument();
    }
  });
});
