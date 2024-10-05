"use client";
import { useState } from "react";
import { Input, Button, Card, Spacer } from "@nextui-org/react";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { EyeIcon, EyeOff } from "lucide-react";
const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    const token = Cookies.get("token");
    console.log(token);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/login", formData);

      if (response.status === 200) {
        console.log(response);

        alert(response.data.message);
        // Redirect or handle successful login here
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          alert(error.response.data.error);
        }
      } else {
        alert("Something went wrong. Please try again."); // Generic error message
      }
    }
  };

  return (
    <Card style={{ margin: "auto", maxWidth: "400px", padding: "20px" }}>
      <h2 className="text-default-900">Login</h2>
      <form onSubmit={handleSubmit}>
        <Spacer y={1} />
        <Input
          label="Username"
          placeholder="Enter your username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          fullWidth
        />
        <Spacer y={1} />
        <Input
          label="Password"
          placeholder="Enter your password"
          name="password"
          type={isVisible ? "text" : "password"}
          value={formData.password}
          onChange={handleChange}
          required
          fullWidth
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
              aria-label="toggle password visibility"
            >
              {isVisible ? (
                <EyeOff className="text-2xl pointer-events-none text-default-400" />
              ) : (
                <EyeIcon className="text-2xl pointer-events-none text-default-400" />
              )}
            </button>
          }
        />
        <Spacer y={1.5} />
        <Button type="submit" color="primary" fullWidth>
          Login
        </Button>
      </form>
    </Card>
  );
};

export default LoginPage;
