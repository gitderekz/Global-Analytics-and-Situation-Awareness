import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SettingsPage from '../pages/SettingsPage';
import api from '../services/api';

vi.mock('../services/api', () => ({
  get: vi.fn(),
  post: vi.fn(),
}));

describe('SettingsPage', () => {
  beforeEach(() => {
    api.get.mockReset();
    api.post.mockReset();
  });

  it('renders the offline MBTiles status and refresh button', async () => {
    api.get.mockResolvedValueOnce({ data: { success: true, data: { enabled: true, hasFile: true, metadata: { format: 'png' } } } });

    render(<SettingsPage />);

    await waitFor(() => expect(api.get).toHaveBeenCalledWith('/tiles/status'));
    expect(await screen.findByText(/MBTiles service:/i)).toBeInTheDocument();
    expect(screen.getByText(/Available/i)).toBeInTheDocument();
    expect(screen.getByText(/Format: png/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Refresh Status/i })).toBeInTheDocument();
  });

  it('allows status refresh when requested', async () => {
    api.get.mockResolvedValueOnce({ data: { success: true, data: { enabled: false, hasFile: false } } });
    api.get.mockResolvedValueOnce({ data: { success: true, data: { enabled: true, hasFile: true, metadata: { format: 'png' } } } });

    render(<SettingsPage />);
    await waitFor(() => expect(api.get).toHaveBeenCalledTimes(1));

    const button = screen.getByRole('button', { name: /Refresh Status/i });
    await userEvent.click(button);
    await waitFor(() => expect(api.get).toHaveBeenCalledTimes(2));
    expect(await screen.findByText(/Available/i)).toBeInTheDocument();
  });
});
