import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './Login';

// Test user login
test('Assuming user credentials correct, allows the user to login', async () => {

    // Mock the global fetch function for a successful response
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,  // Simulate that the response is successful (status code 200-299)
            json: () =>
                Promise.resolve({
                    success: true,
                    data: { token: 'mock_token' },
                }),
        })
    );

    // Render the Login component
    render(<Login setLoggedIn={jest.fn()} setToken={jest.fn()} />);

    // Mock the alert function
    global.alert = jest.fn();

    // Find the input fields and button
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: "Login" });

    // Simulate user input
    fireEvent.change(usernameInput, { target: { value: 'jingen' } });
    fireEvent.change(passwordInput, { target: { value: 'zerox455' } });

    // Simulate form submission
    fireEvent.click(loginButton);

    expect(loginButton).toBeInTheDocument();

    // expect(global.alert).toHaveBeenCalledWith("User Logged in!")
    await waitFor(() => expect(global.alert).toHaveBeenCalledWith("User Logged in!"));


    // Assert the mock function was called with the correct arguments
    // expect(mockOnLogin).toHaveBeenCalledWith('testuser', 'password123');
    // expect(mockOnLogin).toHaveBeenCalledTimes(1);
});

