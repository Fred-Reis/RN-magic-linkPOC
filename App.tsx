import React, { useEffect, useState } from "react";
import {
  Text,
  Input,
  Center,
  Button,
  Heading,
  StatusBar,
  NativeBaseProvider,
} from "native-base";

import { Magic } from "@magic-sdk/react-native";
import { ethers } from "ethers";

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [isLogged, setIsLogged] = useState(false);

  const magic = new Magic("pk_live_3E332189E3DBE138", {
    network: "rinkeby",
    locale: "pt",
  });

  const handleSubmit = async () => {
    const result = magic.auth.loginWithMagicLink({ email });

    result.then(async (token) => {
      const provider = new ethers.providers.Web3Provider(magic.rpcProvider);

      const signer = provider.getSigner();

      const address = await signer.getAddress();

      const getUser = await magic.user.getMetadata();

      console.log(token);

      setUser(getUser);
      setAddress(address);
      setIsLogged(true);
    });
  };

  const handleLogout = async () => {
    await magic.user.logout();
    setEmail("");
    setAddress("");
    setUser(null);
    setIsLogged(false);
  };

  useEffect(() => {
    const isLogged = async () => {
      const isLogged = await magic.user.isLoggedIn();
      setIsLogged(isLogged);
    };

    isLogged();
  }, []);

  return (
    <NativeBaseProvider>
      <StatusBar barStyle="light-content" />
      <Center bg="gray.600" flex={1}>
        <Heading color="gray.100" fontSize="2xl" pb={8}>
          🪄 Magic Link Login 🧙‍♂️✨
        </Heading>
        {email && (
          <Text color="gray.100" fontSize="lg" mb={6} px={8}>
            {address ? `Address: ${address}` : `Email: ${email}`}
          </Text>
        )}
        <Input
          width={"80%"}
          h="60px"
          placeholder="type your email"
          fontSize={18}
          bg="gray.700"
          size="md"
          borderWidth={0}
          fontFamily="body"
          color="white"
          placeholderTextColor="gray.300"
          mb={8}
          onChangeText={setEmail}
          _focus={{
            borderColor: "green.500",
            borderWidth: 2,
            bg: "gray.700",
          }}
        />

        <Button
          onPress={handleSubmit}
          bg="green.700"
          h={12}
          w={"50%"}
          fontSize="sm"
          rounded="sm"
          mb={8}
          _pressed={{
            bg: "green.500",
          }}
        >
          <Heading color="white" fontSize="lg">
            Submit
          </Heading>
        </Button>

        {isLogged && (
          <Button
            onPress={handleLogout}
            bg="orange.700"
            h={12}
            w={"50%"}
            fontSize="sm"
            rounded="sm"
            _pressed={{
              bg: "green.500",
            }}
          >
            <Heading color="white" fontSize="lg">
              LogOut
            </Heading>
          </Button>
        )}
        <magic.Relayer />
      </Center>
    </NativeBaseProvider>
  );
}
