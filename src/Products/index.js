import {
  Title,
  Grid,
  Card,
  Badge,
  Group,
  Space,
  Button,
  LoadingOverlay,
} from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { notifications } from "@mantine/notifications";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { fetchProducts, deleteProduct } from "../api/products";
import { addToCart, getCartItems } from "../api/cart";
import { useCookies } from "react-cookie";

function Products() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [currentProducts, setCurrentProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [perPage, setPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState([]);
  const { isLoading, data: products } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(currentUser ? currentUser.token : ""),
  });
  const { data: cart = [] } = useQuery({
    queryKey: ["cart"],
    queryFn: getCartItems,
  });

  const isAdmin = useMemo(() => {
    return cookies &&
      cookies.currentUser &&
      cookies.currentUser.role === "admin"
      ? true
      : false;
  }, [cookies]);

  useEffect(() => {
    /* 
      everything here will trigger when 
        - products is updated OR 
        - category is changed OR
        - sort is updated OR
        - perpage is updated
    */
    // method 1:
    // if (category !== "") {
    //   const filteredProducts = products.filter((p) => p.category === category);
    //   setCurrentProducts(filteredProducts);
    // } else {
    //   setCurrentProducts(products);
    // }
    // method 2:
    let newList = products ? [...products] : [];
    // filter by category
    if (category !== "") {
      newList = newList.filter((p) => p.category === category);
    }
    //get total pages
    const total = Math.ceil(newList.length / perPage);
    // convert the total number into array
    const pages = [];
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
    setTotalPages(pages);

    //sorting
    switch (sort) {
      case "name":
        newList = newList.sort((a, b) => {
          return a.name.localeCompare(b.name);
        });
        break;
      case "price":
        newList = newList.sort((a, b) => {
          return a.price - b.price;
        });
        break;
      default:
        break;
    }
    //pagination
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    /*
      const start = 0;
      end = 6;
      currentPage = 1
      perPage = 6
      start = 1-1 * 6 = 0
      currentPage = 2
      perPage = 6
      start = 2-1 * 6 = 6
      currentPage = 3
      perPage = 6
      start = 3-1 * 6 = 12
    */
    newList = newList.slice(start, end);

    setCurrentProducts(newList);
  }, [products, category, sort, perPage, currentPage]);

  const categoryOptions = useMemo(() => {
    let options = [];
    if (products && products.length > 0) {
      products.forEach((product) => {
        if (!options.includes(product.category)) {
          options.push(product.category);
        }
      });
    }
    return options;
  }, [products]);

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
      notifications.show({
        title: "Product Deleted",
        color: "green",
      });
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
      notifications.show({
        title: "Product Added to Cart",
        color: "green",
      });
    },
  });

  return (
    <>
      <Space h="20px" />{" "}
      <Group position="apart">
        <Title order={3} align="center">
          Products
        </Title>
        {isAdmin && (
          <Button
            component={Link}
            to="/products_add"
            variant="gradient"
            gradient={{ from: "yellow", to: "purple", deg: 105 }}
          >
            Add New
          </Button>
        )}
      </Group>
      <Space h="20px" />
      <Group>
        <select
          value={category}
          onChange={(event) => {
            setCategory(event.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All Category</option>
          {categoryOptions.map((category) => {
            return (
              <option key={category} value={category}>
                {category}
              </option>
            );
          })}
        </select>
        <select
          value={sort}
          onChange={(event) => {
            setSort(event.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">No Sorting</option>
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price</option>
        </select>
        <select
          value={perPage}
          onChange={(event) => {
            setPerPage(parseInt(event.target.value));
            // reset it back to page 1
            setCurrentPage(1);
          }}
        >
          <option value="6">6 Per Page</option>
          <option value="10">10 Per Page</option>
          <option value={9999999}>All</option>
        </select>
      </Group>
      <Space h="20px" />
      <LoadingOverlay visible={isLoading} />
      <Grid>
        {currentProducts
          ? currentProducts.map((product) => {
              return (
                <Grid.Col key={product._id} lg={4} md={6} sm={6} xs={6}>
                  <Card withBorder shadow="sm" p="20px">
                    <Title order={5}>{product.name}</Title>
                    <Space h="20px" />
                    <Group position="apart" spacing="5px">
                      <Badge color="green">${product.price}</Badge>
                      <Badge color="yellow">{product.category}</Badge>
                    </Group>
                    <Space h="20px" />
                    <Button
                      fullWidth
                      onClick={() => {
                        // pop a messsage if user is not logged in
                        if (cookies && cookies.currentUser) {
                          addToCartMutation.mutate(product);
                        } else {
                          notifications.show({
                            title: "Please login to proceed",
                            message: (
                              <>
                                <Button
                                  color="red"
                                  onClick={() => {
                                    navigate("/login");
                                    notifications.clean();
                                  }}
                                >
                                  Click here to login
                                </Button>
                              </>
                            ),
                            color: "red",
                          });
                        }
                      }}
                    >
                      {" "}
                      Add To Cart
                    </Button>
                    {isAdmin && (
                      <>
                        <Space h="20px" />
                        <Group position="apart">
                          <Button
                            component={Link}
                            to={"/products/" + product._id}
                            color="blue"
                            size="xs"
                            radius="50px"
                          >
                            Edit
                          </Button>
                          <Button
                            color="red"
                            size="xs"
                            radius="50px"
                            onClick={() => {
                              deleteMutation.mutate({
                                id: product._id,
                                token: currentUser ? currentUser.token : "",
                              });
                            }}
                          >
                            Delete
                          </Button>
                        </Group>
                      </>
                    )}
                  </Card>
                </Grid.Col>
              );
            })
          : null}
      </Grid>
      <Space h="40px" />
      <div>
        <span
          style={{
            marginRight: "10px",
          }}
        >
          Page {currentPage} of {totalPages.length}
        </span>
        {totalPages.map((page) => {
          return (
            <button
              key={page}
              onClick={() => {
                setCurrentPage(page);
              }}
            >
              {page}
            </button>
          );
        })}
      </div>
      <Space h="40px" />
    </>
  );
}

export default Products;
