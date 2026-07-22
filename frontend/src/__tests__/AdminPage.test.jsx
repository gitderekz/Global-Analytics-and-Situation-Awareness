import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminPage from '../pages/AdminPage';
import { useAuthStore } from '../store/authStore';

vi.mock('../store/authStore', () => ({
  useAuthStore: vi.fn(),
}));

describe('AdminPage seed button', () => {
  beforeEach(() => {
    useAuthStore.mockReturnValue({ user: { Role: { name: 'Admin' } } });
    vi.stubGlobal('confirm', vi.fn(() => true));
    vi.stubGlobal('alert', vi.fn());
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ success: true }),
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders seed button and calls admin demo seed API when clicked', async () => {
    render(<AdminPage />);
    const seedButton = await screen.findByRole('button', { name: /Seed Demo Data/i });
    expect(seedButton).toBeInTheDocument();

    fireEvent.click(seedButton);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/demo/seed'),
      expect.objectContaining({ method: 'POST' })
    );
  });
});
