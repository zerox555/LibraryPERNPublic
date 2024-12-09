import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './Login';


// Test login page is correctly rendered
test("Login page all elements load correctly", () => {
    render(
        <Login></Login>
    )
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: "Login" });

    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();

})

// Test Server not available
test('Server not accessable', async () => {

    global.fetch = jest.fn(() =>
        Promise.reject()
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
    fireEvent.change(usernameInput, { target: { value: 'jingen1' } });
    fireEvent.change(passwordInput, { target: { value: 'zerox555' } });

    // Simulate form submission
    fireEvent.click(loginButton);

    await waitFor(() => expect(global.alert).toHaveBeenCalledWith("Error logging user in"));
});

// Test user login assuming correct credentials
test('Allows user login if correct credentials', async () => {

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
    fireEvent.change(usernameInput, { target: { value: 'jingen1' } });
    fireEvent.change(passwordInput, { target: { value: 'zerox555' } });

    // Simulate form submission
    fireEvent.click(loginButton);

    expect(loginButton).toBeInTheDocument();

    await waitFor(() => expect(global.alert).toHaveBeenCalledWith("User Logged in!"));
});

// Test user login assuming wrong credentials 
test('Reject user login if incorrect credentials', async () => {

    // Mock the global fetch function for a successful response
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,  // Simulate that the response is successful (status code 200-299)
            json: () =>
                Promise.resolve({
                    success: false,
                    data: {},
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
    fireEvent.change(usernameInput, { target: { value: 'jingen1' } });
    fireEvent.change(passwordInput, { target: { value: 'zerox555' } });

    // Simulate form submission
    fireEvent.click(loginButton);

    expect(loginButton).toBeInTheDocument();

    await waitFor(() => expect(global.alert).toHaveBeenCalledWith("Failed to login user"));
});

// Test user submits form with empty details
test('Prevent user submit form with empty details', async () => {



    // Render the Login component
    render(<Login setLoggedIn={jest.fn()} setToken={jest.fn()} />);

    // Mock the alert function
    global.alert = jest.fn();

    // Get the username and password fields and submit button
    const usernameField = screen.getByLabelText(/username/i);
    const passwordField = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: "Login" });

    // Simulate form submission
    fireEvent.click(loginButton);

    expect(usernameField).toBeInvalid();
    expect(passwordField).toBeInvalid();

});

// Test user login assuming correct credentials
test('Shows error logging user in when role retrieval fails', async () => {

    // Mock the global fetch function for a successful response
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,  // Simulate that the response is successful (status code 200-299)
            json: () =>
                Promise.resolve({
                    success: true,
                    data: { token: '', errorMsg:"Error loading roles: Please contact an admin!" },
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
    fireEvent.change(usernameInput, { target: { value: 'jingen1' } });
    fireEvent.change(passwordInput, { target: { value: 'zerox555' } });

    // Simulate form submission
    fireEvent.click(loginButton);

    expect(loginButton).toBeInTheDocument();

    await waitFor(() => expect(global.alert).toHaveBeenCalledWith("Error loading roles: Please contact an admin!"));
});