"use client";
import { useState } from "react";
import {
  Input,
  Button,
  Card,
  Spacer,
  CardHeader,
  Divider,
  CardFooter,
  CardBody,
} from "@nextui-org/react";
import axios, { AxiosError } from "axios";
import { EyeIcon, EyeOff, LogInIcon } from "lucide-react";
export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isVisible, setIsVisible] = useState(false);
  console.log("Triggered");
  
  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/login", formData);
      console.log(response);
      
      if (response.status === 200 || 307) {
        alert("Login successful");
        // Redirect or handle successful login here
        window.location.reload();
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
    <div className="bg-default-50 w-full h-full flex align-middle">
      <Card
        className="max-w-md bg-default-100 w-3/4 flex justify-center"
        style={{ margin: "auto", padding: "20px" }}
      >
        <CardHeader className="text-default-900 flex flex-col items-start">
          <span className="text-3xl">Login</span>{" "}
          <Spacer x={0.5} y={2}></Spacer>
          <small>Login to your account to access this app</small>
        </CardHeader>
        <Divider />
        <form onSubmit={handleSubmit}>
          <CardBody>
            <Input
              label={<span className="text-default-900">Login</span>}
              labelPlacement="outside"
              placeholder="Enter your username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              fullWidth
              variant="bordered"
            />
            <Spacer y={5} />
            <Input
              label={<span className="text-default-900">Password</span>}
              labelPlacement="outside"
              placeholder="Enter your password"
              name="password"
              type={isVisible ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              required
              fullWidth
              variant="bordered"
              endContent={
                <Button
                  className="bg-transparent"
                  isIconOnly
                  onClick={toggleVisibility}
                  aria-label="toggle password visibility"
                >
                  {isVisible ? (
                    <EyeOff className="text-2xl pointer-events-none text-default-900" />
                  ) : (
                    <EyeIcon className="text-2xl pointer-events-none text-default-900" />
                  )}
                </Button>
              }
            />
          </CardBody>

          <CardFooter>
            <Button
              className="w-full"
              type="submit"
              color="primary"
              fullWidth
              endContent={<LogInIcon />}
            >
              Login
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

