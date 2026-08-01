import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./app";

describe("login screen", () => {
  test("renders the heading and both fields", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { level: 1, name: /welcome to wib/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  test("reports both fields as invalid when the form is submitted empty", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(screen.getByText("Enter your email address.")).toBeInTheDocument();
    expect(screen.getByText("Enter your password.")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toHaveAttribute(
      "aria-invalid",
      "true"
    );
  });

  test("rejects an address that is not a valid email", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText("Email"), "pablo@wib");
    await user.type(screen.getByLabelText("Password"), "correct-horse");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(
      screen.getByText(/enter a valid email address/i)
    ).toBeInTheDocument();
  });

  test("rejects a password shorter than eight characters", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText("Email"), "pablo@wib.digital");
    await user.type(screen.getByLabelText("Password"), "short");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(
      screen.getByText("Use at least 8 characters. This one has 5.")
    ).toBeInTheDocument();
  });

  test("states that nothing was sent once the input is valid", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText("Email"), "pablo@wib.digital");
    await user.type(screen.getByLabelText("Password"), "correct-horse");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(screen.getByText(/nothing was sent/i)).toBeInTheDocument();
  });

  test("toggles password visibility", async () => {
    const user = userEvent.setup();
    render(<App />);

    const password = screen.getByLabelText("Password");
    expect(password).toHaveAttribute("type", "password");

    await user.click(screen.getByRole("button", { name: /show password/i }));
    expect(password).toHaveAttribute("type", "text");

    await user.click(screen.getByRole("button", { name: /hide password/i }));
    expect(password).toHaveAttribute("type", "password");
  });

  test("says a social provider is not connected when its button is used", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(
      screen.getByRole("button", { name: /continue with github/i })
    );

    expect(
      screen.getByText(/github sign-in is not wired up/i)
    ).toBeInTheDocument();
  });
});
