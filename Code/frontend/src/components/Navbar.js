'use client';

import {
  Box,
  Flex,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Stack,
  Center,
  Heading,
  Text,
  Switch,
  useColorMode,
  HStack,
} from '@chakra-ui/react';
import { useAuth0 } from '@auth0/auth0-react';

export default function Nav(props) {
  const { logout, user } = useAuth0();
  const { colorMode, toggleColorMode } = useColorMode();

  const handleBookMarks = () => {
    props.handleBookMarks();
  };

  const handleLogout = () => {
    logout({
      returnTo: window.location.origin,
    });
  };

  return (
    <>
      <Box color="black" mb={5} bg="green.300" px={4}>
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <Box pl={10}>
            <Heading size="md">Saveurs Sélection</Heading>
          </Box>

          <Flex alignItems="center">
            <Stack direction="row" spacing={6} align="center">
              {/* Dark mode toggle */}
              <HStack spacing={2}>
                <Text fontSize="sm">🌙</Text>
                <Switch
                  colorScheme="teal"
                  isChecked={colorMode === 'dark'}
                  onChange={toggleColorMode}
                />
              </HStack>

              {/* Avatar Menu */}
              <Menu>
                <MenuButton
                  as={Button}
                  rounded="full"
                  variant="link"
                  cursor="pointer"
                  minW={0}>
                  <Avatar
                    size="sm"
                    src={user?.picture || 'https://avatars.dicebear.com/api/male/username.svg'}
                  />
                </MenuButton>
                <MenuList alignItems="center">
                  <br />
                  <Center>
                    <Avatar
                      size="xl"
                      src={user?.picture || 'https://avatars.dicebear.com/api/male/username.svg'}
                    />
                  </Center>
                  <br />
                  <Center>
                    <Text fontSize="md" fontWeight="bold">
                      {user?.name || 'Guest'}
                    </Text>
                  </Center>
                  <br />
                  <MenuDivider />
                  <MenuItem onClick={handleBookMarks}>Bookmarks</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
