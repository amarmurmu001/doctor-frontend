import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import UserEdit from '../pages/UserEdit';
import { updateUserProfile } from '../services/authAPI';
import useAuthStore from '../stores/authStore';

// Mock the API service
jest.mock('../services/authAPI', () => ({
  updateUserProfile: jest.fn(),
}));

// Mock the auth store
jest.mock('../stores/authStore', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock the navigate function
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('UserEdit Component', () => {
  const mockUser = {
    id: '123',
    name: 'Test User',
    email: 'test@example.com',
    phone: '1234567890',
    role: 'patient',
  };

  const mockToken = 'test-token';
  const mockSetAuth = jest.fn();

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup auth store mock
    useAuthStore.mockImplementation((selector) => {
      if (selector === expect.any(Function)) {
        const state = {
          user: mockUser,
          token: mockToken,
          setAuth: mockSetAuth,
        };
        return selector(state);
      }
      return undefined;
    });

    // Setup API mock
    updateUserProfile.mockResolvedValue({
      id: '123',
      name: 'Updated User',
      email: 'updated@example.com',
      phone: '0987654321',
    });
  });

  test('renders the form with user data', () => {
    render(
      <BrowserRouter>
        <UserEdit />
      </BrowserRouter>
    );

    // Check if form fields are populated with user data
    expect(screen.getByLabelText(/Full Name/i).value).toBe(mockUser.name);
    expect(screen.getByLabelText(/Email/i).value).toBe(mockUser.email);
    expect(screen.getByLabelText(/Phone Number/i).value).toBe(mockUser.phone);
  });

  test('updates user profile on form submission', async () => {
    render(
      <BrowserRouter>
        <UserEdit />
      </BrowserRouter>
    );

    // Update form fields
    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: 'Updated User' },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'updated@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), {
      target: { value: '0987654321' },
    });

    // Submit the form
    fireEvent.click(screen.getByText(/Save Changes/i));

    // Check if API was called with correct data
    await waitFor(() => {
      expect(updateUserProfile).toHaveBeenCalledWith(
        {
          name: 'Updated User',
          email: 'updated@example.com',
          phone: '0987654321',
        },
        mockToken
      );
    });

    // Check if auth store was updated
    await waitFor(() => {
      expect(mockSetAuth).toHaveBeenCalledWith({
        user: {
          ...mockUser,
          name: 'Updated User',
          email: 'updated@example.com',
          phone: '0987654321',
        },
        token: mockToken,
      });
    });

    // Check if navigation occurred
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/user-profile');
    });
  });

  test('displays error message on API failure', async () => {
    // Setup API to fail
    updateUserProfile.mockRejectedValue(new Error('Update failed'));

    render(
      <BrowserRouter>
        <UserEdit />
      </BrowserRouter>
    );

    // Submit the form
    fireEvent.click(screen.getByText(/Save Changes/i));

    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/Update failed/i)).toBeInTheDocument();
    });

    // Check that navigation did not occur
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('redirects to login if user is not authenticated', () => {
    // Setup auth store to return no user
    useAuthStore.mockImplementation((selector) => {
      if (selector === expect.any(Function)) {
        const state = {
          user: null,
          token: null,
        };
        return selector(state);
      }
      return undefined;
    });

    render(
      <BrowserRouter>
        <UserEdit />
      </BrowserRouter>
    );

    // Check if navigation to login occurred
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});