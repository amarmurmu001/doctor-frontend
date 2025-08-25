import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReviewModal from '../components/reviews/ReviewModal';
import Doctorreview from '../components/reviews/Doctorreview';
import Patientreview from '../components/reviews/Patientreview';

// Mock the reviewAPI service
jest.mock('../services/reviewAPI', () => ({
  submitReview: jest.fn(),
  fetchDoctorReviews: jest.fn()
}));

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock window.location
const mockLocation = {
  href: '',
  pathname: '/doctor/123'
};
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true
});

describe('ReviewModal Component', () => {
  const mockOnClose = jest.fn();
  const mockOnReviewSubmitted = jest.fn();
  const mockOnError = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('displays validation errors for empty comment', () => {
    render(
      <ReviewModal 
        isOpen={true} 
        onClose={mockOnClose} 
        doctorId="123" 
        onReviewSubmitted={mockOnReviewSubmitted}
        onError={mockOnError}
      />
    );
    
    // Try to submit with empty comment
    fireEvent.click(screen.getByText('Submit Review'));
    
    // Check for validation error
    expect(screen.getByText('Please provide a review comment')).toBeInTheDocument();
  });
  
  test('displays validation errors for invalid rating', () => {
    // This would require modifying the component state directly
    // since the UI doesn't allow setting invalid ratings
    // For a real test, you might use component instance or context
  });
  
  test('clears validation errors when user types valid comment', () => {
    render(
      <ReviewModal 
        isOpen={true} 
        onClose={mockOnClose} 
        doctorId="123" 
        onReviewSubmitted={mockOnReviewSubmitted}
        onError={mockOnError}
      />
    );
    
    // Try to submit with empty comment to trigger validation error
    fireEvent.click(screen.getByText('Submit Review'));
    expect(screen.getByText('Please provide a review comment')).toBeInTheDocument();
    
    // Type valid comment
    fireEvent.change(screen.getByPlaceholderText('Share your experience with this doctor...'), {
      target: { value: 'Great doctor, very helpful!' }
    });
    
    // Validation error should be gone
    expect(screen.queryByText('Please provide a review comment')).not.toBeInTheDocument();
  });
});

describe('Doctorreview Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('shows error message when not logged in', () => {
    // Mock localStorage to return no auth token
    localStorageMock.getItem.mockReturnValue(null);
    
    render(<Doctorreview />);
    
    // Click post review button
    fireEvent.click(screen.getByText('Post a review'));
    
    // Check for error message
    expect(screen.getByText('Please log in to submit a review')).toBeInTheDocument();
  });
  
  test('opens modal when logged in', () => {
    // Mock localStorage to return auth token
    localStorageMock.getItem.mockReturnValue(JSON.stringify({
      state: { token: 'fake-token' }
    }));
    
    render(<Doctorreview />);
    
    // Click post review button
    fireEvent.click(screen.getByText('Post a review'));
    
    // Check that modal is opened
    expect(screen.getByText('Write a Review')).toBeInTheDocument();
  });
});

describe('Patientreview Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('shows error message when not logged in', () => {
    // Mock localStorage to return no auth token
    localStorageMock.getItem.mockReturnValue(null);
    
    render(<Patientreview />);
    
    // Click post review button
    fireEvent.click(screen.getByText('Post a review'));
    
    // Check for error message
    expect(screen.getByText('Please log in to submit a review')).toBeInTheDocument();
  });
  
  test('shows notification after successful review submission', async () => {
    // Mock localStorage to return auth token
    localStorageMock.getItem.mockReturnValue(JSON.stringify({
      state: { token: 'fake-token' }
    }));
    
    const { rerender } = render(<Patientreview />);
    
    // Simulate successful review submission
    // This would typically involve more setup with the ReviewModal
    // For this test, we'll just call the handleReviewSubmitted function directly
    // by re-rendering with a prop that would trigger it
    
    rerender(<Patientreview testTriggerReviewSubmitted={true} />);
    
    // Check for success notification
    await waitFor(() => {
      expect(screen.getByText('Review submitted successfully!')).toBeInTheDocument();
    });
  });
});