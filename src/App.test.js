test.skip("This test will not run", () => {
  expect(true).toBe(false);
});
// import { render, screen, fireEvent} from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
// import App from './App';

// // Test for text section

// test('renders nav bar on load before login correctly', () => {
//   render(<App />);
//   const linkElement = screen.getByText("Welcome to the library of Aeons");
//   const homeElement = screen.getByText("Home");
//   const libraryElement = screen.getByText("Library");
//   const registerElement = screen.getByText("Register");
//   const loginStatusElement = screen.getByText("Logged in: No");
//   const tokenElement = screen.getByText("Token:");


//   expect(linkElement).toBeInTheDocument();
//   expect(homeElement).toBeInTheDocument();
//   expect(libraryElement).toBeInTheDocument();
//   expect(registerElement).toBeInTheDocument();
//   expect(loginStatusElement).toBeInTheDocument();
//   expect(tokenElement).toBeInTheDocument();

// });

// // Routing test section 

// test('Navigate to Library page when clicked', async () => {
//   // Render the component with MemoryRouter
//   render(
//     <App />
//   );

//   // Go to library page
//   const libraryElement = screen.getByText("Library");
//   await userEvent.click(libraryElement);
//   expect(screen.getByText("You need to be logged in first!")).toBeInTheDocument;

// });

// test('Navigate to login page when clicked without logging in', async () => {
//   // Render the component with MemoryRouter
//   render(
//     <App />
//   );

//   // Go to library page
//   const loginElement = screen.getByText("Login");
//   await userEvent.click(loginElement);
//   expect(screen.getByText("Username:")).toBeInTheDocument;
//   expect(screen.getByRole('button',{name:"Login"})).toBeInTheDocument;
// });

// test('Navigate to register page when clicked without logging in', async () => {
//   // Render the component with MemoryRouter
//   render(
//     <App />
//   );

//   // Go to register page
//   const registerElement = screen.getByText("Register");
//   await userEvent.click(registerElement);
//   expect(screen.getByText("Username:")).toBeInTheDocument;
//   expect(screen.getByRole('button',{name:"Register"})).toBeInTheDocument;
// });

