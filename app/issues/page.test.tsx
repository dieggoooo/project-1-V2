import '@testing-library/jest-dom';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import IssuesPage from './page';

// Mock Next.js navigation used by BottomNav
jest.mock('next/navigation', () => ({
  usePathname: () => '/issues',
}));

// Mock Header (depends on AuthContext)
jest.mock('../../components/Header', () => ({
  __esModule: true,
  default: () => <div data-testid="header" />,
}));

// Mock BottomNav (depends on next/navigation)
jest.mock('../../components/BottomNav', () => ({
  __esModule: true,
  default: () => <div data-testid="bottom-nav" />,
}));

describe('IssuesPage', () => {
  describe('initial render', () => {
    it('renders the Report Issue tab as active by default', () => {
      render(<IssuesPage />);
      expect(screen.getByText('Report New Issue')).toBeInTheDocument();
    });

    it('renders both tab buttons', () => {
      render(<IssuesPage />);
      expect(screen.getByRole('button', { name: 'Report Issue' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Issue History' })).toBeInTheDocument();
    });

    it('renders the report form fields', () => {
      render(<IssuesPage />);
      expect(screen.getByLabelText('Issue Type')).toBeInTheDocument();
      expect(screen.getByLabelText('Flight Number')).toBeInTheDocument();
      expect(screen.getByLabelText('Item Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Location/Position Code')).toBeInTheDocument();
      expect(screen.getByLabelText('Severity Level')).toBeInTheDocument();
      expect(screen.getByLabelText('Passengers Affected')).toBeInTheDocument();
      expect(screen.getByLabelText('Description')).toBeInTheDocument();
    });

    it('renders the submit button', () => {
      render(<IssuesPage />);
      expect(screen.getByRole('button', { name: 'Submit Issue Report' })).toBeInTheDocument();
    });
  });

  describe('tab switching', () => {
    it('switches to Issue History tab when clicked', () => {
      render(<IssuesPage />);
      fireEvent.click(screen.getByRole('button', { name: 'Issue History' }));
      expect(screen.getByText('Issue History')).toBeInTheDocument();
      expect(screen.queryByText('Report New Issue')).not.toBeInTheDocument();
    });

    it('shows pre-loaded issues in the history tab', () => {
      render(<IssuesPage />);
      fireEvent.click(screen.getByRole('button', { name: 'Issue History' }));
      expect(screen.getByText('Coffee Pot')).toBeInTheDocument();
      expect(screen.getByText('Wine Glasses')).toBeInTheDocument();
      expect(screen.getByText('Ice Bucket')).toBeInTheDocument();
    });

    it('switches back to Report Issue tab when clicked', () => {
      render(<IssuesPage />);
      fireEvent.click(screen.getByRole('button', { name: 'Issue History' }));
      fireEvent.click(screen.getByRole('button', { name: 'Report Issue' }));
      expect(screen.getByText('Report New Issue')).toBeInTheDocument();
    });
  });

  describe('report form', () => {
    it('shows character count for description field', () => {
      render(<IssuesPage />);
      expect(screen.getByText('0/500')).toBeInTheDocument();
    });

    it('updates character count as user types in description', async () => {
      render(<IssuesPage />);
      const textarea = screen.getByLabelText('Description');
      await userEvent.type(textarea, 'hello');
      expect(screen.getByText('5/500')).toBeInTheDocument();
    });

    it('submits form and adds new issue to history', async () => {
      render(<IssuesPage />);

      await userEvent.selectOptions(screen.getByLabelText('Issue Type'), 'damage');
      await userEvent.type(screen.getByLabelText('Flight Number'), 'UA9999');
      await userEvent.type(screen.getByLabelText('Item Name'), 'Test Tray');
      await userEvent.type(screen.getByLabelText('Location/Position Code'), '1A1C01');
      await userEvent.selectOptions(screen.getByLabelText('Severity Level'), 'high');
      await userEvent.type(screen.getByLabelText('Description'), 'Tray is cracked');

      fireEvent.click(screen.getByRole('button', { name: 'Submit Issue Report' }));

      // Should switch to history tab and show the new issue
      expect(screen.getByText('Test Tray')).toBeInTheDocument();
      expect(screen.getByText('1A1C01 • UA9999')).toBeInTheDocument();
    });

    it('resets form fields after submission', async () => {
      render(<IssuesPage />);

      await userEvent.type(screen.getByLabelText('Flight Number'), 'UA9999');
      await userEvent.type(screen.getByLabelText('Item Name'), 'Test Tray');
      await userEvent.type(screen.getByLabelText('Location/Position Code'), '1A1C01');
      await userEvent.type(screen.getByLabelText('Description'), 'Tray is cracked');

      fireEvent.click(screen.getByRole('button', { name: 'Submit Issue Report' }));

      // Switch back to the report tab and check the form is cleared
      fireEvent.click(screen.getByRole('button', { name: 'Report Issue' }));

      expect(screen.getByLabelText('Flight Number')).toHaveValue('');
      expect(screen.getByLabelText('Item Name')).toHaveValue('');
      expect(screen.getByLabelText('Location/Position Code')).toHaveValue('');
      expect(screen.getByLabelText('Description')).toHaveValue('');
    });
  });

  describe('issue history', () => {
    it('displays issue details including severity and status badges', () => {
      render(<IssuesPage />);
      fireEvent.click(screen.getByRole('button', { name: 'Issue History' }));

      // Coffee Pot issue should be medium severity / open
      const coffeePotCard = screen.getByText('Coffee Pot').closest('.card-interactive') as HTMLElement;
      expect(within(coffeePotCard).getByText('MEDIUM')).toBeInTheDocument();
      expect(within(coffeePotCard).getByText('OPEN')).toBeInTheDocument();
    });

    it('displays reporter and timestamp for each issue', () => {
      render(<IssuesPage />);
      fireEvent.click(screen.getByRole('button', { name: 'Issue History' }));
      expect(screen.getByText('Reported by Sarah Johnson')).toBeInTheDocument();
      expect(screen.getByText('Reported by Mike Chen')).toBeInTheDocument();
    });

    it('displays issue type label for each issue', () => {
      render(<IssuesPage />);
      fireEvent.click(screen.getByRole('button', { name: 'Issue History' }));
      expect(screen.getByText('Item Misplacement')).toBeInTheDocument();
      expect(screen.getByText('Damage/Broken')).toBeInTheDocument();
      expect(screen.getByText('Customer Impact')).toBeInTheDocument();
    });
  });
});
