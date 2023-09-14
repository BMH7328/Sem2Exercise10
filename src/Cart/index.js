import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import {
  getCartItems,
  removeItemFromCart,
  removeItemsFromCart,
} from "../api/cart";
import Header from "../Header";
import { useState, useMemo } from "react";
import { notifications } from "@mantine/notifications";

import {
  Table,
  Title,
  Space,
  Grid,
  Group,
  Button,
  Image,
  Checkbox,
} from "@mantine/core";

export default function Cart() {
  const [checkedList, setCheckedList] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  const queryClient = useQueryClient();
  const { data: cart = [] } = useQuery({
    queryKey: ["cart"],
    queryFn: getCartItems,
  });

  const deleteMutation = useMutation({
    mutationFn: removeItemFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
      notifications.show({
        title: "Product Deleted",
        color: "green",
      });
      setCheckAll(false);
    },
  });

  const calculateTotal = (cart) => {
    return cart.price * cart.quantity;
  };

  //Better Method 2
  const grandTotal = useMemo(() => {
    return cart.reduce((total, cart) => total + calculateTotal(cart), 0);
  }, [cart]);

  // console.log(queryClient.getQueryData(["cart"]));
  // console.log(getCartItems());
  // console.log(cart);

  const checkBoxAll = (event) => {
    if (event.target.checked) {
      const newCheckedList = [];
      cart.forEach((cart) => {
        newCheckedList.push(cart._id);
      });
      setCheckedList(newCheckedList);
      setCheckAll(true);
    } else {
      setCheckedList([]);
      setCheckAll(false);
    }
  };

  const checkboxOne = (event, id) => {
    if (event.target.checked) {
      const newCheckedList = [...checkedList];
      newCheckedList.push(id);
      setCheckedList(newCheckedList);
    } else {
      const newCheckedList = checkedList.filter((cart) => cart !== id);
      setCheckedList(newCheckedList);
    }
  };

  const deleteCheckedItems = () => {
    deleteProductsMutation.mutate(checkedList);
  };

  const deleteProductsMutation = useMutation({
    mutationFn: removeItemsFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
      notifications.show({
        title: "Selected Products Deleted",
        color: "green",
      });
      setCheckAll(false);
      setCheckedList([]);
    },
  });

  return (
    <>
      <Group position="center">
        <Header />
      </Group>
      <Group position="center">
        <Title order={3} align="center">
          Cart
        </Title>
      </Group>
      <Space h="20px" />
      <Group position="center">
        <Grid>
          <Table>
            <thead>
              <tr>
                <th>
                  <Checkbox
                    type="checkbox"
                    checked={checkAll}
                    disabled={cart && cart.length > 0 ? false : true}
                    onChange={(event) => {
                      checkBoxAll(event);
                    }}
                  />
                </th>
                <th>Product</th>
                <th></th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>
                  <Group position="right">Actions</Group>
                </th>
              </tr>
            </thead>{" "}
            <tbody>
              {cart ? (
                cart.map((cart) => {
                  return (
                    <tr key={cart._id}>
                      <td>
                        <Checkbox
                          checked={
                            checkedList && checkedList.includes(cart._id)
                              ? true
                              : false
                          }
                          type="checkbox"
                          onChange={(event) => {
                            checkboxOne(event, cart._id);
                          }}
                        />
                      </td>
                      <td>
                        <Image
                          src={"http://localhost:5000/" + cart.image}
                          width="100px"
                        />
                      </td>
                      <td> {cart.name}</td>
                      <td>${cart.price}</td>
                      <td>{cart.quantity}</td>
                      <td>${calculateTotal(cart)}</td>
                      <td>
                        <Group position="right">
                          <Button
                            color="red"
                            size="xs"
                            radius="50px"
                            onClick={() => {
                              deleteMutation.mutate(cart._id);
                            }}
                          >
                            Remove
                          </Button>
                        </Group>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <Grid.Col className="mt-5">
                  <Space h="120px" />
                  <h1 className="text-center text-muted">Empty Cart .</h1>
                </Grid.Col>
              )}
              <tr>
                <td colSpan="5" className="grand-total-label"></td>
                <td className="grand-total">${grandTotal}</td>
              </tr>
            </tbody>
          </Table>
        </Grid>
      </Group>
      <Group position="apart">
        <Button
          variant="danger"
          disabled={checkedList && checkedList.length > 0 ? false : true}
          onClick={(event) => {
            event.preventDefault();
            deleteCheckedItems();
          }}
        >
          Delete Selected
        </Button>
        <Button>Checkout</Button>
      </Group>
    </>
  );
}
