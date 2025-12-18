// src/Form.test.tsx

import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Form  from './form';


// --- Setup ---
// Mock the window.alert function because it's a browser function
// that would stop the test execution if not mocked.
beforeEach(() => {
  vi.spyOn(window, "alert").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks(); // restores alert and resets call counts
});

// --- Test Suite ---
describe('Portfolio Contact Form', () => {
    const user = userEvent.setup();


    // Test 1: Validation and Visual Feedback
    it('should display validation errors and red borders on invalid submission', async () => {
        render(<Form />);
        const submitButton = screen.getByRole('button', { name: /submit/i });
        const firstNameInput = screen.getByLabelText(/First Name \*/i);

        // 1. Submit the empty form
        await user.click(submitButton);

        // 2. Assert validation errors are visible
        expect(screen.getByText('First name must be at least 2 characters.')).toBeInTheDocument();
        expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();

        // 3. Assert visual feedback (red border)
        expect(firstNameInput).toHaveClass('border-red-500');

        // 4. Assert button is NOT stuck in "Sending"
        expect(submitButton).toHaveTextContent('Submit');
    });

    // Test 2: Conditional Rendering Logic (watch hook functionality)
    it('should conditionally show the website field when the company field is populated', async () => {
        render(<Form />);
        const companyInput = screen.getByLabelText(/Company/i);

        // Initial State Check: The Website field should NOT exist
        expect(screen.queryByLabelText(/Website/i)).not.toBeInTheDocument();

        // Type a value into the Company field
        await user.type(companyInput, 'Tech Client Co.');

        // Assert the Website field IS visible now
        const websiteInput = screen.getByLabelText(/Website/i);
        expect(websiteInput).toBeInTheDocument();

        // Assert conditional validation is applied (check the Zod URL rule)
        const submitButton = screen.getByRole('button', { name: /submit/i });
        await user.click(submitButton); // Submit the form to trigger validation

        // If company is present, website is expected to be a valid URL if filled.
        // However, since we didn't fill the *required* fields, we can't fully test the URL error here.
        // Let's just confirm the field exists and its validation is active.

        // Fill the required fields to isolate the conditional field's validation
        await user.type(screen.getByLabelText(/First Name \*/i), 'John');
        await user.type(screen.getByLabelText(/Last Name \*/i), 'Doe');
        await user.type(screen.getByLabelText(/Email \*/i), 'test@example.com');
        await user.type(screen.getByLabelText(/Message \*/i), 'This is a test message with 10 chars.');

        // Now submit (Website is currently empty but it's optional, so no error yet)
        await user.click(submitButton);

        // Type an invalid website URL
        await user.type(websiteInput, 'not-a-url');
        await user.click(submitButton);

        // Assert the Zod URL validation error appears
        expect(await screen.findByText('Invalid URL')).toBeInTheDocument();
    });

    // Test 3: Asynchronous Submission and Loading State
    it('should show "Sending..." state during submission and call alert on success', async () => {
        render(<Form />);
        const submitButton = screen.getByRole('button', { name: /submit/i });

        // 1. Fill out ALL required fields with valid data
        await user.type(screen.getByLabelText(/First Name \*/i), 'Jane');
        await user.type(screen.getByLabelText(/Last Name \*/i), 'Smith');
        await user.type(screen.getByLabelText(/Email \*/i), 'jane@example.com');
        await user.type(screen.getByLabelText(/Message \*/i), 'This message has more than ten characters.');

        // 2. Submit the form
        await user.click(submitButton);

        // 3. Assert loading state (before the promise resolves)
        expect(submitButton).toHaveTextContent('Sending...');
        expect(submitButton).toBeDisabled();

        // 4. Wait for the asynchronous action (setTimeout) to complete
        await waitFor(() => {
            // Assert button reverts to original state
            expect(submitButton).toHaveTextContent('Submit');
        }, { timeout: 2000 }); // Give it more time than the 1500ms timeout

        // 5. Assert the onSubmit handler was completed and called the alert
        // after submitting:
        expect(vi.mocked(window.alert)).toHaveBeenCalledTimes(1);

        const alertArg = vi.mocked(window.alert).mock.calls[0]?.[0];
        expect(typeof alertArg).toBe("string");

        // Assert important fields exist (and don't care about optional empty strings)
        expect(alertArg).toContain('"firstName": "Jane"');
        expect(alertArg).toContain('"lastName": "Smith"');
        expect(alertArg).toContain('"email": "jane@example.com"');
        expect(alertArg).toContain('"message": "This message has more than ten characters."');

        // Because empty company is normalized to undefined, JSON.stringify omits it:
        expect(alertArg).not.toContain('"company"');
    });
});