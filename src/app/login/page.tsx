"use client";
import { useState } from "react";
import { Input, Button, Card, Spacer } from "@nextui-org/react";
import axios from "axios";
import Cookies from 'js-cookie';
import { EyeIcon,EyeOff } from "lucide-react";
const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // New state for error message

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    const token = Cookies.get('token');
    console.log(token);
    
    
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null); // Clear previous errors

    try {
      const response = await axios.post("/api/login", formData);

      if (response.status === 200) {
        console.log(response);
        
        alert(response.data.message);
        // Redirect or handle successful login here
      }
    } catch (error: any) {

      if (error.response && error.response.data && error.response.data.error) {
        alert(error.response.data.error);
      } else {
        setErrorMessage("Something went wrong. Please try again."); // Generic error message
      }
    }
  };

  return (
    <Card style={{ margin: "auto", maxWidth: "400px", padding: "20px" }}>
      <h2>Login</h2>
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
            <button className="focus:outline-none" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
              {isVisible ? (
                <EyeOff className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeIcon className="text-2xl text-default-400 pointer-events-none" />
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
