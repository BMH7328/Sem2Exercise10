import { Group, Space, Title, Divider, Button } from "@mantine/core";
import { Link } from "react-router-dom";

export default function Header({ title, page = "" }) {
  return (
    <div className="header">
      <Space h="50px" />
      <Title align="center">{title}</Title>
      <Space h="20px" />
      <Group position="center">
        <Button
          component={Link}
          to="/"
          variant={page === "home" ? "filled" : "light"}
        >
          Home
        </Button>
        <Button
          component={Link}
          to="/cart"
          variant={page === "cart" ? "filled" : "light"}
        >
          Cart
        </Button>
        <Button
          component={Link}
          to="/orders"
          variant={page === "orders" ? "filled" : "light"}
        >
          My Orders
        </Button>
        <Button
          component={Link}
          to="/login"
          variant={page === "login" ? "filled" : "light"}
        >
          Login
        </Button>
        <Button
          component={Link}
          to="/signup"
          variant={page === "signup" ? "filled" : "light"}
        >
          Sign Up
        </Button>
      </Group>
      <Space h="20px" />
      <Divider />
    </div>
  );
}
