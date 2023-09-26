import {
  Container,
  Space,
  TextInput,
  Card,
  Button,
  Group,
  PasswordInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link } from "react-router-dom";
import Header from "../Header";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [visible, { toggle }] = useDisclosure(false);

  return (
    <Container>
      <Header title="Login To Your Account" page="login" />
      <Space h="50px" />
      <Card withBorder shadow="lg" p="30px">
        <TextInput
          value={email}
          placeholder="Email"
          label="Email"
          required
          onChange={(event) => setEmail(event.target.value)}
        />
        <Space h="20px" />
        <PasswordInput
          value={password}
          placeholder="Password"
          label="Password"
          visible={visible}
          onVisibilityChange={toggle}
          required
          onChange={(event) => setPassword(event.target.value)}
        />
        <Space h="20px" />
        <Group position="center">
          <Button>Submit</Button>
        </Group>
      </Card>
      <Space h="20px" />
      <Group position="center">
        <Button component={Link} to="/" variant="subtle" size="xs" color="gray">
          Go back to Home
        </Button>
      </Group>
    </Container>
  );
}
