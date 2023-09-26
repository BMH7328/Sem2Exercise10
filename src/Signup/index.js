import {
  Container,
  Space,
  TextInput,
  Card,
  Button,
  Group,
  Grid,
  PasswordInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link } from "react-router-dom";
import Header from "../Header";
import { useState } from "react";

export default function Signup() {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [visible, { toggle }] = useDisclosure(false);

  return (
    <Container>
      <Header title="Sign Up A New Account" page="signup" />
      <Space h="50px" />
      <Card withBorder shadow="lg" p="30px">
        <Grid gutter={50}>
          <Grid.Col span={6}>
            <TextInput
              value={name}
              placeholder="Name"
              label="Name"
              required
              onChange={(event) => setName(event.target.value)}
            />
            <Space h="20px" />
            <TextInput
              value={email}
              placeholder="Email"
              label="Email"
              required
              onChange={(event) => setEmail(event.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={6}>
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
            <PasswordInput
              value={confirmPassword}
              placeholder="Confirm Password"
              label="Confirm Password"
              visible={visible}
              onVisibilityChange={toggle}
              required
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </Grid.Col>
        </Grid>
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
